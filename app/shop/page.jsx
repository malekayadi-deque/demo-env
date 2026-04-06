import Footer from "@/components/footers/Footer";

import Header from "@/components/headers/Header";
import Shop5 from "@/components/shoplist/Shop";

export const metadata = {
  title: "Shop Products || Embel || Luxury by design",
};
export default function ShopPage() {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <Shop5 />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer />
    </>
  );
}
