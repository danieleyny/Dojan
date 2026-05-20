import type { Locale } from "@/i18n/routing";

const FALLBACK_ORDER: Locale[] = ["en", "he"];

/**
 * Get a localized field with fallback. Mirrors the eventual Supabase helper
 * for the `content_translations` table.
 *
 * Fallback: requested locale → English → Hebrew → "".
 */
export function getField<T extends { translations?: Partial<Record<Locale, Record<string, string>>> }>(
  entity: T,
  field: string,
  locale: Locale,
): string {
  const t = entity.translations;
  if (!t) return "";
  if (t[locale]?.[field]) return t[locale]![field]!;
  for (const fb of FALLBACK_ORDER) {
    if (fb !== locale && t[fb]?.[field]) return t[fb]![field]!;
  }
  return "";
}
