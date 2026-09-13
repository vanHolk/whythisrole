import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const BMC_URL = 'https://www.buymeacoffee.com/van_ho'
const AUTO_OPEN_MS = 1300

type BuyMeACoffeeButtonProps = {
  downloadCount: number
  saved: boolean
}

export function BuyMeACoffeeButton({ downloadCount, saved }: BuyMeACoffeeButtonProps) {
  const [open, setOpen] = useState(false)
  const titleId = useId()
  const lastOfferedCountRef = useRef(downloadCount)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!saved) {
      setOpen(false)
      return
    }
    if (downloadCount === lastOfferedCountRef.current) return
    lastOfferedCountRef.current = downloadCount
    if (downloadCount < 1) return
    const timeout = window.setTimeout(() => setOpen(true), AUTO_OPEN_MS)
    return () => window.clearTimeout(timeout)
  }, [downloadCount, saved])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  function handlePrimary() {
    window.open(BMC_URL, 'bmc', 'width=480,height=680')
    close()
  }

  if (!open) return null

  return createPortal(
    <div
      className="coffee-modal-overlay"
      onClick={close}
      role="presentation"
    >
      <div
        className="coffee-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId}>Enjoying whythisrole?</h2>
        <p>
          This is a free, one-person project. If it saved you some stress
          before your interview, a coffee goes a long way. Good luck with
          the role, hope you get it.
        </p>
        <div className="coffee-modal-actions">
          <button type="button" className="btn-primary" onClick={handlePrimary}>
            Buy me a coffee ☕
          </button>
          <button type="button" className="coffee-modal-later" onClick={close}>
            Maybe later
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
