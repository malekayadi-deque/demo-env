import Footer from "@/components/footers/Footer";

import Header from "@/components/headers/Header";

import StoreLocator from "@/components/otherPages/StoreLocator";
import React from "react";

export const metadata = {
  title: "Store Location || Embel || Luxury by design",
};
export default function StoreLocationPage() {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <StoreLocator />
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <Footer />
    </>
  );
}
