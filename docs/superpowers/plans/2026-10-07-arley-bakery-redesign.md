# Arley Bakery Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page Next.js site for Arley Bakery with Apple-style scroll animation, whose main jobs are showing the food and getting people to visit or call.

**Architecture:** Next.js App Router page made of independent section components. All business content lives in `content/site.ts`. Each animated section is a client component that owns its GSAP timeline through `useGSAP` and `gsap.matchMedia()`. Lenis provides smooth scrolling and is synced to ScrollTrigger in one provider. Hidden start states are set by GSAP at runtime, so content is visible without JS or with reduced motion.

**Tech Stack:** Next.js (latest, App Router), TypeScript, Tailwind CSS, GSAP + ScrollTrigger + `@gsap/react`, Lenis, `next/image`, `next/font` (Fraunces, Inter), Playwright.

**Spec:** `docs/superpowers/specs/2026-10-07-arley-bakery-redesign-design.md`

## Global Constraints

- Business name: `Arley Bakery`. Phone display: `(773) 222-3333`; phone link: `tel:+17732223333`.
- Address: neighbourhood `Pilsen`, city `Chicago`, region `IL`, postal code `60608`. Street address is a **placeholder** until the bakery confirms it; mark it with a `// PLACEHOLDER` comment.
- Opening hours are a **placeholder**; mark with `// PLACEHOLDER`.
- Menu: exactly 4 items — Flan, Chocolate Cookies, Chocolate Cupcakes, Gummies — each `$10.99` until real prices arrive. Fix live-site typos ("chololate", "flan.The").
- Section order and `id`s: `header`, `hero`, `story`, `showcase`, `menu`, `gallery`, `visit`, `footer`.
- No contact form. No online ordering.
- Every image goes through `next/image` with explicit `width`/`height` (or `fill` with a sized parent) and an `alt`.
- Content must never depend on JS to become visible: no CSS that starts elements at `opacity: 0`. Start states come from `gsap.from()` / `gsap.set()` inside `useGSAP`.
- All motion is inside `gsap.matchMedia()` under `(prefers-reduced-motion: no-preference)`; Lenis is not started when reduced motion is set.
- Design tokens (Tailwind theme): `cream #FBF6EE`, `crust #E9D8BE`, `cocoa #3B2416`, `caramel #B5733A`, `ink #1F1712`. Text on cream uses `cocoa` or `ink` (WCAG AA).
- Downloading files requires the user's explicit OK in chat (list file names, source, approximate size) before running the download.
- Lighthouse on the production build: Performance ≥ 90, Accessibility ≥ 90.

## Review Focus

1. **Reduced motion:** with `prefers-reduced-motion: reduce`, every section's text and images are visible with no scrolling tricks → `tests/e2e/a11y-motion.spec.ts` (Task 3, extended by each section task).
2. **JavaScript disabled:** all section content is visible and Call/Directions links work → `tests/e2e/no-js.spec.ts` (Task 3).
3. **Phone width (375px) horizontal overflow:** the sideways gallery and pinned sections must not make the page scroll horizontally → assertion `document.documentElement.scrollWidth <= 375` in `tests/e2e/mobile.spec.ts` (Task 4, re-run in Tasks 9 and 11).
4. **Anchor navigation with Lenis and pinned sections:** clicking "Visit" in the header must land on `#visit` with its heading in view, even though pinning adds scroll distance → `tests/e2e/navigation.spec.ts` (Task 10).
5. **Viewport resize after load (rotate phone, resize window):** ScrollTrigger positions must refresh so the Visit section is still reachable and visible → resize test in `tests/e2e/navigation.spec.ts` (Task 10).

---

## File Structure

```
app/layout.tsx                    fonts, metadata, <SmoothScroll>, JSON-LD
app/page.tsx                      renders sections in order
app/globals.css                   Tailwind import, base styles, focus styles
content/site.ts                   business, hours, menu, story, showcase, gallery data + types
lib/gsap.ts                       registers ScrollTrigger; re-exports gsap, ScrollTrigger, useGSAP
lib/motion.ts                     media-query constants
lib/links.ts                      directionsUrl(), mapEmbedUrl(), formatPrice()
components/motion/SmoothScroll.tsx  Lenis provider synced with ScrollTrigger
components/ui/Button.tsx          link-styled button (primary | secondary)
components/ui/CallDirections.tsx  Call + Directions button pair
components/ui/MenuCard.tsx
components/ui/MobileActionBar.tsx
components/sections/{Header,Hero,Story,Showcase,Menu,Gallery,Visit,Footer}.tsx
public/images/*                   photos; public/images/CREDITS.md
tests/e2e/*.spec.ts               Playwright tests
playwright.config.ts
```

---

### Task 1: Project scaffold, design tokens and content model

**Files:**
- Create: Next.js app (via `create-next-app`), `content/site.ts`, `lib/links.ts`, `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `playwright.config.ts`, `tests/e2e/smoke.spec.ts`
- Create: `.gitignore` (from scaffold), `README.md` (how to run, where to edit content)

**Interfaces:**
- Produces (`content/site.ts`):
  ```ts
  export type ImageAsset = { src: string; alt: string; width: number; height: number };
  export type Address = { street: string; neighborhood: string; city: string; region: string; postalCode: string };
  export type OpeningHours = { days: string; opens: string; closes: string }[]; // opens/closes "HH:MM" 24h
  export type MenuItem = { id: string; name: string; description: string; price: number; image: ImageAsset };
  export type ShowcaseSlide = { image: ImageAsset; caption: string };
  export const business: { name: string; tagline: string; phoneDisplay: string; phoneHref: string; address: Address; hours: OpeningHours; social: { label: string; href: string }[] };
  export const story: { heading: string; paragraphs: string[]; image: ImageAsset };
  export const hero: { headline: string; subhead: string; image: ImageAsset };
  export const showcase: ShowcaseSlide[];   // 3–4 slides
  export const menu: MenuItem[];            // exactly 4
  export const gallery: ImageAsset[];       // 6–8
  ```
- Produces (`lib/links.ts`): `directionsUrl(a: Address): string` (Google Maps `https://www.google.com/maps/dir/?api=1&destination=<encoded>`), `mapEmbedUrl(a: Address): string` (`https://www.google.com/maps?q=<encoded>&output=embed`), `formatPrice(n: number): string` (`10.99` → `"$10.99"`).
- Image paths in this task point at `/images/...` file names that Task 2 will supply; until then use any temporary local image.

- [ ] **Step 1:** Scaffold: `npx create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm`. Then `npm i gsap @gsap/react lenis` and `npm i -D @playwright/test && npx playwright install chromium`.
- [ ] **Step 2:** Add Tailwind theme tokens from Global Constraints (colours `cream`, `crust`, `cocoa`, `caramel`, `ink`; fonts `display` = Fraunces, `sans` = Inter via `next/font` CSS variables). `body` uses `bg-cream text-ink`.
- [ ] **Step 3:** Configure `playwright.config.ts`: `testDir: tests/e2e`, `webServer: { command: 'npm run build && npm run start', port: 3000, reuseExistingServer: true, timeout: 180_000 }`, projects `desktop` (1280×800) and `mobile` (375×812, `isMobile: true`). Add `"test:e2e": "playwright test"` to `package.json`.
- [ ] **Step 4: Write failing test** `tests/e2e/smoke.spec.ts`:
  ```ts
  test('page has title and all sections in order', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Arley Bakery/);
    const ids = await page.locator('[data-section]').evaluateAll(els => els.map(e => e.id));
    expect(ids).toEqual(['header','hero','story','showcase','menu','gallery','visit','footer']);
  });
  ```
- [ ] **Step 5:** Run `npx playwright test smoke` → FAIL (title / sections missing).
- [ ] **Step 6:** Write `content/site.ts` with the spec's copy (typos fixed, no Lorem ipsum), `lib/links.ts`, metadata title `Arley Bakery — Fresh bakes in Pilsen, Chicago`, and a `page.tsx` that renders 8 placeholder `<section id=… data-section>` elements (Header uses `<header>`, Footer `<footer>`, both with `data-section`).
- [ ] **Step 7:** Run `npx playwright test smoke` → PASS on both projects; `npm run lint` → no errors.
- [ ] **Step 8:** Commit `feat: scaffold Next.js app with design tokens and content model`.

### Task 2: Images

**Files:**
- Create: `public/images/*.jpg`, `public/images/CREDITS.md`
- Modify: `content/site.ts` (real paths, dimensions, alt text)

**Interfaces:**
- Consumes: `ImageAsset` from Task 1.
- Produces: final image files referenced by `content/site.ts`.

- [ ] **Step 1:** **Ask the user for permission** to download: `store.jpg`, `hands.jpg`, `girl.jpg`, `cupcakes.jpg` from `https://saran-pariyar.github.io/bakeshop-3/img/` (each is 3600–6720px wide, likely several MB), plus the chosen Unsplash photos (list each URL). Wait for yes.
- [ ] **Step 2:** Download into a scratch folder, then resize to max 2400px on the long edge, JPEG quality ~80 (`sips -Z 2400 -s formatOptions 80`), and place in `public/images/`. Choose stock: 3–4 close-ups for the showcase (bread/pastry, cookies, cupcakes, flan or similar), 4 menu photos (flan, chocolate cookies, chocolate cupcakes, gummies), and 2–4 extra gallery photos.
- [ ] **Step 3:** Write `public/images/CREDITS.md`: one line per file — file name, source URL, author, licence. Note that the 4 live-site photos need ownership confirmed by the bakery.
- [ ] **Step 4:** Update `content/site.ts` with real `src`, `width`, `height` (`sips -g pixelWidth -g pixelHeight`) and descriptive `alt` text.
- [ ] **Step 5:** Run `npm run build` → succeeds; `ls -la public/images` → no file over 1 MB.
- [ ] **Step 6:** Commit `feat: add optimised bakery photos with credits`.

### Task 3: Motion foundation (GSAP, Lenis, reduced motion, no-JS)

**Files:**
- Create: `lib/gsap.ts`, `lib/motion.ts`, `components/motion/SmoothScroll.tsx`, `tests/e2e/a11y-motion.spec.ts`, `tests/e2e/no-js.spec.ts`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces (`lib/gsap.ts`, `'use client'`): registers `ScrollTrigger` and `useGSAP` once; `export { gsap, ScrollTrigger, useGSAP }`. Every section imports from here, never from `gsap` directly.
- Produces (`lib/motion.ts`):
  ```ts
  export const MQ = {
    desktop: '(prefers-reduced-motion: no-preference) and (min-width: 768px)',
    mobile:  '(prefers-reduced-motion: no-preference) and (max-width: 767px)',
  } as const;
  ```
- Produces: `<SmoothScroll>{children}</SmoothScroll>` — starts Lenis only when reduced motion is not set; drives Lenis from `gsap.ticker`, calls `ScrollTrigger.update` on Lenis scroll, sets `gsap.ticker.lagSmoothing(0)`; destroys on unmount. Adds class `lenis` to `<html>` only when active. Exposes the instance via `useLenis(): Lenis | null` (React context) for anchor scrolling in Task 10.

- [ ] **Step 1: Write failing tests.**
  `a11y-motion.spec.ts` (with `test.use({ reducedMotion: 'reduce' })`):
  ```ts
  test('reduced motion: no smooth scroll, all sections visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/lenis/);
    for (const id of ['hero','story','showcase','menu','gallery','visit']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id} h1, #${id} h2`).first()).toBeVisible();
      expect(await page.locator(`#${id} h1, #${id} h2`).first().evaluate(e => getComputedStyle(e).opacity)).toBe('1');
    }
  });
  ```
  Plus, without reduced motion: `test('smooth scroll active by default')` → `html` has class `lenis` (desktop project only).
  `no-js.spec.ts` (with `test.use({ javaScriptEnabled: false })`): same per-section heading visibility/opacity loop.
- [ ] **Step 2:** Run both → FAIL (headings don't exist yet / no `lenis` class). Give each placeholder section from Task 1 its real `<h1>`/`<h2>` from `content/site.ts` so only the `lenis` assertion fails.
- [ ] **Step 3:** Implement `lib/gsap.ts`, `lib/motion.ts`, `SmoothScroll`, and wrap `app/layout.tsx` body.
- [ ] **Step 4:** Run `npx playwright test a11y-motion no-js` → PASS.
- [ ] **Step 5:** Commit `feat: add GSAP and Lenis smooth scroll with reduced-motion support`.

**Pattern every animated section follows (Tasks 5–9):**
```tsx
'use client';
const root = useRef<HTMLElement>(null);
useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add(MQ.desktop, () => { /* full timeline */ });
  mm.add(MQ.mobile,  () => { /* lighter timeline, no pinning */ });
}, { scope: root });
```

### Task 4: Header, buttons and mobile action bar

**Files:**
- Create: `components/ui/Button.tsx`, `components/ui/CallDirections.tsx`, `components/ui/MobileActionBar.tsx`, `components/sections/Header.tsx`, `tests/e2e/contact-links.spec.ts`, `tests/e2e/mobile.spec.ts`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `Button({ href, variant = 'primary' | 'secondary', children, external? })` — an `<a>` with visible focus ring (`focus-visible:outline caramel`). `external` adds `target="_blank" rel="noopener"`.
- Produces: `CallDirections({ className? })` — two `Button`s: "Call (773) 222-3333" → `business.phoneHref`; "Get directions" → `directionsUrl(business.address)` (external). Both have `data-cta="call"` / `data-cta="directions"`.
- Produces: `MobileActionBar` — fixed bottom bar, `md:hidden`, `data-mobile-bar`, contains "Call" and "Directions" with the same `data-cta` attributes. Page bottom padding prevents it from covering the footer.
- Header: logo text, links "Menu" → `#menu`, "Visit" → `#visit` (`data-nav="visit"`), and a Call button. Fixed; after `scrollY > 40` it gets `data-scrolled` and the cream background + smaller height (a scroll listener or a ScrollTrigger toggle; no CSS-hidden content).

- [ ] **Step 1: Write failing tests.**
  `contact-links.spec.ts`:
  ```ts
  test('every Call link dials the bakery', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page.locator('[data-cta="call"]').evaluateAll(a => a.map(x => x.getAttribute('href')));
    expect(hrefs.length).toBeGreaterThan(0);
    expect(new Set(hrefs)).toEqual(new Set(['tel:+17732223333']));
  });
  test('every Directions link targets Google Maps for Chicago 60608', async ({ page }) => { /* each href starts with https://www.google.com/maps/dir/ and contains 60608 */ });
  ```
  `mobile.spec.ts` (mobile project only):
  ```ts
  test('action bar visible and no horizontal overflow', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-mobile-bar]')).toBeVisible();
    await page.mouse.wheel(0, 3000);
    await expect(page.locator('[data-mobile-bar]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  });
  ```
  Desktop: `[data-mobile-bar]` is hidden.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement the components; render `Header` and `MobileActionBar` in `page.tsx`.
- [ ] **Step 4:** Run `npx playwright test contact-links mobile` → PASS.
- [ ] **Step 5:** Commit `feat: add header, call/directions buttons and mobile action bar`.

### Task 5: Hero

**Files:** Create `components/sections/Hero.tsx`; Modify `app/page.tsx`; Test `tests/e2e/sections.spec.ts`

**Interfaces:** Consumes `hero`, `CallDirections`, `MQ`, `useGSAP`.

- [ ] **Step 1: Failing test** in `sections.spec.ts`: `test('hero shows headline, image and CTAs')` → `#hero h1` has text `hero.headline` ("Baked fresh in Pilsen, every morning"); `#hero img` has non-empty `alt`; `#hero [data-cta="call"]` visible.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement: full-viewport (`min-h-svh`) `next/image` with `fill`, `priority`, `sizes="100vw"`, dark-to-transparent gradient for text contrast. Desktop timeline (scrubbed, `start: 'top top', end: 'bottom top'`): image `scale 1 → 1.15`; headline block `y 0 → -80`, `opacity 1 → 0`. Mobile: image `scale 1 → 1.08` only.
- [ ] **Step 4:** Run `npx playwright test sections a11y-motion no-js` → PASS.
- [ ] **Step 5:** Commit `feat: add hero with scroll zoom`.

### Task 6: Story

**Files:** Create `components/sections/Story.tsx`; Modify `app/page.tsx`; Test `tests/e2e/sections.spec.ts`

**Interfaces:** Consumes `story`, `MQ`, `useGSAP`.

- [ ] **Step 1: Failing test:** `test('story shows heading, all paragraphs and image')` → `#story h2` text equals `story.heading`; `#story p` count equals `story.paragraphs.length`; `#story img` visible after scrolling into view.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement two-column layout (stacked on mobile). Desktop: pin the section (`pin: true, end: '+=100%'`, scrub); paragraphs reveal one after another (`from opacity 0, y 30`, stagger), image slides `from x: 120`. Mobile: no pin; each paragraph fades up once when entering (`toggleActions: 'play none none none'`).
- [ ] **Step 4:** Run `npx playwright test sections a11y-motion no-js mobile` → PASS.
- [ ] **Step 5:** Commit `feat: add pinned story section`.

### Task 7: Close-up showcase

**Files:** Create `components/sections/Showcase.tsx`; Modify `app/page.tsx`; Test `tests/e2e/sections.spec.ts`

**Interfaces:** Consumes `showcase: ShowcaseSlide[]`, `MQ`, `useGSAP`.

- [ ] **Step 1: Failing test:** `test('showcase renders one figure per slide with caption')` → `#showcase figure` count equals `showcase.length`; each `figcaption` text matches the slide caption; each `img` has non-empty `alt`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement: section has an `h2` (e.g. "Made by hand, every morning"). Each slide is a `<figure>`. Desktop: one pinned scrubbed timeline across all slides (`end: '+=' + slides * 100 + '%'`); per slide, image wrapper animates `clip-path: inset(20% 25% round 24px) → inset(0% 0% round 0px)` and `scale 0.9 → 1`, then its caption fades in, then the next slide stacks on top. Mobile: no pin; each figure scales `0.92 → 1` and fades its caption as it enters.
- [ ] **Step 4:** Run `npx playwright test sections a11y-motion no-js mobile` → PASS.
- [ ] **Step 5:** Commit `feat: add close-up showcase`.

### Task 8: Menu

**Files:** Create `components/ui/MenuCard.tsx`, `components/sections/Menu.tsx`; Modify `app/page.tsx`; Test `tests/e2e/sections.spec.ts`

**Interfaces:** Consumes `menu: MenuItem[]`, `formatPrice`. Produces `MenuCard({ item: MenuItem })` → `<article data-menu-item>` with image, `h3` name, description, price.

- [ ] **Step 1: Failing test:**
  ```ts
  test('menu lists the four items with prices', async ({ page }) => {
    await page.goto('/');
    const names = await page.locator('#menu [data-menu-item] h3').allTextContents();
    expect(names).toEqual(['Flan','Chocolate Cookies','Chocolate Cupcakes','Gummies']);
    await expect(page.locator('#menu [data-menu-item]').first()).toContainText('$10.99');
    await expect(page.locator('#menu')).not.toContainText('chololate');
  });
  ```
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement: grid (1 col mobile, 2 tablet, 4 desktop). Each card's image wrapper is `overflow-hidden`. Desktop and mobile: cards rise in with `from y 60, opacity 0`, `stagger 0.12`, once on enter. Desktop only: image inside each card has scrubbed parallax `yPercent -8 → 8`.
- [ ] **Step 4:** Run `npx playwright test sections a11y-motion no-js mobile` → PASS.
- [ ] **Step 5:** Commit `feat: add menu cards`.

### Task 9: Gallery

**Files:** Create `components/sections/Gallery.tsx`; Modify `app/page.tsx`; Test `tests/e2e/sections.spec.ts`, `tests/e2e/mobile.spec.ts`

**Interfaces:** Consumes `gallery: ImageAsset[]`, `MQ`, `useGSAP`.

- [ ] **Step 1: Failing test:** `test('gallery shows every photo')` → `#gallery img` count equals `gallery.length`, all with non-empty `alt`. The existing mobile overflow test must still pass after this task.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement: horizontal flex track inside an `overflow-hidden` wrapper. Desktop: pin the section and scrub `x` from `0` to `-(track.scrollWidth - window.innerWidth)` using function-based values with `invalidateOnRefresh: true`. Mobile and reduced motion: the track is a native horizontally scrollable row (`overflow-x-auto snap-x`) contained within the section, so the page itself never overflows.
- [ ] **Step 4:** Run `npx playwright test sections a11y-motion no-js mobile` → PASS.
- [ ] **Step 5:** Commit `feat: add sideways-scrolling gallery`.

### Task 10: Visit, footer, SEO and anchor navigation

**Files:** Create `components/sections/Visit.tsx`, `components/sections/Footer.tsx`, `tests/e2e/navigation.spec.ts`, `tests/e2e/seo.spec.ts`; Modify `app/layout.tsx` (metadata, Open Graph, JSON-LD), `components/sections/Header.tsx` (anchor clicks), `app/page.tsx`

**Interfaces:** Consumes `business`, `mapEmbedUrl`, `directionsUrl`, `CallDirections`, `useLenis()`.

- [ ] **Step 1: Failing tests.**
  `sections.spec.ts`: `test('visit shows address, every opening-hours row, map and CTAs')` → `#visit` contains `60608`; `#visit [data-hours-row]` count equals `business.hours.length`; `#visit iframe` `src` starts with `https://www.google.com/maps?q=` and has a `title`; call + directions CTAs present. Footer contains `(773) 222-3333` and the current year.
  `navigation.spec.ts` (desktop project):
  ```ts
  test('header Visit link lands on the visit section', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-nav="visit"]');
    await expect(page.locator('#visit h2')).toBeInViewport({ timeout: 5000 });
  });
  test('visit section still reachable after resize', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 900, height: 700 });
    await page.click('[data-nav="visit"]');
    await expect(page.locator('#visit h2')).toBeInViewport({ timeout: 5000 });
  });
  ```
  `seo.spec.ts`: page has `meta[name="description"]`, `meta[property="og:image"]`; the `script[type="application/ld+json"]` parses to an object with `@type` `"Bakery"`, `telephone` `"+1-773-222-3333"`, `address.postalCode` `"60608"`, and one `openingHoursSpecification` entry per `business.hours` row.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement Visit (address block, hours list with `data-hours-row`, lazy `<iframe loading="lazy">` map, `CallDirections`; simple fade-in on desktop and mobile), Footer, metadata + Open Graph (use `store.jpg`), JSON-LD built from `business`. Header anchor links: when `useLenis()` returns an instance, `preventDefault` and `lenis.scrollTo(target, { offset: -headerHeight })`; otherwise fall back to the native hash jump. Ensure `ScrollTrigger.refresh()` runs after fonts and images load (`window` `load` event) so pinned spacing is correct.
- [ ] **Step 4:** Run `npx playwright test` (all) → PASS on both projects.
- [ ] **Step 5:** Commit `feat: add visit section, footer, SEO and anchor navigation`.

### Task 11: Final verification

**Files:** Modify `README.md` (placeholders the bakery must supply: street address, hours, prices, photo ownership; how to deploy to Vercel)

- [ ] **Step 1:** `npm run lint` → 0 errors; `npm run build` → succeeds; `npx playwright test` → all pass.
- [ ] **Step 2:** `npm run start`, then in the browser pane check at 375px and 1280px, with colour scheme light, and reduced motion on and off: animations play smoothly, no overlapping pinned sections, no horizontal scroll, mobile bar never covers the footer text.
- [ ] **Step 3:** Run Lighthouse on `http://localhost:3000` (`npx lighthouse http://localhost:3000 --only-categories=performance,accessibility --preset=desktop --quiet --chrome-flags="--headless"`; repeat without `--preset=desktop` for mobile). Performance ≥ 90 and Accessibility ≥ 90; fix and re-run if not.
- [ ] **Step 4:** Commit `docs: add README with content placeholders and deployment notes`.
