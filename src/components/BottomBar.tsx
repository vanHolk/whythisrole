import { Check, ChevronLeft, ChevronRight, Download, LoaderCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { STEP_LABELS } from '../lib/constants'

const PRIMARY_CHEVRON_LABELS = new Set(['Next', 'Continue'])

type BottomBarProps = {
  step: 1 | 2 | 3
  backHidden?: boolean
  backDisabled?: boolean
  onBack?: () => void
  primaryLabel: string
  primaryDisabled?: boolean
  primaryDanger?: boolean
  primarySaved?: boolean
  primaryBusy?: boolean
  onPrimary: () => void
  belowPrimary?: ReactNode
}

export function BottomBar({
  step,
  backHidden = false,
  backDisabled = false,
  onBack,
  primaryLabel,
  primaryDisabled = false,
  primaryDanger = false,
  primarySaved = false,
  primaryBusy = false,
  onPrimary,
  belowPrimary,
}: BottomBarProps) {
  const primaryClass = primaryDanger
    ? 'btn-record is-recording'
    : primarySaved
      ? 'btn-primary is-saved'
      : 'btn-primary'

  return (
    <nav className="bottom-bar" aria-label="Step navigation">
      <div className="bottom-bar-row">
        <div className="bottom-bar-slot is-start">
          <button
            type="button"
            className="btn-secondary"
            onClick={onBack}
            disabled={backDisabled || backHidden || !onBack}
            hidden={backHidden}
          >
            <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
            Back
          </button>
        </div>

        <div className="bottom-bar-progress" aria-label={`Step ${step} of 3, ${STEP_LABELS[step - 1]}`}>
          <p>
            Step {step} of 3
            <span> · {STEP_LABELS[step - 1]}</span>
          </p>
          <ol className="stepper-dots">
            {STEP_LABELS.map((name, index) => {
              const number = index + 1
              const state = number === step ? 'is-current' : number < step ? 'is-done' : ''
              return (
                <li key={name} className={state}>
                  <span className="stepper-dot" />
                  <span className="visually-hidden">{name}</span>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="bottom-bar-slot is-end">
          <button
            type="button"
            className={primaryClass}
            onClick={onPrimary}
            disabled={primaryDisabled}
            aria-busy={primaryBusy}
          >
            {primaryBusy ? (
              <LoaderCircle
                className="btn-spinner"
                size={18}
                strokeWidth={2}
                aria-hidden="true"
              />
            ) : null}
            {primarySaved ? <Check size={18} strokeWidth={2} aria-hidden="true" /> : null}
            {!primarySaved && !primaryBusy && primaryLabel === 'Start recording' ? (
              <span className="start-rec-dot" aria-hidden="true" />
            ) : null}
            {!primarySaved && !primaryBusy && primaryLabel === 'Download' ? (
              <Download size={16} strokeWidth={2} aria-hidden="true" />
            ) : null}
            {primaryLabel}
            {!primarySaved && !primaryBusy && PRIMARY_CHEVRON_LABELS.has(primaryLabel) ? (
              <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
            ) : null}
          </button>
        </div>
      </div>
      {belowPrimary}
    </nav>
  )
}