import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["he", "en"],
  defaultLocale: "he",
  // Static-export deploy (GitHub Pages) requires "always" — middleware is not
  // available at runtime. To restore brand-clean "/" → Hebrew, deploy to Vercel
  // and switch this back to "as-needed".
  localePrefix: "always",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
