"use client";

import { useRef } from "react";
import { MenuCard } from "@/components/ui/MenuCard";
import { business, menu, menuHeading } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";

export function Menu() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const rise = () =>
        gsap.from("[data-menu-item]", {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-menu-grid]", start: "top 80%", toggleActions: "play none none none" },
        });

      mm.add(MQ.desktop, () => {
        rise();
        gsap.utils.toArray<HTMLElement>("[data-menu-parallax]").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
      mm.add(MQ.mobile, rise);
    },
    { scope: root },
  );

  return (
    <section id="menu" data-section ref={root} className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="max-w-2xl">
          <span className="block text-sm font-semibold uppercase tracking-[0.2em] text-caramel">Baked daily</span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-cocoa md:text-6xl">{menuHeading}</h2>
          <p className="mt-5 text-lg text-ink/75">
            Want a big order or something special? Call us on{" "}
            <a href={business.phoneHref} data-cta="call" className="font-semibold text-cocoa underline underline-offset-4">
              {business.phoneDisplay}
            </a>{" "}
            and we&apos;ll have it ready.
          </p>
        </div>
        <div data-menu-grid className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {menu.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
