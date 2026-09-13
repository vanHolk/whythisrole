export const HARD_CAP_MS = 90_000
export const HARD_CAP_SECONDS = HARD_CAP_MS / 1000

export function formatTimer(ms: number): string {
  const totalSeconds = Math.min(
    HARD_CAP_SECONDS,
    Math.floor(Math.max(0, ms) / 1000),
  )
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export const STEP_LABELS = ['Paste the job', 'Pick and edit', 'Record'] as const

export const PROMPTER_SPEEDS = {
  slow: { label: 'Slow', wpm: 25, linesPerMinute: 4.5 },
  normal: { label: 'Normal', wpm: 50, linesPerMinute: 9 },
  fast: { label: 'Fast', wpm: 100, linesPerMinute: 18 },
} as const

export type PrompterSpeed = keyof typeof PROMPTER_SPEEDS

/** Same window for every chip so Preview shows pace, not a matched line count. */
export const PREVIEW_WINDOW_MS = 8400

export const TAKE_TOASTS = [
  'Nice take, that felt natural.',
  'Done. Onto the next thing on your list.',
  'Clean take, short and clear.',
  "That's a wrap on this one.",
  'Good energy on that one.',
  'Solid, straight to the point.',
  'Recorded. That should land well.',
] as const

let lastToastIndex = -1

export function pickTakeToast(): string {
  let index = Math.floor(Math.random() * TAKE_TOASTS.length)
  if (index === lastToastIndex) {
    index = (index + 1) % TAKE_TOASTS.length
  }
  lastToastIndex = index
  return TAKE_TOASTS[index] ?? 'Recorded. That should land well.'
}

export const SAVE_TOASTS = [
  'Saved. Good luck with it.',
  "Downloaded, that's ready to send.",
  "Done, it's on your device now.",
  "Saved successfully, you're all set.",
  "That's yours now, go get 'em.",
  'Nice, ready to attach and send.',
] as const

let lastSaveToastIndex = -1

export function pickSaveToast(): string {
  let index = Math.floor(Math.random() * SAVE_TOASTS.length)
  if (index === lastSaveToastIndex) {
    index = (index + 1) % SAVE_TOASTS.length
  }
  lastSaveToastIndex = index
  return SAVE_TOASTS[index] ?? 'Saved. Good luck with it.'
}
