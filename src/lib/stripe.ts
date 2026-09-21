import Stripe from "stripe";
import type { ProductId } from "./products";
import { getProduct } from "./products";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

/** True when a secret key exists. Per-product Price IDs are checked separately. */
export function isCheckoutConfigured(productId?: ProductId): boolean {
  if (!process.env.STRIPE_SECRET_KEY) return false;
  if (!productId) {
    return Boolean(
      process.env.STRIPE_PRICE_BOOK || process.env.STRIPE_PRICE_STACK
    );
  }
  return Boolean(getStripePriceId(productId));
}

export function getStripePriceId(productId: ProductId): string | null {
  const product = getProduct(productId);
  if (!product) return null;
  const priceId = process.env[product.stripePriceEnvKey];
  return priceId || null;
}

/** Price ID for the expired-window rung (next $10 step up the ladder). */
export function getStripeRung2PriceId(productId: ProductId): string | null {
  const product = getProduct(productId);
  if (!product) return null;
  const priceId = process.env[product.stripePriceRung2EnvKey];
  return priceId || getStripePriceId(productId);
}

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}
