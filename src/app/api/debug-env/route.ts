import { NextResponse } from "next/server";

/** Temporary diagnostics: reports only whether env keys exist, never values. */
export async function GET() {
  return NextResponse.json({
    hasSecret: Boolean(process.env.STRIPE_SECRET_KEY),
    hasPriceBook: Boolean(process.env.STRIPE_PRICE_BOOK),
    hasSiteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    nodeEnv: process.env.NODE_ENV || null,
  });
}
