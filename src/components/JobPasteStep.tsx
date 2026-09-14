import { AlertCircle, FileText, Link as LinkIcon, LoaderCircle, User } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'
import {
  GENERATE_MAX_CHARS,
  GENERATE_MIN_CHARS,
  combinedGenerateLength,
  generateTooLongMessage,
  validateGenerateInput,
} from '../lib/generate-input'

const FETCH_FAIL = "Couldn't pull text automatically, paste it in above"
const FETCH_RATE_LIMIT = 'Too many requests, try again in a minute'

function isHttpUrl(raw: string): boolean {
  try {
    const parsed = new URL(raw.trim())
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

type JobPasteStepProps = {
  jobDescription: string
  candidateSkills: string
  writeOwnScript: boolean
  onJobDescriptionChange: (value: string) => void
  onCandidateSkillsChange: (value: string) => void
  onWriteOwnScriptChange: (value: boolean) => void
  onGenerated: (output: { bullets: string; script: string }) => void
}

type FetchJobResponse = {
  ok?: boolean
  text?: string
  error?: string
}

export function JobPasteStep({
  jobDescription,
  candidateSkills,
  writeOwnScript,
  onJobDescriptionChange,
  onCandidateSkillsChange,
  onWriteOwnScriptChange,
  onGenerated,
}: JobPasteStepProps) {
  const [jobUrl, setJobUrl] = useState('')
  const [fetching, setFetching] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [fetchNotice, setFetchNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const jobDescriptionRef = useRef<HTMLTextAreaElement>(null)

  function showFetchFallback(message: string) {
    setFetchNotice(message)
    jobDescriptionRef.current?.focus()
  }

  async function handleFetch() {
    setFetchNotice(null)
    if (!isHttpUrl(jobUrl)) {
      showFetchFallback(FETCH_FAIL)
      return
    }
    setError(null)
    setFetching(true)
    try {
      const response = await fetch('/api/fetch-job', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: jobUrl }),
      })
      const payload = (await response.json()) as FetchJobResponse
      if (response.status === 429) {
        showFetchFallback(payload.error ?? FETCH_RATE_LIMIT)
        return
      }
      if (!payload.ok || !payload.text?.trim()) {
        showFetchFallback(FETCH_FAIL)
        return
      }
      onJobDescriptionChange(payload.text.trim())
    } catch {
      showFetchFallback(FETCH_FAIL)
    } finally {
      setFetching(false)
    }
  }

  const combinedLength = combinedGenerateLength(jobDescription, candidateSkills)
  const tooShort = jobDescription.trim().length < GENERATE_MIN_CHARS
  const tooLong = combinedLength > GENERATE_MAX_CHARS
  const lengthError = tooLong ? generateTooLongMessage(combinedLength) : null

  async function handleGenerate(event: FormEvent) {
    event.preventDefault()
    setError(null)
    const inputError = validateGenerateInput(jobDescription, candidateSkills)
    if (inputError) {
      setError(inputError)
      return
    }
    setGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jobDescription, candidateSkills }),
      })
      const payload = (await response.json()) as {
        bullets?: string
        script?: string
        error?: string
      }
      if (!response.ok || !payload.bullets || !payload.script) {
        throw new Error(payload.error ?? 'Could not generate talking points.')
      }
      onGenerated({ bullets: payload.bullets, script: payload.script })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not generate talking points.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <section className="card">
      <h2>Paste the job they asked you about</h2>
      <p className="card-lede">
        Drop in the posting, or try a job URL. Then add a few notes about
        yourself so the talking points can connect your experience to the
        role. Fetch is best-effort. Paste is the path that always works.
        Nothing is saved.
      </p>

      <form className="stack" onSubmit={handleGenerate} noValidate>
        <label className="field">
          <span className="field-label">
            <FileText size={18} strokeWidth={2} aria-hidden="true" />
            Job description
          </span>
          <textarea
            ref={jobDescriptionRef}
            required
            rows={8}
            value={jobDescription}
            onChange={(event) => {
              setFetchNotice(null)
              setError(null)
              onJobDescriptionChange(event.target.value)
            }}
            placeholder="Paste the job description or the question they asked you to answer on video…"
          />
        </label>

        <label className="field">
          <span>
            Or paste a job URL <em>(optional)</em>
          </span>
          <div className="field-row">
            <div className="input-with-icon">
              <LinkIcon size={18} strokeWidth={2} aria-hidden="true" />
              <input
                type="text"
                inputMode="url"
                autoComplete="url"
                spellCheck={false}
                value={jobUrl}
                onChange={(event) => {
                  setFetchNotice(null)
                  setError(null)
                  setJobUrl(event.target.value)
                }}
                placeholder="https://…"
              />
            </div>
            <button
              type="button"
              className={
                jobUrl.trim()
                  ? 'btn-secondary btn-fetch'
                  : 'btn-secondary btn-fetch is-idle'
              }
              onClick={handleFetch}
              disabled={fetching || !jobUrl.trim()}
              aria-busy={fetching}
            >
              {fetching ? (
                <>
                  <LoaderCircle
                    className="btn-fetch-spinner"
                    size={18}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">Fetching</span>
                </>
              ) : (
                'Fetch'
              )}
            </button>
          </div>
        </label>
        {fetchNotice ? (
          <p className="form-warning" role="alert">
            <AlertCircle size={18} strokeWidth={2} aria-hidden="true" />
            {fetchNotice}
          </p>
        ) : null}

        <label className="field">
          <span className="field-label">
            <User size={18} strokeWidth={2} aria-hidden="true" />
            Your skills &amp; experience <em>(optional)</em>
          </span>
          <textarea
            rows={4}
            value={candidateSkills}
            onChange={(event) => {
              setError(null)
              onCandidateSkillsChange(event.target.value)
            }}
            placeholder="Years in the field, tools you use, a project you shipped, languages… whatever makes the answer yours."
          />
        </label>

        {lengthError || error ? (
          <p className="form-error">{lengthError ?? error}</p>
        ) : null}
        <div className="generate-row">
          <button
            type="submit"
            className="btn-primary"
            disabled={generating || fetching || tooShort || tooLong}
          >
            {generating ? 'Generating…' : 'Generate talking points'}
          </button>
          <label className="write-own">
            <input
              type="checkbox"
              checked={writeOwnScript}
              onChange={(event) => onWriteOwnScriptChange(event.target.checked)}
            />
            I want to write my own script
          </label>
        </div>
      </form>
    </section>
  )
}
