"use client";

import Image from "next/image";
import { useRef } from "react";
import { CallDirections } from "@/components/ui/CallDirections";
import { hero } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const scrub = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };

      mm.add(MQ.desktop, () => {
        gsap.to("[data-hero-image]", { scale: 1.15, ease: "none", scrollTrigger: scrub });
        gsap.to("[data-hero-copy]", { y: -80, opacity: 0, ease: "none", scrollTrigger: scrub });
      });
      mm.add(MQ.mobile, () => {
        gsap.to("[data-hero-image]", { scale: 1.08, ease: "none", scrollTrigger: scrub });
      });
    },
    { scope: root },
  );

  return (
    <section id="hero" data-section ref={root} className="relative flex min-h-svh items-end overflow-hidden">
      <div data-hero-image className="absolute inset-0">
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          preload
          sizes="100vw"
          className="object-cover object-[70%_50%] md:object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/20" aria-hidden />
      <div
        data-hero-copy
        className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-32 text-cream md:px-8 md:pb-28"
      >
        <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
          {hero.headline}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-cream/90 md:text-xl">{hero.subhead}</p>
        <CallDirections onDark className="mt-10" />
      </div>
    </section>
  );
}
