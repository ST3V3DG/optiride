import Header from "@/components/header";
import Footer from "@/components/footer";
import RidesClient from "./rides-client";
import Loader from "@/components/loader";
import { Suspense } from "react";

export default function Page() {

  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={<Loader />}>
          <RidesClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
