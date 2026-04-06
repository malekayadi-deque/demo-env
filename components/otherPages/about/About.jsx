import Image from "next/image";
import React from "react";

export default function About() {
  return (
    <section className="about-us container">
      <div className="mw-930">
        <h2 className="page-title">ABOUT EMBEL</h2>
      </div>
      <div className="about-us__content pb-5 mb-5">
        <p className="mb-5">
          <Image
            style={{ height: "fit-content" }}
            loading="lazy"
            className="w-100 h-auto d-block"
            src="/assets/images/about/aboutus-banner.jpg"
            width="1410"
            height="550"
            alt="image"
          />
        </p>
        <div className="mw-930">
          <h3 className="mb-4">OUR STORY</h3>
          <p className="fs-6 fw-medium mb-4">
            Welcome to Embel, where craftsmanship meets sustainability. Founded
            in 2003, Embel has been dedicated to creating high-quality,
            sustainable furniture for over two decades. Our commitment to
            excellence is reflected in every piece we design, blending timeless
            elegance with modern functionality.
          </p>
          <p className="mb-4">
            At Embel, we believe that furniture should not only enhance your
            living space but also contribute to a healthier planet. That's why
            we use eco-friendly materials and sustainable practices throughout
            our production process. From sourcing responsibly harvested wood to
            minimizing waste, we ensure that our products are as kind to the
            environment as they are beautiful.
          </p>
          <p className="mb-4">
            Our skilled artisans take pride in their work, meticulously crafting
            each item with attention to detail and a passion for quality.
            Whether you're looking for a statement piece to elevate your home or
            a comfortable, durable addition to your office, Embel offers a wide
            range of furniture to suit your needs.
          </p>
          <div className="row mb-3">
            <div className="col-md-6">
              <h5 className="mb-3">Our Mission</h5>
              <p className="mb-3">
                Join us in our mission to create a more sustainable world, one
                piece of furniture at a time. Discover the difference that
                quality and sustainability can make with Embel.
              </p>
            </div>
            <div className="col-md-6">
              <h5 className="mb-3">Our Vision</h5>
              <p className="mb-3">
                At Embel, we envision a world where sustainable living is the
                norm, and quality furniture enhances every home with both style
                and environmental responsibility. Our goal is to lead the
                industry in eco-friendly practices, creating timeless pieces
                that inspire and support a greener future.
              </p>
            </div>
          </div>
        </div>
        <div className="mw-930 d-lg-flex align-items-lg-center">
          <div className="image-wrapper col-lg-6">
            <Image
              style={{ height: "fit-content" }}
              className="h-auto"
              loading="lazy"
              src="/assets/images/about/aboutus-company.jpg"
              width="450"
              height="500"
              alt="image"
            />
          </div>
          <div className="content-wrapper col-lg-6 px-lg-4">
            <h5 className="mb-3">The Company</h5>
            <p>
              Embel is a pioneering furniture brand established in 2003,
              dedicated to merging high-quality craftsmanship with
              sustainability. Our mission is to create beautiful, durable
              furniture that not only enhances your living spaces but also
              promotes eco-friendly living. With a focus on responsible sourcing
              and innovative design, we strive to set the standard for
              sustainable furniture in the industry. Join us in our journey to
              make the world a greener, more stylish place, one piece of
              furniture at a time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
