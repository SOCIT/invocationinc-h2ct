import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import WorkbookApp from "@/components/WorkbookApp";

export const metadata: Metadata = {
  title: "Workbook",
  description:
    "The How to Create Time companion workbook as an interactive tool. Your answers stay on your device.",
  robots: { index: false, follow: false },
};

export default function WorkbookAppPage() {
  return (
    <>
      <Header />
      <main className="inner-page lf-wrap" style={{ paddingBottom: 48 }}>
        <WorkbookApp />
        <Footer />
      </main>
    </>
  );
}
