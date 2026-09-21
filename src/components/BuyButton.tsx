"use client";

import { useState, type ReactNode } from "react";
import { getProduct, type ProductId } from "@/lib/products";

interface BuyButtonProps {
  productId: ProductId;
  label?: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  id?: string;
}

function defaultLabel(productId: ProductId): ReactNode {
  const product = getProduct(productId);
  return product ? `${product.shortName} — ${product.priceDisplay}` : "Buy now";
}

export function BuyButton({
  productId,
  label,
  variant = "primary",
  className = "",
  id,
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const product = getProduct(productId);
  const resolvedLabel = label ?? defaultLabel(productId);

  async function handleClick() {
    setLoading(true);
    setMessage(null);

    const paymentLinkUrl = product?.paymentLinkUrl;
    if (paymentLinkUrl) {
      window.location.href = paymentLinkUrl;
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (res.status === 503 || data.error === "checkout_not_configured") {
        setMessage(
          data.message || "Checkout is not configured yet. Please try again shortly."
        );
        setLoading(false);
        return;
      }

      if (!res.ok || !data.url) {
        setMessage(
          data.message || data.error || "Something went wrong. Please try again."
        );
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setMessage("Unable to reach checkout. Please try again in a moment.");
      setLoading(false);
    }
  }

  return (
    <div className={`lf-buy ${className}`.trim()}>
      <button
        id={id}
        type="button"
        onClick={handleClick}
        disabled={loading}
        aria-busy={loading}
        className={variant === "ghost" ? "lf-btn lf-btn-ghost" : "lf-btn lf-btn-red"}
      >
        {loading ? "Starting checkout…" : resolvedLabel}
      </button>
      {message && (
        <p role="status" className="lf-tiny">
          {message}
        </p>
      )}
    </div>
  );
}
