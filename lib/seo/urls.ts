import { routing } from "@/i18n/routing";
import { cities } from "@/data/cities";
import { disciplines } from "@/data/disciplines";
import { gyms } from "@/data/gyms";
import { coaches } from "@/data/coaches";
import { techniques } from "@/data/techniques";
import { watchPosts, storyPosts } from "@/data/editorial";

/**
 * Builds every public URL we want indexed, per locale.
 * Used by sitemap shards + hreflang generation.
 */
export function buildAllPaths(): string[] {
  const base = [
    "",
    "/disciplines",
    "/cities",
    "/search",
    "/quiz",
    "/packages/builder",
    "/women",
    "/women/self-defense",
    "/women/stories",
    "/techniques",
    "/watch",
    "/israel-in-combat",
    "/dashboard",
    "/auth/sign-in",
  ];

  // Disciplines
  for (const d of disciplines) {
    base.push(`/disciplines/${d.slug}`);
    base.push(`/techniques/${d.slug}`);
    base.push(`/women/${d.slug}`);
  }

  // Cities + city/discipline matrix
  for (const c of cities) {
    base.push(`/${c.slug}`);
    base.push(`/women/${c.slug}`);
    for (const d of disciplines) {
      base.push(`/${c.slug}/${d.slug}`);
      base.push(`/women/${c.slug}/${d.slug}`);
    }
  }

  // Gyms
  for (const g of gyms) base.push(`/gyms/${g.slug}`);

  // Coaches
  for (const co of coaches) base.push(`/instructors/${co.slug}`);

  // Techniques (per discipline)
  for (const t of techniques) base.push(`/techniques/${t.discipline_slug}/${t.slug}`);

  // Watch & Stories
  for (const p of watchPosts) base.push(`/watch/${p.slug}`);
  for (const p of storyPosts) base.push(`/israel-in-combat/${p.slug}`);

  return base;
}

export function localizedUrl(path: string, locale: string): string {
  return `/${locale}${path}/`.replace(/\/+/g, "/");
}

export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ??
  "https://danieleyny.github.io";

export const SITE_BASEPATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${SITE_BASEPATH}${path}`;
}

export const ALL_LOCALES = routing.locales;
