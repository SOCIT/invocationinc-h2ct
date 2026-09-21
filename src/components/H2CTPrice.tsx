import { bookProduct } from "@/lib/products";

/**
 * Struck list price immediately before the charge price.
 * Shows the expired-window rung ($57) once the visitor's 24h window closes.
 * Reuses products list/price display fields — no new SKUs.
 */
export function H2CTPrice({
  expired = false,
  compact = true,
}: {
  expired?: boolean;
  compact?: boolean;
}) {
  const list = bookProduct.listPriceDisplay ?? bookProduct.priceDisplay;
  const now = expired ? bookProduct.rung2PriceDisplay : bookProduct.priceDisplay;

  return (
    <span
      className={
        compact ? "lf-stack-price lf-stack-price-compact" : "lf-stack-price"
      }
    >
      <s className="lf-was">{list}</s> <span className="lf-now">{now}</span>
    </span>
  );
}
