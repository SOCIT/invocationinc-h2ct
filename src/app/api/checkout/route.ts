import { NextRequest, NextResponse } from "next/server";

/** Checkout product ids: book only. */
import {
  getSiteUrl,
  getStripe,
  getStripePriceId,
} from "@/lib/stripe";
import { isValidProductId } from "@/lib/products";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = body?.productId;

    if (!productId || typeof productId !== "string" || !isValidProductId(productId)) {
      return NextResponse.json(
        { error: "Invalid product." },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const priceId = getStripePriceId(productId);

    if (!stripe || !priceId) {
      return NextResponse.json(
        {
          error: "checkout_not_configured",
          message:
            "Stripe is not configured yet. Add STRIPE_SECRET_KEY and STRIPE_PRICE_BOOK to env — see README.",
        },
        { status: 503 }
      );
    }

    const siteUrl = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      metadata: { productId },
      billing_address_collection: "auto",
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Unable to start checkout. Please try again." },
      { status: 500 }
    );
  }
}
