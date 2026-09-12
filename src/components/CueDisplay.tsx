import { useLayoutEffect, useRef, useState } from 'react'
import { PROMPTER_SPEEDS, type PrompterSpeed } from '../lib/constants.ts'
import type { CueMode } from '../lib/types.ts'

type CueDisplayProps = {
  text: string
  mode: CueMode
  isScrolling: boolean
  elapsedMs: number
  speed?: PrompterSpeed
  loop?: boolean
}

export function CueDisplay({
  text,
  mode,
  isScrolling,
  elapsedMs,
  speed = 'normal',
  loop = false,
}: CueDisplayProps) {
  const trimmed = text.trim()
  if (!trimmed) return null

  if (mode === 'bullets' && !isScrolling) {
    return (
      <div className="cue-display is-bullets" aria-live="polite">
        {trimmed}
      </div>
    )
  }

  return (
    <ScrollingCue
      text={trimmed}
      mode={mode}
      isScrolling={isScrolling}
      elapsedMs={elapsedMs}
      speed={speed}
      loop={loop}
    />
  )
}

function ScrollingCue({
  text,
  mode,
  isScrolling,
  elapsedMs,
  speed,
  loop,
}: {
  text: string
  mode: CueMode
  isScrolling: boolean
  elapsedMs: number
  speed: PrompterSpeed
  loop: boolean
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [maxScroll, setMaxScroll] = useState(0)
  const [lineHeight, setLineHeight] = useState(33)

  const lines = mode === 'script' ? splitScriptLines(text) : text.split('\n')
  const linesPerMinute = PROMPTER_SPEEDS[speed].linesPerMinute
  const overflowLines = maxScroll / Math.max(lineHeight, 1)
  const durationMs = Math.max(4_000, (overflowLines / Math.max(linesPerMinute, 1)) * 60_000)
  const raw = isScrolling && maxScroll > 0 ? elapsedMs / durationMs : 0
  const progress = loop ? raw % 1 : Math.min(1, raw)
  const offset = progress * maxScroll

  useLayoutEffect(() => {
    const frame = frameRef.current
    const content = contentRef.current
    if (!frame || !content) return

    function measure() {
      if (!frame || !content) return
      setMaxScroll(Math.max(0, content.scrollHeight - frame.clientHeight))
      const firstLine = content.querySelector('p')
      const measured = firstLine?.getBoundingClientRect().height
      if (measured && measured > 0) setLineHeight(measured)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    observer.observe(content)
    return () => observer.disconnect()
  }, [text, mode])

  return (
    <div className={mode === 'bullets' ? 'cue-display is-bullets is-scrolling' : 'cue-display is-script'}>
      <div className="prompter-frame" ref={frameRef}>
        <div
          className="prompter-copy"
          ref={contentRef}
          style={{ transform: `translateY(-${offset}px)` }}
        >
          {lines.map((line, index) => (
            <p key={`${index}-${line}`}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

function splitScriptLines(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
}
