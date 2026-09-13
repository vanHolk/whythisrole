export function PrivacyPage() {
  return (
    <div className="page">
      <header className="topbar">
        <a className="brand" href="/">
          <img className="brand-mark" src="/logo.png" alt="" aria-hidden="true" />
          <span className="brand-name">whythisrole</span>
        </a>
        <div className="topbar-right">
          <a className="topbar-link" href="/">
            Back to whythisrole
          </a>
        </div>
      </header>

      <main className="main">
        <section className="card guide-card privacy-card">
          <h1>Privacy & Terms</h1>
          <p className="card-lede">Last updated: September 13, 2026</p>

          <p>
            Why This Role is a browser-based tool that helps candidates who have
            already been asked by an employer to submit a short video response.
            This page explains what happens to your data and the terms under
            which you use this tool.
          </p>

          <h2>What we handle</h2>
          <ul>
            <li>
              Your recording. Captured directly in your browser using your
              camera and microphone. It is never uploaded to, or stored on, our
              servers. It exists only on your own device, for as long as your
              browser tab stays open, until you download it.
            </li>
            <li>
              Text you paste. The job description and company blurb you paste
              in are sent to Groq&apos;s API solely to generate talking
              points and a script for you to edit. We do not store this text
              ourselves. Groq&apos;s handling of that data is governed by
              their own privacy policy (<a href="https://groq.com/privacy-policy">groq.com/privacy-policy</a>).
            </li>
            <li>
              A job URL, if you use that option. If you paste a job posting URL
              instead of pasting text directly, our server fetches that page
              once to extract readable text for you to edit. We don&apos;t store
              the URL or the fetched page afterward.
            </li>
            <li>
              Optional support. After you download a take, a coffee button may
              appear. Clicking it opens Buy Me a Coffee in a popup. Their site
              has its own terms and privacy policy (
              <a href="https://buymeacoffee.com/privacy-policy">
                buymeacoffee.com/privacy-policy
              </a>
              ), not ours.
            </li>
            <li>
              Accounts and tracking. There are none. No sign-up, no login, no
              cookies-based tracking, no persistent server-side storage of
              anything listed above. If that ever changes, this page will be
              updated first.
            </li>
          </ul>

          <h2>Terms of use</h2>
          <p>
            This tool is provided &quot;as is&quot; and &quot;as available,&quot;
            without warranties of any kind, express or implied, including any
            warranty of merchantability, fitness for a particular purpose, or
            that the service will be uninterrupted or error-free.
          </p>
          <p>
            We make no guarantee about employment outcomes, interview results,
            or that using this tool will improve your chances with any employer.
            You are solely responsible for the content, accuracy, and
            appropriateness of anything you record, and for meeting whatever
            instructions your prospective employer gave you.
          </p>
          <p>
            To the fullest extent permitted by law, Why This Role and its
            creator disclaim liability for any damages, direct or indirect,
            arising from your use of, or inability to use, this tool.
          </p>
          <p>
            This tool is intended for general audiences. If you are using it
            from a jurisdiction that requires parental or guardian consent for
            minors to use online tools, please get that consent first.
          </p>

          <h2>Changes</h2>
          <p>
            This page may be updated from time to time. Continued use of the
            tool after a change means you accept the updated terms.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this page:{' '}
            {/* TODO: replace you@whythisrole.com with the live inbox */}
            <a href="mailto:you@whythisrole.com">you@whythisrole.com</a>
            <span className="privacy-placeholder">
              {' '}
              TODO: replace with the live inbox
            </span>
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>
          Not affiliated with LinkedIn.{' '}
          <a className="footer-link" href="/privacy">
            Privacy & Terms.
          </a>
        </p>
        <p>
          Made by Van Ho ·{' '}
          <a
            className="footer-link"
            href="https://www.vanholker.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Portfolio
          </a>
          {' · '}
          <a
            className="footer-link"
            href="https://www.linkedin.com/in/michael-holker-ba3b507b/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </p>
      </footer>
    </div>
  )
}
