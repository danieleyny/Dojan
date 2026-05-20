import { setRequestLocale } from "next-intl/server";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { AlertCircle, Play } from "lucide-react";
import type { Metadata } from "next";

import { disciplines, findDiscipline } from "@/data/disciplines";
import { techniques, findTechnique } from "@/data/techniques";
import { disciplineName } from "@/lib/i18n/localize";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  const params: { discipline: string; slug: string }[] = [];
  for (const t of techniques) params.push({ discipline: t.discipline_slug, slug: t.slug });
  // Pre-render the cross-product so 404s don't appear from sitemap entries
  for (const d of disciplines) {
    for (const t of techniques) {
      if (t.discipline_slug !== d.slug) params.push({ discipline: d.slug, slug: t.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale; discipline: string; slug: string }> }): Promise<Metadata> {
  const { locale, discipline, slug } = await params;
  const t = findTechnique(discipline, slug);
  if (!t) return {};
  const isHe = locale === "he";
  return {
    title: isHe ? t.name_he : t.name_en,
    description: isHe ? t.summary_he : t.summary_en,
  };
}

export default async function TechniquePage({
  params,
}: { params: Promise<{ locale: Locale; discipline: string; slug: string }> }) {
  const { locale, discipline, slug } = await params;
  setRequestLocale(locale);
  const t = findTechnique(discipline, slug);
  if (!t) notFound();
  return <Inner discipline={discipline} slug={slug} />;
}

function Inner({ discipline, slug }: { discipline: string; slug: string }) {
  const t = findTechnique(discipline, slug)!;
  const d = findDiscipline(discipline)!;
  const locale = useLocale() as Locale;
  const isHe = locale === "he";
  const ld = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t.name_en,
    description: t.summary_en,
    step: t.steps.map((s) => ({
      "@type": "HowToStep",
      name: s.title_en,
      text: s.body_en,
    })),
  };
  const videoLD = t.youtube_id
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: t.name_en,
        description: t.summary_en,
        thumbnailUrl: `https://i.ytimg.com/vi/${t.youtube_id}/maxresdefault.jpg`,
        contentUrl: `https://www.youtube.com/embed/${t.youtube_id}`,
        embedUrl: `https://www.youtube.com/embed/${t.youtube_id}`,
        uploadDate: "2024-01-01",
      }
    : null;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {videoLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLD) }} />
      )}
      <header
        className="border-b border-border"
        style={{ background: `linear-gradient(160deg, ${d.pin_color}14, #FBFAF7 70%)` }}
      >
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-12">
          <nav className="text-[13px] text-ink-muted flex items-center gap-1.5 mb-3">
            <Link href="/techniques" className="hover:text-ink">{isHe ? "ספרייה" : "Library"}</Link>
            <span>·</span>
            <Link href={`/techniques/${d.slug}`} className="hover:text-ink">{disciplineName(d, locale)}</Link>
          </nav>
          <h1 className="display text-3xl md:text-5xl font-extrabold leading-[1.05] max-w-3xl">
            {isHe ? t.name_he : t.name_en}
          </h1>
          <p className="mt-3 text-ink-muted max-w-2xl">{isHe ? t.summary_he : t.summary_en}</p>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-12 grid lg:grid-cols-[1.4fr_1fr] gap-10">
        <article>
          {/* Video */}
          {t.youtube_id ? (
            <div className="aspect-video rounded-2xl overflow-hidden bg-surface-2 mb-8 shadow-md">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${t.youtube_id}`}
                title={t.name_en}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : (
            <div className="aspect-video rounded-2xl bg-surface-2 grid place-items-center mb-8">
              <Play className="size-12 text-ink-subtle" />
            </div>
          )}

          {/* Steps */}
          <h2 className="display text-2xl md:text-3xl font-extrabold mb-5">
            {isHe ? "השלבים" : "The Steps"}
          </h2>
          <ol className="space-y-5">
            {t.steps.map((s) => (
              <li key={s.position} className="grid grid-cols-[auto_1fr] gap-5">
                <span
                  className="size-12 rounded-full grid place-items-center text-white font-extrabold display"
                  style={{ background: d.pin_color }}
                >
                  {s.position}
                </span>
                <div>
                  <h3 className="font-bold text-lg leading-tight mb-1">
                    {isHe ? s.title_he : s.title_en}
                  </h3>
                  <p className="text-ink-muted leading-relaxed">
                    {isHe ? s.body_he : s.body_en}
                  </p>
                  {(isHe ? s.common_mistake_he : s.common_mistake_en) && (
                    <p className="mt-2 inline-flex gap-1.5 items-start text-[13px] text-danger bg-danger/5 rounded-lg p-2.5">
                      <AlertCircle className="size-3.5 mt-0.5 shrink-0" />
                      <span><strong>{isHe ? "טעות נפוצה: " : "Common mistake: "}</strong>{isHe ? s.common_mistake_he : s.common_mistake_en}</span>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </article>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-subtle mb-3">
              {isHe ? "פרטים" : "Details"}
            </p>
            <dl className="space-y-2.5 text-sm">
              <Row k={isHe ? "אומנות" : "Discipline"} v={disciplineName(d, locale)} />
              <Row k={isHe ? "קטגוריה" : "Category"} v={t.category} />
              <Row k={isHe ? "קושי" : "Difficulty"} v={"●".repeat(t.difficulty) + "○".repeat(5 - t.difficulty)} />
            </dl>
            <Link href={`/disciplines/${d.slug}`} className="block mt-4 text-sm font-semibold text-brand hover:text-brand-700">
              {isHe ? `קראי על ${disciplineName(d, locale)}` : `Read about ${disciplineName(d, locale)}`} →
            </Link>
            <Link href={`/search?discipline=${d.slug}`} className="block mt-2 text-sm font-semibold text-brand hover:text-brand-700">
              {isHe ? `מצאי מועדון ${disciplineName(d, locale)}` : `Find a ${disciplineName(d, locale)} gym`} →
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-ink-subtle">{k}</dt>
      <dd className="font-semibold text-ink">{v}</dd>
    </div>
  );
}
