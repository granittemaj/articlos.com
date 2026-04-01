import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set')
  return new GoogleGenerativeAI(apiKey)
}

// POST /api/admin/ai
// body: { action: 'topics', niche?: string }
//     | { action: 'suggest', niche?: string }
//     | { action: 'generate', topic: string, keywords?: string }
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { action: string; niche?: string; topic?: string; keywords?: string; context?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { action, niche, topic, keywords, context } = body

  try {
    const genAI = getClient()
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

    if (action === 'topics') {
      const prompt = `You are an SEO content strategist. Generate 8 high-value blog post topic ideas for ${niche ? `a website in the "${niche}" niche` : 'a general SaaS/content marketing audience'}.

For each topic, provide:
- title: A compelling, SEO-friendly blog post title
- keyword: The primary target keyword
- intent: Search intent (informational/commercial/navigational)
- difficulty: Estimated keyword difficulty (low/medium/high)
- why: One sentence on why this topic is valuable

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "topics": [
    {
      "title": "...",
      "keyword": "...",
      "intent": "...",
      "difficulty": "...",
      "why": "..."
    }
  ]
}`

      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      const parsed = JSON.parse(text)
      return NextResponse.json(parsed)
    }

    if (action === 'suggest') {
      const prompt = `You are an expert SEO content strategist. Suggest ONE high-value, specific blog post idea${niche ? ` for a website about "${niche}"` : ' for a content marketing/SaaS audience'}${context ? `. Additional context: ${context}` : ''}.

Pick a topic that is highly searchable, has clear commercial or informational intent, and would rank well in Google.

Return ONLY valid JSON (no markdown, no code fences):
{
  "title": "A specific, compelling blog post title",
  "keyword": "exact primary keyword to target",
  "secondaryKeywords": "keyword2, keyword3, keyword4",
  "intent": "informational or commercial or navigational",
  "difficulty": "low or medium or high",
  "why": "One sentence explaining why this topic is valuable and timely"
}`

      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '')
      const parsed = JSON.parse(cleaned)
      return NextResponse.json(parsed)
    }

    if (action === 'generate') {
      if (!topic) {
        return NextResponse.json({ error: 'topic is required' }, { status: 400 })
      }

      const keywordHint = keywords ? `Primary keyword to target: "${keywords}".` : ''

      const prompt = `You are an expert SEO content writer. Write a comprehensive, high-quality blog post about: "${topic}".

${keywordHint}

Requirements:
- Length: 1200-1800 words
- Structure: Use H2 and H3 headings to organize content
- Include a compelling introduction that hooks the reader
- Cover the topic thoroughly with actionable insights
- Include a FAQ section with 3-4 questions at the end
- Write in a clear, engaging, authoritative tone
- Optimize naturally for SEO — do not keyword-stuff
- End with a strong conclusion

Return ONLY valid JSON in this exact format (no markdown code fences outside the content):
{
  "title": "The blog post title",
  "excerpt": "A 1-2 sentence meta description (max 160 chars)",
  "metaTitle": "SEO meta title (max 60 chars)",
  "metaDescription": "SEO meta description (max 160 chars)",
  "tags": "tag1, tag2, tag3",
  "content": "<h2>Section Title</h2><p>Content here...</p>"
}`

      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      // Strip possible markdown code fences if Gemini adds them
      const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '')
      const parsed = JSON.parse(cleaned)
      return NextResponse.json(parsed)
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI request failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
