"use client";

import { useRef } from "react";
import { CallDirections } from "@/components/ui/CallDirections";
import { business, visitHeading } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { formatAddress, formatTime, mapEmbedUrl } from "@/lib/links";
import { MQ } from "@/lib/motion";

export function Visit() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Deliberately calm: this is the section people act on.
      gsap.matchMedia().add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        gsap.from("[data-visit-fade]", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 75%", toggleActions: "play none none none" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="visit" data-section ref={root} className="bg-cream py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:gap-16 md:px-8">
        <div>
          <span data-visit-fade className="block text-sm font-semibold uppercase tracking-[0.2em] text-caramel">
            Visit us
          </span>
          <h2 data-visit-fade className="mt-4 font-display text-4xl font-semibold leading-tight text-cocoa md:text-6xl">
            {visitHeading}
          </h2>

          <div data-visit-fade className="mt-10">
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-ink/60">Address</h3>
            <address className="mt-2 text-lg not-italic text-ink">{formatAddress(business.address)}</address>
          </div>

          <div data-visit-fade className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-ink/60">Opening hours</h3>
            <dl className="mt-2 divide-y divide-crust text-lg">
              {business.hours.map((row) => (
                <div key={row.days} data-hours-row className="flex justify-between gap-6 py-2">
                  <dt>{row.days}</dt>
                  <dd className="text-ink/80">
                    {formatTime(row.opens)} – {formatTime(row.closes)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div data-visit-fade className="mt-10">
            <CallDirections />
          </div>
        </div>

        <div data-visit-fade className="relative min-h-80 overflow-hidden rounded-3xl ring-1 ring-crust md:min-h-0">
          <iframe
            title={`Map showing ${business.name} in ${business.address.neighborhood}, ${business.address.city}`}
            src={mapEmbedUrl(business.address)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    </section>
  );
}
