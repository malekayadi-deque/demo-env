import Blog1 from "@/components/blogs/Blog1";

import Footer from "@/components/footers/Footer";

import Header from "@/components/headers/Header";
import React from "react";

export const metadata = {
  title: "Blog || Embel || Luxury by design",
};
export default function BlogPage1() {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <Blog1 />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer />
    </>
  );
}
