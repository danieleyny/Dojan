import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Hebrew (default), English, Arabic, Spanish, French
  // RTL locales: he, ar
  locales: ["he", "en", "ar", "es", "fr"],
  defaultLocale: "he",
  // GitHub Pages static-export deploy requires "always" — middleware is not
  // available at runtime. Reverting to "as-needed" requires moving to Vercel.
  localePrefix: "always",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const RTL_LOCALES: Locale[] = ["he", "ar"];

export const LOCALE_LABELS: Record<Locale, string> = {
  he: "עברית",
  en: "English",
  ar: "العربية",
  es: "Español",
  fr: "Français",
};

export const LOCALE_SHORT: Record<Locale, string> = {
  he: "עב",
  en: "EN",
  ar: "ع",
  es: "ES",
  fr: "FR",
};
