import Footer from "@/components/footers/Footer";

import Header from "@/components/headers/Header";
import Lookbook from "@/components/otherPages/Lookbook";
import React from "react";

export const metadata = {
  title: "Lookbook || Embel || Luxury by design",
};
export default function LookbookPage() {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <Lookbook />
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <Footer />
    </>
  );
}
