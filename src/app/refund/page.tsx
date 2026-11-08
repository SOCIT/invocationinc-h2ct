import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { brand } from "@/lib/products";

export const metadata: Metadata = {
  title: "Refunds",
};

export default function RefundPage() {
  return (
    <>
      <Header />
      <main className="inner-page lf-wrap" style={{ paddingBottom: 48 }}>
        <p>
          <Link href="/">Home</Link> / Refunds
        </p>
        <h1>Refunds</h1>
        <p>
          <strong>Refunds:</strong> Defective file that will not open — contact
          us for a refund or replacement. If you did the Work and the scoreboard
          shows nothing, email us. No refund for skipping the Work.
        </p>
        <p>
          Send refund requests to {brand.legalName} at{" "}
          <a href="mailto:info@invocationinc.com">info@invocationinc.com</a>.
        </p>
        <Footer />
      </main>
    </>
  );
}
