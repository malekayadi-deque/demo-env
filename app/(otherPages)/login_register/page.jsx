import Footer from "@/components/footers/Footer";

import Header from "@/components/headers/Header";
import LoginRegister from "@/components/otherPages/LoginRegister";
import React from "react";

export const metadata = {
  title: "Login & Register || Embel || Luxury by design",
};
export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <LoginRegister />
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <Footer />
    </>
  );
}
