import { useEffect, useState, type FormEvent } from 'react'
import { ArticleMeta } from './guide/ArticleMeta'
import { Callout } from './guide/Callout'
import { CtaCard } from './guide/CtaCard'
import { EditorialFooter } from './guide/EditorialFooter'
import { EditorialHeader } from './guide/EditorialHeader'
import { EMPLOYERS_LOOK_FOR_PATH, HOW_LONG_GUIDE_PATH, PRACTICE_GUIDE_PATH, READ_FROM_SCRIPT_PATH } from './guide/paths'
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
              You don’t need a lifelong dream or half the About page. Say what
              interested you, connect it to something you’ve done, and explain
              why the role makes sense now.
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
              readingTime="11 min read"
            />

            <Toc variant="mobile" />

            <div className="editorial-prose">
              <p>
                If you’ve been asked to record a short video answering{' '}
                <strong>“Why do you want to work here?”</strong>, the question
                can feel harder than it should.
              </p>
              <p>You probably already know you shouldn’t say:</p>
              <blockquote>
                <p>“I need a job and this one looked interesting.”</p>
              </blockquote>
              <p>
                But the opposite can sound just as awkward. You don’t need to
                pretend the company has been your lifelong dream, and you don’t
                need to repeat half of its About page.
              </p>
              <p>
                For a video response, a good answer is usually pretty simple:
              </p>
              <p>
                <strong>
                  Say what interested you, connect it to something you’ve
                  actually done, and explain why the role makes sense for you
                  now.
                </strong>
              </p>
              <p>That’s enough.</p>

              <h2 id="what-employers-ask">What employers are actually asking</h2>
              <p>
                “Why do you want to work here?” sounds like one question, but
                employers are usually trying to figure out a few things at once:
              </p>
              <ul>
                <li>Did you look into the company before applying?</li>
                <li>Do you understand what the role involves?</li>
                <li>Is there a real reason you chose this job?</li>
                <li>Can you connect your experience to what they need?</li>
              </ul>
              <p>They are not looking for the most flattering answer.</p>
              <p>They are looking for a reason that makes sense.</p>
              <p>Compare these two answers.</p>

              <h3>Generic answer</h3>
              <blockquote>
                <p>
                  “I’m really excited about this opportunity because your
                  company has a great reputation and I think it would be a great
                  place for me to grow.”
                </p>
              </blockquote>
              <p>There’s nothing terribly wrong with it.</p>
              <p>
                The problem is that you could say the exact same thing to almost
                any company.
              </p>

              <h3>More specific answer</h3>
              <blockquote>
                <p>
                  “What caught my attention was how closely this role sits
                  between product design and growth. A lot of my recent work has
                  involved onboarding and simplifying fairly complex financial
                  products, so when I read the job description, that part
                  immediately felt familiar.”
                </p>
              </blockquote>
              <p>The second answer gives the interviewer something concrete.</p>
              <p>It also sounds much more believable on camera.</p>

              <h2 id="three-part-answer">A simple 3-part answer</h2>
              <p>You don’t need a complicated interview formula.</p>
              <p>For most people, these three parts are enough.</p>

              <h3>1. What interested you?</h3>
              <p>
                Start with one specific reason the company or role caught your
                attention.
              </p>
              <p>It could be:</p>
              <ul>
                <li>the product</li>
                <li>the type of customers</li>
                <li>a problem the company is solving</li>
                <li>something in the job description</li>
                <li>the industry</li>
                <li>the size of the company</li>
                <li>the way the team works</li>
                <li>the level of ownership in the role</li>
              </ul>
              <p>Try to avoid broad statements like:</p>
              <blockquote>
                <p>“I really love your mission.”</p>
              </blockquote>
              <p>That can work, but only if you explain what you actually mean.</p>
              <p>A stronger version would be:</p>
              <blockquote>
                <p>
                  “I liked that you’re building financial tools for small
                  businesses rather than only targeting large enterprise teams.”
                </p>
              </blockquote>
              <p>Now the interviewer knows what you noticed.</p>

              <h3>2. Why does it fit your experience?</h3>
              <p>
                Next, connect that reason to something you’ve actually done.
              </p>
              <p>You don’t need to walk through your entire career.</p>
              <p>One relevant connection is usually enough.</p>
              <p>For example:</p>
              <blockquote>
                <p>
                  “I’ve spent the last few years designing tools for finance
                  teams, so I’m especially interested in products where fairly
                  complex workflows need to feel simple.”
                </p>
              </blockquote>
              <p>
                That tells the employer why you’re interested and why that
                interest is credible.
              </p>

              <h3>3. Why does the role make sense for you now?</h3>
              <p>Finish with what you want from your next role.</p>
              <p>This doesn’t need to sound dramatic.</p>
              <p>You could say:</p>
              <blockquote>
                <p>
                  “I’d like my next role to give me more ownership over that
                  kind of problem.”
                </p>
              </blockquote>
              <p>Or:</p>
              <blockquote>
                <p>
                  “I’m looking for a smaller team where I can work more closely
                  with product and engineering.”
                </p>
              </blockquote>
              <p>Or:</p>
              <blockquote>
                <p>
                  “I’d like to stay in fintech, but move into a role where I can
                  work across more of the customer journey.”
                </p>
              </blockquote>
              <p>
                This makes the answer sound like a real career decision instead
                of something prepared for an interview.
              </p>

              <div className="inline-cta">
                <p>Have the posting open? Turn your notes into a 90-second script.</p>
                <a className="editorial-cta" href="/">
                  Turn your notes into a 90-second script
                </a>
              </div>

              <h2 id="how-long">How long should your video answer be?</h2>
              <p>
                For this question,{' '}
                <strong>around 45 to 90 seconds is usually enough</strong>.
              </p>
              <p>You do not need to use every second the platform gives you.</p>
              <p>
                A clear 55-second answer is better than stretching one idea into
                two minutes.
              </p>
              <p>
                If your answer keeps going, listen for repetition. Most long
                answers become shorter very quickly once you remove the parts
                that say the same thing twice.
              </p>
              <p>
                We have a separate guide on{' '}
                <a href={HOW_LONG_GUIDE_PATH}>how long a video interview answer should be</a> if
                you want a more detailed breakdown. There is also one on{' '}
                <a href="#">how to stop rambling and keep your answer tight</a>.
              </p>

              <Callout variant="info" label="On length">
                <p>
                  Around 45 to 90 seconds is usually enough for this question. A
                  clear 55-second answer is better than stretching one idea into
                  two minutes. If it keeps going, cut the parts that say the
                  same thing twice.
                </p>
              </Callout>

              <h2 id="example-1">Example 1: Product designer</h2>
              <blockquote>
                <p>
                  “What caught my attention is that you’re building tools for
                  finance teams rather than expecting them to understand crypto
                  first. I’ve worked on corporate cards, payments, onboarding,
                  and stablecoin-based financial products, and a big part of my
                  job has been making those systems understandable to people who
                  aren’t crypto experts. So when I read the role, there was a
                  pretty clear overlap with the kind of problems I already enjoy
                  working on. For my next role, I’d like to keep working on
                  complex financial products but have broader ownership over the
                  experience.”
                </p>
              </blockquote>

              <h3>Why this works</h3>
              <p>
                The candidate gives a real reason for being interested, connects
                it to relevant experience, and explains what they want next.
              </p>
              <p>
                There’s no need to add a line about being “passionate about
                innovation.”
              </p>

              <h2 id="example-2">Example 2: Marketing role</h2>
              <blockquote>
                <p>
                  “What stood out to me was how much experimentation is part of
                  the role. In my current job I work across email, paid social,
                  landing pages, and content, and I like being able to test an
                  idea quickly and see what actually works. From the job
                  description, it sounds like your team works in a similar way.
                  That’s probably the biggest reason the role caught my
                  attention.”
                </p>
              </blockquote>

              <h3>Why this works</h3>
              <p>It focuses on the actual work.</p>
              <p>
                The candidate isn’t trying to prove that they have admired the
                company for years. They are simply explaining why the job fits
                the way they like to work.
              </p>

              <h2 id="example-3">Example 3: Career change</h2>
              <p>
                You don’t need perfectly matching experience to give a
                convincing answer.
              </p>
              <blockquote>
                <p>
                  “I’m moving from customer support into customer success, and
                  this role stood out because it still uses the part of my
                  current job I enjoy most, which is helping customers solve
                  problems and get more value from a product. At the same time,
                  I’ve been looking for a role where I can build longer-term
                  relationships instead of mainly handling individual support
                  requests. So for me, this feels like a pretty natural next
                  step.”
                </p>
              </blockquote>

              <h3>Why this works</h3>
              <p>The candidate doesn’t try to hide the career change.</p>
              <p>They explain why the move makes sense.</p>
              <p>
                That’s much stronger than pretending their background is an
                exact match.
              </p>

              <h2 id="example-4">Example 4: Startup or small company</h2>
              <blockquote>
                <p>
                  “One of the things I liked about the role was the size of the
                  team. Most of my experience has been in smaller companies
                  where people work across functions and you can see the effect
                  of what you ship pretty quickly. I’ve realized I enjoy that
                  environment more than having a very narrow role, and from the
                  job description it sounds like this position has that same
                  kind of ownership.”
                </p>
              </blockquote>

              <h3>Why this works</h3>
              <p>Again, the reason is specific.</p>
              <p>
                It also tells the interviewer something useful about the kind of
                environment the candidate does well in.
              </p>

              <h2 id="example-5">Example 5: Larger company</h2>
              <blockquote>
                <p>
                  “I’ve mostly worked in smaller teams, so one reason this role
                  interested me is the chance to work on a product at a much
                  larger scale. I already have experience solving similar user
                  problems, but I haven’t had as many opportunities to see how
                  those decisions work across millions of users and multiple
                  markets. That feels like a good next step for me.”
                </p>
              </blockquote>
              <p>
                This is a useful reminder that your reason for applying does not
                always have to be about the company’s mission or product.
              </p>
              <p>
                Sometimes the scale, team structure, or type of challenge is the
                real reason.
              </p>
              <p>That’s completely fine.</p>

              <h2 id="need-a-job">
                What if you mostly applied because you need a job?
              </h2>
              <p>That is normal.</p>
              <p>
                You do not need a dramatic personal connection to every company
                you apply to.
              </p>
              <p>
                Your job is to find the most genuine reason this particular role
                makes sense for you.
              </p>
              <p>Maybe:</p>
              <ul>
                <li>the responsibilities match your experience</li>
                <li>you want to move into the industry</li>
                <li>the product is interesting</li>
                <li>the company works remotely</li>
                <li>the role gives you more responsibility</li>
                <li>you want to work on a smaller team</li>
                <li>you want to move from agency work to an in-house team</li>
                <li>you want to work on a product with more users</li>
                <li>
                  you want to specialize in something you have already started
                  doing
                </li>
              </ul>
              <p>Those are all real reasons.</p>
              <p>
                Your answer does not need to sound like a love letter to the
                company.
              </p>
              <p>It just needs to explain why you chose to apply.</p>

              <h2 id="common-mistakes">Common mistakes</h2>

              <h3>Repeating the company website</h3>
              <p>Researching the company is good.</p>
              <p>Repeating its homepage back to the interviewer is not.</p>
              <p>If you say:</p>
              <blockquote>
                <p>
                  “I’m impressed by your mission to empower businesses through
                  innovative technology.”
                </p>
              </blockquote>
              <p>
                the interviewer still doesn’t know why <strong>you</strong> want
                the role.
              </p>
              <p>
                Instead, take something you learned about the company and
                connect it back to yourself.
              </p>
              <p>For example:</p>
              <blockquote>
                <p>
                  “I noticed that a lot of your customers are small business
                  owners. That stood out to me because my current product is
                  also designed for people who don’t have much time to learn
                  complicated software.”
                </p>
              </blockquote>
              <p>Same research, much better answer.</p>

              <h3>Giving your whole career history</h3>
              <p>You do not need to explain every job you have had.</p>
              <p>
                Choose one or two pieces of experience that make your interest
                in this role believable.
              </p>
              <p>
                If the interviewer wants the full story, there will usually be
                other questions for that.
              </p>

              <h3>Complimenting the company too much</h3>
              <p>Statements like:</p>
              <blockquote>
                <p>
                  “You are an industry-leading organization with an incredible
                  culture.”
                </p>
              </blockquote>
              <p>usually sound less convincing than one specific observation.</p>
              <p>Specific beats enthusiastic.</p>

              <h3>Trying to memorize every word</h3>
              <p>
                A perfectly memorized answer can sound strangely flat on camera.
              </p>
              <p>It is often easier to remember three points:</p>
              <ol>
                <li>Why this role caught my attention</li>
                <li>What experience connects to it</li>
                <li>Why it makes sense for me now</li>
              </ol>
              <p>Then speak around those points.</p>
              <p>
                If you do prefer using a full script, write it the way you
                actually speak.
              </p>
              <p>Shorter sentences help.</p>
              <p>Contractions help.</p>
              <p>
                And if a sentence feels uncomfortable to say out loud, rewrite
                it.
              </p>

              <h3>Taking too long to get to the answer</h3>
              <p>You don’t need a long introduction.</p>
              <p>Instead of:</p>
              <blockquote>
                <p>
                  “Thank you so much for giving me the opportunity to answer
                  this question. There are actually several reasons I was very
                  interested in applying for this position…”
                </p>
              </blockquote>
              <p>Start with the reason.</p>
              <blockquote>
                <p>“What caught my attention about this role was…”</p>
              </blockquote>
              <p>You immediately sound more confident.</p>

              <h3>Trying to sound too polished</h3>
              <p>Recorded interviews make this especially tempting.</p>
              <p>
                You have another take, so you keep recording until every
                sentence sounds perfect.
              </p>
              <p>But perfect can start sounding rehearsed.</p>
              <p>A small pause is fine.</p>
              <p>Changing a word halfway through a sentence is fine.</p>
              <p>
                Sounding like a person thinking about their answer is usually
                better than sounding like someone reading a statement.
              </p>
              <p>
                We also have a separate guide on{' '}
                <a href="#">
                  5 mistakes people make in video interview submissions
                </a>
                .
              </p>

              <h2 id="before-you-record">Before you record</h2>
              <p>Write down three things:</p>
              <ol>
                <li>
                  <strong>What specifically interested me?</strong>
                </li>
                <li>
                  <strong>What have I done that connects to it?</strong>
                </li>
                <li>
                  <strong>Why does this role make sense for me now?</strong>
                </li>
              </ol>
              <p>Then say your answer out loud once before recording.</p>
              <p>Not in your head.</p>
              <p>Out loud.</p>
              <p>
                You’ll notice very quickly which sentences are too long or don’t
                sound like something you would actually say.
              </p>
              <p>
                If the answer takes more than 90 seconds, cut anything that
                repeats a point you already made.
              </p>
              <p>
                And if you catch yourself trying to sound impressive, try being
                more specific instead.
              </p>
              <p>
                Specific examples almost always sound better on camera than
                polished interview language.
              </p>

              <h2 id="bullet-points-or-script">
                Should you use bullet points or a full script?
              </h2>
              <p>Either can work.</p>
              <p>
                Bullet points usually sound more natural because you are
                choosing the words as you speak.
              </p>
              <p>
                A full script can be useful if you tend to ramble, forget
                important points, or get nervous once the camera starts
                recording.
              </p>
              <p>The important part is not whether you use a script.</p>
              <p>
                It’s whether you <strong>sound like you are reading one</strong>
                .
              </p>
              <p>
                If you use a full script, keep the language simple and
                conversational. Avoid sentences that are much longer than
                something you would normally say out loud.
              </p>
              <p>
                We also have a separate guide on{' '}
                <a href={READ_FROM_SCRIPT_PATH}>
                  how to read from a script without looking like you’re reading
                </a>
                , and another on{' '}
                <a href="#">
                  bullet points vs. full scripts for video answers
                </a>
                if you want a more detailed breakdown.
              </p>

              <h2 id="turn-notes-into-answer">
                Turn your notes into a short video answer
              </h2>
              <p>
                If you already have the job description, a few notes about the
                company, and your own experience, you do not need to start from
                a blank page.
              </p>
              <p>
                <strong>whythisrole</strong> can turn that information into a
                short set of talking points or a video-ready script.
              </p>
              <p>
                You can then keep the text close to the camera while you record,
                so you are not constantly looking down at notes.
              </p>
              <p>Your recording stays on your device.</p>
              <p>The goal is not to make you sound scripted.</p>
              <p>
                It is to help you know what you want to say before you press
                record.
              </p>

              <div className="inline-cta">
                <p>Have the posting open? Turn your notes into a 90-second script.</p>
                <a className="editorial-cta" href="/">
                  Generate your answer
                </a>
              </div>
            </div>

            <section className="related-block" aria-labelledby="related-heading">
              <h2 id="related-heading">Related guides</h2>
              <div className="related-grid">
                <RelatedPostCard
                  href={HOW_LONG_GUIDE_PATH}
                  title="How long should a video interview answer actually be?"
                  dek="A practical range for this question, and when to stop."
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
