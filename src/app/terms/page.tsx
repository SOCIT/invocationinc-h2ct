import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { brand } from "@/lib/products";

export const metadata: Metadata = {
  title: "Terms of Use",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="inner-page lf-wrap" style={{ paddingBottom: 48 }}>
        <p>
          <Link href="/">Home</Link> / Terms
        </p>
        <h1>Terms of Use</h1>
        <p>
          Stub terms for {brand.legalName}. Replace with counsel-reviewed text
          before launch.
        </p>
        <p>
          By purchasing digital products from {brand.legalName}, you receive a
          personal, non-transferable license to use the PDFs and companion app
          access for your own learning. Redistribution, resale, or public sharing
          of the files is not permitted.
        </p>
        <p>
          Content is educational and personal-development material. It is{" "}
          <strong>not medical, legal, or therapeutic advice</strong>.{" "}
          {brand.legalName} is not a licensed medical or therapy practice. If you
          need a clinician, get one.
        </p>
        <p>
          <strong>Refunds:</strong> Defective file that will not open — contact
          us for a refund or replacement. If you did the Work and the scoreboard
          shows nothing, email us. No refund for skipping the Work.
        </p>
        <Footer />
      </main>
    </>
  );
}
