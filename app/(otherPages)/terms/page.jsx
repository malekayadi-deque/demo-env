import Footer from "@/components/footers/Footer";

import Header from "@/components/headers/Header";
import Terms from "@/components/otherPages/Terms";
import React from "react";

export const metadata = {
  title: "Terms || Embel || Luxury by design",
};
export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <Terms />
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <Footer />
    </>
  );
}
