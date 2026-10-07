"use client";

import Image from "next/image";
import { useRef } from "react";
import { story } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";

export function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        // Heading and image arrive as the section scrolls in, so it never shows as an empty screen...
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", toggleActions: "play none none none" } })
          .from("[data-story-intro]", { y: 30, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power2.out" }, 0)
          .from("[data-story-image]", { x: 120, opacity: 0, duration: 1.1, ease: "power3.out" }, 0);
        // ...then the section holds while the story is told line by line.
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=100%", pin: true, scrub: 0.6 },
          })
          .from("[data-story-line]", { y: 30, opacity: 0, stagger: 0.35, duration: 0.6 });
      });

      mm.add(MQ.mobile, () => {
        gsap.utils.toArray<HTMLElement>("[data-story-intro], [data-story-line], [data-story-image]").forEach((el) => {
          gsap.from(el, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="story" data-section ref={root} className="flex min-h-svh items-center overflow-hidden bg-cream py-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:gap-16 md:px-8">
        <div>
          <span data-story-intro className="block text-sm font-semibold uppercase tracking-[0.2em] text-caramel">
            Our story
          </span>
          <h2 data-story-intro className="mt-4 font-display text-4xl font-semibold leading-tight text-cocoa md:text-5xl">
            {story.heading}
          </h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/80">
            {story.paragraphs.map((text) => (
              <p key={text} data-story-line>
                {text}
              </p>
            ))}
          </div>
        </div>
        <div data-story-image className="relative aspect-[4/5] overflow-hidden rounded-3xl md:aspect-[3/4]">
          <Image
            src={story.image.src}
            alt={story.image.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
