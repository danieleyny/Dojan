import { setRequestLocale } from "next-intl/server";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Library } from "lucide-react";
import { disciplines } from "@/data/disciplines";
import { techniques } from "@/data/techniques";
import { disciplineName } from "@/lib/i18n/localize";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "he"
        ? "ספריית טכניקות — מדריכי לחימה צעד-אחר-צעד"
        : "Technique Library — Step-by-step Combat Guides",
  };
}

export default async function TechniquesHubPage({
  params,
}: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Inner />;
}

function Inner() {
  const locale = useLocale() as Locale;
  const isHe = locale === "he";
  const counts = disciplines.map((d) => ({
    d,
    count: techniques.filter((t) => t.discipline_slug === d.slug).length,
  }));
  return (
    <>
      <header className="bg-warm-radial border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-14 md:py-20">
          <p className="text-[12px] uppercase tracking-[0.18em] font-semibold text-brand bg-brand/10 rounded-full px-3 py-1.5 mb-4 inline-flex items-center gap-1.5 w-fit">
            <Library className="size-3.5" />
            {isHe ? "ספרייה" : "Library"}
          </p>
          <h1 className="display text-4xl md:text-6xl font-extrabold leading-[1.05] max-w-3xl">
            {isHe ? "ספריית טכניקות — צעד-אחר-צעד" : "Technique library — step by step"}
          </h1>
          <p className="mt-4 text-ink-muted max-w-2xl text-lg">
            {isHe
              ? "כל טכניקה מוסברת ב-4 שלבים, עם וידאו וטעויות נפוצות. נבנה על ידי מאמנים מובילים."
              : "Every technique broken into 4 steps, with video and common mistakes. Authored by leading coaches."}
          </p>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {counts
          .filter((x) => x.count > 0)
          .map(({ d, count }) => (
            <Link
              key={d.slug}
              href={`/techniques/${d.slug}`}
              className="rounded-2xl border border-border bg-surface p-6 hover:shadow-md transition-all group"
            >
              <div
                className="size-12 rounded-xl mb-4"
                style={{ background: `linear-gradient(135deg, ${d.pin_color}, ${d.pin_color}cc)` }}
              />
              <h3 className="display font-bold text-xl group-hover:text-brand transition-colors">
                {disciplineName(d, locale)}
              </h3>
              <p className="text-sm text-ink-muted mt-1">
                {count} {isHe ? "טכניקות" : "techniques"}
              </p>
            </Link>
          ))}
      </div>
    </>
  );
}
