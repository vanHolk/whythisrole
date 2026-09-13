import { useEffect } from 'react'
import { EditorialFooter } from './guide/EditorialFooter'
import { EditorialHeader } from './guide/EditorialHeader'
import { HOW_LONG_GUIDE_PATH, READ_FROM_SCRIPT_PATH } from './guide/paths'
import './guide/editorial.css'

const PAGE_TITLE = 'FAQ · whythisrole'

export function FaqPage() {
  useEffect(() => {
    const previous = document.title
    document.title = PAGE_TITLE
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <div className="editorial">
      <EditorialHeader active="faq" />

      <main className="editorial-shell">
        <article className="editorial-faq">
          <p className="editorial-eyebrow">Help</p>
          <h1>Frequently asked questions</h1>
          <p className="editorial-dek">
            Short answers about whythisrole, video interviews, and what stays
            on your device.
          </p>

          <div className="faq-list">
            <section className="faq-item">
              <h2>What is whythisrole?</h2>
              <p>
                A small browser tool for people who have already been asked to
                submit a short video. Paste the job post, generate talking
                points or a script, then record with the cue next to the
                camera.
              </p>
            </section>
            <section className="faq-item">
              <h2>Does my video get uploaded?</h2>
              <p>
                No. The recording stays in this browser tab until you download
                it. There is no account and no server copy of your take. See{' '}
                <a href="/privacy">Privacy & Terms</a> for the details.
              </p>
            </section>
            <section className="faq-item">
              <h2>How long should my answer be?</h2>
              <p>
                For “Why do you want to work here?”, 45 to 90 seconds is enough
                for most one-way prompts. Stay under any cap the employer set.
                The{' '}
                <a href={HOW_LONG_GUIDE_PATH}>
                  length guide
                </a>{' '}
                has a practical range and when to stop.
              </p>
            </section>
            <section className="faq-item">
              <h2>Can I read from a script on camera?</h2>
              <p>
                Yes, if it still sounds spoken. Write short sentences, glance
                at the cue, then talk to the lens. A teleprompter helps more
                when it sits close to the camera than when you read a document
                off to the side. See{' '}
                <a href={READ_FROM_SCRIPT_PATH}>
                  how to read from a script without looking like you’re reading
                </a>.
              </p>
            </section>
            <section className="faq-item">
              <h2>Do I need an account?</h2>
              <p>No. Open the tool, paste the job, record, download.</p>
            </section>
            <section className="faq-item">
              <h2>Is this affiliated with LinkedIn?</h2>
              <p>
                No. whythisrole is an independent project. It is not affiliated
                with LinkedIn.
              </p>
            </section>
          </div>
        </article>
      </main>

      <EditorialFooter />
    </div>
  )
}
