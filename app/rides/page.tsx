import Header from "@/components/header";
import Footer from "@/components/footer";
import RidesList from "@/components/rides-list";
import { Suspense } from "react";
import Loader from "@/components/loader";

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={<Loader />}>
          <RidesList />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
