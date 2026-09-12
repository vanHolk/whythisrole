import { Check } from 'lucide-react'
import type { CueMode, CueSelection } from '../lib/types'

type CuePickerStepProps = {
  bullets: string
  script: string
  selection: CueSelection | null
  onBulletsChange: (value: string) => void
  onScriptChange: (value: string) => void
  onPick: (mode: CueMode) => void
}

export function CuePickerStep({
  bullets,
  script,
  selection,
  onBulletsChange,
  onScriptChange,
  onPick,
}: CuePickerStepProps) {
  return (
    <section className="card">
      <h2>Pick what you want on camera</h2>
      <p className="card-lede">
        Both versions are editable. Nothing is preselected. Choose talking
        points or the full script for this take.
      </p>

      <div className="output-grid">
        <CueOption
          title="Talking points"
          hint="Glanceable bullets. Usually looks more natural on camera."
          value={bullets}
          selected={selection?.mode === 'bullets'}
          onChange={onBulletsChange}
          onPick={() => onPick('bullets')}
          pickLabel="Use talking points"
        />
        <CueOption
          title="Full script"
          hint="A short script you can read. Edit until it sounds like you."
          value={script}
          selected={selection?.mode === 'script'}
          onChange={onScriptChange}
          onPick={() => onPick('script')}
          pickLabel="Use full script"
        />
      </div>
    </section>
  )
}

type CueOptionProps = {
  title: string
  hint: string
  value: string
  selected: boolean
  pickLabel: string
  onChange: (value: string) => void
  onPick: () => void
}

function CueOption({
  title,
  hint,
  value,
  selected,
  pickLabel,
  onChange,
  onPick,
}: CueOptionProps) {
  return (
    <div className={selected ? 'cue-option is-selected' : 'cue-option'}>
      {selected ? (
        <span className="cue-option-check" aria-hidden="true">
          <Check size={14} strokeWidth={2.5} />
        </span>
      ) : null}
      <div className="cue-option-head">
        <h3>{title}</h3>
        <p>{hint}</p>
      </div>
      <textarea rows={12} value={value} onChange={(event) => onChange(event.target.value)} />
      <button
        type="button"
        className={selected ? 'btn-primary' : 'btn-secondary'}
        onClick={onPick}
        aria-pressed={selected}
      >
        {selected ? 'Using this on camera' : pickLabel}
      </button>
    </div>
  )
}
