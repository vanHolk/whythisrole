import { useEffect, useState, type FormEvent } from 'react'
import { ArticleMeta } from './ArticleMeta'
import { Callout } from './Callout'
import { CtaCard } from './CtaCard'
import { EditorialFooter } from './EditorialFooter'
import { EditorialHeader } from './EditorialHeader'
import { RelatedPostCard } from './RelatedPostCard'
import { Toc } from './Toc'
import {
  EMPLOYERS_LOOK_FOR_PATH,
  HOW_LONG_GUIDE_PATH,
  READ_FROM_SCRIPT_PATH,
  WHY_HERE_GUIDE_PATH,
} from './paths'
import './editorial.css'

export { PRACTICE_GUIDE_PATH } from './paths'

const PAGE_TITLE =
  'How to practice for a video interview by recording yourself · whythisrole'

const SECTIONS = [
  { id: 'why-recording-yourself-works', label: 'Why recording yourself works' },
  { id: 'what-to-prepare', label: 'What to prepare before your first take' },
  { id: 'bullet-points-not-a-speech', label: 'Use bullet points, not a speech' },
  { id: 'three-take-practice-method', label: 'A simple three-take practice method' },
  { id: 'what-to-look-for', label: 'What should you look for when watching yourself?' },
  { id: 'check-the-answer', label: 'Check the answer before the performance' },
  { id: 'fix-one-thing', label: 'Fix one thing at a time' },
  { id: 'how-many-times', label: 'How many times should you practice?' },
  { id: 'should-you-memorize', label: 'Should you memorize your answer?' },
  { id: 'practicing-for-a-live-interview', label: 'Practicing for a live video interview' },
  { id: 'practicing-for-a-one-way-interview', label: 'Practicing for a one-way video interview' },
  { id: 'hate-watching-yourself', label: 'What if you hate watching yourself?' },
  { id: 'ten-minute-routine', label: 'A 10-minute video interview practice routine' },
  { id: 'before-the-real-interview', label: 'Before the real interview' },
  { id: 'same-setup', label: 'Practice with the same setup you will use' },
] as const

export function HowToPracticeArticlePage() {
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
            <h1>How to practice for a video interview by recording yourself</h1>
            <p className="editorial-dek">
              The easiest way to practice for a video interview is to record
              one answer, watch it back, and improve one or two specific things
              before trying again. You do not need to memorize a perfect script
              or spend hours rehearsing.
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
              publishedLabel="September 16, 2026"
              publishedDateTime="2026-09-16"
              readingTime="9 min read"
            />

            <Toc variant="mobile" sections={SECTIONS} />

            <div className="editorial-prose">
              <p>
                If you want to get better at video interviews, do not start by
                trying to memorize the perfect answer.
              </p>
              <p>Start by recording an imperfect one.</p>
              <p>
                Prepare a few bullet points, answer one realistic interview
                question, and watch the recording back. You will notice things
                you cannot catch while you are speaking.
              </p>
              <p>
                Maybe the answer takes too long to get to the point.
              </p>
              <p>Maybe you repeat the same idea three times.</p>
              <p>
                Maybe your example is good, but you rush through the most
                important part.
              </p>
              <p>That is useful information.</p>
              <p>
                The goal is not to judge yourself. It is to make the next take
                a little clearer.
              </p>
              <p>
                For most people, three thoughtful practice recordings will help
                more than reading the same notes for an hour.
              </p>

              <h2 id="why-recording-yourself-works">
                Why recording yourself works
              </h2>
              <p>Most interview preparation happens silently.</p>
              <p>
                You read the job description. You write down possible answers.
                You think through examples in your head.
              </p>
              <p>
                Everything sounds reasonably clear until you try to say it out
                loud.
              </p>
              <p>Speaking is different from writing.</p>
              <p>
                A sentence that looks natural on the page may feel much too
                long when spoken. An answer that seemed concise in your head
                may take two minutes because you keep adding context.
              </p>
              <p>
                Recording yourself lets you hear the answer the way another
                person will hear it.
              </p>
              <p>It can show you:</p>
              <ul>
                <li>how long it takes to reach your main point</li>
                <li>whether the answer has a clear structure</li>
                <li>where you begin repeating yourself</li>
                <li>which words feel unnatural when spoken</li>
                <li>whether you are talking too quickly</li>
                <li>where your energy drops</li>
                <li>whether the ending actually sounds finished</li>
              </ul>
              <p>Without a recording, you are mostly guessing.</p>
              <p>With one, you have something specific to improve.</p>

              <Callout variant="info" label="The purpose of a practice recording">
                <p>
                  You are not trying to produce a perfect video. You are trying
                  to find the one or two changes that will make your next
                  answer clearer.
                </p>
              </Callout>

              <h2 id="what-to-prepare">
                What to prepare before your first take
              </h2>
              <p>You do not need to prepare an entire interview.</p>
              <p>
                Choose one question that you are reasonably likely to be asked.
              </p>
              <p>A good place to start is:</p>
              <ul>
                <li>“Why are you interested in this role?”</li>
                <li>“Tell me about yourself.”</li>
                <li>“Why do you want to work here?”</li>
                <li>“Tell me about a project you’re proud of.”</li>
                <li>“Describe a difficult problem you solved.”</li>
              </ul>
              <p>Then prepare three things:</p>
              <ol>
                <li>Your main answer</li>
                <li>One relevant example or piece of context</li>
                <li>The point you want to end on</li>
              </ol>
              <p>That is enough for a first recording.</p>
              <p>
                Do not spend 30 minutes polishing the wording. If you prepare
                too much before speaking, you may end up practicing the text
                rather than practicing the answer.
              </p>

              <h2 id="bullet-points-not-a-speech">
                Use bullet points, not a speech
              </h2>
              <p>
                For most interview practice, three to five bullet points work
                better than a full written script.
              </p>
              <p>For example, if the question is:</p>
              <p>
                <strong>“Why are you interested in this role?”</strong>
              </p>
              <p>your notes might be:</p>
              <ul>
                <li>interested in the company’s finance product</li>
                <li>recent experience with cards and onboarding</li>
                <li>enjoy simplifying complex workflows</li>
                <li>looking for more ownership</li>
              </ul>
              <p>
                Those points give the answer a direction without deciding every
                word in advance.
              </p>
              <p>
                You can glance at them, remember what comes next, and explain
                each point naturally.
              </p>
              <p>
                A full script can still be useful if you have trouble organizing
                your thoughts. But once the structure is clear, try turning the
                script back into shorter notes.
              </p>
              <p>
                The goal is to remember the route, not every sentence along it.
              </p>

              <div className="inline-cta">
                <p>
                  Have the job posting open? Turn it into a few talking points
                  before your practice take.
                </p>
                <a className="editorial-cta" href="/">
                  Generate talking points
                </a>
              </div>

              <h2 id="three-take-practice-method">
                A simple three-take practice method
              </h2>
              <p>You do not need to record the same answer 20 times.</p>
              <p>Try three takes, with a different purpose for each one.</p>

              <h3 id="take-one">Take one: Find out what happens</h3>
              <p>Use your bullet points and answer the question once.</p>
              <p>
                Do not stop every time you stumble over a word. Continue until
                the answer is finished.
              </p>
              <p>
                This first take gives you a baseline. It shows you what happens
                when you try to deliver the answer without correcting yourself
                along the way.
              </p>
              <p>When you watch it back, ask:</p>
              <ul>
                <li>Did I answer the question?</li>
                <li>When did I reach my main point?</li>
                <li>Did I leave out anything important?</li>
                <li>Where did the answer lose direction?</li>
                <li>How long was it?</li>
              </ul>
              <p>
                Do not make a list of every small thing you dislike. Choose the
                biggest problem.
              </p>

              <h3 id="take-two">Take two: Fix the structure</h3>
              <p>For the second take, concentrate on the answer itself.</p>
              <p>
                If your introduction was too long, begin closer to the main
                point.
              </p>
              <p>
                If you repeated yourself, remove one of the repeated sentences.
              </p>
              <p>
                If the example was confusing, give the listener one extra piece
                of context.
              </p>
              <p>
                If the ending drifted, decide on the final point before you
                begin.
              </p>
              <p>Imagine your first answer was:</p>
              <blockquote>
                <p>
                  “I’m interested in this role because I’ve been looking for
                  something where I can have more ownership. I think ownership
                  is really important to me, and I’ve realized that I enjoy
                  being able to own more of the work. I was also interested
                  because of the product and because I’ve worked on similar
                  products before.”
                </p>
              </blockquote>
              <p>
                There are useful ideas in there, but they arrive in a loose
                order and ownership is repeated several times.
              </p>
              <p>A clearer version might be:</p>
              <blockquote>
                <p>
                  “What caught my attention was the combination of a complex
                  finance product and the opportunity to have more ownership. In
                  my current role, I’ve worked on corporate cards and
                  onboarding, so the product feels closely connected to things
                  I already understand. For my next role, I’d like to build on
                  that experience while taking more responsibility for the
                  overall customer journey.”
                </p>
              </blockquote>
              <p>
                The second version does not use more impressive language. It
                simply makes the connection easier to follow.
              </p>

              <h3 id="take-three">Take three: Fix the delivery</h3>
              <p>
                Once the answer is clear, pay attention to how you deliver it.
              </p>
              <p>Choose one thing to work on:</p>
              <ul>
                <li>slow down slightly</li>
                <li>look closer to the camera</li>
                <li>pause instead of filling silence</li>
                <li>speak with a little more energy</li>
                <li>stop looking at your notes after every sentence</li>
                <li>let the final sentence end cleanly</li>
              </ul>
              <p>
                Do not try to repair your posture, eye contact, facial
                expression, voice, hand movements, pacing, and vocabulary all
                in the same take.
              </p>
              <p>That usually makes people look more tense.</p>
              <p>One focused adjustment is enough.</p>

              <h2 id="what-to-look-for">
                What should you look for when watching yourself?
              </h2>
              <p>
                Watching yourself on video can feel uncomfortable because you
                notice things that no interviewer would care about.
              </p>
              <p>
                You may focus on your hair, your voice, the way you move your
                hands, or one strange expression that lasted half a second.
              </p>
              <p>
                Try to separate the answer from your appearance.
              </p>
              <p>On the first playback, focus only on the content:</p>
              <ul>
                <li>Is the answer easy to understand?</li>
                <li>Does it respond to the actual question?</li>
                <li>Is there one main idea?</li>
                <li>Is the example relevant?</li>
                <li>Did you repeat anything?</li>
                <li>Does the answer have a clear ending?</li>
              </ul>
              <p>On the second playback, look at the delivery:</p>
              <ul>
                <li>Are you speaking at a comfortable pace?</li>
                <li>Can every word be heard?</li>
                <li>Are you looking near the camera often enough?</li>
                <li>Do you seem engaged?</li>
                <li>Are your notes pulling your eyes too far away?</li>
                <li>Does anything distract from what you are saying?</li>
              </ul>
              <p>This keeps the review practical.</p>
              <p>
                You are evaluating whether the answer works, not whether you
                enjoy seeing yourself on camera.
              </p>

              <h2 id="check-the-answer">
                Check the answer before the performance
              </h2>
              <p>A well-delivered answer can still be vague.</p>
              <p>
                Before worrying about eye contact or hand movements, make sure
                there is something useful underneath the presentation.
              </p>
              <p>
                For most questions, a good answer should do at least two
                things:
              </p>
              <ol>
                <li>Answer the question directly</li>
                <li>Give the listener a reason to believe the answer</li>
              </ol>
              <p>If you say:</p>
              <blockquote>
                <p>
                  “I’m a strong communicator and I work well with different
                  teams.”
                </p>
              </blockquote>
              <p>the claim is clear, but there is no evidence.</p>
              <p>A more useful version might be:</p>
              <blockquote>
                <p>
                  “Most of my recent projects involved working closely with
                  product, engineering, and compliance. I usually helped turn
                  the different requirements into one flow the team could
                  discuss and test together.”
                </p>
              </blockquote>
              <p>Now the listener has something concrete.</p>
              <p>
                The second version does not need more confident delivery to
                sound more convincing. The content is doing the work.
              </p>

              <h2 id="fix-one-thing">Fix one thing at a time</h2>
              <p>
                Your first recording may give you a long list of things you
                want to change.
              </p>
              <p>Resist the urge to fix all of them at once.</p>
              <p>
                Choose the change that would make the biggest difference to the
                person listening.
              </p>
              <p>That might be:</p>
              <ul>
                <li>getting to the point sooner</li>
                <li>removing an unnecessary story</li>
                <li>replacing a vague claim with an example</li>
                <li>shortening the answer</li>
                <li>speaking more slowly</li>
                <li>moving your notes closer to the camera</li>
              </ul>
              <p>Then record again.</p>
              <p>
                Once that problem is better, decide whether another take would
                genuinely help.
              </p>
              <p>
                This turns practice into a manageable process instead of an
                attempt to become a completely different person on camera.
              </p>

              <h2 id="how-many-times">How many times should you practice?</h2>
              <p>For one question, three to five takes is usually plenty.</p>
              <p>The first take shows you the problem.</p>
              <p>The second improves the structure.</p>
              <p>
                The third gives you a chance to sound more comfortable.
              </p>
              <p>
                A fourth or fifth take can help if you are still making a
                meaningful change.
              </p>
              <p>
                After that, many people begin chasing tiny differences. The
                answer can start to sound flatter because they have repeated it
                too often.
              </p>
              <p>Stop when:</p>
              <ul>
                <li>the answer is clear</li>
                <li>you can remember the main points</li>
                <li>the length feels appropriate</li>
                <li>you sound like yourself</li>
                <li>another take would mostly be about perfection</li>
              </ul>
              <p>
                You are preparing for an interview, not filming a commercial.
              </p>

              <h2 id="should-you-memorize">Should you memorize your answer?</h2>
              <p>
                You can memorize an answer, but it often creates a new problem.
              </p>
              <p>
                Instead of thinking about the question, you start thinking
                about whether you remembered the next sentence correctly.
              </p>
              <p>
                If one word goes missing, the entire answer can suddenly feel
                lost.
              </p>
              <p>It is usually better to remember three beats.</p>
              <p>For example:</p>
              <p>
                <strong>Why this role</strong>
              </p>
              <ul>
                <li>the product caught my attention</li>
              </ul>
              <p>
                <strong>Why me</strong>
              </p>
              <ul>
                <li>relevant onboarding experience</li>
              </ul>
              <p>
                <strong>Why now</strong>
              </p>
              <ul>
                <li>ready for more ownership</li>
              </ul>
              <p>
                The exact wording can change between takes. The meaning stays
                the same.
              </p>
              <p>
                That flexibility is useful in a live interview because the
                interviewer may phrase the question differently or interrupt
                with a follow-up.
              </p>
              <p>
                It is also useful in a recorded interview because you are less
                likely to sound like you are reciting something.
              </p>

              <h2 id="practicing-for-a-live-interview">
                Practicing for a live video interview
              </h2>
              <p>
                A live interview is a conversation, so do not practice as if
                you will be delivering a speech.
              </p>
              <p>
                Use recordings to prepare the first 60 to 90 seconds of your
                answer.
              </p>
              <p>That is normally enough to:</p>
              <ul>
                <li>make your main point</li>
                <li>give a short example</li>
                <li>leave room for a follow-up question</li>
              </ul>
              <p>
                Practice looking toward the camera while you speak, but do not
                force yourself to stare into the lens the entire time. In a
                real conversation, you will naturally look at the interviewer’s
                face too.
              </p>
              <p>You can also practice stopping.</p>
              <p>
                Candidates sometimes keep talking because the interviewer has
                not immediately responded. A short pause does not mean the
                answer failed. It may simply mean they are taking a note or
                deciding what to ask next.
              </p>
              <p>Finish your point and give them space.</p>

              <h2 id="practicing-for-a-one-way-interview">
                Practicing for a one-way video interview
              </h2>
              <p>
                A one-way interview is closer to a recording exercise, so you
                can make the practice setup more realistic.
              </p>
              <p>
                If the platform tells you the time limit, use the same limit
                during practice.
              </p>
              <p>
                If you will have 30 seconds to prepare, give yourself 30
                seconds.
              </p>
              <p>
                If you will only get one attempt, make at least one of your
                practice takes a no-restart take.
              </p>
              <p>
                You should also practice the transition from preparation to
                speaking. Looking at notes for several minutes and then
                recording whenever you feel ready is different from seeing a
                question, organizing your thoughts quickly, and answering under
                a timer.
              </p>
              <p>
                The goal is not to make yourself nervous. It is to make the
                real format feel familiar.
              </p>

              <h2 id="hate-watching-yourself">
                What if you hate watching yourself?
              </h2>
              <p>A lot of people do.</p>
              <p>
                Your recorded voice sounds different from the voice you hear
                while speaking. You may also notice expressions and movements
                you have never seen from the outside.
              </p>
              <p>That does not mean anything is wrong with the recording.</p>
              <p>Give yourself a specific job before pressing play.</p>
              <p>For example:</p>
              <blockquote>
                <p>
                  “I am only checking whether I answered the question in the
                  first 20 seconds.”
                </p>
              </blockquote>
              <p>
                That is much easier than watching with the vague instruction to
                judge your entire performance.
              </p>
              <p>
                You can also listen to the first playback without looking at
                the picture. If the answer is clear and easy to follow, you
                already know the most important part is working.
              </p>
              <p>
                Then watch it once with the picture and check for obvious
                distractions.
              </p>
              <p>
                You do not need to become comfortable admiring yourself on
                video. You only need to become comfortable reviewing the
                answer.
              </p>

              <h2 id="ten-minute-routine">
                A 10-minute video interview practice routine
              </h2>
              <p>
                If you do not want interview preparation to take over your
                evening, use this routine.
              </p>

              <h3 id="minute-1">Minute 1: Choose one question</h3>
              <p>
                Pick a likely question from the job description or application
                form.
              </p>

              <h3 id="minutes-2-to-3">
                Minutes 2 to 3: Write three to five bullet points
              </h3>
              <p>
                Decide on your answer, one relevant example, and the point you
                want to finish with.
              </p>

              <h3 id="minutes-4-to-5">Minutes 4 to 5: Record the first take</h3>
              <p>
                Keep going if you stumble. Let the recording show you what
                needs work.
              </p>

              <h3 id="minutes-6-to-7">Minutes 6 to 7: Watch it back</h3>
              <p>
                Find the single biggest issue. Do not start rewriting
                everything.
              </p>

              <h3 id="minute-8">Minute 8: Adjust your notes</h3>
              <p>
                Cut a repeated point, add missing context, or change the order.
              </p>

              <h3 id="minutes-9-to-10">
                Minutes 9 to 10: Record the second take
              </h3>
              <p>Concentrate on the one change you selected.</p>
              <p>If the second answer is clear, you can stop.</p>
              <p>That is a complete practice session.</p>

              <h2 id="before-the-real-interview">Before the real interview</h2>
              <p>
                You do not need your final practice take to feel perfect.
              </p>
              <p>You should be able to answer yes to these questions:</p>
              <ul>
                <li>Do I know my main point?</li>
                <li>Do I have one relevant example?</li>
                <li>Can I answer without reading full sentences?</li>
                <li>Does the answer fit comfortably within the time limit?</li>
                <li>
                  Can the listener understand why this example matters?
                </li>
                <li>Do I know how I want to finish?</li>
                <li>Are my camera and microphone working?</li>
                <li>
                  Are my notes close enough to the camera for a quick glance?
                </li>
              </ul>
              <p>
                If those things are in place, more repetition may not add much.
              </p>
              <p>
                Take a short break before the real recording. Your answer will
                usually sound fresher than it would after ten consecutive
                takes.
              </p>

              <h2 id="same-setup">
                Practice with the same setup you will use
              </h2>
              <p>
                Practice works best when it resembles the real situation.
              </p>
              <p>
                Use the same computer, camera position, lighting, and
                microphone when possible. Put your notes where you plan to keep
                them during the interview.
              </p>
              <p>This lets you catch practical problems early.</p>
              <p>You may discover that:</p>
              <ul>
                <li>your notes are too far from the camera</li>
                <li>the room is darker on video than expected</li>
                <li>your microphone picks up a fan</li>
                <li>the camera is positioned too low</li>
                <li>notifications appear while you are recording</li>
                <li>your answer is longer than the available time</li>
              </ul>
              <p>
                <strong>whythisrole</strong> lets you prepare talking points,
                record an answer, and watch it back in the browser. Your
                recording stays on your device.
              </p>
              <p>
                You can use the first take as practice, improve one thing, and
                record again when you are ready.
              </p>
              <p>
                The goal is not to memorize the perfect performance.
              </p>
              <p>It is to make the real interview feel like you have done this before.</p>

              <div className="inline-cta">
                <p>Practice once. Watch once. Fix one thing.</p>
                <a className="editorial-cta" href="/">
                  Practice your answer
                </a>
              </div>
            </div>

            <section className="related-block" aria-labelledby="related-heading">
              <h2 id="related-heading">Related guides</h2>
              <div className="related-grid">
                <RelatedPostCard
                  href={HOW_LONG_GUIDE_PATH}
                  title="How long should a video interview answer actually be?"
                  dek="A practical range for most questions, and when to stop."
                />
                <RelatedPostCard
                  href={WHY_HERE_GUIDE_PATH}
                  title="“Why do you want to work here?” video answers (with examples)"
                  dek="Say what interested you, connect it to something you’ve done, and explain why the role makes sense now."
                />
                <RelatedPostCard
                  href={EMPLOYERS_LOOK_FOR_PATH}
                  title="What employers are actually looking for when they ask for a video interview"
                  dek="They want a clear, genuine answer, not a perfect performance."
                />
                <RelatedPostCard
                  href={READ_FROM_SCRIPT_PATH}
                  title="How to read from a script without looking like you’re reading"
                  dek="Eye line, pacing, and sounding like yourself on camera."
                />
              </div>
            </section>

            <EmailCapture />
          </article>

          <aside className="editorial-sidebar">
            <Toc sections={SECTIONS} />
            <CtaCard
              title="Practice before the real take"
              body="Turn the job posting into a few talking points, record an answer, and watch it back before the real interview."
              label="Practice an answer"
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
