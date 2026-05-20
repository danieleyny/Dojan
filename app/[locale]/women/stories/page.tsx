import { setRequestLocale } from "next-intl/server";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { storyPosts, localizedField } from "@/data/editorial";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "he" ? "סיפורי נשים בלחימה — Dojan" : "Women's Stories — Dojan",
  };
}

export default async function WomensStoriesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Inner />;
}

function Inner() {
  const locale = useLocale() as Locale;
  const isHe = locale === "he";
  // Filter to stories that prominently feature women coaches / topics
  const stories = storyPosts.filter(
    (p) => p.related_coaches.includes("shira-mizrahi") || p.slug.includes("women"),
  );
  return (
    <>
      <header className="bg-warm-radial border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-14 md:py-20">
          <p className="text-[12px] uppercase tracking-[0.18em] font-semibold text-accent mb-3">
            {isHe ? "ראיונות" : "Interviews"}
          </p>
          <h1 className="display text-4xl md:text-6xl font-extrabold leading-[1.05]">
            {isHe ? "סיפורי נשים בלחימה" : "Women's stories from the mat"}
          </h1>
          <p className="mt-4 text-ink-muted max-w-2xl text-lg">
            {isHe
              ? "ראיונות עם מאמנות, מתחרות, ותלמידות שעיצבו את סצנת אומנויות הלחימה הנשית בישראל."
              : "Interviews with coaches, competitors, and students shaping Israel's women's martial arts scene."}
          </p>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stories.map((p) => (
          <Link
            key={p.slug}
            href={`/israel-in-combat/${p.slug}`}
            className="rounded-2xl border border-border bg-surface overflow-hidden hover:shadow-md transition-all"
          >
            <div className="aspect-[16/10] bg-gradient-to-br from-brand to-brand-700" />
            <div className="p-5">
              <h3 className="font-bold leading-tight">{localizedField(p, "title", locale)}</h3>
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
