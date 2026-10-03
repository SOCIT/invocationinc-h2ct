# Invocation Inc — How to Create Time (H2CT)

Lean Next.js sales page for **How to Create Time** from **Invocation Inc** (Human Performance Engineers).

The live page is `src/components/H2CTPage.tsx`. Gates, disclaimers, the chapter list, FAQ substance, and the author bio stay as written.

`docs/APPROVED-LONGFORM-V2.html` is an older Eight Weeks to Happy longform. It is not served, and it was not edited here.

## Offers

| Offer | Charge | Includes | Stripe env |
|---|---|---|---|
| **book** (system) | **$9.99** (999¢) | Book + workbook + Time Log | `STRIPE_PRICE_BOOK` |

No second SKU. No workbook-only button. No strike price. No countdown. Checkout product id: `book` only.

`STRIPE_PRICE_BOOK` is the live one-time price `price_1UMYUhPj4KYXkIe0TGmkKkU7` (**999** cents, $9.99). Checkout does not read `STRIPE_PRICE_RUNG2`.

The buy button always renders. If Stripe env is missing, `/api/checkout` returns `503` with `checkout_not_configured`.

### Stripe setup

1. In [Stripe Dashboard → Products](https://dashboard.stripe.com/products), use the active one-time price at **999** cents on How to Create Time.
2. Set Vercel / `.env.local`: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_BOOK`, `NEXT_PUBLIC_SITE_URL`.
3. Do not invent or commit Stripe Price IDs in source.

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
| `STRIPE_PRICE_BOOK` | `price_1UMYUhPj4KYXkIe0TGmkKkU7` — system, $9.99 / 999 cents |
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
    api/checkout/route.ts        # Stripe Checkout Session (book)
    api/subscribe/route.ts       # Newsletter MVP
    success/ cancel/ privacy/ terms/
  components/                    # H2CTPage, BuyButton
  lib/
    products.ts                  # Offers book | ebook + brand
    stripe.ts
```

## License

Private — © Invocation Inc. All rights reserved.
