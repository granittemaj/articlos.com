import OpenAI from 'openai'

export const MODELS = {
  // Long-form article content
  large: 'gpt-4o',
  // Topics, keywords, suggest, relink, metadata (fast, cheap)
  small: 'gpt-4o-mini',
} as const

let _client: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set')
    _client = new OpenAI({ apiKey })
  }
  return _client
}
