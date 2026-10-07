# Arley Bakery Website Redesign — Design Spec

**Date:** 2026-10-07
**Status:** Awaiting review

## 1. Goal

Rebuild the Arley Bakery website (currently https://saran-pariyar.github.io/bakeshop-3/) from scratch as a modern single-page site with Apple-style scroll animation.

The site is for a **real bakery**. Its job is to bring customers in. Success means a visitor:

1. sees that the products are **delicious and clean** (large, crisp food imagery), and
2. can easily **visit the shop** (address, hours, map, directions) or **call to order**.

Online ordering is out of scope. The stack is chosen so a database and payments can be added later.

## 2. Decisions

| Topic | Decision |
|---|---|
| Purpose | Real business site, not a showcase |
| Primary actions | Visit the shop, call to order |
| Look and feel | Warm and artisan (cream and brown, serif headings), clean and bright enough to make the food look fresh |
| Imagery | Reuse the 4 large photos from the live site; free stock photos (e.g. Unsplash) for everything else; swapped for real photos later |
| Framework | Next.js (latest, App Router) + TypeScript, chosen for future database/payments |
| Hosting | Vercel |

### Assumptions to confirm with the bakery

- Business details carried over from the live site: name **Arley Bakery**, phone **(773) 222-3333**, address **Pilsen, Chicago, Illinois 60608**. The live site has no street address; one is needed for the map and directions link.
- Opening hours are not on the live site. Placeholder hours are used, clearly marked in `content/site.ts`.
- Ownership or licence of the reused live-site photos needs confirming.
- Menu prices: all items on the live site are $10.99. They are kept as-is until real prices are supplied.

## 3. Technical setup

- **Next.js** (App Router) with **TypeScript**.
- **Tailwind CSS**. Colours and fonts are defined once as design tokens (e.g. `cream`, `cocoa`, `crust`).
- **GSAP + ScrollTrigger** for scroll animation, through `@gsap/react` (`useGSAP`) so animations are scoped and cleaned up with their components.
- **Lenis** for smooth scrolling, synced with ScrollTrigger.
- **`next/image`** for every image: responsive sizes, WebP/AVIF, lazy loading, fixed dimensions (no layout shift).
- **`next/font`**: serif display font for headings (e.g. Fraunces), sans-serif for body text (e.g. Inter).
- **Content in `content/site.ts`**: business details, hours, menu, captions. Later this file can be replaced by a database fetch without changing the components.

## 4. Page structure and animation

| # | Section | Content | Animation (desktop) |
|---|---|---|---|
| 1 | Header | Logo, Call and Visit buttons | Fixed; shrinks and gains a cream background after scrolling starts |
| 2 | Hero | `store.jpg` full screen, headline (e.g. "Baked fresh in Pilsen, every morning"), Call and Directions buttons | Image slowly zooms in on scroll; headline drifts up and fades |
| 3 | Our story | Short About text and `hands.jpg` | Section pinned; text reveals line by line; image slides in |
| 4 | Close-up showcase | 3–4 large food close-ups (stock), each with a short caption | Each image scales from small to full screen in sequence; captions fade in |
| 5 | Menu | Flan, Chocolate Cookies, Chocolate Cupcakes, Gummies: photo, description, price | Cards rise in one by one; slight parallax on photos |
| 6 | Gallery | 6–8 photos (`girl.jpg`, `cupcakes.jpg`, stock) | Horizontal row slides sideways as the page scrolls down |
| 7 | Visit us | Address, opening hours, embedded Google Map, Call and Directions buttons | Simple fade-in |
| 8 | Footer | Contact details, social links, © year | None |

Other rules:

- **Phones:** a fixed bottom bar with **Call** (`tel:` link) and **Directions** (Google Maps link) is always visible.
- **Phone animations are lighter:** less pinning and simpler zooms, set up with `gsap.matchMedia()`.
- **Contact form removed.** Customers call or visit; a form that sends nothing would mislead. A real form can come with the backend.
- Live-site copy is cleaned up: typos fixed, duplicate menu items removed, Lorem ipsum replaced with real-sounding placeholder copy for the bakery to approve.

## 5. Code structure

```
app/
  layout.tsx        fonts, metadata, smooth-scroll provider
  page.tsx          assembles sections in order
  globals.css
components/
  sections/         Header, Hero, Story, Showcase, Menu, Gallery, Visit, Footer
  ui/               Button, MenuCard, MobileActionBar
  motion/           SmoothScroll (Lenis) and shared animation helpers
content/
  site.ts           single source of business content
public/images/      optimised photos + CREDITS.md listing stock photo sources
```

- Each section reads its content from `content/site.ts` and owns its own animation.
- Adding, removing or reordering a section is a change to `page.tsx` only.

## 6. Robustness and accessibility

- **Progressive enhancement:** all content is visible without JavaScript. Animations only add motion; initial hidden states are applied by JS, not CSS.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, pinning, scaling, parallax and Lenis are disabled and reveals become simple fades or none.
- Every image has descriptive `alt` text; decorative images use empty `alt`.
- Buttons and links are keyboard-accessible with visible focus styles; colour contrast meets WCAG AA.
- **SEO:** page title and description, Open Graph image, and `LocalBusiness`/`Bakery` JSON-LD structured data (address, hours, phone).

## 7. Testing and verification

- `npm run build` and `npm run lint` pass with no errors.
- **Playwright** smoke tests:
  - page loads and all 8 sections are present;
  - Call buttons link to `tel:+17732223333`;
  - Directions link and map point to the configured address;
  - with reduced motion emulated, all section content is visible.
- Manual check in the browser at phone (375px) and desktop widths, with reduced motion on and off.
- **Lighthouse** target: 90+ for performance and accessibility on the production build.

## 8. Out of scope

- Online ordering, checkout, payments, database, CMS.
- Working contact form.
- Multiple pages or languages.
- Final photography and final copy (supplied by the bakery later).
