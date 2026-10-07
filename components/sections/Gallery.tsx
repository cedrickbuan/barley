"use client";

import Image from "next/image";
import { useRef } from "react";
import { gallery, galleryHeading } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: vertical scroll drives the row sideways. Everywhere else the row is a native swipeable strip.
      mm.add(MQ.desktop, () => {
        const el = track.current!;
        gsap.set(el, { overflowX: "visible", scrollSnapType: "none" });
        const distance = () => Math.max(0, el.scrollWidth - el.clientWidth);
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="gallery" data-section ref={root} className="flex min-h-svh flex-col justify-center overflow-hidden bg-crust/40 py-24">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <span className="block text-sm font-semibold uppercase tracking-[0.2em] text-caramel">Gallery</span>
        <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-cocoa md:text-6xl">{galleryHeading}</h2>
      </div>
      <div
        ref={track}
        data-gallery-track
        className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:gap-8 md:px-[max(2rem,calc((100vw-72rem)/2+2rem))]"
      >
        {gallery.map((photo) => (
          <div
            key={photo.src}
            className="relative aspect-[4/5] w-[78vw] shrink-0 snap-start overflow-hidden rounded-3xl sm:w-[46vw] md:w-[30vw]"
          >
            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 30vw, 78vw" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
