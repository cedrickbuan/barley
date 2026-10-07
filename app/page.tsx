import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Showcase } from "@/components/sections/Showcase";
import { Menu } from "@/components/sections/Menu";
import { Gallery } from "@/components/sections/Gallery";
import { Header } from "@/components/sections/Header";
import { MobileActionBar } from "@/components/ui/MobileActionBar";
import { visitHeading } from "@/content/site";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Story />
        <Showcase />
        <Menu />
        <Gallery />
        <section id="visit" data-section>
          <h2>{visitHeading}</h2>
        </section>
      </main>
      <footer id="footer" data-section />
      <MobileActionBar />
    </>
  );
}
