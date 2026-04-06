import Footer from "@/components/footers/Footer";

import Header from "@/components/headers/Header";
import DashboardSidebar from "@/components/otherPages/DashboardSidebar";
import EditAccount from "@/components/otherPages/EditAccount";
import React from "react";

export const metadata = {
  title: "Dashboard Account Edit || Embel || Luxury by design",
};
export default function AccountEditPage() {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">Account Details</h2>
          <div className="row">
            <DashboardSidebar />
            <EditAccount />
          </div>
        </section>
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <Footer />
    </>
  );
}
