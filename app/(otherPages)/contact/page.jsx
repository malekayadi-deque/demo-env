import Footer from "@/components/footers/Footer";

import Header from "@/components/headers/Header";
import Contact from "@/components/otherPages/Contact/Contact";
import LocationMap from "@/components/otherPages/Contact/LocationMap";

import React from "react";

export const metadata = {
  title: "Contact || Embel || Luxury by design",
};
export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="contact-us container">
          <div className="mw-930">
            <h2 className="page-title">CONTACT US</h2>
          </div>
        </section>

        <section className="google-map mb-5">
          <h2 className="d-none">Contact US</h2>
          <div id="map" className="google-map__wrapper">
            <LocationMap />
          </div>
        </section>
        <Contact />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer />
    </>
  );
}
