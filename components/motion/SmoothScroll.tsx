"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Header height to keep clear when scrolling to an in-page anchor. */
const ANCHOR_OFFSET = -72;

/** Any of these means the visitor has taken over scrolling themselves. */
const USER_SCROLL_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

function hashTarget(hash: string): HTMLElement | null {
  return hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Fonts and late images can shift layout; recompute pinned-section positions once everything has loaded.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No pins and no Lenis: native anchor jumps (with scroll-margin-top) are already correct.
      return () => window.removeEventListener("load", refresh);
    }

    const lenis = new Lenis({ autoRaf: false });
    const raf = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // The section we're heading to: from a shared `/#visit` link, or an in-page link click.
    // Sections hydrate and add their pins at different moments, and each pin pushes everything below it down,
    // so re-aim after every ScrollTrigger refresh until the visitor scrolls on their own.
    let anchor: { el: HTMLElement; immediate: boolean } | null = null;
    const hashEl = hashTarget(window.location.hash);
    if (hashEl) anchor = { el: hashEl, immediate: true };

    const aim = () => {
      if (anchor) lenis.scrollTo(anchor.el, { offset: ANCHOR_OFFSET, immediate: anchor.immediate, force: true });
    };
    const onRefresh = () => {
      lenis.resize(); // Lenis caps scrolling at the page height it last measured; pins change that height.
      aim();
    };
    const releaseAnchor = () => {
      anchor = null;
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const href = (e.target as Element | null)?.closest?.('a[href^="#"]')?.getAttribute("href");
      const el = href ? hashTarget(href) : null;
      if (!el) return;
      e.preventDefault(); // The browser's own jump would fight the Lenis glide.
      history.pushState(null, "", href);
      anchor = { el, immediate: false };
      aim();
    };

    ScrollTrigger.addEventListener("refresh", onRefresh);
    USER_SCROLL_EVENTS.forEach((type) => window.addEventListener(type, releaseAnchor, { passive: true }));
    document.addEventListener("click", onClick);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("load", refresh);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      USER_SCROLL_EVENTS.forEach((type) => window.removeEventListener(type, releaseAnchor));
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return children;
}
