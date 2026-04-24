export type CompareTier = 'content-platform' | 'ai-writer' | 'llm'

export interface FeatureRow {
  feature: string
  articlos: boolean | string
  competitor: boolean | string
}

export interface Comparison {
  slug: string
  competitor: string
  tier: CompareTier
  tagline: string
  metaTitle: string
  metaDescription: string
  /** 1–2 sentences shown in the hero under the title. */
  heroIntro: string
  /** Short "why choose Articlos" list — 4–6 bullets, frame by outcome. */
  whyArticlos: string[]
  /** Where the competitor is genuinely stronger — honesty section. */
  competitorStrengths: string[]
  /** Feature table — keep to 10–14 rows. */
  features: FeatureRow[]
  /** "Who should pick Articlos vs [competitor]" decision helper. */
  pickArticlos: string[]
  pickCompetitor: string[]
  /** Shown on hub card. */
  hubBlurb: string
}

const publishingLoop: FeatureRow[] = [
  { feature: 'AI article generation', articlos: true, competitor: true },
  { feature: 'Brand voice training from your samples', articlos: true, competitor: true },
  { feature: 'Direct WordPress publishing', articlos: true, competitor: false },
  { feature: 'Auto internal linking on publish', articlos: true, competitor: false },
  { feature: 'Weekly autopilot (topic → draft → publish)', articlos: true, competitor: false },
  { feature: 'Queue with batch generation', articlos: 'Up to 100 topics', competitor: false },
  { feature: 'Featured image auto-selection (Pexels)', articlos: true, competitor: false },
  { feature: 'Article & FAQ JSON-LD schema', articlos: 'Auto', competitor: 'Manual' },
]

export const comparisons: Comparison[] = [
  // ─────────────────────────────── Content platforms ───────────────────────────────
  {
    slug: 'frase',
    competitor: 'Frase',
    tier: 'content-platform',
    tagline: 'Articlos vs Frase',
    metaTitle: 'Articlos vs Frase — Compare Content Platforms',
    metaDescription: 'Frase helps you optimize a draft. Articlos runs the full loop — discover topics from GSC, generate, publish to WordPress, and rewrite decaying content automatically. Compare side-by-side.',
    heroIntro: 'Frase is a research and optimization assistant. Articlos is a content operations system — it doesn\'t just help you write, it finds topics, publishes them, and rewrites them when rankings slip.',
    hubBlurb: 'Full content loop vs research assistant',
    whyArticlos: [
      'Weekly autopilot generates, schedules, and publishes articles without touching a dashboard',
      'Direct WordPress publishing with auto internal links — Frase stops at the draft',
      'Opportunity map pulls untapped keywords from your own Search Console data',
      'Content decay alerts catch ranking drops and queue rewrites automatically',
      'Multi-model routing (Claude, GPT, Gemini) per article — avoid single-provider outages',
    ],
    competitorStrengths: [
      'Deeper SERP research panel with People Also Ask and competitor header extraction',
      'More refined content brief format preferred by human writers',
      'Longer track record (since 2019) and a larger template library',
    ],
    features: [
      ...publishingLoop,
      { feature: 'SERP analysis & content briefs', articlos: 'Basic', competitor: 'Advanced' },
      { feature: 'Google Search Console opportunity mining', articlos: true, competitor: false },
      { feature: 'GA4 content-decay alerts & rewrite triggers', articlos: true, competitor: false },
      { feature: 'Keyword rank tracking', articlos: true, competitor: 'Add-on' },
      { feature: 'Multi-model AI routing (Claude / GPT / Gemini)', articlos: true, competitor: false },
      { feature: 'People Also Ask extraction', articlos: false, competitor: true },
    ],
    pickArticlos: [
      'You want articles actually published, not just briefed',
      'You already have a WordPress site and Search Console data to mine',
      'You want content to improve itself through the decay-rewrite loop',
    ],
    pickCompetitor: [
      'Your writers want a detailed SERP research panel for each piece',
      'You are an agency producing one-off briefs for manual writers',
      'You do not publish on WordPress',
    ],
  },
  {
    slug: 'surfer',
    competitor: 'Surfer SEO',
    tier: 'content-platform',
    tagline: 'Articlos vs Surfer SEO',
    metaTitle: 'Articlos vs Surfer SEO — Compare Content Tools',
    metaDescription: 'Surfer scores a draft against SERP competitors. Articlos closes the loop — discover, generate, publish to WordPress, and rewrite decaying posts. See how the two compare.',
    heroIntro: 'Surfer is a SERP-driven optimizer you bring a draft to. Articlos is an end-to-end content loop — it runs from topic discovery to publishing and back through performance-based rewrites.',
    hubBlurb: 'End-to-end loop vs on-page optimizer',
    whyArticlos: [
      'Autopilot publishes on a weekly cadence — Surfer never touches your CMS',
      'Opportunity map surfaces what to write from your real GSC data, not just SERP scores',
      'GA4 decay alerts trigger rewrites the moment rankings slip',
      'Brand voice is applied org-wide across every generation, not per document',
      'Direct WordPress publishing with auto internal linking on save',
    ],
    competitorStrengths: [
      'Content Score + SERP Analyzer remain the benchmark for on-page scoring',
      'NLP term frequency suggestions are more granular for writers polishing drafts',
      'Strong Google Docs integration for teams that draft outside a CMS',
    ],
    features: [
      ...publishingLoop,
      { feature: 'SERP-based Content Score', articlos: 'Basic', competitor: 'Advanced' },
      { feature: 'NLP term frequency recommendations', articlos: false, competitor: true },
      { feature: 'Opportunity mining from your GSC data', articlos: true, competitor: false },
      { feature: 'GA4 content-decay alerts', articlos: true, competitor: false },
      { feature: 'Weekly autopilot generation & publishing', articlos: true, competitor: false },
      { feature: 'Multi-model AI routing', articlos: true, competitor: false },
    ],
    pickArticlos: [
      'You want a system that publishes without daily human effort',
      'You care about what to write next, not just how to optimize a draft',
      'You want decaying content to fix itself',
    ],
    pickCompetitor: [
      'You have writers who want the best on-page score in the industry',
      'You produce drafts in Google Docs, not a CMS',
      'You need granular NLP term suggestions for manual editing',
    ],
  },
  {
    slug: 'clearscope',
    competitor: 'Clearscope',
    tier: 'content-platform',
    tagline: 'Articlos vs Clearscope',
    metaTitle: 'Articlos vs Clearscope — Compare Content Platforms',
    metaDescription: 'Clearscope grades drafts for semantic coverage. Articlos runs the whole content operation — discover, generate, publish, and rewrite. Compare pricing and capabilities.',
    heroIntro: 'Clearscope is a premium content grader for teams who write and optimize manually. Articlos runs the operation end-to-end, from GSC opportunity to published post to decay rewrite.',
    hubBlurb: 'Whole operation vs premium grader',
    whyArticlos: [
      'Generate, optimize, and publish in one workflow — no second tool needed',
      'Opportunity map tells you what to write next from your own Search Console data',
      'Decay detection catches posts losing rankings and queues rewrites automatically',
      'Significantly more output per dollar for teams publishing weekly',
      'Direct WordPress publishing with auto internal linking',
    ],
    competitorStrengths: [
      'Industry-leading semantic coverage scoring — writers love the grader',
      'Strong entity extraction and LSI coverage recommendations',
      'Premium enterprise support and onboarding',
    ],
    features: [
      ...publishingLoop,
      { feature: 'Semantic coverage grader (A+ score)', articlos: false, competitor: true },
      { feature: 'Entity & LSI coverage recommendations', articlos: 'Basic', competitor: 'Advanced' },
      { feature: 'GSC opportunity mining', articlos: true, competitor: false },
      { feature: 'GA4 decay alerts', articlos: true, competitor: false },
      { feature: 'Weekly autopilot', articlos: true, competitor: false },
      { feature: 'Starting price', articlos: '$24/mo', competitor: '$189/mo' },
    ],
    pickArticlos: [
      'You publish weekly and need the full pipeline automated',
      'Clearscope pricing is out of budget for your content volume',
      'You want one tool that replaces the research → write → optimize → publish chain',
    ],
    pickCompetitor: [
      'Your in-house writers live and die by the Clearscope grader',
      'You are a premium brand where every article goes through manual optimization',
      'You need enterprise-level SOC 2 and onboarding support',
    ],
  },
  {
    slug: 'marketmuse',
    competitor: 'MarketMuse',
    tier: 'content-platform',
    tagline: 'Articlos vs MarketMuse',
    metaTitle: 'Articlos vs MarketMuse — Content Strategy Platforms Compared',
    metaDescription: 'MarketMuse plans the strategy. Articlos plans and executes — discover, generate, publish, and rewrite decaying content. See the feature comparison.',
    heroIntro: 'MarketMuse is a strategy and topic-modeling platform. Articlos is a strategy platform that also generates and ships the articles it plans.',
    hubBlurb: 'Plan and ship vs plan only',
    whyArticlos: [
      'Topic planning plus actual article generation and publishing in one system',
      'GSC-powered opportunity mining uses your real data, not modeled authority scores',
      'Autopilot executes the plan weekly without manual intervention',
      'Far lower starting price for the full pipeline',
      'Direct WordPress integration — MarketMuse stops at the brief',
    ],
    competitorStrengths: [
      'Topic modeling and content gap analysis across massive corpora',
      'Authority scoring that benchmarks your site against the topic',
      'Mature inventory audit for large content libraries (10k+ URLs)',
    ],
    features: [
      ...publishingLoop,
      { feature: 'Topic modeling & content gap analysis', articlos: 'Basic', competitor: 'Advanced' },
      { feature: 'Topical authority scoring', articlos: false, competitor: true },
      { feature: 'Full-article generation (not just outlines)', articlos: true, competitor: 'Add-on' },
      { feature: 'Direct publishing to WordPress', articlos: true, competitor: false },
      { feature: 'GSC opportunity mining', articlos: true, competitor: false },
      { feature: 'Starting price', articlos: '$24/mo', competitor: '$149/mo' },
    ],
    pickArticlos: [
      'You need articles published, not just strategy documents',
      'You have under 1,000 URLs and do not need enterprise-scale inventory modeling',
      'You want the tool that plans to also ship the content',
    ],
    pickCompetitor: [
      'You manage a 10,000+ URL content library needing inventory analysis',
      'You are an enterprise content strategy team, not an operations team',
      'Topical authority modeling is core to your content planning',
    ],
  },
  {
    slug: 'writesonic',
    competitor: 'Writesonic',
    tier: 'content-platform',
    tagline: 'Articlos vs Writesonic',
    metaTitle: 'Articlos vs Writesonic — AI Content Platform Comparison',
    metaDescription: 'Writesonic generates drafts fast. Articlos closes the loop with GSC-driven topic discovery, WordPress publishing, and automatic rewrites for decaying content.',
    heroIntro: 'Writesonic is a fast, multi-format AI writer. Articlos is a focused long-form content loop — finding the right SEO topics, publishing them to WordPress, and rewriting them when traffic drops.',
    hubBlurb: 'Focused SEO loop vs general AI writer',
    whyArticlos: [
      'Built specifically for SEO long-form content, not ad copy or social posts',
      'Opportunity map pulls real keyword gaps from your own Search Console',
      'GA4 decay detection triggers rewrites automatically — Writesonic does not track performance',
      'Weekly autopilot publishes on a schedule, no manual prompting',
      'Brand voice trained from your existing articles, applied org-wide',
    ],
    competitorStrengths: [
      'Broader output range — ads, landing pages, product descriptions, social, images',
      'Chatsonic chat interface for quick marketing copy iterations',
      'Larger free tier for casual or experimental use',
    ],
    features: [
      ...publishingLoop,
      { feature: 'Long-form SEO article focus', articlos: true, competitor: 'Mixed' },
      { feature: 'Ad copy, social posts, landing pages', articlos: false, competitor: true },
      { feature: 'Image generation', articlos: 'Pexels', competitor: 'Built-in' },
      { feature: 'GSC opportunity mining', articlos: true, competitor: false },
      { feature: 'GA4 decay alerts', articlos: true, competitor: false },
      { feature: 'Weekly autopilot to WordPress', articlos: true, competitor: false },
    ],
    pickArticlos: [
      'You publish SEO long-form content to a WordPress site',
      'You want a system that tracks performance and rewrites decaying posts',
      'You already have a marketing stack and need one tool for article operations',
    ],
    pickCompetitor: [
      'You need a swiss-army knife for ads, social, landing pages, and articles',
      'You are a freelancer switching between client formats daily',
      'You want image generation inside the same product',
    ],
  },
  // ─────────────────────────────── AI writers ───────────────────────────────
  {
    slug: 'jasper',
    competitor: 'Jasper',
    tier: 'ai-writer',
    tagline: 'Articlos vs Jasper',
    metaTitle: 'Articlos vs Jasper — Content Operations vs AI Writer',
    metaDescription: 'Jasper is an AI writing assistant with templates. Articlos is a content operations system that discovers, generates, publishes, and rewrites. See how they compare.',
    heroIntro: 'Jasper gives you a chat window and templates. Articlos gives you a content pipeline — keyword opportunities, scheduled publishing, and automatic rewrites when rankings drop.',
    hubBlurb: 'Content pipeline vs AI assistant',
    whyArticlos: [
      'End-to-end pipeline: discover → plan → generate → publish → track → rewrite',
      'Direct WordPress publishing with auto internal linking',
      'GSC-powered opportunity map surfaces the articles you should actually write',
      'GA4 decay alerts catch drops and queue rewrites — Jasper has no performance loop',
      'Built for content teams who publish weekly, not for marketers writing ad copy',
    ],
    competitorStrengths: [
      'Larger template library for marketing formats (ads, emails, social)',
      'Jasper Chat is polished for brainstorming and creative copy iterations',
      'Stronger brand-kit management for multi-brand agencies',
    ],
    features: [
      ...publishingLoop,
      { feature: 'Templates for ads, emails, social posts', articlos: false, competitor: true },
      { feature: 'Chat interface for creative copy', articlos: false, competitor: true },
      { feature: 'GSC opportunity mining', articlos: true, competitor: false },
      { feature: 'GA4 decay alerts & rewrite triggers', articlos: true, competitor: false },
      { feature: 'Weekly autopilot to WordPress', articlos: true, competitor: false },
      { feature: 'Keyword rank tracking', articlos: true, competitor: false },
    ],
    pickArticlos: [
      'You want articles published weekly on autopilot',
      'You care about ranking performance, not just content volume',
      'You publish to WordPress and want one tool that closes the loop',
    ],
    pickCompetitor: [
      'You write ad copy, emails, and social more than long-form SEO',
      'You are an agency managing many brand kits with varied output formats',
      'You prefer a chat-based creative workflow over a pipeline',
    ],
  },
  {
    slug: 'copy-ai',
    competitor: 'Copy.ai',
    tier: 'ai-writer',
    tagline: 'Articlos vs Copy.ai',
    metaTitle: 'Articlos vs Copy.ai — SEO Content Operations Compared',
    metaDescription: 'Copy.ai is an AI assistant for marketing copy. Articlos is a content operations system that mines GSC opportunities, publishes to WordPress, and rewrites decaying posts.',
    heroIntro: 'Copy.ai is a workflow-builder for marketing output across many formats. Articlos is a focused SEO content system — it finds topics, writes long-form, publishes, and rewrites.',
    hubBlurb: 'SEO content system vs marketing copy toolkit',
    whyArticlos: [
      'Purpose-built for SEO long-form, not short marketing copy',
      'Opportunity map pulls untapped keywords from your own Search Console',
      'Weekly autopilot publishes directly to WordPress — no manual export',
      'Decay detection triggers rewrites when articles lose rankings',
      'Brand voice trained from your existing articles, used in every generation',
    ],
    competitorStrengths: [
      'Workflow builder (GTM AI) is flexible across sales, marketing, and ops use cases',
      'Strong team workspaces and prompt library sharing',
      'Broader output range including sales emails, LinkedIn, and CRM workflows',
    ],
    features: [
      ...publishingLoop,
      { feature: 'Multi-format marketing copy (ads, emails, social)', articlos: false, competitor: true },
      { feature: 'Custom workflow builder', articlos: false, competitor: true },
      { feature: 'GSC opportunity mining', articlos: true, competitor: false },
      { feature: 'GA4 decay alerts', articlos: true, competitor: false },
      { feature: 'Weekly autopilot to WordPress', articlos: true, competitor: false },
      { feature: 'Keyword rank tracking', articlos: true, competitor: false },
    ],
    pickArticlos: [
      'Your goal is ranking long-form articles, not generating sales copy',
      'You want published output, not prompts and drafts to copy-paste',
      'You need the content to improve itself via the decay loop',
    ],
    pickCompetitor: [
      'You run revenue workflows that span many copy formats',
      'You are a GTM team stitching AI into CRM and outbound workflows',
      'You want flexible prompt workflows more than a content pipeline',
    ],
  },
  {
    slug: 'rytr',
    competitor: 'Rytr',
    tier: 'ai-writer',
    tagline: 'Articlos vs Rytr',
    metaTitle: 'Articlos vs Rytr — Content Platform vs AI Writing Assistant',
    metaDescription: 'Rytr is a low-cost AI writing assistant for short-form output. Articlos is a content operations system that discovers, generates, publishes, and rewrites. Compare capabilities.',
    heroIntro: 'Rytr is a fast, cheap AI writing assistant for short-form content. Articlos is a full SEO content pipeline — it researches, generates long-form, publishes to WordPress, and rewrites posts when traffic drops.',
    hubBlurb: 'SEO content pipeline vs short-form writer',
    whyArticlos: [
      'Long-form SEO focus — Rytr is built for short marketing copy',
      'Opportunity map and decay alerts you will not find in any AI writer',
      'Direct WordPress publishing with auto internal linking',
      'Brand voice profiles trained from your real articles',
      'Multi-model routing (Claude, GPT, Gemini) instead of a single cheap model',
    ],
    competitorStrengths: [
      'Extremely cheap — free tier and low monthly pricing',
      'Simple UI great for solo bloggers and hobbyists',
      'Wide range of short-form use cases (emails, blurbs, captions)',
    ],
    features: [
      ...publishingLoop,
      { feature: 'Long-form SEO article focus', articlos: true, competitor: 'Mixed' },
      { feature: 'GSC opportunity mining', articlos: true, competitor: false },
      { feature: 'GA4 decay alerts', articlos: true, competitor: false },
      { feature: 'Weekly autopilot to WordPress', articlos: true, competitor: false },
      { feature: 'Multi-model AI routing', articlos: true, competitor: false },
      { feature: 'Starting price', articlos: '$24/mo', competitor: '$9/mo' },
    ],
    pickArticlos: [
      'You need ranking articles, not just words generated',
      'You publish weekly and want the operation automated',
      'You track performance and want decaying posts rewritten automatically',
    ],
    pickCompetitor: [
      'You are a solo blogger or student on the tightest possible budget',
      'You need quick short-form output (emails, captions, bios)',
      'You do not publish SEO long-form content',
    ],
  },
  // ─────────────────────────────── Raw LLMs ───────────────────────────────
  {
    slug: 'chatgpt',
    competitor: 'ChatGPT, Claude & Gemini',
    tier: 'llm',
    tagline: 'Articlos vs ChatGPT, Claude & Gemini',
    metaTitle: 'Articlos vs ChatGPT, Claude & Gemini — Raw LLMs vs Content System',
    metaDescription: 'Raw LLMs generate text. Articlos orchestrates them inside a full content system — GSC opportunity mining, brand voice, WordPress publishing, rank tracking, and decay rewrites.',
    heroIntro: 'ChatGPT, Claude, and Gemini are general-purpose language models. Articlos is the content system built on top of them — opportunity discovery, brand voice, publishing, ranking, and rewrites. You do not choose between Articlos and an LLM; Articlos uses all three.',
    hubBlurb: 'Raw LLMs vs content operations system',
    whyArticlos: [
      'Uses Claude, GPT, and Gemini — pick the best model per article, fall back when one is down',
      'Opportunity map pulls untapped keywords from your own Search Console data',
      'Brand voice trained once, applied to every generation — no prompt engineering per article',
      'Direct WordPress publishing, auto internal links, scheduled posts',
      'GA4 decay alerts and automatic rewrites when rankings slip',
      'Weekly autopilot: topic → draft → published post with zero manual steps',
    ],
    competitorStrengths: [
      'Maximum flexibility — you can prompt anything, not just SEO articles',
      'General chat and research use cases beyond content marketing',
      'Cheapest possible per-token cost if you build every workflow yourself',
    ],
    features: [
      { feature: 'Raw text generation', articlos: true, competitor: true },
      { feature: 'Uses multiple LLMs under the hood', articlos: 'Claude + GPT + Gemini', competitor: 'One provider' },
      { feature: 'Google Search Console opportunity mining', articlos: true, competitor: false },
      { feature: 'Brand voice trained on your articles', articlos: true, competitor: 'Manual prompt' },
      { feature: 'Direct WordPress publishing', articlos: true, competitor: false },
      { feature: 'Auto internal linking', articlos: true, competitor: false },
      { feature: 'Keyword rank tracking', articlos: true, competitor: false },
      { feature: 'GA4 content-decay alerts', articlos: true, competitor: false },
      { feature: 'Weekly autopilot (unattended)', articlos: true, competitor: false },
      { feature: 'Article queue with batch generation', articlos: 'Up to 100', competitor: false },
      { feature: 'SEO metadata & JSON-LD schema', articlos: 'Auto', competitor: 'Manual' },
      { feature: 'Featured image selection', articlos: 'Auto (Pexels)', competitor: false },
    ],
    pickArticlos: [
      'You publish SEO articles and want the operation automated',
      'You want the best model for each article without managing three accounts',
      'You want the system to track rankings and rewrite decaying content',
    ],
    pickCompetitor: [
      'You need general-purpose chat, research, and coding — not just content',
      'You have engineering time to build opportunity mining, publishing, and tracking yourself',
      'Content marketing is a side workflow, not a core operation',
    ],
  },
]

export function getComparison(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug)
}

export function groupedComparisons() {
  return {
    contentPlatforms: comparisons.filter((c) => c.tier === 'content-platform'),
    aiWriters: comparisons.filter((c) => c.tier === 'ai-writer'),
    llms: comparisons.filter((c) => c.tier === 'llm'),
  }
}
