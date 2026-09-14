import { enforceRateLimit, TOO_MANY_REQUESTS } from './rate-limit'
import { validateGenerateInput } from '../src/lib/generate-input'
import type { GenerateResponse } from '../src/lib/types'

export const config = { runtime: 'edge' }

const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'openai/gpt-oss-20b'
// gpt-oss spends completion tokens on reasoning first. 500 often leaves
// empty content (finish_reason=length) and the UI shows a generic 502.
const MAX_COMPLETION_TOKENS = 4096
const GROQ_TIMEOUT_MS = 25_000
const GENERIC_GENERATE_ERROR = 'Could not generate talking points. Try again in a moment.'
const GENERATE_NOT_CONFIGURED = 'Generate is not configured. Try again in a moment.'
const NETWORK_BLOCKED_ERROR =
  'This network blocked the request. If you are on a VPN, try turning it off and generate again.'

class GenerateHttpError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

// Van: set a hard spend/budget alert on this API key in the Groq Console.
// That is the backstop if code-side limits fail — independent of this handler.

type GenerateBody = {
  jobDescription?: unknown
  candidateSkills?: unknown
  companyBlurb?: unknown
}

const SYSTEM_PROMPT = [
  'You help a job candidate record a 45–90 second first-person video answer.',
  'Use the job description to understand the role.',
  'Use the candidate’s own skills and experience as the only source of proof.',
  'Cross-reference: connect what they have actually done to what the role needs.',
  'Do not invent jobs, years, tools, companies, or achievements they did not mention.',
  'If they left skills blank, write a tight generic structure they can edit. Do not fabricate a biography.',
  'Do not quote, dump, or paraphrase the posting at length.',
  'Respond with one JSON object only. Both keys are required. Never omit script.',
  'Put script first so it is never dropped:',
  '{"script":"A single string of spoken first-person sentences they can say aloud in 45-90 seconds. Natural speech, no lists, no bullets.","key_points":["short first-person talking point","another talking point"]}',
  'script MUST be one string of spoken sentences, never an array, never empty, never omitted.',
  'key_points MUST be an array of 4-6 short first-person strings that mix the role with their stated experience when provided.',
  'Do not wrap the object, do not add other keys, do not return key_points without script.',
].join(' ')

const RETRY_SYSTEM_PROMPT = [
  'Return ONLY this JSON shape. Both keys are required.',
  '{"script":"Four to eight spoken first-person sentences as one string.","key_points":["point 1","point 2","point 3","point 4"]}',
  'script is a required string of spoken sentences. Never omit it. Never use an array for script.',
  'If you only have talking points, still write script as those points spoken aloud in sentences.',
].join(' ')

export function mockGenerate(_jobDescription: string, candidateSkills: string) {
  const bullets = [
    '• Why this work: the problem is concrete, and I can already see where I would contribute',
    candidateSkills
      ? '• Proof: I can point to the experience I added, including a tradeoff I made'
      : '• Proof: one short example of similar work I have shipped, including the tradeoff I made',
    '• First 90 days: learn how success is measured here, then deliver one visible win',
    '• Why this company: the way they work fits how I like to operate',
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

function asTextContent(content: unknown): string {
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  return content
    .map((part) => {
      if (typeof part === 'string') return part
      if (part && typeof part === 'object' && typeof (part as { text?: unknown }).text === 'string') {
        return (part as { text: string }).text
      }
      return ''
    })
    .join('')
}

function extractGroqContent(data: unknown): string {
  if (!data || typeof data !== 'object') return ''
  const choices = (data as { choices?: unknown }).choices
  if (!Array.isArray(choices) || !choices[0] || typeof choices[0] !== 'object') return ''
  const message = (choices[0] as { message?: unknown }).message
  if (!message || typeof message !== 'object') return ''
  const content = asTextContent((message as { content?: unknown }).content)
  if (content) return content
  // gpt-oss may spend the visible payload on reasoning and leave content empty.
  return asTextContent((message as { reasoning?: unknown }).reasoning)
}

function groqFinishReason(data: unknown): string {
  if (!data || typeof data !== 'object') return ''
  const choices = (data as { choices?: unknown }).choices
  if (!Array.isArray(choices) || !choices[0] || typeof choices[0] !== 'object') return ''
  const reason = (choices[0] as { finish_reason?: unknown }).finish_reason
  return typeof reason === 'string' ? reason : ''
}

function groqErrorMessage(data: unknown): string {
  if (!data || typeof data !== 'object') return ''
  const error = (data as { error?: unknown }).error
  if (typeof error === 'string') return error.trim()
  if (error && typeof error === 'object' && typeof (error as { message?: unknown }).message === 'string') {
    return (error as { message: string }).message.trim()
  }
  return ''
}

function groqFailedGeneration(data: unknown): string {
  if (!data || typeof data !== 'object') return ''
  const error = (data as { error?: unknown }).error
  if (!error || typeof error !== 'object') return ''
  const failed = (error as { failed_generation?: unknown }).failed_generation
  return typeof failed === 'string' ? failed : ''
}

function isSchemaValidationError(data: unknown): boolean {
  const message = groqErrorMessage(data)
  return /schema|failed_generation|jsonschema|json_validate/i.test(message)
}

function throwForGroqStatus(status: number, data: unknown): never {
  const groqMessage = groqErrorMessage(data)
  if (status === 401 || /invalid api key|incorrect api key|unauthorized/i.test(groqMessage)) {
    throw new GenerateHttpError(GENERATE_NOT_CONFIGURED, 500)
  }
  if (status === 429 || /rate limit/i.test(groqMessage)) {
    throw new GenerateHttpError(TOO_MANY_REQUESTS, 429)
  }
  if (status === 403 || /access denied|network settings/i.test(groqMessage)) {
    throw new GenerateHttpError(NETWORK_BLOCKED_ERROR, 502)
  }
  throw new GenerateHttpError(GENERIC_GENERATE_ERROR, 502)
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

function stripBulletPrefix(point: string): string {
  return point.trim().replace(/^(?:[•\-*]|\d+[.)])\s*/, '').trim()
}

function scriptFromPoints(points: string[]): string {
  return points
    .map((point) => {
      let sentence = stripBulletPrefix(point)
      if (!sentence) return ''
      if (!/[.!?]$/.test(sentence)) sentence += '.'
      return sentence
    })
    .filter(Boolean)
    .join(' ')
}

function bulletsFromScript(script: string): string {
  const sentences = script
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 8)
    .slice(0, 6)
  return asBulletLines(sentences.length >= 2 ? sentences : [script])
}

function extractJsonObject(text: string): string[] {
  const trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = (fenced?.[1] ?? trimmed).trim()
  const start = raw.indexOf('{')
  if (start < 0) return raw ? [raw, `{${raw}`] : []

  const candidates: string[] = []
  let depth = 0
  let inString = false
  let escape = false
  for (let i = start; i < raw.length; i += 1) {
    const char = raw[i]
    if (inString) {
      if (escape) escape = false
      else if (char === '\\') escape = true
      else if (char === '"') inString = false
      continue
    }
    if (char === '"') inString = true
    else if (char === '{') depth += 1
    else if (char === '}') {
      depth -= 1
      if (depth === 0) {
        candidates.push(raw.slice(start, i + 1))
        break
      }
    }
  }
  if (!candidates.length) {
    const end = raw.lastIndexOf('}')
    candidates.push(end > start ? raw.slice(start, end + 1) : raw.slice(start))
  }
  return candidates
}

function tryParseObject(raw: string): Record<string, unknown> | null {
  const attempts = [raw, raw.replace(/,\s*([}\]])/g, '$1')]
  for (const attempt of attempts) {
    try {
      const parsed = JSON.parse(attempt) as unknown
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>
      }
    } catch {
      /* try the next repair */
    }
  }
  return null
}

const POINT_KEYS = ['key_points', 'keyPoints', 'talking_points', 'talkingPoints', 'bullets', 'points']
const SCRIPT_KEYS = ['script', 'spoken_script', 'spokenScript', 'narration', 'spoken']

function hasUsefulKeys(obj: Record<string, unknown>): boolean {
  return POINT_KEYS.some((key) => key in obj) || SCRIPT_KEYS.some((key) => key in obj)
}

function unwrapPayload(obj: Record<string, unknown>): Record<string, unknown> {
  if (hasUsefulKeys(obj)) return obj
  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nested = value as Record<string, unknown>
      if (hasUsefulKeys(nested)) return nested
    }
  }
  return obj
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === 'string') return [item]
      if (item && typeof item === 'object' && typeof (item as { text?: unknown }).text === 'string') {
        return [(item as { text: string }).text]
      }
      return []
    })
  }
  if (typeof value === 'string') {
    return value
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
  }
  return []
}

function asScript(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .join(' ')
      .trim()
  }
  return ''
}

function parseGenerateJson(text: string): GenerateResponse | null {
  for (const candidate of extractJsonObject(text)) {
    const parsed = tryParseObject(candidate)
    if (!parsed) continue
    const payload = unwrapPayload(parsed)

    let points: string[] = []
    for (const key of POINT_KEYS) {
      const found = asStringList(payload[key])
      if (found.length) {
        points = found
        break
      }
    }

    let script = ''
    for (const key of SCRIPT_KEYS) {
      const found = asScript(payload[key])
      if (found) {
        script = found
        break
      }
    }

    let bullets = points.length ? asBulletLines(points) : ''
    if (!script && points.length) script = scriptFromPoints(points)
    if (!bullets && script) bullets = bulletsFromScript(script)
    if (bullets && script) return { bullets, script }
  }
  return null
}

function parseGroqPayload(data: unknown): GenerateResponse | null {
  return (
    parseGenerateJson(extractGroqContent(data)) ??
    parseGenerateJson(groqFailedGeneration(data))
  )
}

async function groqChat(
  apiKey: string,
  systemPrompt: string,
  userContent: string,
): Promise<{ status: number; data: unknown }> {
  const upstream = await fetch(GROQ_CHAT_URL, {
    method: 'POST',
    signal: AbortSignal.timeout(GROQ_TIMEOUT_MS),
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
      'user-agent': 'WhyWorkHere/1.0',
    },
    body: JSON.stringify({
      model: MODEL,
      max_completion_tokens: MAX_COMPLETION_TOKENS,
      temperature: 0.3,
      reasoning_effort: 'low',
      // json_schema + gpt-oss often 400s with missing `script`.
      // json_object still yields JSON we can parse and recover.
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
    }),
  })

  let data: unknown
  try {
    data = await upstream.json()
  } catch {
    throw new GenerateHttpError(GENERIC_GENERATE_ERROR, 502)
  }

  return { status: upstream.status, data }
}

function throwIfUnusable(data: unknown): never {
  if (groqFinishReason(data) === 'length') {
    throw new GenerateHttpError(
      'Could not finish generating. Try a shorter job description.',
      502,
    )
  }
  throw new GenerateHttpError(GENERIC_GENERATE_ERROR, 502)
}

function buildUserContent(jobDescription: string, candidateSkills: string): string {
  const skillsBlock = candidateSkills
    ? `Candidate’s own skills and experience (use only what they wrote; do not invent more):\n${candidateSkills}`
    : 'The candidate did not add skills. Do not invent a biography. Write a tight first-person answer they can edit with their own examples.'

  return [
    `Job description:\n${jobDescription}`,
    skillsBlock,
    'Cross-reference the role with their experience. Connect what they have done to what the job needs.',
    'Return JSON with required keys "script" (one spoken-sentence string) and "key_points" (string array). Never omit script.',
  ].join('\n\n')
}

async function generateWithGroq(
  jobDescription: string,
  candidateSkills: string,
): Promise<GenerateResponse> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error(GENERATE_NOT_CONFIGURED)
  }

  const userContent = buildUserContent(jobDescription, candidateSkills)

  const first = await groqChat(apiKey, SYSTEM_PROMPT, userContent)
  if (first.status === 200) {
    const parsed = parseGroqPayload(first.data)
    if (parsed) return parsed
  } else if (isSchemaValidationError(first.data)) {
    const recovered = parseGroqPayload(first.data)
    if (recovered) return recovered
  } else {
    throwForGroqStatus(first.status, first.data)
  }

  const retry = await groqChat(apiKey, RETRY_SYSTEM_PROMPT, userContent)
  if (retry.status === 200) {
    const parsed = parseGroqPayload(retry.data)
    if (parsed) return parsed
    throwIfUnusable(retry.data)
  }
  if (isSchemaValidationError(retry.data)) {
    const recovered = parseGroqPayload(retry.data)
    if (recovered) return recovered
  }
  throwForGroqStatus(retry.status, retry.data)
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
  const candidateSkills = String(body.candidateSkills ?? body.companyBlurb ?? '').trim()
  const inputError = validateGenerateInput(jobDescription, candidateSkills)
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
    return Response.json(mockGenerate(jobDescription, candidateSkills))
  }

  try {
    return Response.json(await generateWithGroq(jobDescription, candidateSkills))
  } catch (caught) {
    if (caught instanceof GenerateHttpError) {
      return Response.json({ error: caught.message }, { status: caught.status })
    }
    const message =
      caught instanceof Error && caught.message.startsWith('Generate is not configured')
        ? caught.message
        : GENERIC_GENERATE_ERROR
    const timedOut =
      caught instanceof Error && (caught.name === 'TimeoutError' || caught.name === 'AbortError')
    const status = message.startsWith('Generate is not configured') ? 500 : timedOut ? 504 : 502
    return Response.json(
      { error: timedOut ? 'Generate timed out. Try again in a moment.' : message },
      { status },
    )
  }
}
