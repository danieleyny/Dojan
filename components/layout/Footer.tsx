import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
// Lucide v0.4xx renamed brand glyphs; using neutral icons for socials.
import { AtSign, Send, Globe } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const sections = [
    {
      title: t("explore"),
      links: [
        ["disciplines", "/disciplines"],
        ["cities", "/cities"],
        ["quiz", "/quiz"],
        ["blog", "/blog"],
      ],
    },
    {
      title: t("for_business"),
      links: [
        ["list_gym", "/list-your-gym"],
        ["pricing", "/pricing"],
        ["for_owners", "/dashboard"],
      ],
    },
    {
      title: t("company"),
      links: [
        ["about", "/about"],
        ["contact", "/contact"],
        ["press", "/press"],
      ],
    },
    {
      title: t("legal"),
      links: [
        ["privacy", "/privacy"],
        ["terms", "/terms"],
      ],
    },
  ] as const;

  return (
    <footer className="mt-24 border-t border-border bg-surface-2">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          <div className="col-span-2">
            <Logo className="h-9 mb-4" />
            <p className="text-ink-muted text-sm leading-relaxed max-w-xs">
              {t("tagline")}
            </p>
            <div className="flex gap-3 mt-6 text-ink-muted">
              <a aria-label="Instagram" className="hover:text-ink transition-colors" href="#">
                <AtSign className="size-5" />
              </a>
              <a aria-label="Facebook" className="hover:text-ink transition-colors" href="#">
                <Globe className="size-5" />
              </a>
              <a aria-label="Telegram" className="hover:text-ink transition-colors" href="#">
                <Send className="size-5" />
              </a>
            </div>
          </div>

          {sections.map((s) => (
            <div key={s.title}>
              <h3 className="text-sm font-semibold mb-3 text-ink">{s.title}</h3>
              <ul className="flex flex-col gap-2 text-sm">
                {s.links.map(([key, href]) => (
                  <li key={key}>
                    <Link
                      href={href as never}
                      className="text-ink-muted hover:text-ink transition-colors"
                    >
                      {t(`links.${key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row gap-3 items-center justify-between text-xs text-ink-subtle">
          <span>{t("rights")}</span>
          <span>{t("made_with")}</span>
        </div>
      </div>
    </footer>
  );
}
