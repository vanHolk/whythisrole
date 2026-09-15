export function isTouchRecordingDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: coarse)').matches
}

export function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return true
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
}

export function iosBrowserSettingsName(): string | null {
  if (!isIOSDevice()) return null
  const ua = navigator.userAgent
  if (/CriOS/i.test(ua)) return 'Chrome'
  if (/EdgiOS/i.test(ua)) return 'Edge'
  if (/FxiOS/i.test(ua)) return 'Firefox'
  if (/OPiOS|OPT\//i.test(ua)) return 'Opera'
  return null
}

export type RecordingBrowserKind =
  | 'ios-chrome'
  | 'ios-safari'
  | 'android-chrome'
  | 'desktop-chrome'
  | 'other'

export function recordingBrowserKind(): RecordingBrowserKind {
  if (typeof navigator === 'undefined') return 'other'
  const ua = navigator.userAgent
  const ios = isIOSDevice()
  const android = /Android/i.test(ua)
  if (ios && /CriOS/i.test(ua)) return 'ios-chrome'
  if (ios && /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|OPT\//i.test(ua)) {
    return 'ios-safari'
  }
  if (android && /Chrome/i.test(ua) && !/Edg/i.test(ua)) return 'android-chrome'
  if (!ios && !android && /Chrome/i.test(ua) && !/Edg/i.test(ua)) return 'desktop-chrome'
  return 'other'
}

export type BlockedMedia = 'camera' | 'microphone' | 'both' | 'other'

type CaptureError = Error & { blockedKind?: Exclude<BlockedMedia, 'other'> }

const DESKTOP_CONSTRAINTS: MediaStreamConstraints[] = [
  {
    video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: true,
  },
  { video: { facingMode: { ideal: 'user' } }, audio: true },
  { video: true, audio: true },
]

function assertCanCapture() {
  if (!window.isSecureContext) {
    throw new DOMException('Camera access needs https.', 'SecurityError')
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new DOMException('getUserMedia is not available.', 'NotSupportedError')
  }
}

function isDenied(error: unknown): boolean {
  const name = error instanceof DOMException ? error.name : ''
  return name === 'NotAllowedError' || name === 'PermissionDeniedError'
}

function isOverconstrained(error: unknown): boolean {
  const name = error instanceof DOMException ? error.name : ''
  return name === 'OverconstrainedError' || name === 'ConstraintNotSatisfiedError'
}

function markBlocked(error: unknown, kind: Exclude<BlockedMedia, 'other'>): unknown {
  if (error && typeof error === 'object') {
    ;(error as CaptureError).blockedKind = kind
  }
  return error
}

export function blockedMediaKind(error: unknown): BlockedMedia {
  if (error && typeof error === 'object' && 'blockedKind' in error) {
    const kind = (error as CaptureError).blockedKind
    if (kind === 'camera' || kind === 'microphone' || kind === 'both') return kind
  }
  if (isDenied(error)) return 'both'
  return 'other'
}

export function isPermissionDeniedError(error: unknown): boolean {
  return isDenied(error)
}

async function capture(constraints: MediaStreamConstraints): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia(constraints)
}

async function getIosCameraMicStream(): Promise<MediaStream> {
  let video: MediaStream
  try {
    video = await capture({
      video: { facingMode: { ideal: 'user' } },
      audio: false,
    })
  } catch (error) {
    if (isOverconstrained(error)) {
      try {
        video = await capture({ video: true, audio: false })
      } catch (fallbackError) {
        throw markBlocked(fallbackError, 'camera')
      }
    } else {
      throw markBlocked(error, 'camera')
    }
  }

  try {
    const audio = await capture({ video: false, audio: true })
    for (const track of audio.getAudioTracks()) video.addTrack(track)
    return video
  } catch (error) {
    video.getTracks().forEach((track) => track.stop())
    throw markBlocked(error, 'microphone')
  }
}

async function getDesktopCameraMicStream(): Promise<MediaStream> {
  let lastError: unknown
  for (const constraints of DESKTOP_CONSTRAINTS) {
    try {
      return await capture(constraints)
    } catch (error) {
      lastError = error
      if (isDenied(error)) break
    }
  }
  throw markBlocked(
    lastError instanceof Error
      ? lastError
      : new DOMException('Could not start the camera.', 'NotReadableError'),
    'both',
  )
}

export async function getCameraMicStream(): Promise<MediaStream> {
  assertCanCapture()
  if (isIOSDevice()) return getIosCameraMicStream()
  if (isTouchRecordingDevice()) {
    try {
      return await capture({
        video: { facingMode: { ideal: 'user' } },
        audio: true,
      })
    } catch (error) {
      if (isDenied(error)) throw markBlocked(error, 'both')
      try {
        return await capture({ video: true, audio: true })
      } catch (fallback) {
        throw markBlocked(fallback, 'both')
      }
    }
  }
  return getDesktopCameraMicStream()
}

export type CameraDeniedHelp = {
  title: string
  steps: string[]
  note?: string
}

export function cameraIdleHint(): string | null {
  const app = iosBrowserSettingsName()
  if (app) {
    return `${app} on iPhone often skips the popup. Camera access is in Settings → ${app}.`
  }
  return null
}

export function cameraPendingHint(): string {
  const app = iosBrowserSettingsName()
  if (app) {
    return `Allow it if iPhone asks. If nothing appears, that’s normal — use Settings → ${app}.`
  }
  return 'Allow camera and microphone when the browser asks.'
}

export function cameraDeniedHelp(error?: unknown): CameraDeniedHelp {
  const blocked = error ? blockedMediaKind(error) : 'both'
  const app = iosBrowserSettingsName()
  const kindLabel =
    blocked === 'microphone' ? 'Microphone' : blocked === 'camera' ? 'Camera' : 'Camera and Microphone'

  if (app) {
    return {
      title:
        blocked === 'microphone'
          ? `${app} turned the camera on, but the microphone is still off.`
          : `${app} didn’t ask. Turn ${kindLabel} on in iPhone Settings.`,
      steps: [
        `Open the Settings app (the grey gear, not ${app}).`,
        `Scroll to ${app}.`,
        blocked === 'microphone'
          ? 'Turn on Microphone.'
          : blocked === 'camera'
            ? 'Turn on Camera.'
            : 'Turn on Camera and Microphone.',
        'Come back here and tap Enable camera.',
      ],
      note: `This is an iPhone setting for the ${app} app. A site popup often never appears.`,
    }
  }

  switch (recordingBrowserKind()) {
    case 'ios-safari':
      return {
        title: 'Safari blocked the camera for this site.',
        steps: [
          'Open Settings → Safari.',
          'Set Camera and Microphone to Ask or Allow.',
          'Return here and tap Enable camera.',
        ],
      }
    case 'android-chrome':
      return {
        title: 'Chrome blocked the camera for this site.',
        steps: [
          'Tap the lock icon in the address bar.',
          'Open Permissions.',
          'Set Camera and Microphone to Allow.',
          'Tap Enable camera again.',
        ],
      }
    case 'desktop-chrome':
      return {
        title: 'Chrome blocked the camera for this site.',
        steps: [
          'Click the lock or camera icon in the address bar.',
          'Set Camera and Microphone to Allow.',
          'Click Enable camera again.',
        ],
      }
    default:
      return {
        title: 'This browser blocked the camera.',
        steps: [
          'Open this site’s camera and microphone permissions.',
          'Turn both on, then tap Enable camera again.',
        ],
      }
  }
}

export function cameraErrorMessage(error: unknown): string {
  if (!window.isSecureContext) {
    return 'Camera access needs a secure connection. Open whythisrole.com and try again.'
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    return 'This browser cannot access the camera. Try Safari or Chrome on this phone.'
  }

  const name = error instanceof DOMException ? error.name : ''
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return cameraDeniedHelp(error).title
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'No camera or microphone was found on this device.'
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return 'The camera is in use by another app. Close it and try again.'
  }
  if (name === 'OverconstrainedError' || name === 'ConstraintNotSatisfiedError') {
    return 'Could not start the front camera. Try again, or use Safari or Chrome.'
  }
  if (name === 'SecurityError' || name === 'NotSupportedError') {
    return 'This browser blocked camera access. Try Safari or Chrome, and stay on https.'
  }
  return 'Could not start the camera. Tap Enable camera and allow access if the browser asks.'
}
