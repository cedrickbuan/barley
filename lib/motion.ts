// Media queries for gsap.matchMedia(). Nothing animates when reduced motion is requested.
export const MQ = {
  desktop: "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
  mobile: "(prefers-reduced-motion: no-preference) and (max-width: 767px)",
} as const;
