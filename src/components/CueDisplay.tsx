import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { PROMPTER_SPEEDS, type PrompterSpeed } from '../lib/constants'
import type { CueMode } from '../lib/types'

type CueDisplayProps = {
  text: string
  mode: CueMode
  isScrolling: boolean
  speed?: PrompterSpeed
  loop?: boolean
}

export function CueDisplay({
  text,
  mode,
  isScrolling,
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
      speed={speed}
      loop={loop}
    />
  )
}

function ScrollingCue({
  text,
  mode,
  isScrolling,
  speed,
  loop,
}: {
  text: string
  mode: CueMode
  isScrolling: boolean
  speed: PrompterSpeed
  loop: boolean
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const maxScrollRef = useRef(0)
  const lineHeightRef = useRef(33)
  const [maxScroll, setMaxScroll] = useState(0)
  const [lineHeight, setLineHeight] = useState(33)

  const lines = mode === 'script' ? splitScriptLines(text) : text.split('\n')
  maxScrollRef.current = maxScroll
  lineHeightRef.current = lineHeight

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

  useEffect(() => {
    const content = contentRef.current
    if (!isScrolling) {
      window.cancelAnimationFrame(rafRef.current)
      if (content) content.style.transform = 'translate3d(0, 0, 0)'
      return
    }

    const startedAt = performance.now()
    const linesPerMinute = PROMPTER_SPEEDS[speed].linesPerMinute
    const tick = (now: number) => {
      const elapsedMs = now - startedAt
      const lineHeight = Math.max(lineHeightRef.current, 1)
      const pxPerMs = (lineHeight * linesPerMinute) / 60_000
      const maxScroll = maxScrollRef.current
      if (maxScroll <= 0) {
        if (content) content.style.transform = 'translate3d(0, 0, 0)'
        rafRef.current = window.requestAnimationFrame(tick)
        return
      }
      const distance = elapsedMs * pxPerMs
      const offset = loop ? distance % maxScroll : Math.min(maxScroll, distance)
      if (content) content.style.transform = `translate3d(0, -${offset}px, 0)`
      rafRef.current = window.requestAnimationFrame(tick)
    }
    rafRef.current = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(rafRef.current)
  }, [isScrolling, speed, text, loop, mode])

  return (
    <div className={mode === 'bullets' ? 'cue-display is-bullets is-scrolling' : 'cue-display is-script'}>
      <div className="prompter-frame" ref={frameRef}>
        <div className="prompter-copy" ref={contentRef}>
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
