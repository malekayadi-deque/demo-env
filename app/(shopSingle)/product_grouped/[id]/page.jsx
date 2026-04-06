import Footer from "@/components/footers/Footer";

import Header from "@/components/headers/Header";
import RelatedSlider from "@/components/singleProduct/RelatedSlider";
import SingleProduct14 from "@/components/singleProduct/SingleProduct14";
import React from "react";
import { allProducts } from "@/data/products";

export const metadata = {
  title: "Shop Grouped Products || Embel || Luxury by design",
};
export default function ProductDetailsPage4({ params }) {
  const productId = params.id;
  const product =
    allProducts.filter((elm) => elm.id == productId)[0] || allProducts[0];
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-md-1 pb-md-3"></div>
        <SingleProduct14 product={product} />
        <RelatedSlider />
      </main>
      <Footer />
    </>
  );
}
