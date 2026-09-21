import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { brand } from "@/lib/products";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="inner-page lf-wrap" style={{ paddingBottom: 48 }}>
        <p>
          <Link href="/">Home</Link> / Privacy
        </p>
        <h1>Privacy Policy</h1>
        <p>
          Stub policy for {brand.legalName}. Replace with counsel-reviewed text
          before launch.
        </p>
        <p>
          We collect information you provide when purchasing (such as email and
          billing details processed by Stripe) and email addresses you submit for
          updates. We use this to fulfill orders, send requested updates, and
          improve the site.
        </p>
        <p>
          Payment card data is handled by Stripe; we do not store full card
          numbers on our servers. We do not sell your personal information.
          Newsletter signups may be forwarded to a configured webhook
          (`NEWSLETTER_WEBHOOK_URL`) when set.
        </p>
        <p>
          For privacy requests or questions, contact {brand.legalName} using the
          channels published on invocationinc.com once live.
        </p>
        <Footer />
      </main>
    </>
  );
}
