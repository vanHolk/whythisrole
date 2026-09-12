import { useEffect, useRef, useState } from 'react'

const BAR_COUNT = 20

type AudioMeterProps = {
  stream: MediaStream | null
  active: boolean
}

export function AudioMeter({ stream, active }: AudioMeterProps) {
  const [levels, setLevels] = useState<number[]>(() => Array.from({ length: BAR_COUNT }, () => 0))
  const frameRef = useRef(0)

  useEffect(() => {
    if (!stream || !active) {
      setLevels(Array.from({ length: BAR_COUNT }, () => 0))
      return
    }

    const audioTracks = stream.getAudioTracks()
    if (audioTracks.length === 0) return

    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return

    const context = new AudioCtx()
    const source = context.createMediaStreamSource(stream)
    const analyser = context.createAnalyser()
    analyser.fftSize = 64
    analyser.smoothingTimeConstant = 0.7
    source.connect(analyser)
    void context.resume()

    const buffer = new Uint8Array(analyser.frequencyBinCount)

    function tick() {
      analyser.getByteFrequencyData(buffer)
      const next: number[] = []
      const slice = Math.max(1, Math.floor(buffer.length / BAR_COUNT))
      for (let index = 0; index < BAR_COUNT; index += 1) {
        const start = index * slice
        let sum = 0
        for (let offset = 0; offset < slice; offset += 1) {
          sum += buffer[start + offset] ?? 0
        }
        next.push(sum / slice / 255)
      }
      setLevels(next)
      frameRef.current = window.requestAnimationFrame(tick)
    }

    frameRef.current = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frameRef.current)
      source.disconnect()
      void context.close()
    }
  }, [stream, active])

  return (
    <div className="audio-meter" aria-hidden="true">
      {levels.map((level, index) => (
        <span
          key={index}
          className="audio-meter-bar"
          style={{ height: `${Math.max(8, level * 100)}%` }}
        />
      ))}
    </div>
  )
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}