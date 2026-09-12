export const config = { runtime: 'edge' }

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  // Stub: later this creates a Stripe PaymentIntent (~$0.99) and returns
  // a client_secret for an in-page Payment Element.
  //
  // PAYMENT CONSTRAINT: the recorded video only exists as an in-memory Blob
  // in this browser tab. Do not use Stripe Checkout or any other flow that
  // navigates the user away from this page. A redirect would unload the tab
  // and destroy the Blob before they can download. Use Stripe's embedded
  // Payment Element (or equivalent) so the tab never unloads.
  return Response.json({
    stub: true,
    amount: 99,
    currency: 'usd',
    clientSecret: 'stub_client_secret_replace_with_stripe',
  })
}
