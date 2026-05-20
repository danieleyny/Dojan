import { setRequestLocale } from "next-intl/server";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Film } from "lucide-react";
import { watchPosts, localizedField } from "@/data/editorial";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "he"
        ? "לצפות — סרטים, קרבות, וביקורת לחימה"
        : "Watch — Combat Films, Fights & Reviews",
  };
}

export default async function WatchHubPage({
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
      <header className="bg-warm-radial border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-14 md:py-20">
          <p className="text-[12px] uppercase tracking-[0.18em] font-semibold text-accent bg-accent/10 rounded-full px-3 py-1.5 mb-4 inline-flex items-center gap-1.5 w-fit">
            <Film className="size-3.5" />
            {isHe ? "ביקורות" : "Editorial"}
          </p>
          <h1 className="display text-4xl md:text-6xl font-extrabold leading-[1.05]">
            {isHe ? "לצפות — לחימה במסך" : "Watch — combat on screen"}
          </h1>
          <p className="mt-4 text-ink-muted max-w-2xl text-lg">
            {isHe
              ? "ביקורות מעמיקות של סרטים, סדרות, וקרבות מקצועיים. נכתב על ידי מאמנים."
              : "Deep reviews of movies, TV, and pro fights. Written by working coaches."}
          </p>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {watchPosts.map((p) => (
          <Link
            key={p.slug}
            href={`/watch/${p.slug}`}
            className="rounded-2xl border border-border bg-surface overflow-hidden hover:shadow-md transition-all group"
          >
            <div className="aspect-[16/10] bg-gradient-to-br from-ink to-brand-700 relative grid place-items-center">
              <Film className="size-12 text-white/30" />
              {p.media && (
                <span className="absolute bottom-3 start-3 text-[10px] uppercase tracking-wider font-bold bg-black/40 text-white rounded-full px-2 py-1 backdrop-blur">
                  {p.media.kind} · {p.media.year ?? ""}
                </span>
              )}
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
