import { BusinessJsonLd } from "@/components/BusinessJsonLd";
import { Footer } from "@/components/sections/Footer";
import { Gallery } from "@/components/sections/Gallery";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Menu } from "@/components/sections/Menu";
import { Showcase } from "@/components/sections/Showcase";
import { Story } from "@/components/sections/Story";
import { Visit } from "@/components/sections/Visit";
import { MobileActionBar } from "@/components/ui/MobileActionBar";

export default function Home() {
  return (
    <>
      <BusinessJsonLd />
      <Header />
      <main>
        <Hero />
        <Story />
        <Showcase />
        <Menu />
        <Gallery />
        <Visit />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
