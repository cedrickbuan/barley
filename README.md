# Arley Bakery website

Single-page site for Arley Bakery (Pilsen, Chicago), built with Next.js, Tailwind CSS, GSAP (ScrollTrigger) and Lenis smooth scrolling.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Edit content

All text, opening hours, prices, phone, address and photo references live in `content/site.ts`. Photos are in `public/images/` (sources and licences in `public/images/CREDITS.md`).

## Before launch: details to get from the bakery

These are placeholders in `content/site.ts` (search for `PLACEHOLDER`):

- **Street address**: only "Pilsen, Chicago, IL 60608" is known, so the map and Directions button point at the neighbourhood, not the shop.
- **Opening hours**
- **Prices**: every item is $10.99, copied from the old site.
- **Photo rights**: confirm the bakery owns `store.jpg`, `hands.jpg`, `girl.jpg` and `cupcakes.jpg` (taken from the old site).

## Checks

```bash
npm run lint
npm run build
npm run test:e2e
```

`test:e2e` builds the production site and runs Playwright on port 3100, at desktop (1280px) and phone (375px) sizes.

## How the animation works

- Each section in `components/sections/` owns its own GSAP timeline, set up with `useGSAP` and `gsap.matchMedia()` (breakpoints in `lib/motion.ts`).
- Nothing animates when the visitor has "reduce motion" turned on, and all content is visible without JavaScript: start states are set by GSAP at runtime, never in CSS.
- `components/motion/SmoothScroll.tsx` runs Lenis and keeps it in sync with ScrollTrigger, and handles in-page links (`#menu`, `#visit`) so they land correctly despite the pinned sections.

## Deploy

Push the repository to GitHub and import it at https://vercel.com/new. No configuration is needed.
