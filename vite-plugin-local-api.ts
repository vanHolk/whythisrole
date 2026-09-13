import type { IncomingMessage, ServerResponse } from 'node:http'
import { loadEnv, type Plugin } from 'vite'

function requestHeaders(req: IncomingMessage): Headers {
  const headers = new Headers()
  headers.set('content-type', req.headers['content-type'] ?? 'application/json')

  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') headers.set('x-forwarded-for', forwarded)
  else if (Array.isArray(forwarded) && forwarded[0]) {
    headers.set('x-forwarded-for', forwarded[0])
  } else if (req.socket.remoteAddress) {
    headers.set('x-forwarded-for', req.socket.remoteAddress)
  }

  const realIp = req.headers['x-real-ip']
  if (typeof realIp === 'string') headers.set('x-real-ip', realIp)
  return headers
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer | string) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

async function pipeToNode(
  handler: (request: Request) => Promise<Response>,
  req: IncomingMessage,
  res: ServerResponse,
  url: string,
): Promise<void> {
  const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await readBody(req)
  const request = new Request(`http://localhost${url}`, {
    method: req.method,
    headers: requestHeaders(req),
    body,
  })
  const response = await handler(request)
  res.statusCode = response.status
  res.setHeader('content-type', response.headers.get('content-type') ?? 'application/json')
  res.end(await response.text())
}

export function localApiPlugin(): Plugin {
  // Vite loads .env after plugin factories run and will not overwrite
  // existing process.env keys. Apply .env first so GROQ_API_KEY and
  // USE_MOCK_GENERATE=false actually reach the generate handler.
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
  const loaded = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(loaded)) {
    if (process.env[key] === undefined) process.env[key] = value
  }

  // Safe local default: the funnel works without a key. Set
  // USE_MOCK_GENERATE=false in .env to call Groq from npm run dev.
  if (!process.env.USE_MOCK_GENERATE) {
    process.env.USE_MOCK_GENERATE = 'true'
  }

  return {
    name: 'cuecard-local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''

        try {
          if (url === '/api/generate') {
            const { default: handler } = await import('./api/generate')
            await pipeToNode(handler, req, res, url)
            return
          }
          if (url === '/api/fetch-job') {
            const { default: handler } = await import('./api/fetch-job')
            await pipeToNode(handler, req, res, url)
            return
          }
        } catch (error) {
          res.statusCode = 500
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'API error' }))
          return
        }

        next()
      })
    },
  }
}
