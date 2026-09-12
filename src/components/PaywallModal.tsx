import { useEffect, useId, useRef, useState } from 'react'
import { PRICE_LABEL } from '../lib/constants.ts'

type PaywallModalProps = {
  open: boolean
  onClose: () => void
  onUnlocked: () => void
}

type PaymentSlotProps = {
  onSuccess: () => void
}

/**
 * PAYMENT CONSTRAINT
 *
 * The recorded clip only exists as an in-memory Blob in this tab. Whatever
 * payment method we use later must NOT navigate the browser away from this
 * page (no redirect to Stripe Checkout or any hosted page). A full navigation
 * unloads the tab and destroys the Blob before the user can download.
 *
 * Swap `StubPaymentForm` below for Stripe's embedded Payment Element
 * (PaymentIntent + client_secret from /api/create-payment). Keep it in-page.
 */
function StubPaymentForm({ onSuccess }: PaymentSlotProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePay() {
    setBusy(true)
    setError(null)
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount: 99, currency: 'usd' }),
      })
      if (!response.ok) {
        throw new Error('Could not start payment.')
      }
      await response.json()
      onSuccess()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Payment failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="payment-slot">
      <p className="payment-slot-note">
        This clip is longer than 45 seconds, so download is {PRICE_LABEL}.
        Payment stays on this page so your recording is not lost.
      </p>
      {error ? <p className="form-error">{error}</p> : null}
      <button type="button" className="btn-primary" onClick={handlePay} disabled={busy}>
        {busy ? 'Unlocking…' : `Pay ${PRICE_LABEL}`}
      </button>
    </div>
  )
}

export function PaywallModal({ open, onClose, onUnlocked }: PaywallModalProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id={titleId}>Unlock download</h2>
          <button
            ref={closeRef}
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <StubPaymentForm onSuccess={onUnlocked} />
      </div>
    </div>
  )
}
