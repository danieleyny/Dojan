"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useState, useTransition } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { routing, LOCALE_LABELS, LOCALE_SHORT, type Locale } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onChange = (next: Locale) => {
    setOpen(false);
    startTransition(() => {
      router.replace(
        // @ts-expect-error params type is dynamic
        { pathname, params },
        { locale: next },
      );
    });
  };

  return (
    <div className="relative" data-pending={isPending}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:border-ink-muted transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="size-3.5" />
        {LOCALE_SHORT[locale]}
        <ChevronDown className="size-3" />
      </button>
      {open && (
        <>
          <button
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <ul
            role="listbox"
            className="absolute top-9 end-0 z-20 w-44 rounded-xl border border-border bg-surface shadow-lg py-1 text-sm"
          >
            {routing.locales.map((l) => (
              <li key={l}>
                <button
                  onClick={() => onChange(l)}
                  className={`w-full text-start flex items-center justify-between gap-2 px-3 py-2 hover:bg-surface-2 ${
                    l === locale ? "font-semibold text-brand" : "text-ink"
                  }`}
                  dir={l === "he" || l === "ar" ? "rtl" : "ltr"}
                  role="option"
                  aria-selected={l === locale}
                >
                  <span>{LOCALE_LABELS[l]}</span>
                  <span className="text-[10px] uppercase tracking-wider text-ink-subtle">
                    {l}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
