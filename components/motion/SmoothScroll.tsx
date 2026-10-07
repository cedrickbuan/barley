"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Header height to keep clear when scrolling to an in-page anchor. */
const ANCHOR_OFFSET = -72;

/** Any of these means the visitor has taken over scrolling themselves. */
const USER_SCROLL_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

/** How long a shared-link jump must stay undisturbed before we stop guarding it. */
const SETTLE_MS = 1000;

function hashTarget(hash: string): HTMLElement | null {
  if (hash.length < 2) return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null; // Malformed hash, e.g. a link cut off mid "%E0%A4".
  }
}

/** Move keyboard focus to where we scrolled, as the browser's own anchor jump would. */
function focusTarget(el: HTMLElement) {
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
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
    // Sections hydrate and add their pins at different moments; each pin pushes everything below it down, and each
    // section's own ScrollTrigger refresh restores an older scroll position. So while we're heading somewhere we
    // re-aim after any layout change or scroll that wasn't the visitor's. We let go when a click glide arrives,
    // when a shared-link jump has been undisturbed for SETTLE_MS, or as soon as the visitor scrolls themselves.
    let anchor: { el: HTMLElement; immediate: boolean } | null = null;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    const releaseAnchor = () => {
      anchor = null;
      clearTimeout(settleTimer);
    };
    const anchorY = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY + ANCHOR_OFFSET;

    const aim = () => {
      if (!anchor) return;
      const { el, immediate } = anchor;
      if (immediate) {
        // Jump natively: other code may have moved the page since Lenis last looked, and Lenis skips a jump to
        // where it *thinks* it already is. Lenis follows native scrolls by itself.
        window.scrollTo(0, anchorY(el));
        clearTimeout(settleTimer);
        settleTimer = setTimeout(releaseAnchor, SETTLE_MS);
        return;
      }
      lenis.scrollTo(el, {
        offset: ANCHOR_OFFSET,
        force: true,
        // A fixed duration always finishes; the default lerp glide can creep for seconds over the last pixel.
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        onComplete: () => {
          if (anchor?.el !== el) return;
          releaseAnchor();
          focusTarget(el);
        },
      });
    };

    // Re-aim a shared-link jump whenever the page is knocked off target (a scroll restore or a layout shift).
    const keepParked = () => {
      if (anchor?.immediate && Math.abs(window.scrollY - anchorY(anchor.el)) > 4) aim();
    };
    const layoutObserver = new ResizeObserver(keepParked);
    layoutObserver.observe(document.body);

    const hashEl = hashTarget(window.location.hash);
    if (hashEl) anchor = { el: hashEl, immediate: true };

    const onRefresh = () => {
      lenis.resize(); // Lenis caps scrolling at the page height it last measured; pins change that height.
      aim();
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
    window.addEventListener("scroll", keepParked, { passive: true });
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("load", refresh);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      USER_SCROLL_EVENTS.forEach((type) => window.removeEventListener(type, releaseAnchor));
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", keepParked);
      layoutObserver.disconnect();
      clearTimeout(settleTimer);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return children;
}
