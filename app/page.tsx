import { galleryHeading, hero, menuHeading, showcaseHeading, story, visitHeading } from "@/content/site";

export default function Home() {
  return (
    <>
      <header id="header" data-section />
      <main>
        <section id="hero" data-section>
          <h1>{hero.headline}</h1>
        </section>
        <section id="story" data-section>
          <h2>{story.heading}</h2>
        </section>
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
    </>
  );
}
