# Invocation Inc — Eight Weeks to Happy (EW2H)

Lean Next.js sales page for **Eight Weeks to Happy** from **Invocation Inc** (Human Performance Engineers).

The public landing is a port of the approved Chat longform v2. **Do not invent or rewrite marketing prose.** Source of truth:

`docs/APPROVED-LONGFORM-V2.html`

Method tokens: SmileBell™ / CalmBell™, Mood Log 6×/day, present-tense Change Statements, DoTo. Not therapy.

## Offers

| Offer | Charge | List | Includes | Stripe env |
|---|---|---|---|---|
| **stack** (STACK) | **$47** (4700¢) | $97 | Book + Workbook + Companion App | `STRIPE_PRICE_STACK` |
| **book** (WHY) | **$9.99** (999¢) | — | Book only | `STRIPE_PRICE_BOOK` |

No workbook-only SKU. No combo SKU. Checkout product ids: `book` \| `stack` only.

Companion app (only public app URL): https://invocationinc-ew2h-app.vercel.app

Buy buttons always render. If Stripe env is missing, `/api/checkout` returns `503` with `checkout_not_configured`.

STACK CTAs are primary red (`#d10f28`). Book CTAs are ghost. Sticky bar: `$97 → $47` + timer + red Take the Stack.

### Stripe setup

1. In [Stripe Dashboard → Products](https://dashboard.stripe.com/products), create one-time prices at **999** and **4700** cents.
2. Set Vercel / `.env.local`: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_BOOK`, `STRIPE_PRICE_STACK`, `NEXT_PUBLIC_SITE_URL`.
3. Do not invent or commit Stripe Price IDs in source.

## 24h STACK timer

- localStorage key: `ew2h_stack_deadline`
- Set once on first visit (`now + 24h`). Refresh does not reset.
- Shown in: top bar, hero, story CTA, offer box, final CTA, sticky bar.

## Newsletter MVP

`POST /api/subscribe` validates email, logs to stdout, and if `NEWSLETTER_WEBHOOK_URL` is set POSTs `{ email, source, ts }` there. Otherwise returns 200 with no durable store.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Stripe Checkout via `/api/checkout`
- Visual from approved HTML: paper `#f3eadc`, ink `#140e0c`, one red `#d10f28`

## Quick start

```bash
cd invocationinc-ew2h
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Purpose |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publishable key (reserved) |
| `STRIPE_PRICE_BOOK` | Price ID for book ($9.99 / 999) |
| `STRIPE_PRICE_STACK` | Price ID for STACK ($47 / 4700) |
| `NEXT_PUBLIC_SITE_URL` | Public origin, no trailing slash |
| `NEWSLETTER_WEBHOOK_URL` | Optional webhook for email signups |

Offer catalog: `src/lib/products.ts`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Local development |
| `npm run build` | Production build (must succeed) |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |

## Deploy on Vercel + domain

1. Push to GitHub → Vercel project (Next.js).
2. Add env vars from `.env.example` (live Stripe keys for production).
3. Set `NEXT_PUBLIC_SITE_URL=https://invocationinc.com`.
4. Attach domain in Vercel → Domains.

## PDF / app delivery

Checkout creates a Stripe Session only. PDFs and the app beta exist; email automation may still be separate. No fulfillment webhook in this repo.

## Project layout

```text
docs/APPROVED-LONGFORM-V2.html   # Approved sales copy (do not invent)
src/
  app/
    page.tsx                     # Longform landing (port of approved HTML)
    api/checkout/route.ts        # Stripe Checkout Session (book | stack)
    api/subscribe/route.ts       # Newsletter MVP
    success/ cancel/ privacy/ terms/
  components/                    # LongformLanding, Countdown, BuyButton, StickyBar
  lib/
    products.ts                  # Offers book | stack + brand + APP_URL
    stripe.ts
    countdown.ts                 # ew2h_stack_deadline helper
```

## License

Private — © Invocation Inc. All rights reserved.
