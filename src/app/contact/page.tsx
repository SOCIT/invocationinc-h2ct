import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { brand } from "@/lib/products";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="inner-page lf-wrap" style={{ paddingBottom: 48 }}>
        <p>
          <Link href="/">Home</Link> / Contact
        </p>
        <h1>Contact</h1>
        <p>{brand.legalName}</p>
        <p>
          Email:{" "}
          <a href="mailto:info@invocationinc.com">info@invocationinc.com</a>
        </p>
        <p>Mail: 7820 12th Ave, Jenison, MI 49428</p>
        <p>
          Phone: <a href="tel:+17273866825">727-386-6825</a>
        </p>
        <Footer />
      </main>
    </>
  );
}
