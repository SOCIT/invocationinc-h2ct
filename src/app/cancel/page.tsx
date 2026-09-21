import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Checkout canceled",
};

export default function CancelPage() {
  return (
    <>
      <Header />
      <main className="inner-page lf-wrap" style={{ paddingBottom: 48 }}>
        <h1>Checkout canceled</h1>
        <p>No charge was made. Return to the offer when you want to try again.</p>
        <p>
          <Link href="/#offer">Back to the offer</Link>
          {" · "}
          <Link href="/">Home</Link>
        </p>
        <Footer />
      </main>
    </>
  );
}
