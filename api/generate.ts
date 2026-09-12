import { enforceRateLimit } from './rate-limit.ts'
import { validateGenerateInput } from '../src/lib/generate-input.ts'
import type { GenerateResponse } from '../src/lib/types.ts'

export const config = { runtime: 'edge' }

const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'openai/gpt-oss-20b'
const MAX_COMPLETION_TOKENS = 500
const GROQ_TIMEOUT_MS = 20_000

// Van: set a hard spend/budget alert on this API key in the Groq Console.
// That is the backstop if code-side limits fail — independent of this handler.

type GenerateBody = {
  jobDescription?: unknown
  companyBlurb?: unknown
}

const SYSTEM_PROMPT = [
  'You help a job candidate record a 45–90 second first-person video answer.',
  'Use the job description and optional company blurb as context only.',
  'Do not quote, dump, or paraphrase the posting at length.',
  'Write concise first-person talking points and a short spoken script.',
  'Return a JSON object with keys "key_points" and "script".',
  'key_points: 4–6 short first-person talking points as an array of strings.',
  'script: something they can say aloud in about 45–90 seconds. Natural, first person, no lists.',
].join(' ')

export function mockGenerate(_jobDescription: string, _companyBlurb: string) {
  const bullets = [
    '• Why this work: the problem is concrete, and I can already see where I would contribute',
    '• Proof: one short example of similar work I have shipped, including the tradeoff I made',
    '• First 90 days: learn how success is measured here, then deliver one visible win',
    '• Why this company: the mission and the way they work both fit how I like to operate',
    '• Close: I can keep this answer tight — I want the work, not a speech',
  ].join('\n')

  const script = [
    'Thanks for asking me to record this.',
    'I wanted this role because the work is specific, and I can already picture how I would help.',
    'A quick example: I have done similar work with a small team, shipped it, and can talk to the tradeoffs I made along the way.',
    'If I joined, my first focus would be learning how you measure success and delivering one visible win early.',
    'I would be glad to do that work with you.',
  ].join(' ')

  return { bullets, script } satisfies GenerateResponse
}

function useMockGenerate(): boolean {
  return process.env.USE_MOCK_GENERATE === 'true'
}

function extractGroqContent(data: unknown): string {
  if (!data || typeof data !== 'object') return ''
  const choices = (data as { choices?: unknown }).choices
  if (!Array.isArray(choices) || !choices[0] || typeof choices[0] !== 'object') return ''
  const message = (choices[0] as { message?: unknown }).message
  if (!message || typeof message !== 'object') return ''
  const content = (message as { content?: unknown }).content
  return typeof content === 'string' ? content : ''
}

function asBulletLines(points: string[]): string {
  return points
    .map((point) => {
      const trimmed = point.trim()
      if (!trimmed) return ''
      return trimmed.startsWith('•') ? trimmed : `• ${trimmed}`
    })
    .filter(Boolean)
    .join('\n')
}

function parseGenerateJson(text: string): GenerateResponse | null {
  const trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = (fenced?.[1] ?? trimmed).trim()
  const candidates = raw.startsWith('{') ? [raw] : [`{${raw}`]
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as {
        key_points?: unknown
        bullets?: unknown
        script?: unknown
      }
      const script = typeof parsed.script === 'string' ? parsed.script.trim() : ''
      let bullets = ''
      if (Array.isArray(parsed.key_points)) {
        bullets = asBulletLines(
          parsed.key_points.filter((point): point is string => typeof point === 'string'),
        )
      } else if (typeof parsed.bullets === 'string') {
        bullets = parsed.bullets.trim()
      }
      if (bullets && script) return { bullets, script }
    } catch {
      /* try the next shape */
    }
  }
  return null
}

async function generateWithGroq(
  jobDescription: string,
  companyBlurb: string,
): Promise<GenerateResponse> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('Generate is not configured. Set GROQ_API_KEY on the server.')
  }

  const userContent = companyBlurb
    ? `Job description:\n${jobDescription}\n\nCompany blurb:\n${companyBlurb}`
    : `Job description:\n${jobDescription}`

  const upstream = await fetch(GROQ_CHAT_URL, {
    method: 'POST',
    signal: AbortSignal.timeout(GROQ_TIMEOUT_MS),
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_completion_tokens: MAX_COMPLETION_TOKENS,
      temperature: 0.4,
      reasoning_effort: 'low',
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'generate_cues',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              key_points: {
                type: 'array',
                items: { type: 'string' },
              },
              script: { type: 'string' },
            },
            required: ['key_points', 'script'],
            additionalProperties: false,
          },
        },
      },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
    }),
  })

  if (!upstream.ok) {
    throw new Error('Could not generate talking points. Try again in a moment.')
  }

  const data: unknown = await upstream.json()
  const parsed = parseGenerateJson(extractGroqContent(data))
  if (!parsed) {
    throw new Error('Could not generate talking points. Try again in a moment.')
  }
  return parsed
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  let body: GenerateBody
  try {
    body = (await request.json()) as GenerateBody
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const jobDescription = String(body.jobDescription ?? '').trim()
  const companyBlurb = String(body.companyBlurb ?? '').trim()
  const inputError = validateGenerateInput(jobDescription, companyBlurb)
  if (inputError) {
    return Response.json({ error: inputError }, { status: 400 })
  }

  const usingMock = useMockGenerate()
  // Mock + no Upstash: skip Redis and still allow generate.
  // Real path without Upstash: process-local limiter so local real-API
  // testing is still protected. Production should set UPSTASH_REDIS_REST_URL
  // and UPSTASH_REDIS_REST_TOKEN — the in-memory Map is per isolate, not a prod control.
  const limited = await enforceRateLimit(request, {
    prefix: 'cuecard:generate',
    skipIfNoUpstash: usingMock,
  })
  if (limited) return limited

  if (usingMock) {
    return Response.json(mockGenerate(jobDescription, companyBlurb))
  }

  try {
    return Response.json(await generateWithGroq(jobDescription, companyBlurb))
  } catch (caught) {
    const message =
      caught instanceof Error && caught.message.startsWith('Generate is not configured')
        ? caught.message
        : 'Could not generate talking points. Try again in a moment.'
    const status = message.startsWith('Generate is not configured') ? 500 : 502
    return Response.json({ error: message }, { status })
  }
}
