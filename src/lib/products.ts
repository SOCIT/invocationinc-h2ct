/**
 * H2CT offer — the system: book + workbook + Time Log, direct from the author.
 * One price: $9.99. Do not hardcode Stripe Price IDs; wire them via env.
 *
 * Checkout uses STRIPE_PRICE_BOOK. Live value:
 * price_1UMYUhPj4KYXkIe0TGmkKkU7 ($9.99, 999 cents, one-time).
 */

export type ProductId = "book";

export interface Product {
  id: ProductId;
  name: string;
  shortName: string;
  description: string;
  /** Charge price shown on the button. One number. No strike. */
  priceDisplay: string;
  priceCents: number;
  /** Env var name holding the Stripe Price ID for this offer. */
  stripePriceEnvKey: "STRIPE_PRICE_BOOK";
  /**
   * Optional Stripe Payment Link. Leave empty to use /api/checkout.
   * Prefer API checkout + env Price IDs.
   */
  paymentLinkUrl: string;
  features: string[];
  highlighted?: boolean;
}

export const brand = {
  name: "Invocation Inc",
  legalName: "Invocation Inc",
  shortName: "Invocation",
  role: "Human Performance Engineers",
  tagline: "Invoke a better you.",
  mechanismLine: "Pick Point B. Log the hours. Run the weeks.",
  bookTitle: "How to Create Time",
  bookAbbrev: "H2CT",
  siteUrlFallback: "http://localhost:3000",
  paper: "#f3eadc",
  ink: "#140e0c",
  red: "#d10f28",
} as const;

export const products: Product[] = [
  {
    id: "book",
    name: "How to Create Time — The System",
    shortName: "The System",
    description:
      "The complete book plus the H2CT Companion workbook and the Time Log. Instant PDF downloads.",
    priceDisplay: "$9.99",
    priceCents: 999,
    stripePriceEnvKey: "STRIPE_PRICE_BOOK",
    paymentLinkUrl: "",
    highlighted: true,
    features: [
      "How to Create Time — the book (PDF)",
      "H2CT Companion workbook — Have/Want grids, log pages, exercise pages (PDF)",
      "H2CT Time Log — the 15-minute tracking grid",
    ],
  },
];

export function getProduct(id: ProductId): Product | undefined {
  return products.find((p) => p.id === id);
}

export function isValidProductId(id: string): id is ProductId {
  return id === "book";
}

export const bookProduct = getProduct("book")!;
