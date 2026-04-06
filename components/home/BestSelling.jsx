"use client";
const filterCategories4 = ["Kitchen", "Storage", "Bedroom", "Dining Room"];
import { useContextElement } from "@/context/Context";
import { products52 } from "@/data/products/fashion";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import ActionBtn from "../common/ActionBtn";
import { useRouter } from "next/navigation";

const products = [...products52];

export default function BestSelling() {
  const { toggleWishlist, isAddedtoWishlist } = useContextElement();
  const { addProductToCart, isAddedToCartProducts } = useContextElement();
  const [currentCategory, setCurrentCategory] = useState(filterCategories4[0]);
  const [filtered, setFiltered] = useState(products);
  const router = useRouter();
  useEffect(() => {
    
    if (currentCategory == "All") {
      setFiltered(products);
    } else {
      setFiltered([
        ...products.filter((elm) => elm.category == currentCategory),
      ]);
    }
    
  }, [currentCategory]);

  return (
    <section className="products-carousel container">
      <h2 className="section-title text-center fw-normal text-uppercase mb-1 mb-md-3 pb-xl-3">
        Best Selling Products
      </h2>

      <ul
        className="nav nav-tabs mb-3 pb-3 mb-xl-4 text-uppercase justify-content-center"
        id="collections-tab"
        role="tablist"
      >
        {filterCategories4.map((elm, i) => (
          <li
            onClick={() => setCurrentCategory(elm)}
            key={i}
            className="nav-item"
            role="presentation"
          >
            <a
              className={`nav-link nav-link_underscore ${
                currentCategory == elm ? "active" : ""
              }`}
            >
              {elm}
            </a>
          </li>
        ))}
      </ul>

      <div className="tab-content pt-2" id="collections-tab-content">
        <div
          className="tab-pane fade show active"
          id="collections-tab-1"
          role="tabpanel"
          aria-labelledby="collections-tab-1-trigger"
        >
          <div className="row">
            {filtered.map((elm, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-3">
                <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                  <div className="pc__img-wrapper">
                    <a onClick={()=> router.push(`/product/${elm.id}`)}>
                      <Image
                        loading="lazy"
                        src={elm.imgSrc}
                        width="330"
                        height="400"
                        className="pc__img"
                      />
                    </a>
                    <ActionBtn
                      onClick={() => addProductToCart(elm.id)}
                      title={
                        isAddedToCartProducts(elm.id)
                          ? "Already Added"
                          : "Add to Cart"
                      }
                    >
                      <svg
                        className="d-inline-blockk align-middle mx-2"
                        width="14"
                        height="14"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use
                          href={`${
                            isAddedToCartProducts(elm.id)
                              ? "#icon_cart_added"
                              : "#icon_cart"
                          }`}
                        />
                      </svg>
                      <span className="d-inline-block align-middle">
                        {isAddedToCartProducts(elm.id)
                          ? "Already Added"
                          : "Add To Cart"}
                      </span>
                    </ActionBtn>
                  </div>

                  <div className="pc__info position-relative">
                    <p className="pc__category">{elm.category}</p>
                    <h6 className="pc__title mb-2">
                      <Link href={`/product/${elm.id}`}>
                        {elm.title}
                      </Link>
                    </h6>
                    <div className="product-card__price d-flex">
                      <span className="money price">${elm.price}</span>
                    </div>

                    <button
                      className={`pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist ${
                        isAddedtoWishlist(elm.id) ? "active" : ""
                      }`}
                      onClick={() => toggleWishlist(elm.id)}
                      title="Add To Wishlist"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href="#icon_heart" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* <!-- /.row --> */}
          <div className="text-center mt-2">
            <Link
              className="btn-link btn-link_lg default-underline text-uppercase fw-medium"
              href="/shop"
            >
              See All Products
            </Link>
          </div>
        </div>
      </div>
      {/* <!-- /.tab-content pt-2 --> */}
    </section>
  );
}
