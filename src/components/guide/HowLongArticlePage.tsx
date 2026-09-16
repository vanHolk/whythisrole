import { useEffect, useState, type FormEvent } from 'react'
import { ArticleMeta } from './ArticleMeta'
import { Callout } from './Callout'
import { CtaCard } from './CtaCard'
import { EditorialFooter } from './EditorialFooter'
import { EditorialHeader } from './EditorialHeader'
import { RelatedPostCard } from './RelatedPostCard'
import { Toc } from './Toc'
import { EMPLOYERS_LOOK_FOR_PATH, PRACTICE_GUIDE_PATH, READ_FROM_SCRIPT_PATH, WHY_HERE_GUIDE_PATH } from './paths'
import './editorial.css'

export { HOW_LONG_GUIDE_PATH } from './paths'

const PAGE_TITLE =
  'How long should a video interview answer actually be? · whythisrole'

const SECTIONS = [
  { id: 'sweet-spot', label: 'The sweet spot: 45 to 90 seconds' },
  { id: 'why-shorter', label: 'Why shorter usually works better on video' },
  { id: 'full-time-limit', label: 'Do you need to use the full time limit?' },
  { id: 'sixty-seconds', label: 'What can you actually say in 60 seconds?' },
  { id: 'thirty-seconds', label: 'When 30 seconds is enough' },
  { id: 'ninety-seconds', label: 'When you should use closer to 90 seconds' },
  { id: 'too-long', label: 'Why answers get too long' },
  { id: 'shorten', label: 'The easiest way to shorten an answer' },
  { id: 'timing-rule', label: 'A simple timing rule' },
  { id: 'speak-faster', label: 'Should you speak faster to fit more in?' },
  { id: 'how-fast', label: 'How fast should you speak?' },
  { id: 'freeze', label: 'What if I freeze halfway through?' },
  { id: 'memorize', label: 'Should you memorize a 60-second answer?' },
  { id: 'tell-me-about-yourself', label: 'What about “Tell me about yourself”?' },
  { id: 'behavioral', label: 'What about behavioral questions?' },
  { id: 'hard-rule', label: 'Is 90 seconds a hard rule?' },
  { id: 'before-you-record', label: 'Before you record' },
  { id: 'without-a-clock', label: 'Keep the answer close to 90 seconds without watching a clock' },
] as const

export function HowLongArticlePage() {
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
            <h1>How long should a video interview answer actually be?</h1>
            <p className="editorial-dek">
              For most video interview questions, aim for about 45 to 90
              seconds. That is usually enough to make one clear point, give a
              little context, and finish without repeating yourself.
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
              readingTime="10 min read"
            />

            <Toc variant="mobile" sections={SECTIONS} />

            <div className="editorial-prose">
              <p>
                If you’ve been asked to record a video interview answer, one of
                the first questions is usually:
              </p>
              <p>
                <strong>How long should I talk for?</strong>
              </p>
              <p>The short answer:</p>
              <p>
                <strong>
                  For most video interview questions, aim for about 45 to 90
                  seconds.
                </strong>
              </p>
              <p>
                That is usually enough time to make one clear point, give a
                little context, and finish without starting to repeat yourself.
              </p>
              <p>
                You do not need to fill every second the platform gives you.
              </p>
              <p>
                A strong 55-second answer is better than a two-minute answer
                that starts well and slowly loses direction.
              </p>

              <h2 id="sweet-spot">The sweet spot: 45 to 90 seconds</h2>
              <p>For most common interview questions, this range works well:</p>
              <ul>
                <li>
                  <strong>30 to 45 seconds:</strong> good for simple questions
                </li>
                <li>
                  <strong>45 to 60 seconds:</strong> enough for most answers
                </li>
                <li>
                  <strong>60 to 90 seconds:</strong> useful when you need a
                  specific example
                </li>
                <li>
                  <strong>More than 90 seconds:</strong> usually worth trimming
                </li>
              </ul>
              <p>There are exceptions, of course.</p>
              <p>
                If an employer explicitly gives you three minutes and asks for a
                detailed project example, use more time if you need it.
              </p>
              <p>But if the question is something like:</p>
              <ul>
                <li>
                  <a href={WHY_HERE_GUIDE_PATH}>“Why do you want to work here?”</a>
                </li>
                <li>“Tell us about yourself.”</li>
                <li>“What are your strengths?”</li>
                <li>“Why are you interested in this role?”</li>
              </ul>
              <p>you probably do not need several minutes.</p>

              <h2 id="why-shorter">Why shorter usually works better on video</h2>
              <p>Recorded answers feel different from live interviews.</p>
              <p>
                In a live conversation, an interviewer can interrupt, ask a
                follow-up question, or react to what you are saying.
              </p>
              <p>In a one-way video interview, none of that happens.</p>
              <p>
                You are speaking into a camera, and the person watching may
                have dozens of other recordings to review.
              </p>
              <p>That makes structure more important.</p>
              <p>A concise answer is easier to follow.</p>
              <p>
                It also makes you sound more confident because you are not
                searching for your point while you speak.
              </p>

              <h2 id="full-time-limit">Do you need to use the full time limit?</h2>
              <p>No.</p>
              <p>
                This is probably the biggest mistake people make with timed
                video interviews.
              </p>
              <p>
                If the platform gives you two minutes, that does{' '}
                <strong>not</strong> mean the employer expects a two-minute
                answer.
              </p>
              <p>Think of the time limit as a maximum, not a target.</p>
              <p>If your answer feels complete after 55 seconds, stop.</p>
              <p>
                You do not get extra credit for using the remaining 65 seconds.
              </p>

              <Callout variant="info" label="On the time limit">
                <p>
                  The platform’s clock is a ceiling, not a goal. A complete
                  55-second answer is better than filling leftover time.
                </p>
              </Callout>

              <h2 id="sixty-seconds">What can you actually say in 60 seconds?</h2>
              <p>More than you might think.</p>
              <p>A 60-second answer can usually fit three things:</p>
              <ol>
                <li>A direct answer to the question</li>
                <li>One piece of context or a short example</li>
                <li>A clear ending</li>
              </ol>
              <p>For example:</p>
              <blockquote>
                <p>
                  “One reason I’m interested in this role is that it combines
                  product design with growth. In my current role, I’ve been
                  working on onboarding and activation, and I’ve realized I
                  really enjoy that part of the product. I like looking at where
                  people drop off and finding ways to make the experience
                  simpler. So for my next role, I’d like to keep doing that, but
                  with more ownership over the full journey.”
                </p>
              </blockquote>
              <p>That is enough.</p>
              <p>
                You know what the candidate wants, why they want it, and what
                experience they have.
              </p>
              <p>
                You do not need another minute unless there is something
                genuinely useful to add.
              </p>

              <div className="inline-cta">
                <p>Have the posting open? Turn your notes into a 90-second script.</p>
                <a className="editorial-cta" href="/">
                  Turn your notes into a 90-second script
                </a>
              </div>

              <h2 id="thirty-seconds">When 30 seconds is enough</h2>
              <p>Some questions are simple.</p>
              <p>For example:</p>
              <p>
                <strong>“Are you comfortable working remotely?”</strong>
              </p>
              <p>A good answer might be:</p>
              <blockquote>
                <p>
                  “Yes. I’ve worked remotely for several years with teams across
                  different time zones. I’m comfortable communicating
                  asynchronously, documenting decisions, and managing my own
                  schedule. I also like having regular calls for the things that
                  are easier to solve together.”
                </p>
              </blockquote>
              <p>There is no reason to stretch that into 90 seconds.</p>
              <p>The answer is clear.</p>
              <p>Stop there.</p>

              <h2 id="ninety-seconds">When you should use closer to 90 seconds</h2>
              <p>Longer answers make sense when you need to tell a short story.</p>
              <p>For example:</p>
              <ul>
                <li>“Tell me about a difficult problem you solved.”</li>
                <li>“Describe a time you disagreed with a teammate.”</li>
                <li>“Tell us about a project you’re proud of.”</li>
                <li>“Describe a challenge you faced and how you handled it.”</li>
              </ul>
              <p>These usually need a little more context.</p>
              <p>A simple structure is:</p>
              <p>
                <strong>Situation → what you did → what happened</strong>
              </p>
              <p>You do not need every detail.</p>
              <p>
                Just enough for the listener to understand why the example
                matters.
              </p>

              <h3>Example</h3>
              <blockquote>
                <p>
                  “In one project, we noticed a lot of new users were getting
                  stuck during onboarding because the account setup process had
                  too many steps and some of the financial terminology was
                  confusing. I worked with product and engineering to simplify
                  the flow and rewrite the key instructions. We also moved a few
                  optional steps until after setup. After the changes, we saw a
                  clear improvement in completion, and support questions around
                  onboarding dropped as well. What I learned from that project
                  is that sometimes the biggest UX improvement is not adding
                  something. It’s deciding what people do not need yet.”
                </p>
              </blockquote>
              <p>
                That answer benefits from a little more time because the
                example itself is the answer.
              </p>

              <h2 id="too-long">Why answers get too long</h2>
              <p>
                Usually, it is not because the candidate has too much useful
                information.
              </p>
              <p>It is because they repeat themselves.</p>
              <p>You might say:</p>
              <blockquote>
                <p>
                  “I really enjoy working in smaller teams because I like
                  having ownership. I like being able to take ownership of my
                  work and have more responsibility, which is something I
                  really value.”
                </p>
              </blockquote>
              <p>That is one idea said three times.</p>
              <p>A tighter version:</p>
              <blockquote>
                <p>
                  “I enjoy smaller teams because I usually have more ownership
                  over what I’m working on.”
                </p>
              </blockquote>
              <p>Same point.</p>
              <p>Much easier to listen to.</p>

              <h2 id="shorten">The easiest way to shorten an answer</h2>
              <p>Record yourself once and listen back.</p>
              <p>Then look for these things:</p>

              <h3>Long introductions</h3>
              <p>You do not need:</p>
              <blockquote>
                <p>
                  “Thank you for giving me the opportunity to answer this
                  question. I think this is a really interesting question and
                  there are a few things that come to mind.”
                </p>
              </blockquote>
              <p>Just answer the question.</p>

              <h3>Repeating the question</h3>
              <p>If they ask:</p>
              <p>
                <strong>“Why are you interested in this role?”</strong>
              </p>
              <p>You do not need to begin with:</p>
              <blockquote>
                <p>“The reason I am interested in this role is because…”</p>
              </blockquote>
              <p>You can go straight into:</p>
              <blockquote>
                <p>“What caught my attention was…”</p>
              </blockquote>

              <h3>Saying the same thing twice</h3>
              <p>This is probably the easiest cut.</p>
              <p>If two sentences make the same point, choose the better one.</p>

              <h3>Too much background</h3>
              <p>Give people enough information to understand the example.</p>
              <p>Not enough to recreate your entire org chart.</p>

              <h3>Unnecessary endings</h3>
              <p>You do not need:</p>
              <blockquote>
                <p>
                  “So yeah, I think that basically covers why I’m interested
                  and I’m really excited about the opportunity and hopefully
                  I’ll have the chance to speak with you soon.”
                </p>
              </blockquote>
              <p>When the answer is finished, finish.</p>

              <h2 id="timing-rule">A simple timing rule</h2>
              <p>Here is an easy rule to use while preparing:</p>
              <p>
                <strong>One main point: 30 to 45 seconds</strong>
              </p>
              <p>
                <strong>One point + explanation: 45 to 60 seconds</strong>
              </p>
              <p>
                <strong>One point + short example: 60 to 90 seconds</strong>
              </p>
              <p>
                If you are regularly going past 90 seconds, the problem is
                usually structure, not speaking speed.
              </p>

              <h2 id="speak-faster">Should you speak faster to fit more in?</h2>
              <p>Usually not.</p>
              <p>
                When people realize their answer is too long, they often start
                speaking faster.
              </p>
              <p>That tends to make the recording worse.</p>
              <p>
                You sound nervous, and the interviewer has to work harder to
                follow you.
              </p>
              <p>Cut words instead.</p>
              <p>
                A slower 60-second answer is usually much better than racing
                through 100 seconds of material in 75 seconds.
              </p>

              <h2 id="how-fast">How fast should you speak?</h2>
              <p>You do not need to calculate words per minute.</p>
              <p>
                Just speak at roughly the pace you would use when explaining
                something to another person.
              </p>
              <p>A short pause after an important sentence is fine.</p>
              <p>
                Pauses often feel much longer to you while recording than they
                do to the person watching.
              </p>
              <p>You do not need to fill every moment with sound.</p>

              <h2 id="freeze">What if I freeze halfway through?</h2>
              <p>That is normal when recording yourself.</p>
              <p>If you lose your place, you have a few options.</p>
              <p>If the platform allows multiple takes, start again.</p>
              <p>
                If you are recording somewhere that lets you edit before
                submitting, you can simply record another version.
              </p>
              <p>If you only get one take, pause for a second and continue.</p>
              <p>
                A short pause looks much more natural than panicking and trying
                to fill the silence.
              </p>

              <h2 id="memorize">Should you memorize a 60-second answer?</h2>
              <p>You can, but you probably do not need to.</p>
              <p>
                For most people, it works better to remember three points
                instead.
              </p>
              <p>For example:</p>
              <p>
                <strong>Why this company</strong>
              </p>
              <ul>
                <li>finance product for small businesses</li>
              </ul>
              <p>
                <strong>My connection</strong>
              </p>
              <ul>
                <li>designed similar onboarding flows</li>
              </ul>
              <p>
                <strong>Why now</strong>
              </p>
              <ul>
                <li>want more ownership</li>
              </ul>
              <p>
                That gives you enough structure to stay focused without forcing
                you to remember every word.
              </p>
              <p>If you do prefer a script, write it for speaking.</p>
              <p>
                That means shorter sentences, normal vocabulary, and fewer
                sentences that look good on paper but sound strange out loud.
              </p>

              <h2 id="tell-me-about-yourself">What about “Tell me about yourself”?</h2>
              <p>This is one question where people often talk far too long.</p>
              <p>You do not need to give the interviewer your full biography.</p>
              <p>A strong version can still fit into 60 to 90 seconds.</p>
              <p>Try:</p>
              <ol>
                <li>What you do now</li>
                <li>The experience most relevant to this role</li>
                <li>What you are looking for next</li>
              </ol>
              <p>For example:</p>
              <blockquote>
                <p>
                  “I’m a product designer and most of my recent work has been
                  in fintech. I’ve worked on things like payments, corporate
                  cards, onboarding, and account management, usually in smaller
                  teams where I’m involved from early concepts through launch.
                  Before moving into product design, I also worked more broadly
                  across digital and brand design. At this point, I’m looking
                  for a role where I can keep working on complex products but
                  have more ownership over the overall customer experience.”
                </p>
              </blockquote>
              <p>
                That is enough to give the interviewer a useful picture of you.
              </p>

              <h2 id="behavioral">What about behavioral questions?</h2>
              <p>
                Behavioral questions usually deserve more time than simple
                motivation questions.
              </p>
              <p>If the interviewer asks:</p>
              <p>
                <strong>“Tell me about a time you made a mistake.”</strong>
              </p>
              <p>you need enough time to explain:</p>
              <ul>
                <li>what happened</li>
                <li>what you did</li>
                <li>what changed afterward</li>
              </ul>
              <p>Around 60 to 90 seconds is reasonable.</p>
              <p>The mistake is trying to include every detail.</p>
              <p>
                The interviewer does not need every meeting, every stakeholder,
                and every conversation.
              </p>
              <p>They need the story.</p>

              <h2 id="hard-rule">Is 90 seconds a hard rule?</h2>
              <p>No.</p>
              <p>There is nothing magical about 90 seconds.</p>
              <p>
                The real goal is to answer the question clearly without losing
                the listener.
              </p>
              <p>Sometimes that takes 35 seconds.</p>
              <p>Sometimes it takes 80.</p>
              <p>Sometimes a detailed question genuinely needs two minutes.</p>
              <p>
                But if you are unsure,{' '}
                <strong>90 seconds is a useful upper limit to aim for</strong>.
              </p>
              <p>
                It forces you to decide which parts of the answer actually
                matter.
              </p>

              <h2 id="before-you-record">Before you record</h2>
              <p>Once you think your answer is ready, do one test recording.</p>
              <p>Then ask yourself:</p>
              <ul>
                <li>Did I answer the question in the first few sentences?</li>
                <li>Is there one clear main idea?</li>
                <li>Did I repeat anything?</li>
                <li>
                  Is there a detail I can remove without changing the meaning?
                </li>
                <li>Does the ending actually end?</li>
                <li>Am I speaking at a normal pace?</li>
              </ul>
              <p>If the answer feels clear at 50 seconds, leave it alone.</p>
              <p>Do not make it longer just because you can.</p>

              <h2 id="without-a-clock">
                Keep the answer close to 90 seconds without watching a clock
              </h2>
              <p>
                It is hard to sound natural if part of your brain is constantly
                thinking about the timer.
              </p>
              <p>
                A better approach is to prepare the right amount of material
                before you start.
              </p>
              <p>
                <strong>whythisrole</strong> can turn your notes, the job
                description, and a little company context into a short answer
                designed to stay within a practical recording length.
              </p>
              <p>
                You can use bullet points if you prefer speaking freely, or a
                short script if you tend to ramble.
              </p>
              <p>The goal is simple:</p>
              <p>
                <strong>Say enough to make your point, then stop.</strong>
              </p>

              <div className="inline-cta">
                <p>Say enough to make your point, then stop.</p>
                <a className="editorial-cta" href="/">
                  Turn your notes into a short answer
                </a>
              </div>
            </div>

            <section className="related-block" aria-labelledby="related-heading">
              <h2 id="related-heading">Related guides</h2>
              <div className="related-grid">
                <RelatedPostCard
                  href={WHY_HERE_GUIDE_PATH}
                  title="“Why do you want to work here?” video answers (with examples)"
                  dek="Say what interested you, connect it to something you’ve done, and explain why the role makes sense now."
                />
                <RelatedPostCard
                  href={EMPLOYERS_LOOK_FOR_PATH}
                  title="What employers are actually looking for when they ask for a video interview"
                  dek="They want a clear, genuine answer — not a perfect performance."
                />
                <RelatedPostCard
                  href={READ_FROM_SCRIPT_PATH}
                  title="How to read from a script without looking like you’re reading"
                  dek="Eye line, pacing, and sounding like yourself on camera."
                />
                <RelatedPostCard
                  href={PRACTICE_GUIDE_PATH}
                  title="How to practice for a video interview by recording yourself"
                  dek="A simple three-take routine for making your answer clearer without sounding over-rehearsed."
                />
                <RelatedPostCard
                  title="How to stop rambling and keep your answer tight"
                  dek="Cut the repeats so the answer stays easy to follow."
                />
                <RelatedPostCard
                  title="5 mistakes people make in video interview submissions"
                  dek="The habits that make a recording harder to watch."
                />
              </div>
            </section>

            <EmailCapture />
          </article>

          <aside className="editorial-sidebar">
            <Toc sections={SECTIONS} />
            <CtaCard
              title="Say enough, then stop"
              body="Turn your notes, the job post, and a little company context into a short answer that stays within a practical recording length."
              label="Turn your notes into a short answer"
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
