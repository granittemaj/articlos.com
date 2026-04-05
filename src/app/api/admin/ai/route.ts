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
//     | { action: 'keywords', niche?: string }
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
      const seed = Math.floor(Math.random() * 100000)
      const prompt = `You are a wildly creative content strategist who hates generic content. Generate 8 unexpected, high-value blog post topic ideas for ${niche ? `a website in the "${niche}" niche` : 'a content marketing / SaaS audience'}.

RANDOMIZATION SEED: ${seed} — use this to vary your output. Be unpredictable. Never repeat yourself across calls.

Pick exactly 8 angles from this list — choose a DIFFERENT random subset each time, never the same combination twice:
- Real-world case studies with specific numbers/results
- Controversial or contrarian takes that challenge conventional wisdom
- Data-driven analysis (cite specific stats, studies, or benchmarks)
- Beginner guides that tackle ONE very specific sub-problem (not broad overviews)
- Advanced tactics for practitioners who already know the basics
- Tool/method comparisons (head-to-head, with clear winners)
- Bold industry predictions with reasoning
- Myth-busting (name a popular belief and dismantle it)
- Step-by-step tutorials for a precise workflow or technique
- Expert roundup ideas (frame a specific debate or question)
- Seasonal or timely hooks tied to current events or trends
- Niche crossover ideas (combine two unexpected fields)
- "X vs Y" comparisons that people actually search for
- Listicles with genuinely unexpected or counterintuitive items
- Emerging trends that almost nobody is covering yet
- Failure post-mortems (what went wrong and lessons learned)
- "Behind the scenes" of a specific process or strategy

STRICT RULES:
- Never suggest generic titles like "Ultimate Guide to X", "10 Tips for Y", "Everything You Need to Know About Z", or "How to Get Started with X". Each title must feel specific, fresh, and clickable.
- Every title should include a specific detail — a number, a named tool, a timeframe, a specific outcome, or a surprising angle.
- ${niche ? `Dig DEEP into sub-niches and specific problems within "${niche}". Avoid surface-level takes. Think about the specific frustrations, edge cases, and underserved questions real practitioners have.` : 'Think about specific, underserved questions that real marketers and founders actually struggle with.'}

For each topic:
- title: A compelling, specific, scroll-stopping blog post title (NOT generic)
- keyword: The primary target keyword (long-tail and specific)
- intent: Search intent (informational/commercial/navigational)
- difficulty: Estimated keyword difficulty (low/medium/high)
- why: One sentence explaining why this topic is valuable and timely right now

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
      const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '')
      const parsed = JSON.parse(cleaned)
      return NextResponse.json(parsed)
    }

    if (action === 'keywords') {
      const prompt = `You are an SEO keyword researcher. Suggest 8-10 high-value SEO keywords or long-tail keyword phrases for ${niche ? `the "${niche}" niche` : 'a content marketing / SaaS audience'}. Focus on keywords with good search volume and reasonable competition.

Return ONLY a valid JSON array of strings, nothing else. Example: ["keyword 1", "keyword 2"]`

      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '')
      const match = cleaned.match(/\[[\s\S]*\]/)
      if (!match) return NextResponse.json({ error: 'Failed to parse keywords' }, { status: 500 })
      const keywords = JSON.parse(match[0])
      return NextResponse.json({ keywords })
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

      // Use responseMimeType to force proper JSON encoding — prevents unescaped
      // quotes in the HTML content field from breaking JSON.parse
      const generateModel = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        generationConfig: { responseMimeType: 'application/json' },
      })

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

Return a JSON object with these fields:
- title: The blog post title
- excerpt: A 1-2 sentence meta description (max 160 chars)
- metaTitle: SEO meta title (max 60 chars)
- metaDescription: SEO meta description (max 160 chars)
- tags: Comma-separated tags, e.g. "tag1, tag2, tag3"
- content: The full article as an HTML string using h2/h3/p/ul/li tags`

      const result = await generateModel.generateContent(prompt)
      const text = result.response.text().trim()
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
