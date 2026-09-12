import { Box, Camera, Cloud, Gauge, Mic } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  FREE_LIMIT_MS,
  HARD_CAP_MS,
  PREVIEW_WINDOW_MS,
  PRICE_LABEL,
  PROMPTER_SPEEDS,
  formatTimer,
  pickSaveToast,
  pickTakeToast,
  type PrompterSpeed,
} from '../lib/constants'
import { pickRecorderFormat } from '../lib/recording'
import type { CueMode, RecordedClip } from '../lib/types'
import { AudioMeter } from './AudioMeter'
import { BottomBar } from './BottomBar'
import { CueDisplay } from './CueDisplay'

type Phase = 'need-permission' | 'ready' | 'countdown' | 'recording' | 'review' | 'download'

type CameraRecorderProps = {
  cueText: string
  cueMode: CueMode
  clip: RecordedClip | null
  resultCopy: string | null
  gated: boolean
  speed: PrompterSpeed
  onSpeedChange: (speed: PrompterSpeed) => void
  onClipChange: (clip: RecordedClip | null) => void
  onDownload: () => void
  downloadCount: number
  preparingDownload?: boolean
  onBack: () => void
}

export function CameraRecorder({
  cueText,
  cueMode,
  clip,
  resultCopy,
  gated,
  speed,
  onSpeedChange,
  onClipChange,
  onDownload,
  downloadCount,
  preparingDownload = false,
  onBack,
}: CameraRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const startedAtRef = useRef(0)
  const elapsedRef = useRef(0)
  const tickRef = useRef<number>(0)
  const previewTickRef = useRef<number>(0)
  const countdownRef = useRef<number>(0)
  const startingRef = useRef(false)

  const [phase, setPhase] = useState<Phase>(clip ? 'review' : 'need-permission')
  const [permissionState, setPermissionState] = useState<'idle' | 'pending' | 'live' | 'denied'>(
    'idle',
  )
  const [error, setError] = useState<string | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [previewElapsedMs, setPreviewElapsedMs] = useState(0)
  const [previewing, setPreviewing] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [cameraName, setCameraName] = useState('Camera')
  const [micName, setMicName] = useState('Microphone')
  const [toast, setToast] = useState<string | null>(null)
  const [saveToast, setSaveToast] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [streamVersion, setStreamVersion] = useState(0)
  const lastDownloadCountRef = useRef(downloadCount)

  const inPaidZone = phase === 'recording' && elapsedMs >= FREE_LIMIT_MS
  const liveStream = streamRef.current
  const isLivePreview = permissionState === 'live' && (phase === 'ready' || phase === 'countdown' || phase === 'recording')

  useEffect(() => {
    void enableCamera(!clip)
    return () => {
      window.clearInterval(tickRef.current)
      window.clearInterval(previewTickRef.current)
      window.clearInterval(countdownRef.current)
      recorderRef.current?.state === 'recording' && recorderRef.current.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
    // Mount-only: request devices once for this record session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (phase !== 'review' && phase !== 'download') return
    const video = videoRef.current
    const url = clip?.objectUrl
    if (!video || !url) return
    video.srcObject = null
    video.controls = true
    video.muted = false
    if (video.src !== url) video.src = url
    const showFrame = () => {
      if (video.currentTime === 0) video.currentTime = 0.05
    }
    video.addEventListener('loadeddata', showFrame)
    video.load()
    return () => video.removeEventListener('loadeddata', showFrame)
  }, [phase, clip])

  useEffect(() => {
    if (phase !== 'review' || !toast) return
    const timeout = window.setTimeout(() => setToast(null), 3400)
    return () => window.clearTimeout(timeout)
  }, [phase, toast])

  useEffect(() => {
    if (phase !== 'download' || !saveToast) return
    const timeout = window.setTimeout(() => setSaveToast(null), 3400)
    return () => window.clearTimeout(timeout)
  }, [phase, saveToast])

  useEffect(() => {
    if (downloadCount === lastDownloadCountRef.current) return
    lastDownloadCountRef.current = downloadCount
    if (downloadCount < 1) return
    setSaved(true)
    setSaveToast(pickSaveToast())
  }, [downloadCount])

  function attachStream(stream: MediaStream) {
    streamRef.current = stream
    setStreamVersion((value) => value + 1)
    const video = videoRef.current
    if (!video) return
    video.controls = false
    video.removeAttribute('src')
    video.srcObject = stream
    video.muted = true
    void video.play().catch(() => {
      /* autoplay can fail until a click; preview still attaches */
    })
  }

  async function enableCamera(attachPreview = true) {
    setError(null)
    setPermissionState('pending')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      })
      streamRef.current = stream
      setStreamVersion((value) => value + 1)
      if (attachPreview) attachStream(stream)
      setPermissionState('live')
      if (attachPreview) {
        setPhase((current) =>
          current === 'need-permission' || current === 'ready' ? 'ready' : current,
        )
      }
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoId = stream.getVideoTracks()[0]?.getSettings().deviceId
      const audioId = stream.getAudioTracks()[0]?.getSettings().deviceId
      const videoLabel = devices.find(
        (device) => device.deviceId === videoId && device.kind === 'videoinput',
      )?.label
      const audioLabel = devices.find(
        (device) => device.deviceId === audioId && device.kind === 'audioinput',
      )?.label
      setCameraName(videoLabel || stream.getVideoTracks()[0]?.label || 'Camera')
      setMicName(audioLabel || stream.getAudioTracks()[0]?.label || 'Microphone')
    } catch {
      setPermissionState('denied')
      setPhase((current) =>
        current === 'review' || current === 'download' ? current : 'need-permission',
      )
      setError(
        'Camera and microphone access is required to record. Check the browser prompt and try again.',
      )
    }
  }

  function stopPreview() {
    window.clearInterval(previewTickRef.current)
    setPreviewing(false)
    setPreviewElapsedMs(0)
  }

  function startPreview() {
    if (cueMode !== 'script' || phase !== 'ready') return
    window.clearInterval(previewTickRef.current)
    const started = Date.now()
    const demoMs = PREVIEW_WINDOW_MS[speed]
    setPreviewing(true)
    setPreviewElapsedMs(0)
    previewTickRef.current = window.setInterval(() => {
      const elapsed = Date.now() - started
      if (elapsed >= demoMs) {
        window.clearInterval(previewTickRef.current)
        setPreviewing(false)
        setPreviewElapsedMs(0)
        return
      }
      setPreviewElapsedMs(elapsed)
    }, 50)
  }

  function stopTicker() {
    window.clearInterval(tickRef.current)
  }

  function finishRecording() {
    const recorder = recorderRef.current
    if (!recorder || recorder.state === 'inactive') return
    recorder.stop()
  }

  function startRecording() {
    if (startingRef.current || recorderRef.current?.state === 'recording') return
    const stream = streamRef.current
    if (!stream) return
    if (typeof MediaRecorder === 'undefined') {
      setError('This browser does not support in-tab recording (MediaRecorder).')
      return
    }
    startingRef.current = true

    window.clearInterval(countdownRef.current)
    stopPreview()

    const video = videoRef.current
    if (video) {
      video.controls = false
      video.removeAttribute('src')
      video.srcObject = stream
      video.muted = true
      void video.play()
    }

    const format = pickRecorderFormat()
    chunksRef.current = []

    let recorder: MediaRecorder
    try {
      recorder = format.mimeType
        ? new MediaRecorder(stream, { mimeType: format.mimeType })
        : new MediaRecorder(stream)
    } catch {
      startingRef.current = false
      setError('Could not start the recorder in this browser.')
      return
    }

    recorderRef.current = recorder
    const mimeType = recorder.mimeType || format.mimeType || 'video/webm'
    const extension = mimeType.includes('mp4') ? 'mp4' : format.extension

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data)
    }

    recorder.onstop = () => {
      startingRef.current = false
      stopTicker()
      const durationMs = Math.min(HARD_CAP_MS, elapsedRef.current)
      const blob = new Blob(chunksRef.current, { type: mimeType })
      const objectUrl = URL.createObjectURL(blob)
      setPhase('review')
      setToast(pickTakeToast())

      const playback = videoRef.current
      if (playback) {
        playback.srcObject = null
        playback.src = objectUrl
        playback.controls = true
        playback.muted = false
      }

      onClipChange({ blob, durationMs, extension, objectUrl })
    }

    startedAtRef.current = Date.now()
    elapsedRef.current = 0
    setElapsedMs(0)
    setPhase('recording')

    try {
      recorder.start(250)
    } catch {
      startingRef.current = false
      setError('Could not start the recorder in this browser.')
      setPhase('ready')
      return
    }
    stopTicker()
    tickRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current
      elapsedRef.current = elapsed
      setElapsedMs(elapsed)
      if (elapsed >= HARD_CAP_MS) {
        stopTicker()
        finishRecording()
      }
    }, 100)
  }

  function beginCountdown() {
    if (!streamRef.current) return
    stopPreview()
    setCountdown(3)
    setPhase('countdown')
    window.clearInterval(countdownRef.current)
    let remaining = 3
    countdownRef.current = window.setInterval(() => {
      remaining -= 1
      if (remaining <= 0) {
        window.clearInterval(countdownRef.current)
        startRecording()
        return
      }
      setCountdown(remaining)
    }, 1000)
  }

  function cancelCountdown() {
    window.clearInterval(countdownRef.current)
    setPhase('ready')
    setCountdown(3)
  }

  function skipCountdown() {
    window.clearInterval(countdownRef.current)
    startRecording()
  }

  function restoreLivePreview() {
    const stream = streamRef.current
    const video = videoRef.current
    if (video) {
      video.controls = false
      video.removeAttribute('src')
      video.muted = true
      video.srcObject = stream
      if (stream) void video.play()
    }
  }

  async function handleRetake() {
    setToast(null)
    setSaveToast(null)
    setSaved(false)
    setCountdown(3)
    setPhase('countdown')
    restoreLivePreview()
    onClipChange(null)
    if (!streamRef.current) {
      await enableCamera(true)
      if (!streamRef.current) {
        setPhase('need-permission')
        return
      }
    }
    beginCountdown()
  }

  async function handleDelete() {
    setToast(null)
    setSaveToast(null)
    setSaved(false)
    if (!streamRef.current) await enableCamera(true)
    else restoreLivePreview()
    onClipChange(null)
    setPhase('ready')
  }

  function handlePrimary() {
    if (phase === 'ready') beginCountdown()
    else if (phase === 'recording') finishRecording()
    else if (phase === 'review') setPhase('download')
    else if (phase === 'download') onDownload()
    else if (phase === 'need-permission') void enableCamera()
  }

  const primary =
    phase === 'need-permission'
      ? { label: permissionState === 'pending' ? 'Requesting access…' : 'Enable camera & mic', disabled: permissionState === 'pending', danger: false }
      : phase === 'ready'
        ? { label: 'Start recording', disabled: permissionState !== 'live', danger: false }
        : phase === 'countdown'
          ? { label: 'Start recording', disabled: true, danger: false }
          : phase === 'recording'
            ? { label: 'Stop', disabled: false, danger: true }
            : phase === 'review'
              ? { label: 'Continue', disabled: false, danger: false }
              : { label: gated ? `Download · ${PRICE_LABEL}` : 'Download', disabled: !clip, danger: false }

  const showCue = phase === 'ready' || phase === 'countdown' || phase === 'recording'
  const cueScrolling =
    cueMode === 'script' && (phase === 'recording' || (phase === 'ready' && previewing))
  const cueElapsed = phase === 'recording' ? elapsedMs : previewElapsedMs

  return (
    <div className="record-shell">
      <div className="stage is-full">
        <video
          ref={videoRef}
          className={isLivePreview ? 'stage-video is-mirrored' : 'stage-video'}
          autoPlay={isLivePreview}
          playsInline
          muted={isLivePreview}
        />

        {phase === 'need-permission' ? (
          <div className="stage-empty is-light">
            <p>Turn on your camera when you are ready to record.</p>
          </div>
        ) : null}

        {showCue ? (
          <CueDisplay
            text={cueText}
            mode={cueMode}
            isScrolling={cueScrolling}
            elapsedMs={cueElapsed}
            speed={speed}
            loop={false}
          />
        ) : null}

        {phase === 'recording' ? (
          <div className="rec-timer" aria-live="off">
            <span className="rec-dot" />
            {formatTimer(elapsedMs)}
            <span className="rec-cap"> / 1:30</span>
          </div>
        ) : null}

        {inPaidZone ? (
          <div className="paid-pill" role="status">
            Paid zone · download {PRICE_LABEL}
          </div>
        ) : null}

        {phase === 'countdown' && countdown > 0 ? (
          <div className="countdown-overlay">
            <button type="button" className="countdown-close" onClick={cancelCountdown} aria-label="Cancel">
              ×
            </button>
            <p className="countdown-number">{countdown}</p>
            <button type="button" className="countdown-skip" onClick={skipCountdown}>
              Skip
            </button>
          </div>
        ) : null}

        {phase === 'review' && toast ? (
          <div className="take-toast" role="status">
            {toast}
          </div>
        ) : null}

        {phase === 'download' && saveToast ? (
          <div className="take-toast" role="status">
            {saveToast}
          </div>
        ) : null}
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      {phase === 'ready' ? (
        <div className="ready-panel">
          <div className="device-row">
            <DeviceChip kind="camera" label="Camera" name={cameraName} />
            <DeviceChip kind="mic" label="Mic" name={micName} />
          </div>
          <div className="meter-block">
            <span>Mic level</span>
            <AudioMeter stream={liveStream} active={permissionState === 'live' && streamVersion > 0} />
          </div>
          <div className="speed-block">
            <span className="label-with-icon">
              <Gauge size={18} strokeWidth={2} aria-hidden="true" />
              Teleprompter speed
            </span>
            <div className="speed-presets" role="group" aria-label="Teleprompter speed">
              {(Object.keys(PROMPTER_SPEEDS) as PrompterSpeed[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={speed === key ? 'speed-chip is-active' : 'speed-chip'}
                  onClick={() => {
                    stopPreview()
                    onSpeedChange(key)
                  }}
                >
                  {PROMPTER_SPEEDS[key].label}
                </button>
              ))}
              {cueMode === 'script' ? (
                <button
                  type="button"
                  className={previewing ? 'speed-chip is-preview is-active' : 'speed-chip is-preview'}
                  onClick={startPreview}
                >
                  {previewing ? 'Previewing…' : 'Preview'}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {phase === 'review' ? (
        <div className="review-actions">
          <button type="button" className="btn-secondary" onClick={handleRetake}>
            Retake
          </button>
          <button type="button" className="btn-secondary" onClick={handleDelete}>
            Delete
          </button>
        </div>
      ) : null}

      {phase === 'download' ? (
        <div className="download-status">
          {resultCopy ? (
            <div className="result-bar">
              <p>{resultCopy}</p>
            </div>
          ) : null}
          <div className="share-card">
            <div className="share-card-copy">
              <p>Need a link instead of a file?</p>
              <p>Host the video on Google Drive or Dropbox, then share a link from there.</p>
            </div>
            <div className="share-card-actions">
              <a
                className="share-card-btn"
                href="https://drive.google.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Google Drive"
              >
                <Cloud size={16} strokeWidth={2} aria-hidden="true" />
              </a>
              <a
                className="share-card-btn"
                href="https://www.dropbox.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Dropbox"
              >
                <Box size={16} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <BottomBar
        step={3}
        onBack={onBack}
        backDisabled={phase === 'countdown' || phase === 'recording' || preparingDownload}
        primaryLabel={
          phase === 'download' && preparingDownload
            ? 'Preparing…'
            : phase === 'download' && saved
              ? 'Saved'
              : primary.label
        }
        primaryDisabled={primary.disabled || preparingDownload}
        primaryDanger={primary.danger}
        primarySaved={phase === 'download' && saved}
        onPrimary={handlePrimary}
      />
    </div>
  )
}

function DeviceChip({
  kind,
  label,
  name,
}: {
  kind: 'camera' | 'mic'
  label: string
  name: string
}) {
  const Icon = kind === 'camera' ? Camera : Mic
  return (
    <div className="device-chip">
      <Icon className="device-chip-icon" size={18} strokeWidth={2} aria-hidden="true" />
      <div>
        <p className="device-chip-kind">{label}</p>
        <p className="device-chip-name">{name}</p>
      </div>
      <span className="on-badge">On</span>
    </div>
  )
}
