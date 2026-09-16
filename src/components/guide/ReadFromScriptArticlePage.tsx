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
  PRACTICE_GUIDE_PATH,
  WHY_HERE_GUIDE_PATH,
} from './paths'
import './editorial.css'

const PAGE_TITLE =
  'How to read from a script without looking like you’re reading · whythisrole'

const SECTIONS = [
  { id: 'close-to-camera', label: 'Keep the script close to the camera' },
  { id: 'not-an-essay', label: 'Do not write the script like an essay' },
  { id: 'shorter-sentences', label: 'Use shorter sentences' },
  { id: 'how-you-speak', label: 'Write the way you actually speak' },
  { id: 'not-every-word', label: 'Do not try to read every word perfectly' },
  { id: 'look-at-camera', label: 'Look at the camera at the end of a thought' },
  { id: 'not-too-much-text', label: 'Do not put too much text on screen' },
  { id: 'easy-to-read', label: 'Make the text easy to read' },
  { id: 'slow-the-script', label: 'Slow the script down' },
  { id: 'pauses', label: 'Leave room for pauses' },
  { id: 'try-bullets', label: 'Try bullet points before a full script' },
  { id: 'bullets-vs-script', label: 'Bullet points vs. a script' },
  { id: 'practice-once', label: 'Practice once before recording' },
  { id: 'first-sentence', label: 'Know your first sentence' },
  { id: 'last-sentence', label: 'Know your last sentence too' },
  { id: 'obvious-reading', label: 'What does obvious script-reading look like?' },
  { id: 'simple-setup', label: 'A simple setup before you record' },
  { id: 'keep-close-to-lens', label: 'Keep your script close to the lens' },
] as const

export function ReadFromScriptArticlePage() {
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
            <h1>
              How to read from a script without looking like you’re reading
            </h1>
            <p className="editorial-dek">
              Using a script is not the problem. Looking like you are reading
              one is. Keep the notes close to the camera, write the way you
              speak, and treat the text as a guide.
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
              readingTime="12 min read"
            />

            <Toc variant="mobile" sections={SECTIONS} />

            <div className="editorial-prose">
              <p>Using a script for a video interview is not a bad idea.</p>
              <p>Looking like you are reading one is the problem.</p>
              <p>
                The difference is usually not whether you have notes. It is{' '}
                <strong>
                  where the notes are, how they are written, and how closely you
                  try to follow them
                </strong>
                .
              </p>
              <p>
                If your eyes keep dropping below the camera, your sentences
                sound unusually formal, or you are concentrating so hard on the
                next word that your face stops moving, people notice.
              </p>
              <p>The good news is that you do not need to memorize everything.</p>
              <p>
                A few small changes can make a scripted answer look much more
                natural.
              </p>

              <h2 id="close-to-camera">Keep the script close to the camera</h2>
              <p>This is probably the biggest improvement you can make.</p>
              <p>
                If your notes are on your desk, in your lap, or on a second
                screen, your eyes have to travel a long way every time you look
                at them.
              </p>
              <p>That makes it obvious you are reading.</p>
              <p>
                Instead, put the text as close to your webcam as possible.
              </p>
              <p>
                Ideally, you should only need to move your eyes slightly to read
                the next line.
              </p>
              <p>
                The smaller that eye movement is, the more natural the recording
                looks.
              </p>
              <p>
                This matters even more in a short video interview, where the
                viewer is usually looking directly at your face.
              </p>

              <Callout variant="info" label="Where the notes go">
                <p>
                  The smaller the eye movement from lens to text, the less
                  obvious the script is. Desk notes and a second screen make
                  that trip too long.
                </p>
              </Callout>

              <h2 id="not-an-essay">Do not write the script like an essay</h2>
              <p>
                A sentence can look perfectly normal on a page and feel terrible
                when you try to say it out loud.
              </p>
              <p>For example:</p>
              <blockquote>
                <p>
                  “Throughout my professional career, I have consistently sought
                  opportunities that allow me to combine strategic thinking with
                  hands-on execution.”
                </p>
              </blockquote>
              <p>You could say that.</p>
              <p>But most people would not naturally talk that way.</p>
              <p>A more natural version:</p>
              <blockquote>
                <p>
                  “I’ve always liked roles where I can think about the bigger
                  picture but still stay close to the actual work.”
                </p>
              </blockquote>
              <p>Same idea.</p>
              <p>Much easier to say.</p>
              <p>
                If you plan to read from a script, write for your mouth, not for
                the page.
              </p>

              <h2 id="shorter-sentences">Use shorter sentences</h2>
              <p>
                Long sentences are harder to read naturally because you have to
                keep track of where they are going.
              </p>
              <p>They also make it harder to look back at the camera.</p>
              <p>Compare:</p>
              <blockquote>
                <p>
                  “What interested me most about this opportunity is the chance
                  to work on a product that is already operating at scale while
                  still being part of a relatively small team where designers
                  have significant ownership over the decisions they make.”
                </p>
              </blockquote>
              <p>with:</p>
              <blockquote>
                <p>
                  “What interested me most is the scale of the product. At the
                  same time, the team still seems fairly small. I like that
                  combination because it usually means designers can have real
                  ownership.”
                </p>
              </blockquote>
              <p>
                The second version gives you natural places to pause and look
                back at the camera.
              </p>

              <h2 id="how-you-speak">Write the way you actually speak</h2>
              <p>Contractions help.</p>
              <p>Use:</p>
              <ul>
                <li>I’m</li>
                <li>I’ve</li>
                <li>I’d</li>
                <li>it’s</li>
                <li>that’s</li>
                <li>you’re</li>
              </ul>
              <p>instead of writing everything in its most formal form.</p>
              <p>Also, do not be afraid of ordinary words.</p>
              <p>You do not need to say:</p>
              <blockquote>
                <p>
                  “This opportunity aligns strongly with my professional
                  aspirations.”
                </p>
              </blockquote>
              <p>You can say:</p>
              <blockquote>
                <p>“This feels like a good next step for me.”</p>
              </blockquote>
              <p>
                The second version will usually sound better on camera because
                it sounds like something a person would actually say.
              </p>

              <h2 id="not-every-word">
                Do not try to read every word perfectly
              </h2>
              <p>This is where a script starts becoming obvious.</p>
              <p>
                If you miss one word and immediately correct yourself, the
                viewer can tell that you are following written text.
              </p>
              <p>Instead, treat the script as a guide.</p>
              <p>If the line says:</p>
              <blockquote>
                <p>
                  “I was particularly interested in the company’s focus on small
                  business customers.”
                </p>
              </blockquote>
              <p>and you naturally say:</p>
              <blockquote>
                <p>
                  “What really interested me was the focus on small businesses.”
                </p>
              </blockquote>
              <p>keep going.</p>
              <p>The meaning is the same.</p>
              <p>Nobody watching knows what the original sentence was.</p>

              <h2 id="look-at-camera">
                Look at the camera at the end of a thought
              </h2>
              <p>You do not need perfect eye contact for every word.</p>
              <p>That can actually look unnatural too.</p>
              <p>A useful rhythm is:</p>
              <p>
                <strong>
                  read a short phrase → look at the camera → finish the thought
                </strong>
              </p>
              <p>For example:</p>
              <blockquote>
                <p>“Most of my recent experience has been in fintech…”</p>
                <p>
                  <em>look toward the camera</em>
                </p>
                <p>
                  “…so this role felt pretty relevant to what I’ve already been
                  doing.”
                </p>
              </blockquote>
              <p>
                You are still using the script, but the important part of the
                sentence lands directly at the viewer.
              </p>

              <div className="inline-cta">
                <p>
                  Keep the text close to the lens so you can glance, then look
                  back at the camera.
                </p>
                <a className="editorial-cta" href="/">
                  Practice with a script near the camera
                </a>
              </div>

              <h2 id="not-too-much-text">Do not put too much text on screen</h2>
              <p>A huge block of text encourages your eyes to start scanning.</p>
              <p>That is when people get the classic teleprompter look.</p>
              <p>
                Your eyes move steadily from left to right, line after line.
              </p>
              <p>Instead, show only a small amount of text at once.</p>
              <p>
                A few short lines are easier to follow than a full paragraph.
              </p>
              <p>
                This also makes it easier to find your place if you look away.
              </p>

              <h2 id="easy-to-read">Make the text easy to read</h2>
              <p>Tiny text causes two problems.</p>
              <p>You squint, and you concentrate much harder than you need to.</p>
              <p>
                Use a font size that feels comfortable from your normal
                recording distance.
              </p>
              <p>
                You also want enough line spacing that you can quickly find the
                next sentence.
              </p>
              <p>
                This is not the place to fit as much text as possible onto the
                screen.
              </p>
              <p>
                The easier the script is to read, the less you will look like you
                are reading it.
              </p>

              <h2 id="slow-the-script">Slow the script down</h2>
              <p>
                If the text is scrolling, it should feel slightly slower than
                you think you need.
              </p>
              <p>When the text moves too quickly, you start chasing it.</p>
              <p>Your voice speeds up.</p>
              <p>Your eyes move more.</p>
              <p>And you stop sounding like yourself.</p>
              <p>
                A good teleprompter should follow your speaking pace, not force
                you to follow its pace.
              </p>
              <p>If you find yourself rushing to keep up, slow it down.</p>

              <h2 id="pauses">Leave room for pauses</h2>
              <p>People pause when they speak.</p>
              <p>
                Scripts often remove those pauses because everything appears as
                one continuous block.
              </p>
              <p>
                You can fix that by formatting the script around the way you
                want to speak.
              </p>
              <p>For example:</p>
              <blockquote>
                <p>“What caught my attention was the product itself.</p>
                <p>
                  I’ve been working on similar problems for the last few years.
                </p>
                <p>
                  So when I read the job description, there was an immediate
                  connection.”
                </p>
              </blockquote>
              <p>
                Those line breaks remind you that you do not have to rush into
                the next sentence.
              </p>

              <h2 id="try-bullets">Try bullet points before a full script</h2>
              <p>
                If you know the answer reasonably well, bullet points may look
                more natural than a full script.
              </p>
              <p>For example:</p>
              <p>
                <strong>Why them</strong>
              </p>
              <ul>
                <li>product for finance teams</li>
              </ul>
              <p>
                <strong>My experience</strong>
              </p>
              <ul>
                <li>payments</li>
                <li>onboarding</li>
                <li>complex workflows</li>
              </ul>
              <p>
                <strong>Why now</strong>
              </p>
              <ul>
                <li>want more ownership</li>
              </ul>
              <p>You can glance at the points and then speak naturally.</p>
              <p>
                That works well if your main problem is forgetting what you
                wanted to say.
              </p>
              <p>A full script is more useful if your problem is different.</p>
              <p>Maybe you ramble.</p>
              <p>Maybe you get nervous.</p>
              <p>Maybe English is not your first language.</p>
              <p>
                Maybe you know exactly what you want to say, but once the camera
                starts recording, the wording disappears.
              </p>
              <p>In those cases, having the full sentence available can help.</p>

              <h2 id="bullets-vs-script">Bullet points vs. a script</h2>
              <p>Neither option is automatically better.</p>
              <p>Use bullet points if:</p>
              <ul>
                <li>you speak comfortably without much preparation</li>
                <li>you want the answer to feel very spontaneous</li>
                <li>you mostly need help remembering your structure</li>
              </ul>
              <p>Use a full script if:</p>
              <ul>
                <li>you tend to ramble</li>
                <li>you forget important points</li>
                <li>you get nervous on camera</li>
                <li>you want tighter control over the length</li>
                <li>
                  you are answering in a language you do not use every day
                </li>
              </ul>
              <p>You can also combine them.</p>
              <p>
                Write a full script first, then reduce it to a few key phrases
                once you know the answer.
              </p>

              <h2 id="practice-once">Practice once before recording</h2>
              <p>Not ten times.</p>
              <p>Once.</p>
              <p>
                Read the answer out loud and listen for anything that feels
                awkward.
              </p>
              <p>
                You will notice things you never notice while reading silently.
              </p>
              <p>Maybe the sentence is too long.</p>
              <p>Maybe you keep stumbling over the same phrase.</p>
              <p>Maybe there is a word you would never normally use.</p>
              <p>Change it.</p>
              <p>
                The goal is not to memorize the answer during practice.
              </p>
              <p>It is to remove the parts that are difficult to say.</p>

              <h2 id="first-sentence">Know your first sentence</h2>
              <p>The first sentence is worth preparing especially well.</p>
              <p>Starting is often the hardest part.</p>
              <p>
                Once you are already speaking, it becomes easier to continue
                naturally.
              </p>
              <p>
                If you know your opening line, you do not have to begin the
                recording by searching the screen for your place.
              </p>
              <p>For example:</p>
              <blockquote>
                <p>
                  “What caught my attention about the role was how closely it
                  connects to the work I’m already doing.”
                </p>
              </blockquote>
              <p>
                Once you get through that line, you can relax into the rest.
              </p>

              <h2 id="last-sentence">Know your last sentence too</h2>
              <p>Ending naturally can be surprisingly difficult.</p>
              <p>
                Without a clear ending, people often start adding extra phrases:
              </p>
              <blockquote>
                <p>
                  “So yeah, that’s basically why I’m interested, and I think it
                  would just be a really interesting opportunity, and I’d be
                  excited to…”
                </p>
              </blockquote>
              <p>You were already finished.</p>
              <p>Write one clean final sentence.</p>
              <p>For example:</p>
              <blockquote>
                <p>
                  “That’s why this feels like a really natural next step for
                  me.”
                </p>
              </blockquote>
              <p>Then stop.</p>

              <h2 id="dont-stare">Do not stare at yourself</h2>
              <p>
                If your recording tool shows your own face, try not to watch it
                constantly.
              </p>
              <p>It is distracting.</p>
              <p>
                You start thinking about your expression, your hair, where you
                are looking, or whether you are moving too much.
              </p>
              <p>That takes attention away from what you are saying.</p>
              <p>
                If possible, keep your attention around the camera and your
                script instead.
              </p>
              <p>
                The person watching the recording does not need you to monitor
                your own face while you speak.
              </p>

              <h2 id="dont-force-smile">Do not force a smile</h2>
              <p>You do not need to smile for the entire answer.</p>
              <p>
                That can look more unnatural than being slightly nervous.
              </p>
              <p>Let your expression follow what you are saying.</p>
              <p>
                A small smile when introducing yourself or talking about
                something you genuinely like is enough.
              </p>
              <p>
                For most interview answers, calm and engaged looks better than
                permanently cheerful.
              </p>

              <h2 id="obvious-reading">
                What does obvious script-reading look like?
              </h2>
              <p>A few things tend to give it away:</p>
              <ul>
                <li>your eyes move continuously from side to side</li>
                <li>you rarely look near the camera</li>
                <li>every sentence has exactly the same rhythm</li>
                <li>you never pause</li>
                <li>you correct yourself when you change a word</li>
                <li>
                  the language sounds more formal than the way you normally
                  speak
                </li>
                <li>
                  your voice gets flatter because most of your attention is on
                  reading
                </li>
              </ul>
              <p>
                If you notice one of these in a test recording, do not throw out
                the script.
              </p>
              <p>Fix the specific problem.</p>
              <p>Move the text closer.</p>
              <p>Shorten the sentences.</p>
              <p>Add line breaks.</p>
              <p>Increase the text size.</p>
              <p>Remove words you would never actually say.</p>

              <Callout variant="tip" label="Fix the problem, keep the script">
                <p>
                  If a test take looks like you are reading, change the setup
                  or the wording. You usually do not need to memorize instead.
                </p>
              </Callout>

              <h2 id="eyes-still-move">What if your eyes still move?</h2>
              <p>They probably will.</p>
              <p>That is fine.</p>
              <p>
                Even in a normal conversation, people do not stare directly into
                someone’s eyes without moving.
              </p>
              <p>The goal is not to hide every eye movement.</p>
              <p>
                The goal is to avoid the obvious pattern of repeatedly looking
                far away from the camera to find your notes.
              </p>
              <p>Small movements near the lens are much less noticeable.</p>

              <h2 id="lose-your-place">What if you lose your place?</h2>
              <p>Do not panic.</p>
              <p>Pause.</p>
              <p>Look at the next line.</p>
              <p>Continue.</p>
              <p>If you can record another take, you can always try again.</p>
              <p>
                If you cannot, a short pause is usually much less noticeable than
                rushing through the next sentence because you are trying to
                recover.
              </p>
              <p>This is another reason shorter lines help.</p>
              <p>They make it much easier to find your place again.</p>

              <h2 id="how-close">How close should the script be to the camera?</h2>
              <p>
                As close as you can comfortably get it without covering the
                camera itself.
              </p>
              <p>
                If you are using a laptop, a small script window near the top
                center of the screen usually works better than notes at the
                bottom.
              </p>
              <p>
                That way, even when you are reading, your eyes stay relatively
                close to the lens.
              </p>
              <p>The difference can be surprisingly noticeable.</p>

              <h2 id="simple-setup">A simple setup before you record</h2>
              <p>Before pressing record:</p>
              <ol>
                <li>Put your camera roughly at eye level.</li>
                <li>Move your script as close to the lens as possible.</li>
                <li>Increase the text size.</li>
                <li>Keep only a few lines visible.</li>
                <li>Read the first sentence out loud once.</li>
                <li>Take a second before you start speaking.</li>
              </ol>
              <p>That is usually enough.</p>
              <p>You do not need a professional teleprompter.</p>

              <h2 id="help-not-control">
                The script should help you, not control you
              </h2>
              <p>
                A script is useful when it removes one thing you have to worry
                about.
              </p>
              <p>You no longer need to remember every point.</p>
              <p>
                That gives you more attention for the camera, your voice, and
                the meaning of what you are saying.
              </p>
              <p>
                But if you are concentrating on reproducing every word exactly,
                the script has started doing the opposite.
              </p>
              <p>Use it as support.</p>
              <p>Not as something you have to obey.</p>

              <h2 id="keep-close-to-lens">Keep your script close to the lens</h2>
              <p>
                <strong>whythisrole</strong> is designed around this exact
                problem.
              </p>
              <p>
                Instead of putting your notes somewhere below the camera, you
                can keep your answer close to the lens while you record.
              </p>
              <p>
                You can work from short talking points or a full script,
                depending on what feels more comfortable.
              </p>
              <p>The recording stays on your device.</p>
              <p>
                And you do not have to memorize a paragraph just to make it look
                like you are not reading one.
              </p>
              <p>The goal is simple:</p>
              <p>
                <strong>
                  Know what you want to say, keep it where you can see it, and
                  still sound like yourself.
                </strong>
              </p>

              <div className="inline-cta">
                <p>
                  Keep the answer close to the lens so you can glance without
                  looking down.
                </p>
                <a className="editorial-cta" href="/">
                  Practice your answer on this device
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
                  href={HOW_LONG_GUIDE_PATH}
                  title="How long should a video interview answer actually be?"
                  dek="A practical range for most questions, and when to stop."
                />
                <RelatedPostCard
                  href={EMPLOYERS_LOOK_FOR_PATH}
                  title="What employers are actually looking for when they ask for a video interview"
                  dek="They want a clear, genuine answer — not a perfect performance."
                />
                <RelatedPostCard
                  href={PRACTICE_GUIDE_PATH}
                  title="How to practice for a video interview by recording yourself"
                  dek="A simple three-take routine for making your answer clearer without sounding over-rehearsed."
                />
              </div>
            </section>

            <EmailCapture />
          </article>

          <aside className="editorial-sidebar">
            <Toc sections={SECTIONS} />
            <CtaCard
              title="Keep the script near the lens"
              body="Work from talking points or a full script, with the text close to the camera so you still sound like yourself."
              label="Practice your answer on this device"
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
