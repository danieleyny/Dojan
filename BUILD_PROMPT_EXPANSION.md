# Claude Code Build Prompt — Expansion Pack
**Marketplace depth, multi-locale reach, lead engine, and SEO weaponization.**

Companion to `BUILD_PROMPT.md`. Read that file first — every non-negotiable, every token, every URL convention, every table in §5 still applies. This document is **additive**. Do not refactor the existing schema, routing, or design system unless this file explicitly says so. Where this file extends a previously defined section, the section number is called out (e.g. "extends §5.1").

The goal of this phase: turn the read-only/booking-enabled MVP into the **default marketplace** for anyone — Israeli or visiting from abroad — searching for any form of combat training in Israel. SEO is the primary growth lever. Lead capture is the primary monetization lever. Both must be designed-in from the first commit of every feature below.

---

## 1. Audience & positioning (locks in for every feature below)

Two primary personas, weighted equally:

- **The Visitor.** Lives in the US, UK, Western Europe, Latin America, or a French-speaking country. Will be in Israel for 1–6 weeks. Wants a curated package of classes — ideally Krav Maga, MMA, or BJJ — taught in English, Spanish, French, or Arabic depending on origin, with logistics figured out. Discovers us via Google search in their own language.
- **The Local.** Lives in Israel. Wants the best class within reasonable travel distance. Searches in Hebrew, sometimes Arabic. Cares about price, schedule fit, and reviews.

A secondary, very high-intent persona:

- **The Woman.** Looking for women-only training, female instructors, or self-defense specifically tailored to her safety concerns. Search intent is distinct enough that we treat it as a parallel funnel with its own surfaces.

Every feature below must be explicitly designed for at least two of these three personas. Mention which ones in the PR description.

---

## 2. Locale expansion: 5 languages (extends §3, §4, §6.4, §9)

The platform currently ships Hebrew (default, `/`) and English (`/en`). Add three more locales as first-class citizens — not afterthoughts, not auto-translated widgets.

### 2.1 Locales & URL map

| Locale | Direction | URL prefix | Default copy strategy |
|---|---|---|---|
| Hebrew (`he`) | RTL | `/` (unprefixed, unchanged) | Native — already in repo |
| English (`en`) | LTR | `/en` (unchanged) | Native — already in repo |
| Arabic (`ar`) | RTL | `/ar` | Professional translation, native review by Arabic-speaking martial artist |
| Spanish (`es`) | LTR | `/es` | Professional translation, neutral-LatAm Spanish |
| French (`fr`) | LTR | `/fr` | Professional translation, France French |

`hreflang` must emit all five alternates plus `x-default` (point `x-default` at `/en` — international visitors who haven't picked a language).

### 2.2 Schema impact

The current schema (§5.1) has paired `*_he` / `*_en` columns. Five locales make this unsustainable. **Migrate content fields to a translations pattern:**

```sql
-- new generic translations table
content_translations (
  id bigserial PK,
  entity_type text check (entity_type in ('gym','discipline','instructor','class','city','content_page','technique','media_review')),
  entity_id text NOT NULL,                 -- string to accept both uuid and serial ids
  locale text NOT NULL check (locale in ('he','en','ar','es','fr')),
  field text NOT NULL,                     -- 'name', 'description', 'body', 'meta_title', etc.
  value text,
  UNIQUE (entity_type, entity_id, locale, field)
)
```

Write a migration that backfills `content_translations` from the existing `*_he` and `*_en` columns, then leaves the old columns in place behind a `@deprecated` comment for one release cycle before dropping them. Update queries via a typed `getLocalizedField(entity, field, locale)` helper that falls back: requested locale → English → Hebrew. Document the helper in `lib/i18n/README.md`.

UI strings (buttons, labels, validation messages) stay in `next-intl` JSON files, one per locale.

### 2.3 Translation workflow

Set up [Crowdin](https://crowdin.com), [Lokalise](https://lokalise.com), or `tolgee` (recommend Tolgee — open-source, self-hostable, free tier sufficient at our scale). Source = Hebrew + English. Surface the choice as a one-paragraph recommendation before wiring it up; do not pick on my behalf.

**Never machine-translate user-facing copy on the fly.** All translations are pre-generated, reviewed, and committed.

### 2.4 RTL parity for Arabic

Reuse the §6.4 RTL handling already in place for Hebrew. Verify Mapbox `mapbox-gl-rtl-text` plugin handles Arabic labels (it does). Add Arabic to the Playwright RTL test matrix.

### 2.5 SEO implications

- Per-locale sitemap.xml shards: `/sitemap-he.xml`, `/sitemap-en.xml`, `/sitemap-ar.xml`, `/sitemap-es.xml`, `/sitemap-fr.xml`, all referenced from `/sitemap.xml` index.
- `generateMetadata` must produce localized `title`, `description`, `openGraph`, `twitter`, and `alternates.languages` for all five locales on every page.
- Locale switcher (already exists per §6.5) extended to 5 options; preserves current pathname and query params.

---

## 3. Google Business Profile integration (new feature; extends §5 reviews, §7.3 gym detail)

The platform must be a two-way bridge between our `reviews` table and each gym's Google Business Profile (GBP). Implement in this order:

### 3.1 Reality check before building

The Google **Business Profile API** has had several review-write endpoints deprecated. Before writing a single line of integration code, do this and surface findings to me:

1. Confirm in [Google's current docs](https://developers.google.com/my-business) which review operations are still available in 2026: `accounts.locations.reviews.list`, individual review reply, and posting net-new reviews. Note: posting net-new reviews on behalf of users is generally **not** permitted by Google.
2. Confirm the OAuth scopes required (`https://www.googleapis.com/auth/business.manage`).
3. Confirm rate limits and quota.
4. Report back with a one-paragraph recommendation: which of the two options below is actually buildable, and what tradeoffs apply.

### 3.2 Option A (preferred if Google allows it): write-through

User submits a review on our platform → after passing moderation, the review is **also posted** to the gym's GBP via the gym owner's connected Google account. The gym owner connects their GBP via OAuth in `/dashboard/profile/integrations`. Tokens stored in a new `gym_integrations` table with refresh-token rotation. If GBP returns an error, we still keep the review on our platform and surface the GBP-sync status to the gym owner.

### 3.3 Option B (fallback, definitely buildable): read-through scrape & sync

1. Gym owner connects GBP via OAuth.
2. A Supabase Edge Function runs on a cron (weekly default, configurable per gym) and fetches all reviews from `accounts.locations.reviews.list`.
3. New reviews land in our `reviews` table with `source = 'google_business'`, `is_verified = true` (Google enforces its own verification), and an immutable `external_id` to prevent duplicates.
4. UX hint: after a user submits a review on our platform, also surface a "Leave this review on Google?" button that deep-links to the gym's GBP review URL with the rating pre-filled where possible.

### 3.4 Schema changes (additive only)

```sql
-- new column on existing reviews table
ALTER TABLE reviews ADD COLUMN source text
  check (source in ('platform','google_business','imported'))
  default 'platform';
ALTER TABLE reviews ADD COLUMN external_id text;
ALTER TABLE reviews ADD COLUMN external_url text;
CREATE UNIQUE INDEX reviews_external_id_uniq
  ON reviews(source, external_id) WHERE external_id IS NOT NULL;

-- new table for connected accounts
gym_integrations (
  id uuid PK default gen_random_uuid(),
  gym_id uuid FK gyms,
  provider text check (provider in ('google_business','meta','tiktok')),
  external_account_id text,
  access_token_encrypted text,           -- via Supabase Vault
  refresh_token_encrypted text,
  scopes text[],
  sync_frequency text default 'weekly',  -- 'daily','weekly','monthly'
  last_synced_at timestamptz,
  status text check (status in ('active','expired','revoked','error')) default 'active',
  created_at timestamptz default now()
)
```

### 3.5 Display & UX (extends §7.3)

On the gym detail page reviews block:
- Show a "G" badge on reviews where `source = 'google_business'`, linking to the original Google review.
- Aggregate rating is calculated across both platform and GBP reviews, but each is also displayed separately so the user can see "Platform: 4.7 (38) • Google: 4.5 (212)".
- JSON-LD `AggregateRating` uses the combined count and weighted average; this is fully compliant with Schema.org as long as both sources are real customer reviews.

---

## 4. Universal lead capture (extends §5 bookings)

The current `bookings` table is trial-class-focused. Extend it to be the system of record for **every form of user-to-gym contact** that originates on our platform. Nobody emails or calls a gym directly through a contact form we don't own.

### 4.1 Schema extension

```sql
ALTER TABLE bookings ADD COLUMN inquiry_type text
  check (inquiry_type in ('trial_class','full_membership','package','private_lesson','women_only','corporate','tourism','general'))
  default 'trial_class';
ALTER TABLE bookings ADD COLUMN source_url text;            -- the page they were on when they inquired
ALTER TABLE bookings ADD COLUMN source_locale text;
ALTER TABLE bookings ADD COLUMN source_referrer text;       -- where they came from before landing on us
ALTER TABLE bookings ADD COLUMN utm jsonb;                  -- {source, medium, campaign, content, term}
ALTER TABLE bookings ADD COLUMN value_props_shown text[];   -- A/B-test which copy converted them
ALTER TABLE bookings ADD COLUMN assigned_to uuid;           -- internal sales rep (nullable)
ALTER TABLE bookings ADD COLUMN lead_score smallint;        -- 0-100, computed
ALTER TABLE bookings ADD COLUMN follow_ups jsonb default '[]';  -- timestamped log of every outreach
```

### 4.2 Universal inquiry component (`<InquiryForm variant>`)

Build once, reuse everywhere. Variants: `trial`, `package`, `private`, `corporate`, `tourism`. Lives on every gym detail page, every coach page, every package result, the women's hub, and the tourism landing page. On submit:

1. Insert into `bookings` with full context.
2. Send templated email to gym owner via Resend with our branding (we're not invisible).
3. Send confirmation email to the user in their locale.
4. Send a WhatsApp template to the gym owner via the Cloud API (requires gym's `whatsapp` field; degrade gracefully if absent).
5. Fire a `lead_submitted` PostHog event with full UTM and source context.

### 4.3 Admin lead inbox

New surface: `/admin/leads`. Visible only to `role = 'admin'`. Filterable by inquiry type, gym, city, locale, source, status, lead score. Each lead opens a side panel with the booking detail and a free-text outreach log. This is the spine of our sales operation — design it like a CRM, not a database viewer.

### 4.4 Gym-side dashboard (extends §7.5)

`/dashboard/bookings` gains tabs: `New leads` / `Confirmed` / `Completed` / `Lost`. The gym owner sees the same inquiries we do, but cannot see lead-score or our internal follow-up log.

---

## 5. Custom package builder (new surface; extends §7.5 quiz)

The biggest unlock for the Visitor persona. A package isn't a single class; it's a curated week-or-more of training.

### 5.1 Route & flow

`/packages/builder` (every locale). Multi-step wizard, single question per screen on mobile, side-by-side on desktop. Steps:

1. **When are you here?** Date range picker. Defaults to "I'm in Israel now" or "I'm planning a trip" — branches the rest of the flow.
2. **Where will you be staying?** City autocomplete + map fallback. Multi-select if traveling.
3. **What do you want to train?** Discipline multi-select with depth slider per discipline ("Try it" / "Train hard" / "Compete-ready").
4. **Any constraints?** Women-only toggle, English-speaking instructor required toggle, language preference, age, fitness level, injuries (free text), budget range.
5. **Schedule shape.** Number of sessions per week, morning/evening preference, willingness to travel between cities.
6. **Review & customize.** Generated package displayed as a weekly calendar with gym pins on a map, with totals (sessions, estimated total cost in NIS + USD/EUR conversion, distance traveled).

The user can swap any session for another option the algorithm scored highly. Finally: **"Send me this package"** drops into the lead capture system (§4) as `inquiry_type = 'package'`.

### 5.2 Algorithm

For each requested discipline and constraint, score every matching `class` row by:

- Match score (discipline + level + age_group + women-only fit) — 40%
- Gym rating (combined platform + GBP) — 25%
- Distance from declared city(ies) — 15%
- Schedule fit (no conflicts, preferred time-of-day) — 10%
- Price within budget — 10%

Greedy schedule fill: highest-scoring class first, then next-highest non-conflicting, until requested session count is met. Document the algorithm in `lib/packages/algorithm.md` so we can iterate transparently.

### 5.3 Output as a shareable artifact

Every generated package gets a `share_token`-addressed page at `/packages/[token]`, server-rendered, with OG image preview. Users share these with travel companions or family before booking. Indexable only if the user opts in; private by default.

---

## 6. Women's hub (new surface; extends existing `women-only` enum + new SEO cluster)

The Woman persona deserves a parallel funnel. Today the platform only exposes "women-only" as a filter chip on `/search`. Build a full hub.

### 6.1 Routes

```
/women                                    Hub: hero + explainer + 4 sub-rails
/women/self-defense                       Self-defense focus (the highest-intent landing)
/women/[discipline]                       e.g. /women/krav-maga, /women/bjj
/women/[city]                             e.g. /women/tel-aviv
/women/[city]/[discipline]                The conversion-driving long-tail SEO page
/women/stories                            Long-form interviews & case studies
```

All five locales. SEO-first SSR.

### 6.2 Content (high-intent keywords)

Target queries like:
- Hebrew: "הגנה עצמית לנשים", "קרב מגע נשים תל אביב"
- English: "women's self defense Israel", "women only krav maga Tel Aviv"
- Arabic: "دفاع عن النفس للنساء"
- Spanish: "defensa personal mujeres Tel Aviv"
- French: "self défense pour femmes Israël"

Each city × discipline page emits its own JSON-LD `LocalBusiness` list and `FAQPage` with women-safety-specific FAQs. Internal-link densely between women's pages and the general site (the Israel-storytelling cluster from §10 cross-links here for any female practitioner profiled).

### 6.3 Filters & data

Add `instructor_gender` to the `instructors` table (`m`, `f`, `other`, `prefer_not_to_say`). Add `class.is_women_only` boolean (existing `age_group = 'women-only'` semantics carry over, but boolean is faster to filter). RLS unchanged.

### 6.4 Design notes

The visual language stays consistent with the main site (no pink-it-and-shrink-it). Imagery: real photos of women training, taken in real Israeli gyms. The macho cliché must be even more strictly absent here than on the main site.

---

## 7. Article-style coach profiles (rewrites the §7.5 shorthand for `/instructors/[slug]`)

Each coach gets a **long-form, magazine-style profile** — 1,500–2,500 words — designed to rank for the coach's own name and to convert visitors into trial bookings with *that specific coach*. The current `/instructors/[slug]` page is upgraded from "card with bio" to "feature article."

### 7.1 Structure

1. Hero: portrait photo (4:3, lazy-loaded), name in display font, rank, primary discipline, city, sticky "Book a class with [Name]" CTA.
2. Pull-quote (1 sentence from the coach about why they teach).
3. Origin story (300–500 words).
4. Training lineage and credentials (with verifiable links where possible).
5. Competition record (table).
6. Teaching philosophy (300–500 words).
7. Disciplines taught — each links into both the discipline encyclopedia and the gym(s) where the coach teaches.
8. Embedded video (the coach's flagship technique, from §8 if available).
9. Schedule preview (the coach's classes for the next 2 weeks).
10. Student reviews where `instructor_id` matches.
11. "Train elsewhere with [Name]" — seminars, private lessons (lead-capture `inquiry_type = 'private_lesson'`).
12. Related coaches (same discipline, same city).
13. FAQ.

### 7.2 Schema additions

```sql
ALTER TABLE instructors ADD COLUMN headline text;           -- 1-line tagline
ALTER TABLE instructors ADD COLUMN origin_story_md text;    -- localized via content_translations
ALTER TABLE instructors ADD COLUMN philosophy_md text;
ALTER TABLE instructors ADD COLUMN competition_record jsonb;  -- [{year, event, result}]
ALTER TABLE instructors ADD COLUMN media_links jsonb;         -- [{type:'youtube'|'article'|'podcast', url, title}]
ALTER TABLE instructors ADD COLUMN languages_spoken text[];
ALTER TABLE instructors ADD COLUMN gender text check (gender in ('m','f','other','prefer_not_to_say'));
```

JSON-LD: `Person` + `AggregateRating` (filtered to reviews where `instructor_id` is set, once we add per-coach review tagging — track that as a follow-up if not done).

---

## 8. Animated technique library (new content surface)

For SEO: capture every "how to [technique]" search query in five languages. For UX: a teaching aid that drives time-on-site and shareability.

### 8.1 Routes

```
/techniques                                Hub by discipline
/techniques/[discipline]                   All techniques for the discipline, grouped by category
/techniques/[discipline]/[technique]       Single technique page
```

### 8.2 Hybrid media strategy (do not pick one — do both)

For each technique:

- **Curated YouTube embed** as the primary visual (fast to fill the catalog, instant SEO via VideoObject embedding the YouTube `embedUrl`).
- **Custom animation** for "flagship" techniques (the 5–10 most-searched per discipline) — Lottie-rendered stick-figure animations. Commission these incrementally; gate behind a `has_custom_animation` boolean and fall back to the YouTube embed otherwise.

### 8.3 Step-by-step structured content

Every technique page renders a stepwise `HowTo` JSON-LD block. The steps are stored in the DB and translatable:

```sql
techniques (
  id uuid PK default gen_random_uuid(),
  slug text unique,
  discipline_id int FK disciplines,
  category text,                            -- 'strike','grapple','defense','combo','drill'
  difficulty smallint check (between 1 and 5),
  -- translatable fields go to content_translations
  youtube_id text,
  has_custom_animation bool default false,
  animation_lottie_url text,
  related_technique_ids uuid[],
  created_at timestamptz default now()
)

technique_steps (
  id uuid PK default gen_random_uuid(),
  technique_id uuid FK techniques,
  position smallint,
  -- title and body via content_translations
  common_mistake_md text,                   -- translatable
  PRIMARY KEY (technique_id, position)
)
```

### 8.4 SEO architecture

- `VideoObject` JSON-LD per page (use the YouTube thumbnail as `thumbnailUrl`, the embed URL as `contentUrl`).
- `HowTo` JSON-LD with the steps.
- Internal links: technique → discipline encyclopedia, technique → "gyms in [city] that teach this", technique → related techniques.
- The `/techniques/[discipline]` hub becomes a deep, query-rich hub page that itself ranks.

---

## 9. Combat-media reviews (new content cluster; pure SEO engine)

Long-form reviews and breakdowns of MMA fights, fighting movies, and fighting TV shows. Each post is independent SEO content that links inbound to disciplines, coaches, and packages.

### 9.1 Routes

```
/watch                                     Hub
/watch/[slug]                              Single review post
```

### 9.2 Content shape per post

- Hero with the media's poster / YouTube thumbnail.
- 800–2,000 words of editorial commentary.
- Embedded video (if YouTube; if a movie/TV show, no embed — just reference + JSON-LD `Movie` / `TVSeries`).
- "Techniques used" section: links to relevant `/techniques/...` pages.
- "Train this style yourself" section: links to disciplines + a curated list of gyms.
- Author byline (could be a coach from `instructors` — pulls bio).
- Comments via Giscus (GitHub Discussions backend, free, no PII).

### 9.3 Schema

Reuse existing `content_pages` with new `type` enum values:

```sql
ALTER TABLE content_pages DROP CONSTRAINT IF EXISTS content_pages_type_check;
ALTER TABLE content_pages ADD CONSTRAINT content_pages_type_check
  CHECK (type IN ('encyclopedia','blog','comparison','guide','media_review','story'));
```

### 9.4 SEO architecture

- `Review` + `VideoObject` / `Movie` JSON-LD per post.
- Each post internal-links to ≥3 disciplines, ≥2 techniques, ≥2 gyms or coaches.
- Build an editorial cadence target: 2 reviews/week to seed the cluster.

---

## 10. Israel-in-combat storytelling hub (new content cluster)

A distinct, evergreen content vertical that brands Israel as a martial arts destination. Drives top-of-funnel traffic for "Krav Maga history," "Israeli MMA fighters," "fighting in Israel," etc., across all five locales.

### 10.1 Routes

```
/israel-in-combat                          Hub
/israel-in-combat/[slug]                   Long-form story
```

### 10.2 Initial editorial slate (seed 8 articles before launch)

1. The origin of Krav Maga: Imi Lichtenfeld and the IDF lineage.
2. Israeli MMA on the world stage (Natan Levy, Haim Gozali, current roster).
3. The Israeli BJJ scene: how it grew in 15 years.
4. Women in Israeli combat sports.
5. Why so many travelers fly to Israel to train Krav Maga — and where they actually go.
6. The Israeli boxing tradition (often-overlooked).
7. Krav Maga vs. Lichtenfeld's original system: what changed.
8. Self-defense in modern Israel: civilian programs that work.

Uses `content_pages` with `type = 'story'`. Internal-links densely into instructors, disciplines, women's hub, and packages.

---

## 11. SEO architecture additions (extends §9)

Beyond the per-feature SEO notes above, the platform-wide SEO posture gets these additions:

- **Localized URL slugs.** Slugs may translate where helpful for foreign-language SEO (e.g. `/es/disciplinas/krav-maga` is fine; `/es/disciplines/krav-maga` is not). Maintain slug mapping in `content_translations` and 301-redirect old slugs.
- **Locale-aware OG images.** `next/og` route accepts `?locale=...`; image text renders in that locale's display font.
- **Per-locale sitemap shards** as in §2.5.
- **Robots.txt** disallows nothing on production; explicitly allows `/api/og/*`.
- **Internal-link density target:** every public page links to ≥ 8 other internal pages contextually (not just nav).
- **Programmatic SEO matrix.** Generate (city × discipline) and (city × discipline × women) landing pages systematically. Cap at ~2,000 indexable pages initially; expand once Search Console shows healthy crawl rate.
- **Lighthouse thresholds extended** to every public route added in this expansion, not just the original 5 reference routes.
- **Search Console & Bing Webmaster Tools** verification files committed; submit each new sitemap on deploy.

---

## 12. Things to confirm with me before acting

Surface a one-paragraph recommendation and wait for each of these. **Do not** make these unilaterally:

1. **Translation vendor.** Tolgee self-hosted vs. Crowdin SaaS vs. Lokalise SaaS. Cost, workflow, lock-in.
2. **GBP integration scope.** Option A (write-through) vs. Option B (read-only sync) based on §3.1 findings.
3. **Comments backend for `/watch`.** Giscus vs. Hyvor Talk vs. roll-our-own. Privacy and moderation tradeoffs.
4. **Custom animation production.** Lottie-via-After-Effects (commissioned) vs. Rive (in-browser editable) vs. SVG keyframe (lowest cost, lowest polish). Recommend one with a budget estimate per technique.
5. **WhatsApp Cloud API tier.** Requires Meta business verification. Confirm we can use the existing `whatsapp` field on `gyms` as the destination.
6. **Slug translation policy.** Translate slugs in `ar` / `es` / `fr` (better SEO, more redirects to maintain) vs. keep English slugs in non-Hebrew locales (less work, weaker SEO).

---

## 13. Execution order (do not reorder without asking)

### Phase E1 — Foundations of expansion
1. Migrate to `content_translations` table; backfill from existing `*_he` / `*_en` columns; ship `getLocalizedField` helper.
2. Wire `next-intl` for `ar`, `es`, `fr`; add language switcher; verify Mapbox RTL still works in Arabic.
3. Update `generateMetadata`, hreflang, sitemap shards across every existing route.
4. Translation vendor wired and seeded with existing copy.

### Phase E2 — Lead engine
5. Extend `bookings` per §4.1.
6. Build `<InquiryForm>` universal component; replace any direct-contact CTAs.
7. `/admin/leads` inbox.
8. PostHog event taxonomy for the new lead funnel.

### Phase E3 — High-intent surfaces
9. Women's hub (`/women/*`) — full page set, all locales.
10. Package builder (`/packages/builder`) — wizard + algorithm + share page.
11. Article-style instructor pages — schema migration + new page template.

### Phase E4 — SEO content engines
12. Technique library — schema, `/techniques/*`, YouTube-embed-first catalog of top 20 techniques per top-10 disciplines.
13. Combat-media reviews — `/watch/*`, seed with 8 posts.
14. Israel-in-combat hub — `/israel-in-combat/*`, seed with 8 stories.
15. Programmatic city × discipline × women matrix.

### Phase E5 — Google Business Profile
16. OAuth connection in instructor dashboard.
17. `reviews.source` + `gym_integrations` + sync edge function.
18. Combined-rating display on gym detail pages.
19. (If §3.1 permits) Write-through publishing.

Each phase must ship Lighthouse-green and not regress the existing routes. Treat the existing site as production from commit one of phase E1.

---

## 14. Definition of done (extends §12.4)

A feature in this expansion is done only when:

- All five locales render correctly (RTL for `he` and `ar`).
- New routes are in the appropriate per-locale sitemap shard.
- `hreflang` alternates are complete and round-trip-verified by Playwright.
- New JSON-LD blocks validate against [Schema.org's validator](https://validator.schema.org/) — committed validator snapshots in `tests/seo/`.
- New tables have RLS policies, not just RLS-on.
- Existing Playwright e2e flows still pass; new flows added for new critical journeys (women's flow, package builder, GBP-synced review display).
- Lead-instrumented surfaces fire the correct PostHog events.

---

## 15. Begin

Acknowledge that you have re-read `BUILD_PROMPT.md` and read this file. Then start with §13 Phase E1, step 1 — the `content_translations` migration. Before running the migration, surface the slug-translation policy decision from §12.6.
