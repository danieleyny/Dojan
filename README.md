# Dojan — Israel's Martial Arts & Combat Fitness Platform

> The discovery platform for martial arts in Israel. 800+ gyms, 50+ disciplines, verified reviews, interactive map, in Hebrew and English.

This is the implementation of the spec defined in [`BUILD_PROMPT.md`](./BUILD_PROMPT.md).
The "brand name" placeholder has been provisionally filled as **Dojan** — easy to pronounce in both languages, available as `.co.il`, evokes "dojo" without being too literal. Surface a final shortlist before launch.

## What's running today

The platform is shipped as a working, navigable, beautifully-designed read-only product with rich mock data. Wire-up to Supabase, real auth, Mapbox, Stripe, etc. follows from here.

| Route | Status |
| --- | --- |
| `/` & `/en` — Homepage | ✅ |
| `/disciplines` — Encyclopedia hub | ✅ |
| `/disciplines/[slug]` — Article (full content for top 10) | ✅ SSR · JSON-LD |
| `/cities` — Cities index | ✅ |
| `/[city]` — City landing | ✅ SSR |
| `/[city]/[discipline]` — City + discipline (≈400 SEO pages) | ✅ SSG |
| `/gyms/[slug]` — Gym detail | ✅ SSR · JSON-LD `LocalBusiness` |
| `/search` — Map + list split-view with filters | ✅ |
| `/quiz` — 8-question discipline matcher | ✅ |
| `/account/*`, `/dashboard/*` — Auth + instructor dashboard | _next phase_ |
| `/auth/*` — Sign-in flow | _next phase (Supabase Auth)_ |

The production build generates **497 static pages** across both locales.

## Stack

- **Next.js 16** (App Router, React 19, Server Components by default)
- **TypeScript strict** + ESLint
- **Tailwind v4** (CSS-first `@theme` tokens)
- **next-intl** for i18n with locale-prefix routing (`/` = he, `/en/*` = en)
- **Leaflet + OpenStreetMap (Carto Light)** as the map provider in this build — swap to Mapbox the moment you provide an access token (the `SearchMap.tsx` API is identical).
- **Lucide** icons, **clsx + tailwind-merge** for className composition, **CVA** for component variants
- **date-fns** ready for schedule formatting

> Per the build spec, Supabase, Mapbox, Resend, Sentry, Plausible, PostHog, Stripe and Apple/Google/Facebook auth are all called for but **need accounts you control**. They are not connected in this commit. The mock data layer in `data/*.ts` is a drop-in replacement for the eventual Supabase queries — same shapes, same accessors (`findGym`, `gymsByCity`, etc.).

## Run it

```bash
pnpm install
pnpm dev      # http://localhost:3000  (he default, /en for English)
pnpm build    # production build, 497 prerendered pages
pnpm start
```

## Design system

Tokens are defined in [`app/globals.css`](app/globals.css) under `@theme`. Highlights:

- Brand teal `#0F4C5C` (anchors trust + athletic)
- Coral accent `#F76B53` (CTAs, energy — never alarmist red)
- Warm off-white background `#FBFAF7`
- Hebrew display font: **Rubik 700/800**; body: **Heebo 400–700**. English: **Inter 400–800**.
- 4-pt spacing grid, six radius steps, three shadow steps.
- All directional spacing uses logical properties (`ms-`, `me-`, `start-`, `end-`) — every component flips correctly between RTL and LTR.

## What's left (mapped to BUILD_PROMPT phases)

### P0 — Foundation (mostly done)

- [x] Project scaffolding, RTL + i18n, design tokens, base layout
- [x] Mock data layer (drop-in replacement for Supabase)
- [x] Discipline encyclopedia hub + 10 articles
- [x] Gym detail page with JSON-LD
- [x] Search + Map split-view with filters
- [x] Homepage
- [x] City + city/discipline landings (≈400 pages prerendered)
- [x] Quiz with result page
- [ ] Sitemap.xml / robots.txt — needs production domain
- [ ] Per-route OG image generators — pending photography
- [ ] Plausible + PostHog + Sentry — pending account setup
- [ ] Lighthouse CI — pending Vercel deploy

### P1 — Engagement (pending Supabase)

- [ ] Magic-link, Google, Apple, Facebook auth
- [ ] Heart/save toggle persisted to `favorites` table
- [ ] Verified-review submission tied to attended bookings
- [ ] Trial booking flow (3 steps) + email confirmations via Resend
- [ ] Instructor dashboard (profile, schedule editor, bookings inbox, review responses)
- [ ] Instructor analytics view

### P2 — Growth & monetization

- [ ] Premium instructor profiles (`gyms.premium_until`)
- [ ] Sponsored search results (badged "ממומן" / "Sponsored")
- [ ] Booking commission tracking
- [ ] Affiliate widget on discipline pages
- [ ] `/corporate` and `/en/krav-maga-tourism` lead pages

## Decisions to make (per BUILD_PROMPT §12.3)

1. **Mapbox style** — currently Leaflet + Carto Light. When you provide a Mapbox token, recommend `mapbox/light-v11` as the base, then commission a custom style with off-white `#FBFAF7` land and warm coral road accents.
2. **Email sender domain** — needs DNS once the brand name is locked.
3. **Apple Sign In** — defer until Apple Developer enrolment ($99/yr). Google + email magic link cover the Israeli market today.
4. **Stripe** — not needed until P2.
5. **Brand name shortlist** — provisionally **Dojan**. Other candidates: **Ringside**, **Tatami**, **Mihtar** (מבחר). Decide before we lock the logo.

## Project layout

```
app/
  [locale]/
    layout.tsx              ← html dir/lang, fonts, Providers, NavShell
    page.tsx                ← Homepage
    disciplines/[slug]/
    gyms/[slug]/
    search/                 ← split-view (client)
    [city]/[discipline]/
    quiz/
    cities/
components/
  layout/                   ← TopNav, BottomTabBar, Footer, Logo, LocaleSwitcher
  ui/                       ← Button, GymCard, RatingStars, DisciplinePill, ...
  search/                   ← SearchClient (client), SearchMap (Leaflet)
  quiz/                     ← QuizClient
data/
  cities.ts disciplines.ts gyms.ts
i18n/
  routing.ts navigation.ts request.ts
messages/
  he.json en.json
lib/
  utils.ts
middleware.ts               ← next-intl locale routing
```

## Deviations from the spec (and why)

| Spec | Built | Reason |
| --- | --- | --- |
| Next.js 15 | Next.js 16 (latest from `create-next-app`) | Same App Router APIs, faster Turbopack — no behavior change that matters here. |
| Mapbox GL JS | Leaflet + Carto Light tiles | No paid token required; `SearchMap` API is provider-agnostic, ready to swap. |
| Supabase (Auth + DB + RLS) | Static mock data in `data/*.ts` | Per spec §12.5 we don't create third-party accounts. Mock shapes match the schema 1:1. |

The Next 16 deprecation warning about `middleware → proxy` is non-blocking; we'll migrate that file when we add the Supabase session in P1.
