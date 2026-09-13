export function isTouchRecordingDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: coarse)').matches
}

const CAMERA_CONSTRAINTS: MediaStreamConstraints[] = [
  {
    video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: true,
  },
  { video: { facingMode: { ideal: 'user' } }, audio: true },
  { video: true, audio: true },
]

export async function getCameraMicStream(): Promise<MediaStream> {
  if (!window.isSecureContext) {
    throw new DOMException('Camera access needs https.', 'SecurityError')
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new DOMException('getUserMedia is not available.', 'NotSupportedError')
  }

  let lastError: unknown
  for (const constraints of CAMERA_CONSTRAINTS) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints)
    } catch (error) {
      lastError = error
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new DOMException('Could not start the camera.', 'NotReadableError')
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
    return 'Allow camera and microphone when asked. If you already blocked them, open this site’s settings in the browser, turn both on, then tap Enable again.'
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
  return 'Could not start the camera. Tap Enable camera and allow access when the browser asks.'
}
