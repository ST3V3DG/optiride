import Header from "@/components/header";
import RideDetailsLayout from "@/components/ride-details-layout";
import Footer from "@/components/footer";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <RideDetailsLayout id={id} />
      <Footer />
    </>
  );
}
