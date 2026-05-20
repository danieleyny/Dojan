# Translations layer

This implements the spec's `content_translations` shape using static TypeScript
data. When we graduate to Supabase, every entity already has a
`translations: Partial<Record<Locale, Record<string, string>>>` map that swaps
1:1 with rows in the `content_translations` table.

## Helper

```ts
import { getField } from "@/lib/i18n/getField";

const name = getField(gym, "name", locale); // locale → en → he fallback
```

Fallback order (per BUILD_PROMPT_EXPANSION §2.2):
1. Requested locale
2. English
3. Hebrew
4. Empty string

## Adding a new locale

1. Add the locale to `i18n/routing.ts` (`locales` array).
2. Create `messages/<locale>.json` mirroring `messages/en.json`.
3. Add `translations.<locale>` entries to data entries you want localized;
   missing entries fall back per above.
4. Update `<LocaleSwitcher>` (auto-derives from `routing.locales`).
