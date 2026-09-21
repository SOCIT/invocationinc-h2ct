import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { brand } from "@/lib/products";

export const metadata: Metadata = {
  title: {
    default: `${brand.bookTitle} — ${brand.name}`,
    template: `%s | ${brand.name}`,
  },
  description:
    "How to Create Time from Invocation Inc. An 8-week system, distilled from five-figure executive coaching, that gets you from ran-out-of-week to lined-up hours: pick Point B, log the hours, run the weeks. Blunt. Dry. No hustle-culture hype.",
  openGraph: {
    title: `${brand.bookTitle} — ${brand.name}`,
    description:
      "How to Create Time — Same 24 Hours. Different Output. The $47 system: book + workbook + Time Log, direct from the author.",
    siteName: brand.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
