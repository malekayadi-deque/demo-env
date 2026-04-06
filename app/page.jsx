import Features from "@/components/common/features/Features";
import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import BestSelling from "@/components/home/BestSelling";
import Blogs from "@/components/home/Blogs";
import Brands from "@/components/common/brands/Brands";
import Collections from "@/components/home/Collections";
import Hero from "@/components/home/Hero";
import Instagram from "@/components/home/Instagram";
import Lookbook from "@/components/home/Lookbook";
import React from "react";

export const metadata = {
  title: "Home || Embel || Luxury by design",
  description: "",
};
export default function HomePage() {
  return (
    <>
      <Header />

      <main className="page-wrapper">
        <Hero />
        <div className="mb-3 pb-1"></div>
        <Collections />
        <div className="mb-1 pb-4 mb-xl-5 pb-xl-5"></div>
        <BestSelling />
        <div className="mb-5 pb-4"></div>
        <Lookbook />
        <div className="pt-1 pb-5 mt-4 mt-xl-5"></div>
        <Blogs />
        <div className="mb-5 pb-4 pb-xl-5 mb-xl-5"></div>
        <Brands />
        <div className="mb-3 mb-xl-5 pt-1 pb-4"></div>
        <Instagram />
        <div className="mb-3 mb-xl-5"></div>
        <Features />
      </main>
      <Footer />
    </>
  );
}