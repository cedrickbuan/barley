import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Header } from "@/components/sections/Header";
import { MobileActionBar } from "@/components/ui/MobileActionBar";
import { galleryHeading, menuHeading, showcaseHeading, visitHeading } from "@/content/site";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Story />
        <section id="showcase" data-section>
          <h2>{showcaseHeading}</h2>
        </section>
        <section id="menu" data-section>
          <h2>{menuHeading}</h2>
        </section>
        <section id="gallery" data-section>
          <h2>{galleryHeading}</h2>
        </section>
        <section id="visit" data-section>
          <h2>{visitHeading}</h2>
        </section>
      </main>
      <footer id="footer" data-section />
      <MobileActionBar />
    </>
  );
}
