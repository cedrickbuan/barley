"use client";

import Image from "next/image";
import { useRef } from "react";
import { showcase, showcaseHeading } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";

const CLIP_SMALL = "inset(18% 24% round 28px)";
const CLIP_FULL = "inset(0% 0% round 0px)";

export function Showcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const figures = gsap.utils.toArray<HTMLElement>("[data-slide]");
      const media = (f: HTMLElement) => f.querySelector("[data-slide-media]");
      const caption = (f: HTMLElement) => f.querySelector("[data-slide-caption]");

      mm.add(MQ.desktop, () => {
        // Stack every slide in one full-screen stage; matchMedia reverts these sets when the query stops matching.
        gsap.set("[data-stage]", { height: "100svh" });
        gsap.set(figures, { position: "absolute", inset: 0, height: "100%" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: "[data-stage]",
            start: "top top",
            end: `+=${figures.length * 100}%`,
            pin: true,
            scrub: 0.6,
          },
        });

        figures.forEach((fig, i) => {
          if (i > 0) tl.to(caption(figures[i - 1]), { autoAlpha: 0, duration: 0.3 });
          tl.fromTo(
            media(fig),
            { clipPath: CLIP_SMALL, scale: 0.9, autoAlpha: i === 0 ? 1 : 0 },
            { clipPath: CLIP_FULL, scale: 1, autoAlpha: 1, duration: 1 },
          ).fromTo(caption(fig), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5 }).to({}, { duration: 0.4 });
        });
      });

      mm.add(MQ.mobile, () => {
        figures.forEach((fig) => {
          gsap
            .timeline({ scrollTrigger: { trigger: fig, start: "top 80%", toggleActions: "play none none none" } })
            .from(media(fig), { scale: 0.92, duration: 0.9, ease: "power2.out" })
            .from(caption(fig), { autoAlpha: 0, y: 24, duration: 0.6, ease: "power2.out" }, "-=0.4");
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="showcase" data-section ref={root} className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-24 text-center md:px-8 md:py-32">
        <span className="block text-sm font-semibold uppercase tracking-[0.2em] text-caramel">Fresh today</span>
        <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-cocoa md:text-6xl">{showcaseHeading}</h2>
      </div>
      <div data-stage className="relative overflow-hidden">
        {showcase.map((slide) => (
          <figure key={slide.image.src} data-slide className="relative h-[85svh] md:h-svh">
            <div data-slide-media className="absolute inset-0 overflow-hidden">
              <Image src={slide.image.src} alt={slide.image.alt} fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" aria-hidden />
            </div>
            <figcaption
              data-slide-caption
              className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-14 font-display text-3xl font-semibold leading-tight text-cream md:px-8 md:pb-20 md:text-6xl"
            >
              {slide.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
