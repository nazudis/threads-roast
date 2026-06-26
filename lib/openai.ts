import OpenAI from 'openai'
import { buildRoastMessages } from './buildPrompt'

/** Creates a client from env. Throws if the key is missing. Never import in client components. */
export function createClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set')
  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  })
}

export type RoastDeps = { client: OpenAI; model?: string; temperature?: number }

export async function getRoast(
  input: { username: string; vibe: string; reroll?: boolean },
  deps: RoastDeps,
): Promise<string> {
  const model = deps.model ?? process.env.OPENAI_MODEL ?? 'gpt-4o-mini'
  // 1.1 (>1.0) widens reroll variety; OpenAI allows up to 2.0. Some
  // OPENAI_BASE_URL-swapped providers cap at 1.0 — override via deps if needed.
  const temperature = deps.temperature ?? (input.reroll ? 1.1 : 0.9)

  const completion = await deps.client.chat.completions.create({
    model,
    temperature,
    max_tokens: 240,
    messages: buildRoastMessages(input),
  })

  const text = completion.choices[0]?.message?.content?.trim()
  if (!text) throw new Error('Empty roast from provider')
  return text
}
