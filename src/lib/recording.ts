export type RecorderFormat = {
  mimeType: string
  extension: string
}

const CANDIDATES: RecorderFormat[] = [
  { mimeType: 'video/webm;codecs=vp9,opus', extension: 'webm' },
  { mimeType: 'video/webm;codecs=vp8,opus', extension: 'webm' },
  { mimeType: 'video/webm', extension: 'webm' },
  // Safari best-effort only — spec output is webm.
  { mimeType: 'video/mp4', extension: 'mp4' },
]

export function pickRecorderFormat(): RecorderFormat {
  if (typeof MediaRecorder === 'undefined') {
    return { mimeType: '', extension: 'webm' }
  }

  for (const candidate of CANDIDATES) {
    if (MediaRecorder.isTypeSupported(candidate.mimeType)) {
      return candidate
    }
  }

  return { mimeType: '', extension: 'webm' }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

/** Short product URL burned into the downloaded file only. */
export const DOWNLOAD_WATERMARK_TEXT = 'whythisrole.com'

export async function bakeDownloadWatermark(
  blob: Blob,
  options: { durationMs?: number; extension: string },
): Promise<{ blob: Blob; extension: string }> {
  try {
    return await composeWatermarkedBlob(blob, options)
  } catch {
    return { blob, extension: options.extension }
  }
}

function pickCompositorMime(originalType: string): string {
  if (originalType && MediaRecorder.isTypeSupported(originalType)) {
    return originalType
  }
  const base = originalType.split(';')[0]?.trim() ?? ''
  if (base && MediaRecorder.isTypeSupported(base)) {
    return base
  }
  return pickRecorderFormat().mimeType
}

function extensionForMime(mimeType: string, fallback: string): string {
  if (mimeType.includes('mp4')) return 'mp4'
  if (mimeType.includes('webm')) return 'webm'
  return fallback
}

function drawWatermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const shortest = Math.min(width, height)
  const fontSize = Math.max(13, Math.round(shortest * 0.026))
  const padX = Math.max(12, Math.round(width * 0.016))
  const padY = Math.max(10, Math.round(height * 0.02))

  ctx.save()
  ctx.font = `500 ${fontSize}px -apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'
  ctx.lineJoin = 'round'
  ctx.miterLimit = 2
  ctx.lineWidth = Math.max(2, fontSize * 0.14)
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.42)'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.78)'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.38)'
  ctx.shadowBlur = Math.max(2, fontSize * 0.16)
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 1
  ctx.strokeText(DOWNLOAD_WATERMARK_TEXT, width - padX, height - padY)
  ctx.fillText(DOWNLOAD_WATERMARK_TEXT, width - padX, height - padY)
  ctx.restore()
}

function createCompositorRecorder(stream: MediaStream, mimeType: string): MediaRecorder {
  const attempts: MediaRecorderOptions[] = []
  if (mimeType) {
    attempts.push({ mimeType, videoBitsPerSecond: 4_000_000, audioBitsPerSecond: 128_000 })
    attempts.push({ mimeType })
  }
  attempts.push({ videoBitsPerSecond: 4_000_000 })
  attempts.push({})

  let lastError: unknown
  for (const options of attempts) {
    try {
      return new MediaRecorder(stream, options)
    } catch (error) {
      lastError = error
    }
  }
  throw lastError instanceof Error ? lastError : new Error('MediaRecorder failed')
}

async function composeWatermarkedBlob(
  blob: Blob,
  options: { durationMs?: number; extension: string },
): Promise<{ blob: Blob; extension: string }> {
  if (typeof MediaRecorder === 'undefined' || typeof document === 'undefined') {
    throw new Error('compositor unavailable')
  }

  const objectUrl = URL.createObjectURL(blob)
  const video = document.createElement('video')
  video.playsInline = true
  video.muted = true
  video.preload = 'auto'
  video.crossOrigin = 'anonymous'
  video.src = objectUrl
  video.setAttribute('playsinline', 'true')
  video.setAttribute('webkit-playsinline', 'true')
  video.style.cssText =
    'position:fixed;left:0;top:0;width:2px;height:2px;opacity:0;pointer-events:none;z-index:-1'
  document.body.append(video)

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) {
    video.remove()
    URL.revokeObjectURL(objectUrl)
    throw new Error('AudioContext unavailable')
  }

  const audioContext = new AudioCtx()
  let recorder: MediaRecorder | null = null
  let mixed: MediaStream | null = null
  let canvasStream: MediaStream | null = null
  let raf = 0
  let frameHandle = 0
  let finished = false

  const videoWithFrames = video as HTMLVideoElement & {
    requestVideoFrameCallback?: (callback: () => void) => number
    cancelVideoFrameCallback?: (handle: number) => void
  }

  try {
    await new Promise<void>((resolve, reject) => {
      const onReady = () => {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          resolve()
          return
        }
        video.currentTime = 0.05
        video.addEventListener(
          'seeked',
          () => {
            if (video.videoWidth > 0 && video.videoHeight > 0) resolve()
            else reject(new Error('no video frame'))
          },
          { once: true },
        )
      }
      video.addEventListener('loadeddata', onReady, { once: true })
      video.addEventListener('error', () => reject(new Error('video load failed')), { once: true })
      video.load()
    })

    const width = video.videoWidth
    const height = video.videoHeight
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) throw new Error('no 2d context')

    const paint = () => {
      ctx.drawImage(video, 0, 0, width, height)
      drawWatermark(ctx, width, height)
    }
    paint()

    canvasStream = canvas.captureStream(30)
    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }

    const dest = audioContext.createMediaStreamDestination()
    const source = audioContext.createMediaElementSource(video)
    source.connect(dest)

    mixed = new MediaStream()
    for (const track of canvasStream.getVideoTracks()) mixed.addTrack(track)
    for (const track of dest.stream.getAudioTracks()) mixed.addTrack(track)
    if (mixed.getVideoTracks().length === 0) {
      throw new Error('no video track')
    }

    const mimeType = pickCompositorMime(blob.type)
    recorder = createCompositorRecorder(mixed, mimeType)

    const chunks: BlobPart[] = []
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data)
    }

    const recorded = new Promise<Blob>((resolve, reject) => {
      recorder!.onstop = () => {
        const type = recorder!.mimeType || mimeType || blob.type || 'video/webm'
        resolve(new Blob(chunks, { type }))
      }
      recorder!.onerror = () => reject(new Error('MediaRecorder failed'))
    })

    recorder.start(250)

    const paintLoop = () => {
      if (finished) return
      paint()
      raf = window.requestAnimationFrame(paintLoop)
    }
    raf = window.requestAnimationFrame(paintLoop)

    if (videoWithFrames.requestVideoFrameCallback) {
      const onFrame = () => {
        if (finished) return
        paint()
        frameHandle = videoWithFrames.requestVideoFrameCallback!(onFrame)
      }
      frameHandle = videoWithFrames.requestVideoFrameCallback(onFrame)
    }

    video.currentTime = 0
    await video.play()

    const durationHint =
      Number.isFinite(video.duration) && video.duration > 0
        ? video.duration * 1000
        : (options.durationMs ?? 90_000)

    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error('watermark timed out')), durationHint + 15_000)
      video.addEventListener(
        'ended',
        () => {
          window.clearTimeout(timer)
          resolve()
        },
        { once: true },
      )
    })

    paint()
    finished = true
    window.cancelAnimationFrame(raf)
    videoWithFrames.cancelVideoFrameCallback?.(frameHandle)

    await new Promise((resolve) => window.setTimeout(resolve, 120))
    if (recorder.state !== 'inactive') recorder.stop()

    const output = await recorded
    if (output.size < 256) throw new Error('empty watermarked blob')

    return {
      blob: output,
      extension: extensionForMime(output.type || mimeType, options.extension),
    }
  } finally {
    finished = true
    window.cancelAnimationFrame(raf)
    videoWithFrames.cancelVideoFrameCallback?.(frameHandle)
    video.pause()
    canvasStream?.getTracks().forEach((track) => track.stop())
    mixed?.getTracks().forEach((track) => track.stop())
    if (recorder && recorder.state !== 'inactive') recorder.stop()
    void audioContext.close()
    video.removeAttribute('src')
    video.load()
    video.remove()
    URL.revokeObjectURL(objectUrl)
  }
}

export function clipFilename(extension: string): string {
  const stamp = new Date().toISOString().replaceAll(/[:.]/g, '-')
  return `whythisrole-${stamp}.${extension}`
}
