import { useEffect, useState, type FormEvent } from 'react'
import { ArticleMeta } from './guide/ArticleMeta'
import { Callout } from './guide/Callout'
import { CtaCard } from './guide/CtaCard'
import { EditorialFooter } from './guide/EditorialFooter'
import { EditorialHeader } from './guide/EditorialHeader'
import { RelatedPostCard } from './guide/RelatedPostCard'
import { Toc } from './guide/Toc'
import './guide/editorial.css'

const PAGE_TITLE =
  '“Why do you want to work here?” video answers (with examples) · whythisrole'

export function GuidePage() {
  useEffect(() => {
    const previous = document.title
    document.title = PAGE_TITLE
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <div className="editorial">
      <EditorialHeader active="guide" />

      <div className="editorial-shell">
        <div className="editorial-layout">
          <article className="editorial-article">
            <p className="editorial-eyebrow">Video interview guide</p>
            <h1>“Why do you want to work here?” video answers (with examples)</h1>
            <p className="editorial-dek">
              A calm, practical way to answer the question employers keep putting
              in one-way video interviews—without sounding like you memorized the
              About page.
            </p>

            <figure className="article-cover">
              <img
                src="/hero-illustration.png"
                alt=""
                width={120}
                height={120}
              />
            </figure>

            <ArticleMeta
              authorName="Van Ho"
              authorHref="https://www.vanholker.com"
              publishedLabel="September 13, 2026"
              publishedDateTime="2026-09-13"
              readingTime="8 min read"
            />

            <Toc variant="mobile" />

            <div className="editorial-prose">
              <p>
                If you have been asked to record a short video, you have probably
                seen this prompt: “Why do you want to work here?” It shows up in
                async, one-way interviews because it is a fast way to see whether
                you did any homework, and whether you can talk about a company
                without reading the careers site out loud.
              </p>
              <p>
                This guide covers what hiring teams are listening for, a simple
                formula you can reuse, and three example answers you can adapt.
                Keep it short. Sound like yourself. If you are reading a script,
                write it the way you actually talk.
              </p>

              <h2 id="why-employers-ask">Why employers ask this</h2>
              <p>
                The question is not a trivia test. Most reviewers already know
                their own mission statement. They are checking three quieter
                things:
              </p>
              <ul>
                <li>Did you look past the job title?</li>
                <li>Can you connect your work to something they actually do?</li>
                <li>
                  Will you sound like someone they could put in a follow-up call
                  without cringing?
                </li>
              </ul>
              <p>
                In a live interview, a follow-up question can rescue a vague
                answer. In a one-way video, there is no rescue. You get one take
                that has to stand on its own. That is why this prompt is so
                common in async screens: it is a cheap filter for generic
                applications.
              </p>
              <p>
                A useful length for most prompts is 45 to 90 seconds. Longer than
                that and people start skipping. Shorter than 30 seconds and you
                usually have not said why this company—only why you want a job.
              </p>

              <div className="inline-cta">
                <p>Have the posting open? Turn your notes into a 90-second script.</p>
                <a className="editorial-cta" href="/">
                  Turn your notes into a 90-second script
                </a>
              </div>

              <h2 id="what-a-strong-answer-includes">What a strong answer includes</h2>
              <p>
                A strong answer is specific, short, and a little personal. It
                usually has four pieces, and not much else:
              </p>
              <ul>
                <li>
                  One concrete thing about the company—a product, a customer, a
                  recent change—not “great culture”
                </li>
                <li>One reason that thing matters to you</li>
                <li>One proof point from your own work</li>
                <li>A close that looks forward, not a sales pitch</li>
              </ul>
              <p>
                You do not need to cover your whole resume. You need a
                through-line: them, then you, then what you would do next.
              </p>
              <p>
                If you are using a teleprompter, the words still have to sound
                spoken. Short sentences. Contractions. One idea at a time. A
                script that looks polished on a page often sounds stiff on
                camera. Leave yourself a beat to glance at the cue, then talk to
                the lens. Looking natural with a teleprompter is less about
                memorizing and more about not chasing every word with your eyes.
              </p>

              <Callout variant="info" label="On length">
                <p>
                  Most one-way prompts work best at 45–90 seconds. That is long
                  enough to name the company, give one proof point, and stop. If
                  the employer set a hard cap, stay under it with a few seconds
                  to spare so you are not rushing the last sentence.
                </p>
              </Callout>

              <h2 id="a-simple-answer-formula">A simple answer formula</h2>
              <p>
                Use this four-beat structure. Spoken at a normal pace, it fits
                in about a minute.
              </p>
              <ol>
                <li>
                  <strong>The hook.</strong> Name the company and the one thing
                  that made you apply.
                </li>
                <li>
                  <strong>The fit.</strong> Tie that thing to a skill or
                  experience you already have.
                </li>
                <li>
                  <strong>The proof.</strong> Give one short example, not a
                  career montage.
                </li>
                <li>
                  <strong>The close.</strong> Say what you want to do in the
                  role, in plain language.
                </li>
              </ol>
              <p>
                If a sentence does not serve one of those four beats, cut it.
                “I’m passionate about this space” almost never does.
              </p>

              <Callout variant="tip" label="Tip">
                <p>
                  If you freeze, start with “I applied because…” and finish the
                  sentence out loud. That first clause is usually enough to get
                  you into the formula.
                </p>
              </Callout>

              <h2 id="example-answers">3 example answers</h2>
              <p>
                These are spoken drafts, not copy-paste speeches. Swap in the
                real product, the real constraint, and a proof point that is
                actually yours. Each one lands around a minute if you do not
                rush.
              </p>

              <h3>1. You already know the product</h3>
              <p>
                “I applied because I have used your product from the customer
                side, and I kept thinking about one workflow that still takes our
                team too long. I spent three years next to support queues, so I
                know what it looks like when a feature ships clean in a demo and
                messy on a Monday. What I want to do here is take that same
                bias—fewer steps, clearer defaults—and put it on the problems you
                are already naming in the job post.”
              </p>

              <h3>2. You are changing fields</h3>
              <p>
                “I want to work here because you are building for a problem I
                have sat with as an operator, not as a specialist. I ran
                scheduling for a forty-person team, which is unglamorous and very
                specific. When I saw you were hiring someone to make that kind of
                work less manual, I did not need a branding video to decide. I
                want to bring the operator view into the first year of this
                role—especially the parts that look simple until you do them
                every week.”
              </p>

              <h3>3. You are earlier in your career</h3>
              <p>
                “I’m interested in this role because the team publishes how they
                work, not just what they sell. I learned more from your public
                writing than from the careers page. I do not have ten years of
                experience. I do have internships where I owned a small, real
                deliverable, and I want to keep doing that kind of work in a
                place that already talks in public about tradeoffs. That is why I
                applied here instead of sending the same video to twenty tabs.”
              </p>

              <h2 id="common-mistakes">Common mistakes</h2>
              <p>
                Most weak takes fail in the same few ways. They are easy to
                fix once you can name them.
              </p>
              <ul>
                <li>
                  Reciting the About page. Reviewers wrote that copy. They do
                  not need it read back to them.
                </li>
                <li>
                  “I’m passionate about this space” with no example attached.
                </li>
                <li>
                  Reading a script with your eyes tracking left to right. Sit
                  back far enough that a glance at the cue does not become a
                  visible scan.
                </li>
                <li>
                  Going past two minutes. If they wanted a presentation, they
                  would have asked for one.
                </li>
                <li>
                  Apologizing for nerves on camera. A short pause is fine. A
                  disclaimer is not.
                </li>
                <li>
                  Listing every job you have had. One proof point beats a
                  montage.
                </li>
                <li>
                  Talking only about what you want—title, remote, salary—and
                  never about the work.
                </li>
              </ul>
              <p>
                Setup matters more than people admit. Put the camera at eye
                level. Sit facing a window or a lamp, not with the bright source
                behind you. Find a quiet room. Leave a second of silence at the
                start so the clip does not open mid-breath. Then say the four
                beats and stop.
              </p>

              <h2 id="final-tip">Final tip before recording</h2>
              <p>
                Do one ugly take on purpose. Then do the real one. The first
                take burns off the nerves; the second is usually the one you
                send.
              </p>
              <p>
                If you are reading from a teleprompter, do not chase a perfect
                recitation. Glance, then talk. A small pause sounds more human
                than a flawless paragraph. Keep it short. Stop when you have
                said the four beats. Smile at the end only if that is how you
                actually look when you are done talking.
              </p>
              <p>
                You can practice the whole thing privately on this device. The
                recording stays in the browser tab until you download it.
              </p>

              <div className="inline-cta">
                <p>Run a private take before you send anything.</p>
                <a className="editorial-cta editorial-cta-secondary" href="/">
                  Practice your answer privately on this device
                </a>
              </div>
            </div>

            <section className="related-block" aria-labelledby="related-heading">
              <h2 id="related-heading">Related</h2>
              <div className="related-grid">
                <RelatedPostCard
                  title="How long should a one-way video answer be?"
                  dek="A practical range for async prompts, and when to stop early."
                />
                <RelatedPostCard
                  title="Looking natural while you read a script"
                  dek="Eye line, pacing, and why a teleprompter should sit near the lens."
                />
                <RelatedPostCard
                  title="Camera, light, and audio for a desk setup"
                  dek="The minimum that keeps reviewers from noticing the room."
                />
              </div>
            </section>

            <EmailCapture />
          </article>

          <aside className="editorial-sidebar">
            <Toc />
            <CtaCard
              title="Generate your answer"
              body="Paste the job post and get a short script you can edit before you record."
              label="Generate your answer"
            />
          </aside>
        </div>
      </div>

      <EditorialFooter />
    </div>
  )
}

function EmailCapture() {
  const [noteVisible, setNoteVisible] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNoteVisible(true)
  }

  return (
    <section className="email-capture" aria-labelledby="email-heading">
      <h2 id="email-heading">Get the next guide</h2>
      <p>
        Occasional notes on video interviews. You do not need an email to use
        the recording tool.
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          <span className="visually-hidden">Email address</span>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            autoComplete="email"
            required
          />
        </label>
        <button type="submit" className="editorial-cta">
          Notify me
        </button>
      </form>
      {noteVisible ? (
        <p className="email-capture-note" role="status">
          This form isn’t connected yet. Nothing was sent.
        </p>
      ) : null}
    </section>
  )
}
