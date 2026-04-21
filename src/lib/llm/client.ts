import { GoogleGenerativeAI } from '@google/generative-ai'

export const MODELS = {
  // Used for generate (long-form article content)
  flash: 'gemini-2.5-flash',
  // Used for topics, keywords, suggest, relink, metadata (fast, cheap)
  flashLite: 'gemini-2.5-flash-lite',
} as const

let _client: GoogleGenerativeAI | null = null

export function getGeminiClient(): GoogleGenerativeAI {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set')
    _client = new GoogleGenerativeAI(apiKey)
  }
  return _client
}
