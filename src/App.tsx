import { Lock } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { BottomBar } from './components/BottomBar'
import { CameraRecorder } from './components/CameraRecorder'
import { CuePickerStep } from './components/CuePickerStep'
import { GuidePage } from './components/GuidePage'
import { PrivacyPage } from './components/PrivacyPage'
import { JobPasteStep } from './components/JobPasteStep'
import { PaywallModal } from './components/PaywallModal'
import {
  PRICE_LABEL,
  formatTimer,
  requiresPayment,
  type PrompterSpeed,
} from './lib/constants'
import { bakeDownloadWatermark, clipFilename, downloadBlob } from './lib/recording'
import type { CueMode, CueSelection, RecordedClip } from './lib/types'

type Step = 1 | 2 | 3

export default function App() {
  if (window.location.pathname === '/guide') {
    return <GuidePage />
  }
  if (window.location.pathname === '/privacy') {
    return <PrivacyPage />
  }
  return <Funnel />
}

function Funnel() {
  const [step, setStep] = useState<Step>(1)
  const [jobDescription, setJobDescription] = useState('')
  const [companyBlurb, setCompanyBlurb] = useState('')
  const [bullets, setBullets] = useState('')
  const [script, setScript] = useState('')
  const [hasGenerated, setHasGenerated] = useState(false)
  const [selection, setSelection] = useState<CueSelection | null>(null)
  const [clip, setClip] = useState<RecordedClip | null>(null)
  const [prompterSpeed, setPrompterSpeed] = useState<PrompterSpeed>('normal')
  const clipUrlRef = useRef<string | null>(null)
  const [unlocked, setUnlocked] = useState(false)
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [downloadCount, setDownloadCount] = useState(0)
  const [preparingDownload, setPreparingDownload] = useState(false)
  const preparingRef = useRef(false)
  const bakedRef = useRef<{ source: Blob; result: { blob: Blob; extension: string } } | null>(
    null,
  )

  const gated = clip ? requiresPayment(clip.durationMs) && !unlocked : false
  const canGoToStep2 = hasGenerated
  const canGoToStep3 = Boolean(selection)

  const resultCopy = useMemo(() => {
    if (!clip) return null
    if (!requiresPayment(clip.durationMs)) {
      return `This take is ${formatTimer(clip.durationMs)}. It is under 45 seconds, so download is free.`
    }
    if (unlocked) {
      return `This take is ${formatTimer(clip.durationMs)}. Payment confirmed in this session, so download is unlocked.`
    }
    return `This take is ${formatTimer(clip.durationMs)}. Download is ${PRICE_LABEL} because it is 45 seconds or longer.`
  }, [clip, unlocked])

  function handleGenerated(output: { bullets: string; script: string }) {
    setBullets(output.bullets)
    setScript(output.script)
    setHasGenerated(true)
    setSelection(null)
    setStep(2)
  }

  function pick(mode: CueMode) {
    const text = mode === 'bullets' ? bullets : script
    setSelection({ mode, text })
  }

  function handleClipChange(next: RecordedClip | null) {
    const previousUrl = clipUrlRef.current
    if (previousUrl && previousUrl !== next?.objectUrl) {
      URL.revokeObjectURL(previousUrl)
    }
    clipUrlRef.current = next?.objectUrl ?? null
    bakedRef.current = null
    setClip(next)
    setUnlocked(false)
    setPaywallOpen(false)
  }

  async function saveClip() {
    if (!clip || preparingRef.current) return
    preparingRef.current = true
    setPreparingDownload(true)
    try {
      const cached = bakedRef.current?.source === clip.blob ? bakedRef.current.result : null
      const result =
        cached ??
        (await bakeDownloadWatermark(clip.blob, {
          durationMs: clip.durationMs,
          extension: clip.extension,
        }))
      if (result.blob !== clip.blob) {
        bakedRef.current = { source: clip.blob, result }
      }
      downloadBlob(result.blob, clipFilename(result.extension))
      setDownloadCount((count) => count + 1)
    } finally {
      preparingRef.current = false
      setPreparingDownload(false)
    }
  }

  function handleDownload() {
    if (!clip || preparingRef.current) return
    if (requiresPayment(clip.durationMs) && !unlocked) {
      setPaywallOpen(true)
      return
    }
    void saveClip()
  }

  function goNext() {
    if (step === 1 && canGoToStep2) setStep(2)
    if (step === 2 && canGoToStep3) setStep(3)
  }

  function goBack() {
    if (step === 2) setStep(1)
    if (step === 3) setStep(2)
  }

  return (
    <div className={step === 3 ? 'page is-record' : 'page'}>
      <AppHeader />

      {step === 1 ? (
        <main className="main">
          <section className="hero">
            <img
              className="hero-illustration"
              src="/hero-illustration.png"
              alt="Candidate looking at the camera, notes in their lap crossed out"
              width={220}
              height={220}
            />
            <div className="hero-copy">
              <h1 className="display">A short recording, with a script running right over the camera.</h1>
              <p>
                For candidates who've already been asked to submit a video.
                The file stays on this device, it's never uploaded.
              </p>
            </div>
          </section>

          <JobPasteStep
            jobDescription={jobDescription}
            companyBlurb={companyBlurb}
            onJobDescriptionChange={setJobDescription}
            onCompanyBlurbChange={setCompanyBlurb}
            onGenerated={handleGenerated}
          />

          <footer className="footer">
            <p className="footer-trust">
              <Lock size={18} strokeWidth={2} aria-hidden="true" />
              Video never leaves this browser tab. No account. Desktop web for now.
            </p>
            <p>
              Not affiliated with LinkedIn.{' '}
              <a className="footer-link" href="/privacy">
                Privacy & Terms.
              </a>
            </p>
          </footer>
        </main>
      ) : null}

      {step === 2 ? (
        <main className="main">
          <CuePickerStep
            bullets={bullets}
            script={script}
            selection={selection}
            onBulletsChange={(value) => {
              setBullets(value)
              if (selection?.mode === 'bullets') {
                setSelection({ mode: 'bullets', text: value })
              }
            }}
            onScriptChange={(value) => {
              setScript(value)
              if (selection?.mode === 'script') {
                setSelection({ mode: 'script', text: value })
              }
            }}
            onPick={pick}
          />

          <footer className="footer">
            <p className="footer-trust">
              <Lock size={18} strokeWidth={2} aria-hidden="true" />
              Video never leaves this browser tab. No account. Desktop web for now.
            </p>
            <p>
              Not affiliated with LinkedIn.{' '}
              <a className="footer-link" href="/privacy">
                Privacy & Terms.
              </a>
            </p>
          </footer>
        </main>
      ) : null}

      {step === 3 && selection ? (
        <CameraRecorder
          cueText={selection.text}
          cueMode={selection.mode}
          clip={clip}
          resultCopy={resultCopy}
          gated={gated}
          speed={prompterSpeed}
          onSpeedChange={setPrompterSpeed}
          onClipChange={handleClipChange}
          onDownload={handleDownload}
          downloadCount={downloadCount}
          preparingDownload={preparingDownload}
          onBack={goBack}
        />
      ) : null}

      {step < 3 ? (
        <BottomBar
          step={step}
          backHidden={step === 1}
          onBack={goBack}
          primaryLabel="Next"
          primaryDisabled={step === 1 ? !canGoToStep2 : !canGoToStep3}
          onPrimary={goNext}
        />
      ) : null}

      <PaywallModal
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onUnlocked={() => {
          setUnlocked(true)
          setPaywallOpen(false)
          void saveClip()
        }}
      />
    </div>
  )
}