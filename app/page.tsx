import Header from "@/components/header";
import Hero from "@/components/sections/hero/default";
import Items from "@/components/sections/items/default";
import Logos from "@/components/sections/logos/default";
import Stats from "@/components/sections/stats/default";
import Pricing from "@/components/sections/pricing/default";
import CTA from "@/components/sections/cta/default";
import Footer from "@/components/footer";

export default function Page() {
  return (
    <>
      <Header />
      <Hero />
      <Logos />
      <Items />
      <Stats />
      <Pricing />
      <CTA />
      <Footer />
    </>
  )
}