import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set')
  return new GoogleGenerativeAI(apiKey)
}

// POST /api/admin/ai
// body: { action: 'topics', niche?: string, topicStyle?: 'accessible' | 'technical' }
//     | { action: 'suggest', niche?: string }
//     | { action: 'keywords', niche?: string }
//     | { action: 'generate', topic: string, keywords?: string, writingStyle?: 'accessible' | 'technical' }
//     | { action: 'relink', content: string, title: string }
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { action: string; niche?: string; topic?: string; keywords?: string; selectedKeywords?: string[]; context?: string; content?: string; title?: string; topicStyle?: string; writingStyle?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { action, niche, topic, keywords, selectedKeywords, context, content, title, topicStyle, writingStyle } = body

  try {
    const genAI = getClient()
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

    if (action === 'topics') {
      const ALL_ANGLES = [
        'A real-world case study with specific numbers and measurable results',
        'A contrarian take that directly challenges a widely-held belief in the industry',
        'A data-driven deep-dive citing specific recent stats, studies, or benchmarks',
        'A beginner guide that solves ONE very specific sub-problem (not a broad overview)',
        'An advanced tactics post for experienced practitioners who already know the basics',
        'A head-to-head tool or method comparison with a clear winner and reasoning',
        'A bold, reasoned industry prediction for the next 12–18 months',
        'A myth-busting piece that names a popular belief and dismantles it with evidence',
        'A step-by-step tutorial for a very precise workflow, technique, or process',
        'A failure post-mortem: what went wrong, why, and what to do differently',
        'An emerging trend that almost nobody is writing about yet',
        'A niche crossover that combines two unexpected fields or disciplines',
        'An "X vs Y" comparison framed around a real decision practitioners face',
        'A listicle with counterintuitive or surprising items most people haven\'t considered',
        'A "behind the scenes" breakdown of a specific strategy used by a real company',
        'A seasonal or timely angle tied to something happening right now in 2026',
        'An interview-style or expert-roundup framing a specific ongoing debate',
        'A cost/ROI analysis: is [popular tactic] actually worth it?',
      ]

      // Truly randomise server-side: shuffle and take 8
      const shuffled = ALL_ANGLES.slice().sort(() => Math.random() - 0.5)
      const selectedAngles = shuffled.slice(0, 8)

      const today = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

      const isTechnical = topicStyle === 'technical'

      const keywordContext = selectedKeywords && selectedKeywords.length > 0
        ? `\nFOCUS KEYWORDS: The user has selected these specific keywords to target — every topic MUST be built around one of these keywords:\n${selectedKeywords.map(k => `- ${k}`).join('\n')}\nDistribute the 8 topics across these keywords as evenly as possible.`
        : ''

      const prompt = `You are a sharp, opinionated content strategist writing for ${niche ? `a "${niche}" audience` : 'a content marketing / SaaS audience'} in ${today}.

Generate exactly 8 blog post topic ideas — one for each angle listed below. Use the angles in the order given.
${keywordContext}
ASSIGNED ANGLES (use each one, in order):
${selectedAngles.map((a, i) => `${i + 1}. ${a}`).join('\n')}

CONTEXT: It is currently ${today}. Topics must feel relevant and timely for right now — not 2023 or 2024. Reference current tools, platforms, and trends that exist in 2026. Avoid anything that was already overdone in 2024 (e.g. generic ChatGPT hype, "AI will replace writers", basic SEO 101 content).

AUDIENCE LEVEL: ${isTechnical
  ? 'TECHNICAL — these topics are for experienced practitioners and experts. You may use industry jargon, acronyms, and assume deep prior knowledge. Titles should reflect advanced, specific, or niche problems that only someone deep in the field would care about.'
  : 'ACCESSIBLE — these topics must be easy to understand for someone relatively new to the subject. Avoid jargon and acronyms. Write titles the way a real person would type a question into Google: plain language, conversational, and immediately clear about what they will learn.'}

STRICT TITLE RULES:
- No generic titles: "Ultimate Guide to X", "X Tips for Y", "Everything You Need to Know", "How to Get Started", "The Power of X", "Why X Matters"
- Every title must include at least one specific detail: a number, a named tool, a concrete outcome, a timeframe, or a surprising framing
- Titles should feel like something a real expert would share — not content-farm clickbait
- ${niche ? `Go deep into sub-niches and edge cases within "${niche}". Think about the specific frustrations, workflow problems, and underserved questions that real practitioners in this space have in 2026.` : 'Think about the specific, nuanced questions that senior marketers and SaaS founders are actually debating right now.'}

For each topic return:
- title: The blog post title (specific, not generic)
- keyword: Primary long-tail keyword to target
- intent: informational / commercial / navigational
- difficulty: low / medium / high
- why: One sentence on why this topic is valuable and timely in ${today}

Return ONLY valid JSON, no markdown, no code fences:
{
  "topics": [
    { "title": "...", "keyword": "...", "intent": "...", "difficulty": "...", "why": "..." }
  ]
}`

      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '')
      const parsed = JSON.parse(cleaned)
      return NextResponse.json(parsed)
    }

    if (action === 'keywords') {
      const prompt = `You are an SEO keyword researcher. Given the seed topic "${niche || 'content marketing'}", suggest 4-5 keyword phrases per intent type below.

Intent types to cover:
- how-to: step-by-step guides, tutorials, processes (e.g. "how to do X", "X step by step")
- informational: definitions, explanations, comparisons, research (e.g. "what is X", "X vs Y", "best X for Y")
- commercial: tool evaluations, reviews, buyer intent (e.g. "best X tools", "X software for Y", "X alternatives")
- navigational: branded or niche-specific queries someone would search to find a resource (e.g. "X checklist", "X template", "X examples")

Rules:
- All keywords must be closely related to "${niche || 'content marketing'}"
- Use long-tail phrasing that real people actually search
- No generic filler — be specific to the topic

Return ONLY valid JSON, no markdown, no code fences:
{
  "groups": [
    { "intent": "how-to", "keywords": ["...", "...", "...", "...", "..."] },
    { "intent": "informational", "keywords": ["...", "...", "...", "...", "..."] },
    { "intent": "commercial", "keywords": ["...", "...", "...", "...", "..."] },
    { "intent": "navigational", "keywords": ["...", "...", "...", "...", "..."] }
  ]
}`

      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '')
      const parsed = JSON.parse(cleaned)
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

      // Use responseMimeType + responseSchema to guarantee valid JSON —
      // prevents HTML attributes (double quotes) in the content field from
      // breaking JSON.parse, which was the source of the intermittent error
      const generateModel = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              excerpt: { type: SchemaType.STRING },
              metaTitle: { type: SchemaType.STRING },
              metaDescription: { type: SchemaType.STRING },
              tags: { type: SchemaType.STRING },
              content: { type: SchemaType.STRING },
            },
            required: ['title', 'excerpt', 'metaTitle', 'metaDescription', 'tags', 'content'],
          },
        },
      })

      const isWritingTechnical = writingStyle === 'technical'

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

WRITING STYLE: ${isWritingTechnical
  ? 'TECHNICAL — write for experienced practitioners. Use precise terminology, industry jargon, and assume the reader has deep prior knowledge. You can reference specific tools, APIs, frameworks, and advanced concepts without explaining the basics. Be dense, specific, and opinionated.'
  : 'ACCESSIBLE — write for a general audience that may be new to this topic. Explain concepts clearly without assuming prior knowledge. Avoid jargon; when a technical term is necessary, briefly explain it. Use simple, direct sentences.'}

Humanization rules (critical — follow strictly):
- Write like a real person, not a content robot. Use "you" to address the reader directly. Occasionally use "we" or "I" to add a human voice.
- Vary sentence length. Mix short punchy sentences with longer ones. Avoid a rhythm that feels machine-generated.
- Never use these overused AI phrases: "In today's fast-paced world", "It's important to note", "Dive into", "Delve into", "At the end of the day", "Game-changer", "Leverage", "Unlock", "Empower", "Navigate", "Landscape", "It goes without saying", "Needless to say", "In conclusion, it is clear that"
- Avoid unnecessarily formal or academic language. Use contractions (don't, you'll, it's, here's) to sound natural.
- Ground claims in reality — mention specific tools, real numbers, or concrete examples rather than vague generalities
- The introduction should feel like something a knowledgeable friend would say, not a Wikipedia opening paragraph

Linking requirements (critical for SEO):
- Internal links (3-5 throughout the article): Naturally link to articlos.com pages where relevant. Use these exact HTML snippets where they fit contextually:
  * <a href="/blog">our blog</a> — when mentioning content resources or further reading
  * <a href="/">articlos</a> — when referencing AI content automation tools
  * <a href="/about">about us</a> — when establishing credibility
  * <a href="/faq">FAQ</a> — when suggesting readers learn more
- External links (1-2 only): Link to one or two authoritative sources (Google Search Central, Moz, HubSpot, Semrush, Ahrefs, or Search Engine Journal) to support a specific claim. Use target="_blank" rel="noopener noreferrer".

Fields to populate:
- title: The blog post title
- excerpt: A 1-2 sentence meta description (max 160 chars)
- metaTitle: SEO meta title (max 60 chars)
- metaDescription: SEO meta description (max 160 chars)
- tags: Comma-separated tags, e.g. "tag1, tag2, tag3"
- content: The full article as an HTML string using h2/h3/p/ul/li tags`

      const result = await generateModel.generateContent(prompt)
      const parsed = JSON.parse(result.response.text())
      return NextResponse.json(parsed)
    }

    if (action === 'relink') {
      if (!content) return NextResponse.json({ error: 'content is required' }, { status: 400 })

      const relinkModel = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: { content: { type: SchemaType.STRING } },
            required: ['content'],
          },
        },
      })

      // Fetch published posts for cross-linking
      let otherPosts: { title: string; slug: string }[] = []
      try {
        otherPosts = await prisma.post.findMany({
          where: { published: true, ...(title ? { title: { not: title } } : {}) },
          take: 20,
          select: { title: true, slug: true },
          orderBy: { publishedAt: 'desc' },
        })
      } catch { /* DB unavailable */ }

      const crossLinkSection = otherPosts.length > 0
        ? `\n- Cross-links to other blog posts on this site (add 1-2 where topically relevant):\n${otherPosts.map(p => `  * <a href="/blog/${p.slug}">${p.title}</a>`).join('\n')}`
        : ''

      const result = await relinkModel.generateContent(
        `You are an SEO editor. Improve the internal and external linking of this blog article${title ? ` titled "${title}"` : ''}.

Rules:
- Add 3-5 internal links to articlos.com pages where they fit naturally in the existing text. Use these exact hrefs:
  * /blog — when mentioning "our blog", "more articles", "read more", "further reading"
  * / — when mentioning "articlos", "our platform", "AI content tools"
  * /about — when mentioning "our team", "about us", "who we are"
  * /faq — when mentioning "common questions", "learn more", "frequently asked"${crossLinkSection}
- Add 1-2 external links to authoritative sources (Moz, Google Search Central, HubSpot, Semrush, Ahrefs, Search Engine Journal) that back up a specific factual claim already in the article. Use target="_blank" rel="noopener noreferrer".
- Do NOT rewrite, add, or remove any text — only wrap existing words in <a> tags.
- Do NOT add links to text that is already inside an <a> tag.
- Return the full article HTML with the links added.

Article HTML:
${content}`
      )

      const parsed = JSON.parse(result.response.text())
      return NextResponse.json(parsed)
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI request failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
