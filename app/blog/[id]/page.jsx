import Blog3 from "@/components/blogs/Blog3";
import BlogDetails from "@/components/blogs/BlogDetails";
import Footer from "@/components/footers/Footer";

import Header from "@/components/headers/Header";
import { allBlogs } from "@/data/blogs";
import React from "react";

export default function BlogDetailsPage({ params }) {
  const id = params.id;
  const blog = allBlogs.filter((elm) => elm.id == id)[0] || allBlogs[0];
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <BlogDetails blog={blog} />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer />
    </>
  );
}
