# Stripe

Add Stripe **test mode** only. Document `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in `.env.example`. Never call live mode keys from a Brix scaffold. Do not put secrets in `infra/` images or committed compose files.

## Checkout

- Create a Checkout Session on the server (secret key never reaches the browser). Return the session URL or client secret to the client per Stripe's current Checkout flow for your API version.
- Fulfill on webhook events, not only on the browser redirect (the user can close the tab).

## Webhook (official)

- Route lives in the API route tree (`src/routes` on Node, or `src/api/routes` on Python), for example `POST /v1/stripe/webhook`.
- Verify signatures with the official SDK before trusting the payload:
  - Node: `stripe.webhooks.constructEvent(rawBody, signature, endpointSecret)`
  - Python: `stripe.Webhook.construct_event(payload, sig_header, secret)`
- Use the **exact raw body** bytes/string Stripe sent. Framework JSON middleware that re-parses or reorders the body breaks verification. In Express, register `express.raw({ type: "application/json" })` on this route **before** `express.json()`. In FastAPI/Flask, read raw body / `request.data` before parsing.
- Handle `checkout.session.completed` and, for delayed methods, `checkout.session.async_payment_succeeded` (and optionally `async_payment_failed`). Return 2xx quickly after verifying; do heavy work async if needed.
- Local CLI secrets (`stripe listen`) differ from Dashboard endpoint secrets — document which one `.env.example` expects.
