import Link from "next/link";
import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { brand, bookProduct } from "@/lib/products";

export const metadata: Metadata = {
  title: "Purchase complete",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;
  // The workbook ships as part of the system; show its download only if present.
  const hasWorkbook = existsSync(
    join(process.cwd(), "public/downloads/h2ct-workbook.pdf")
  );

  return (
    <>
      <Header />
      <main className="inner-page lf-wrap" style={{ paddingBottom: 48 }}>
        <p className="lf-stamp">Payment confirmed. Welcome, operator.</p>
        <h1>Your copy of {brand.bookTitle}</h1>
        <p>
          The PDFs are ready right now — download them below and keep them forever.
          Check your email for the Stripe receipt.
        </p>
        <div className="lf-cta">
          <a
            className="lf-btn lf-btn-red"
            href="/downloads/h2ct.pdf"
            download="How-to-Create-Time.pdf"
          >
            Download the book (PDF)
          </a>
          {hasWorkbook && (
            <p style={{ marginTop: 12 }}>
              <a
                className="lf-btn lf-btn-ghost"
                href="/downloads/h2ct-workbook.pdf"
                download="H2CT-Companion-Workbook.pdf"
              >
                Download the workbook (PDF)
              </a>
            </p>
          )}
          <p className="lf-tiny">
            {bookProduct.description}
          </p>
        </div>
        {sessionId && (
          <p className="lf-tiny" style={{ color: "var(--soft)" }}>
            Session: {sessionId}
          </p>
        )}
        <p>
          <Link href="/">Back to home</Link>
        </p>
        <Footer />
      </main>
    </>
  );
}
