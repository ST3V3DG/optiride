import Header from "@/components/header";
import Footer from "@/components/footer";
import RidesClient from "./rides-client";

export default function Page() {

  return (
    <>
      <Header />
      <main className="flex-1">
        <RidesClient />
      </main>
      <Footer />
    </>
  );
}
