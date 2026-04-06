import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import OrderTrack from "@/components/shopCartandCheckout/OrderTrack";
import React from "react";

export default function () {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <OrderTrack />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer />
    </>
  );
}
