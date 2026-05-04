"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Home, Search, Heart, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomTabBar() {
  const t = useTranslations("tabbar");
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/search", label: t("search"), icon: Search },
    { href: "/account/saved", label: t("saved"), icon: Heart },
    { href: "/quiz", label: t("quiz"), icon: Sparkles },
    { href: "/account", label: t("account"), icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl border-t border-border"
      aria-label="Primary"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  active ? "text-brand" : "text-ink-subtle",
                )}
              >
                <Icon
                  className={cn(
                    "size-5",
                    active && "stroke-[2.4]",
                  )}
                />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
