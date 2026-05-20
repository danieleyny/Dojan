import { setRequestLocale } from "next-intl/server";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { Play } from "lucide-react";
import { disciplines, findDiscipline } from "@/data/disciplines";
import { techniquesByDiscipline } from "@/data/techniques";
import { disciplineName } from "@/lib/i18n/localize";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export function generateStaticParams() {
  return disciplines.map((d) => ({ discipline: d.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale; discipline: string }> }): Promise<Metadata> {
  const { locale, discipline } = await params;
  const d = findDiscipline(discipline);
  if (!d) return {};
  const isHe = locale === "he";
  const n = isHe ? d.name_he : d.name_en;
  return { title: isHe ? `טכניקות ${n}` : `${n} Techniques` };
}

export default async function TechniquesByDisciplinePage({
  params,
}: { params: Promise<{ locale: Locale; discipline: string }> }) {
  const { locale, discipline } = await params;
  setRequestLocale(locale);
  if (!findDiscipline(discipline)) notFound();
  return <Inner discipline={discipline} />;
}

function Inner({ discipline }: { discipline: string }) {
  const d = findDiscipline(discipline)!;
  const locale = useLocale() as Locale;
  const isHe = locale === "he";
  const list = techniquesByDiscipline(discipline);
  return (
    <>
      <header
        className="border-b border-border"
        style={{ background: `linear-gradient(135deg, ${d.pin_color}1a, #FBFAF7 70%)` }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <nav className="text-[13px] text-ink-muted flex items-center gap-1.5 mb-4">
            <Link href="/techniques" className="hover:text-ink">{isHe ? "ספרייה" : "Library"}</Link>
            <span>·</span>
            <span className="text-ink font-semibold">{disciplineName(d, locale)}</span>
          </nav>
          <h1 className="display text-4xl md:text-6xl font-extrabold leading-[1.05]">
            {isHe ? `טכניקות ${disciplineName(d, locale)}` : `${disciplineName(d, locale)} Techniques`}
          </h1>
          <p className="mt-3 text-ink-muted">
            {list.length} {isHe ? "טכניקות" : "techniques"} · {isHe ? "מתחילים עד מתקדמים" : "Beginner through advanced"}
          </p>
        </div>
      </header>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((t) => (
          <Link
            key={t.slug}
            href={`/techniques/${discipline}/${t.slug}`}
            className="rounded-2xl border border-border bg-surface overflow-hidden hover:shadow-md transition-all group"
          >
            <div
              className="aspect-video relative grid place-items-center"
              style={{ background: `linear-gradient(135deg, ${d.pin_color}, ${d.pin_color}cc)` }}
            >
              <Play className="size-12 text-white/80 fill-white/20 group-hover:scale-110 transition-transform" />
              <span className="absolute top-3 end-3 text-[10px] uppercase tracking-wider font-bold bg-black/30 text-white rounded-full px-2 py-1 backdrop-blur">
                {t.category}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-bold leading-tight">
                {isHe ? t.name_he : t.name_en}
              </h3>
              <p className="text-sm text-ink-muted mt-1 line-clamp-2">
                {isHe ? t.summary_he : t.summary_en}
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-wider text-ink-subtle font-bold">
                <span>{isHe ? "קושי" : "Difficulty"}</span>
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="block w-1.5 h-2 rounded-sm" style={{ background: i < t.difficulty ? d.pin_color : "#E8E5DD" }} />
                  ))}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {list.length === 0 && (
          <p className="col-span-full text-ink-muted">
            {isHe ? "טכניקות ל-" + disciplineName(d, locale) + " בקרוב." : `Techniques for ${disciplineName(d, locale)} coming soon.`}
          </p>
        )}
      </div>
    </>
  );
}
