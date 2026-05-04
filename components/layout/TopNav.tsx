"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Search, Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";

export function TopNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/disciplines", label: t("disciplines") },
    { href: "/cities", label: t("cities") },
    { href: "/quiz", label: t("quiz") },
    { href: "/blog", label: t("blog") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-bg/85 backdrop-blur-md border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 md:h-18 flex items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="Dojan home"
        >
          <Logo className="h-8 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-1 ms-2 flex-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-3 py-2 rounded-md text-[15px] font-medium text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors",
                pathname.startsWith(l.href) && "text-ink bg-surface-2",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/search"
            className="flex items-center gap-2 px-3 py-2 rounded-full border border-border hover:border-ink-muted bg-surface text-sm text-ink-muted transition-colors"
          >
            <Search className="size-4" />
            {t("search")}
          </Link>
          <LocaleSwitcher />
          <Link
            href="/dashboard"
            className="text-sm font-medium text-ink-muted hover:text-ink px-3 py-2"
          >
            {t("for_business")}
          </Link>
          <Link
            href="/auth/sign-in"
            className="text-sm font-semibold bg-ink text-white px-4 py-2 rounded-full hover:bg-brand-700 transition-colors"
          >
            {t("sign_in")}
          </Link>
        </div>

        <button
          className="md:hidden ms-auto p-2 -me-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <div className="px-4 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 px-3 rounded-lg text-base font-medium hover:bg-surface-2"
              >
                {l.label}
              </Link>
            ))}
            <div className="border-t border-border my-2" />
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="py-3 px-3 rounded-lg text-base font-medium hover:bg-surface-2"
            >
              {t("for_business")}
            </Link>
            <Link
              href="/auth/sign-in"
              onClick={() => setMobileOpen(false)}
              className="py-3 px-3 rounded-lg text-base font-semibold text-brand"
            >
              {t("sign_in")}
            </Link>
            <div className="flex items-center gap-2 mt-2 px-3 py-2 text-sm text-ink-muted">
              <Globe className="size-4" />
              <span className="me-auto">
                {locale === "he" ? "שפה" : "Language"}
              </span>
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
