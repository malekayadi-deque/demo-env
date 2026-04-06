import Footer from "@/components/footers/Footer";

import Header from "@/components/headers/Header";
import RelatedSlider from "@/components/singleProduct/RelatedSlider";
import SingleProduct16 from "@/components/singleProduct/SingleProduct16";
import React from "react";
import { allProducts } from "@/data/products";

export const metadata = {
  title: "Out Of Stock || Embel || Luxury by design",
};
export default function ProductDetailsPage6({ params }) {
  const productId = params.id;
  const product =
    allProducts.filter((elm) => elm.id == productId)[0] || allProducts[0];
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-md-1 pb-md-3"></div>
        <SingleProduct16 product={product} />
        <RelatedSlider />
      </main>
      <Footer />
    </>
  );
}
