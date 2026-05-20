import { setRequestLocale } from "next-intl/server";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Flag } from "lucide-react";
import { storyPosts, localizedField } from "@/data/editorial";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "he"
        ? "ישראל בלחימה — סיפורים מהזירה"
        : "Israel in Combat — Stories from the Mat",
  };
}

export default async function IsraelInCombatHubPage({
  params,
}: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Inner />;
}

function Inner() {
  const locale = useLocale() as Locale;
  const isHe = locale === "he";
  return (
    <>
      <header
        className="border-b border-border"
        style={{
          background:
            "linear-gradient(160deg, #0E1116 0%, #0F4C5C 50%, #F76B53 200%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-14 md:py-24 text-white">
          <p className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.18em] font-bold text-accent bg-accent/15 rounded-full px-3 py-1.5 mb-4 w-fit">
            <Flag className="size-3.5" />
            {isHe ? "תיעוד" : "Long-form"}
          </p>
          <h1 className="display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.02] max-w-4xl">
            {isHe ? "ישראל בלחימה — סיפורים מהזירה" : "Israel in combat — stories from the mat"}
          </h1>
          <p className="mt-5 text-white/80 max-w-2xl text-lg leading-relaxed">
            {isHe
              ? "ההיסטוריה של אומנויות הלחימה בישראל בכתבות מעמיקות. מקרב מגע ועד הדור הבא של MMA."
              : "The history of Israel's martial arts in long-form. From Krav Maga's origins to the next generation of MMA."}
          </p>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {storyPosts.map((p) => (
          <Link
            key={p.slug}
            href={`/israel-in-combat/${p.slug}`}
            className="rounded-2xl border border-border bg-surface overflow-hidden hover:shadow-md transition-all group"
          >
            <div className="aspect-[16/10] bg-gradient-to-br from-brand to-brand-700 relative grid place-items-center">
              <Flag className="size-12 text-white/30" />
            </div>
            <div className="p-5">
              <h3 className="font-bold leading-tight group-hover:text-brand transition-colors">
                {localizedField(p, "title", locale)}
              </h3>
              <p className="text-sm text-ink-muted mt-2 line-clamp-3">
                {localizedField(p, "excerpt", locale)}
              </p>
              <p className="text-[11px] text-ink-subtle mt-3">
                {p.reading_minutes} {isHe ? "דק' קריאה" : "min read"} · {p.author}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
