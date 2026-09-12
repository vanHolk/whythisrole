import { enforceRateLimit } from './rate-limit.ts'

// Edge runtime: Node `dns` is unavailable here (and Vercel uses this file's
// `runtime: 'edge'`). Resolve via Cloudflare DNS-over-HTTPS, then fetch with
// redirects off so each hop's resolved IP can be re-checked. The Vite local
// API plugin imports this same handler.
export const config = { runtime: 'edge' }

const FETCH_TIMEOUT_MS = 8_000
const MAX_BYTES = 2_500_000
const MIN_CHARS = 80
const MAX_REDIRECTS = 5
const DOH_ENDPOINT = 'https://cloudflare-dns.com/dns-query'

type FetchBody = {
  url?: unknown
}

type DoHResponse = {
  Answer?: Array<{ type?: number; data?: string }>
}

function parseHttpUrl(raw: string): URL | null {
  let parsed: URL
  try {
    parsed = new URL(raw.trim())
  } catch {
    return null
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
  if (!parsed.hostname) return null
  return parsed
}

function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().replace(/\.$/, '')
}

function isBlockedHostname(hostname: string): boolean {
  const host = normalizeHostname(hostname).replace(/^\[|\]$/g, '')
  return (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.internal')
  )
}

function ipv4FromParts(parts: number[]): string | null {
  if (parts.length === 0 || parts.length > 4) return null
  if (parts.some((part) => !Number.isInteger(part) || part < 0)) return null
  if (parts.length === 4) {
    if (parts.some((part) => part > 255)) return null
    return parts.join('.')
  }
  if (parts.length === 1) {
    if (parts[0]! > 0xffffffff) return null
    const n = parts[0]!
    return `${(n >>> 24) & 255}.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}`
  }
  if (parts.length === 2) {
    if (parts[0]! > 255 || parts[1]! > 0xffffff) return null
    const rest = parts[1]!
    return `${parts[0]}.${(rest >>> 16) & 255}.${(rest >>> 8) & 255}.${rest & 255}`
  }
  if (parts[0]! > 255 || parts[1]! > 255 || parts[2]! > 0xffff) return null
  const rest = parts[2]!
  return `${parts[0]}.${parts[1]}.${(rest >>> 8) & 255}.${rest & 255}`
}

function parseIPv4Literal(host: string): string | null {
  if (!/^\d+(?:\.\d+){0,3}$/.test(host)) return null
  return ipv4FromParts(host.split('.').map((part) => Number(part)))
}

function parseIPv6Literal(raw: string): number[] | null {
  let ip = raw.toLowerCase()
  if (ip.startsWith('[') && ip.endsWith(']')) ip = ip.slice(1, -1)
  const zone = ip.indexOf('%')
  if (zone !== -1) ip = ip.slice(0, zone)

  const lastColon = ip.lastIndexOf(':')
  const dotted = lastColon === -1 ? '' : ip.slice(lastColon + 1)
  if (dotted.includes('.')) {
    const v4 = parseIPv4Literal(dotted)
    if (!v4) return null
    const octets = v4.split('.').map((part) => Number(part))
    const hi = ((octets[0]! << 8) | octets[1]!).toString(16)
    const lo = ((octets[2]! << 8) | octets[3]!).toString(16)
    ip = `${ip.slice(0, lastColon + 1)}${hi}:${lo}`
  }

  const sides = ip.split('::')
  if (sides.length > 2) return null

  const parseSide = (side: string): number[] | null => {
    if (!side) return []
    const groups: number[] = []
    for (const group of side.split(':')) {
      if (!/^[0-9a-f]{1,4}$/.test(group)) return null
      groups.push(Number.parseInt(group, 16))
    }
    return groups
  }

  if (sides.length === 1) {
    const groups = parseSide(sides[0]!)
    return groups && groups.length === 8 ? groups : null
  }

  const left = parseSide(sides[0]!)
  const right = parseSide(sides[1]!)
  if (!left || !right) return null
  const missing = 8 - left.length - right.length
  if (missing < 0) return null
  return [...left, ...Array<number>(missing).fill(0), ...right]
}

function isPrivateIPv4(ip: string): boolean {
  const parsed = parseIPv4Literal(ip)
  if (!parsed) return true
  const octets = parsed.split('.').map((part) => Number(part))
  const n =
    ((octets[0]! << 24) | (octets[1]! << 16) | (octets[2]! << 8) | octets[3]!) >>> 0
  if (n <= 0x00ff_ffff) return true
  if (n >= 0x0a00_0000 && n <= 0x0aff_ffff) return true
  if (n >= 0x7f00_0000 && n <= 0x7fff_ffff) return true
  if (n >= 0xa9fe_0000 && n <= 0xa9fe_ffff) return true
  if (n >= 0xac10_0000 && n <= 0xac1f_ffff) return true
  if (n >= 0xc0a8_0000 && n <= 0xc0a8_ffff) return true
  return false
}

function isPrivateIPv6(groups: number[]): boolean {
  if (groups.every((group, index) => (index === 7 ? group === 1 : group === 0))) {
    return true
  }
  if (groups.every((group) => group === 0)) return true
  if ((groups[0]! & 0xffc0) === 0xfe80) return true
  if ((groups[0]! & 0xfe00) === 0xfc00) return true
  const mapped =
    groups[0] === 0 &&
    groups[1] === 0 &&
    groups[2] === 0 &&
    groups[3] === 0 &&
    groups[4] === 0 &&
    groups[5] === 0xffff
  if (mapped) {
    const ipv4 = `${groups[6]! >> 8}.${groups[6]! & 0xff}.${groups[7]! >> 8}.${groups[7]! & 0xff}`
    return isPrivateIPv4(ipv4)
  }
  return false
}

function isBlockedAddress(address: string): boolean {
  const v4 = parseIPv4Literal(address)
  if (v4) return isPrivateIPv4(v4)
  const v6 = parseIPv6Literal(address)
  if (v6) return isPrivateIPv6(v6)
  return true
}

function literalAddresses(hostname: string): string[] | null {
  const host = normalizeHostname(hostname)
  const v4 = parseIPv4Literal(host)
  if (v4) return [v4]
  const v6 = parseIPv6Literal(host)
  if (v6) {
    const rendered = v6.map((group) => group.toString(16)).join(':')
    return [rendered]
  }
  return null
}

async function resolveHostname(
  hostname: string,
  signal: AbortSignal,
): Promise<string[]> {
  const literals = literalAddresses(hostname)
  if (literals) return literals

  const lookups = (['A', 'AAAA'] as const).map(async (type) => {
    const query = new URL(DOH_ENDPOINT)
    query.searchParams.set('name', hostname)
    query.searchParams.set('type', type)
    const response = await fetch(query, {
      method: 'GET',
      redirect: 'error',
      signal,
      headers: { accept: 'application/dns-json' },
    })
    if (!response.ok) return [] as string[]
    const body = (await response.json()) as DoHResponse
    const expected = type === 'A' ? 1 : 28
    return (body.Answer ?? [])
      .filter((answer) => answer.type === expected && typeof answer.data === 'string')
      .map((answer) => answer.data as string)
  })

  return (await Promise.all(lookups)).flat()
}

async function assertPublicHttpUrl(url: URL, signal: AbortSignal): Promise<boolean> {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
  const hostname = normalizeHostname(url.hostname)
  if (!hostname || isBlockedHostname(hostname)) return false
  const addresses = await resolveHostname(hostname, signal)
  if (addresses.length === 0) return false
  return addresses.every((address) => !isBlockedAddress(address))
}

async function readCappedText(
  response: Response,
  maxBytes: number,
): Promise<string | null> {
  const declared = Number(response.headers.get('content-length') ?? '')
  if (Number.isFinite(declared) && declared > maxBytes) return null

  if (!response.body) {
    const text = await response.text()
    return new TextEncoder().encode(text).byteLength <= maxBytes ? text : null
  }

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > maxBytes) {
        await reader.cancel()
        return null
      }
      chunks.push(value)
    }
  } catch {
    return null
  }

  const bytes = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder('utf-8').decode(bytes)
}

async function fetchPublicHttp(
  start: URL,
  signal: AbortSignal,
): Promise<Response | null> {
  let current = start
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const allowed = await assertPublicHttpUrl(current, signal)
    if (!allowed) return null

    const upstream = await fetch(current.toString(), {
      method: 'GET',
      redirect: 'manual',
      signal,
      headers: {
        accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
    })

    if (upstream.status >= 300 && upstream.status < 400) {
      const location = upstream.headers.get('location')
      if (!location) return null
      try {
        current = new URL(location, current)
      } catch {
        return null
      }
      continue
    }

    return upstream
  }
  return null
}

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) =>
      String.fromCharCode(Number.parseInt(n, 16)),
    )
}

function stripTagBlocks(html: string, tag: string): string {
  return html.replace(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`, 'gi'), ' ')
}

function slicePreferredContainer(html: string): string {
  const patterns = [
    /<main\b[^>]*>[\s\S]*?<\/main>/i,
    /<article\b[^>]*>[\s\S]*?<\/article>/i,
    /<div\b[^>]*(id|class)=["'][^"']*(job|posting|description|content)[^"']*["'][^>]*>[\s\S]*?<\/div>/i,
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match && match[0].length > 200) return match[0]
  }
  return html
}

function htmlToText(html: string): string {
  const withBreaks = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h1|h2|h3|h4|li|tr|section|header)>/gi, '\n')
    .replace(/<li\b[^>]*>/gi, '• ')
    .replace(/<h[1-4]\b[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')

  return decodeEntities(withBreaks)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[^\S\n]{2,}/g, ' ')
    .trim()
}

const NOISE =
  /^(sign in|log in|sign up|cookie|privacy|subscribe|referr|earn up to|share the referral|start application|view all opportunities|activate my referral|don't know who to refer|browse|save\s*$|posted \d|equal opportunity$)/i

function cleanExtractedText(text: string): string {
  const lines = text
    .split('\n')
    .map((line) => line.replace(/^[^A-Za-z0-9•$]+/, '').trim())
    .filter((line) => line.length > 1 && !NOISE.test(line) && !/view all opportunities/i.test(line))

  const collapsed: string[] = []
  for (const line of lines) {
    if (collapsed.at(-1) === line) continue
    collapsed.push(line)
  }
  return collapsed.join('\n').trim()
}

function extractJsonLdJob(html: string): string {
  const blocks = html.matchAll(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )
  const chunks: string[] = []

  for (const block of blocks) {
    try {
      const parsed: unknown = JSON.parse(block[1] ?? '{}')
      const items = flattenLd(parsed)
      for (const item of items) {
        if (!item || typeof item !== 'object') continue
        const record = item as Record<string, unknown>
        const type = String(record['@type'] ?? '')
        if (!/jobposting/i.test(type)) continue
        const title = typeof record.title === 'string' ? record.title : ''
        const description =
          typeof record.description === 'string' ? htmlToText(record.description) : ''
        const hiring =
          record.hiringOrganization &&
          typeof record.hiringOrganization === 'object' &&
          typeof (record.hiringOrganization as { name?: unknown }).name === 'string'
            ? String((record.hiringOrganization as { name: string }).name)
            : ''
        chunks.push([title, hiring, description].filter(Boolean).join('\n'))
      }
    } catch {
      /* ignore malformed JSON-LD */
    }
  }

  return chunks.sort((a, b) => b.length - a.length)[0] ?? ''
}

function flattenLd(value: unknown): unknown[] {
  if (Array.isArray(value)) return value.flatMap(flattenLd)
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    if (Array.isArray(record['@graph'])) return flattenLd(record['@graph'])
    return [value]
  }
  return []
}

export function extractJobText(html: string): string {
  const jsonLd = extractJsonLdJob(html)
  let stripped = html
  for (const tag of ['script', 'style', 'noscript', 'svg', 'nav', 'footer', 'form', 'iframe']) {
    stripped = stripTagBlocks(stripped, tag)
  }
  const fromDom = cleanExtractedText(htmlToText(slicePreferredContainer(stripped)))
  const candidate = jsonLd.length > fromDom.length ? jsonLd : fromDom
  return candidate
}

function fail(): Response {
  return Response.json({ ok: false })
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  let body: FetchBody
  try {
    body = (await request.json()) as FetchBody
  } catch {
    return fail()
  }

  const parsed = parseHttpUrl(String(body.url ?? ''))
  if (!parsed) return fail()

  const limited = await enforceRateLimit(request, { prefix: 'cuecard:fetch-job' })
  if (limited) return limited

  try {
    const upstream = await fetchPublicHttp(
      parsed,
      AbortSignal.timeout(FETCH_TIMEOUT_MS),
    )
    if (!upstream || !upstream.ok) return fail()

    const html = await readCappedText(upstream, MAX_BYTES)
    if (html === null) return fail()

    const text = extractJobText(html)
    if (text.length < MIN_CHARS) return fail()

    return Response.json({ ok: true, text })
  } catch {
    return fail()
  }
}
