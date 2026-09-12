import { Building2, FileText, Link as LinkIcon, LoaderCircle } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import {
  GENERATE_MAX_CHARS,
  GENERATE_MIN_CHARS,
  combinedGenerateLength,
  generateTooLongMessage,
  validateGenerateInput,
} from '../lib/generate-input.ts'

const FETCH_FAIL = "Couldn't pull text automatically, paste it in above"
const FETCH_RATE_LIMIT = 'Too many requests, try again in a minute'

type JobPasteStepProps = {
  jobDescription: string
  companyBlurb: string
  onJobDescriptionChange: (value: string) => void
  onCompanyBlurbChange: (value: string) => void
  onGenerated: (output: { bullets: string; script: string }) => void
}

type FetchJobResponse = {
  ok?: boolean
  text?: string
  error?: string
}

export function JobPasteStep({
  jobDescription,
  companyBlurb,
  onJobDescriptionChange,
  onCompanyBlurbChange,
  onGenerated,
}: JobPasteStepProps) {
  const [jobUrl, setJobUrl] = useState('')
  const [fetching, setFetching] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [fetchNotice, setFetchNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFetch() {
    setFetchNotice(null)
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
        setFetchNotice(payload.error ?? FETCH_RATE_LIMIT)
        return
      }
      if (!payload.ok || !payload.text?.trim()) {
        setFetchNotice(FETCH_FAIL)
        return
      }
      onJobDescriptionChange(payload.text.trim())
    } catch {
      setFetchNotice(FETCH_FAIL)
    } finally {
      setFetching(false)
    }
  }

  const combinedLength = combinedGenerateLength(jobDescription, companyBlurb)
  const tooShort = jobDescription.trim().length < GENERATE_MIN_CHARS
  const tooLong = combinedLength > GENERATE_MAX_CHARS
  const lengthError = tooLong ? generateTooLongMessage(combinedLength) : null

  async function handleGenerate(event: FormEvent) {
    event.preventDefault()
    setError(null)
    const inputError = validateGenerateInput(jobDescription, companyBlurb)
    if (inputError) {
      setError(inputError)
      return
    }
    setGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jobDescription, companyBlurb }),
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
        Drop in the posting, or try a job URL. Fetch is best-effort. Paste is
        the path that always works. Nothing is saved.
      </p>

      <form className="stack" onSubmit={handleGenerate}>
        <label className="field">
          <span className="field-label">
            <FileText size={18} strokeWidth={2} aria-hidden="true" />
            Job description
          </span>
          <textarea
            required
            rows={8}
            value={jobDescription}
            onChange={(event) => onJobDescriptionChange(event.target.value)}
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
                type="url"
                value={jobUrl}
                onChange={(event) => setJobUrl(event.target.value)}
                placeholder="https://…"
              />
            </div>
            <button
              type="button"
              className="btn-secondary btn-fetch"
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
        {fetchNotice ? <p className="form-soft">{fetchNotice}</p> : null}

        <label className="field">
          <span className="field-label">
            <Building2 size={18} strokeWidth={2} aria-hidden="true" />
            Company blurb <em>(optional)</em>
          </span>
          <textarea
            rows={3}
            value={companyBlurb}
            onChange={(event) => onCompanyBlurbChange(event.target.value)}
            placeholder="A sentence or two about the company, if you have it."
          />
        </label>

        {lengthError || error ? (
          <p className="form-error">{lengthError ?? error}</p>
        ) : null}
        <button
          type="submit"
          className="btn-primary"
          disabled={generating || fetching || tooShort || tooLong}
        >
          {generating ? 'Generating…' : 'Generate talking points'}
        </button>
      </form>
    </section>
  )
}
