"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const onChange = (next: string) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error params type is dynamic
        { pathname, params },
        { locale: next as (typeof routing.locales)[number] },
      );
    });
  };

  return (
    <div
      className="inline-flex items-center rounded-full border border-border bg-surface text-xs font-semibold p-0.5"
      data-pending={isPending}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`px-3 py-1.5 rounded-full transition-colors ${
            l === locale
              ? "bg-ink text-white"
              : "text-ink-muted hover:text-ink"
          }`}
          aria-pressed={l === locale}
        >
          {l === "he" ? "עברית" : "EN"}
        </button>
      ))}
    </div>
  );
}
