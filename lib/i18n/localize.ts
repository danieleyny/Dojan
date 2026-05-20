import type { Locale } from "@/i18n/routing";
import type { Gym } from "@/data/gyms";
import type { Discipline } from "@/data/disciplines";
import type { City } from "@/data/cities";

/**
 * Bridge between the current `*_he` / `*_en` columns and the eventual
 * `content_translations` table (BUILD_PROMPT_EXPANSION §2.2).
 *
 * For locales without committed translations (ar/es/fr today), falls back
 * to English. The shape of these helpers is the same as the eventual
 * `getLocalizedField(entity, field, locale)` call against Supabase.
 */

export function gymName(g: Gym, locale: Locale): string {
  switch (locale) {
    case "he": return g.name_he;
    case "en": return g.name_en;
    default: return g.name_en; // ar/es/fr fall back to English for proper-noun gym names
  }
}

export function gymDescription(g: Gym, locale: Locale): string {
  return locale === "he" ? g.description_he : g.description_en;
}

export function gymNeighborhood(g: Gym, locale: Locale): string {
  return locale === "he" ? g.neighborhood_he : g.neighborhood_en;
}

export function cityName(c: City, locale: Locale): string {
  return locale === "he" ? c.name_he : c.name_en;
}

export function cityDistrict(c: City, locale: Locale): string {
  return locale === "he" ? c.district_he : c.district_en;
}

export function disciplineName(d: Discipline, locale: Locale): string {
  return locale === "he" ? d.name_he : d.name_en;
}

export function disciplineShort(d: Discipline, locale: Locale): string {
  return locale === "he" ? d.short_he : d.short_en;
}

export function disciplineOrigin(d: Discipline, locale: Locale): string {
  return locale === "he" ? d.origin_he : d.origin_en;
}

/** Is this an RTL locale? */
export function isRtl(locale: Locale): boolean {
  return locale === "he" || locale === "ar";
}
