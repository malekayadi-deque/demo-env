import Footer from "@/components/footers/Footer";

import Header from "@/components/headers/Header";
import About from "@/components/otherPages/about/About";
import Clients from "@/components/otherPages/about/Clients";
import Services from "@/components/otherPages/about/Services";
import React from "react";

export const metadata = {
  title: "About || Embel || Luxury by design",
};
export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <About />
        <Services />
        <Clients />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer />
    </>
  );
}
