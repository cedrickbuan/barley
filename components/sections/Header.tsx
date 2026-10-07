"use client";

import { useEffect, useState } from "react";
import { business } from "@/content/site";
import { PhoneIcon } from "@/components/ui/icons";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="header"
      data-section
      data-scrolled={scrolled || undefined}
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-cream/90 py-3 text-cocoa shadow-sm backdrop-blur" : "py-5 text-cream"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 md:px-8">
        <a href="#hero" className="font-display text-xl font-semibold tracking-tight md:text-2xl">
          {business.name}
        </a>
        <nav aria-label="Main" className="flex items-center gap-5 text-sm font-medium md:gap-8">
          <a href="#menu" className="hover:underline underline-offset-4">
            Menu
          </a>
          <a href="#visit" data-nav="visit" className="hover:underline underline-offset-4">
            Visit
          </a>
          <a
            href={business.phoneHref}
            data-cta="call"
            className={`hidden items-center gap-2 rounded-full px-5 py-2.5 font-semibold transition-colors md:inline-flex ${
              scrolled ? "bg-cocoa text-cream hover:bg-ink" : "bg-cream text-cocoa hover:bg-crust"
            }`}
          >
            <PhoneIcon />
            Call to order
          </a>
        </nav>
      </div>
    </header>
  );
}
