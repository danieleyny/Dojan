import { setRequestLocale } from "next-intl/server";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ChevronRight, ChevronLeft, MapPin, Clock, Award, Users, Activity, Check } from "lucide-react";
import type { Metadata } from "next";

import { findDiscipline, disciplines } from "@/data/disciplines";
import { gymsByDiscipline } from "@/data/gyms";
import { findCity } from "@/data/cities";
import { GymCard } from "@/components/ui/GymCard";
import { DisciplinePill } from "@/components/ui/DisciplinePill";
import { DisciplineHero } from "@/components/ui/DisciplineHero";
import type { Locale } from "@/i18n/routing";

export async function generateStaticParams() {
  return disciplines.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const d = findDiscipline(slug);
  if (!d) return {};
  const isHe = locale === "he";
  const name = isHe ? d.name_he : d.name_en;
  const desc = isHe ? d.short_he : d.short_en;
  return {
    title: `${name} — ${isHe ? "מדריך מלא" : "Complete Guide"}`,
    description: desc,
    openGraph: {
      images: [d.hero_image],
    },
    alternates: {
      canonical: locale === "he" ? `/disciplines/${slug}` : `/${locale}/disciplines/${slug}`,
      languages: {
        he: `/disciplines/${slug}`,
        en: `/en/disciplines/${slug}`,
      },
    },
  };
}

export default async function DisciplinePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const d = findDiscipline(slug);
  if (!d) notFound();

  return <Article slug={slug} />;
}

function Article({ slug }: { slug: string }) {
  const d = findDiscipline(slug);
  if (!d) return null;
  const t = useTranslations("discipline");
  const locale = useLocale() as "he" | "en";
  const isHe = locale === "he";
  const Chevron = isHe ? ChevronLeft : ChevronRight;

  const gyms = gymsByDiscipline(slug).slice(0, 12);
  // Group gyms by city
  const byCity: Record<string, typeof gyms> = {};
  for (const g of gyms) {
    (byCity[g.city_slug] ||= []).push(g);
  }

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: isHe ? d.name_he : d.name_en,
    description: isHe ? d.short_he : d.short_en,
    image: d.hero_image,
    inLanguage: locale === "he" ? "he-IL" : "en-US",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <header className="relative">
        <div className="absolute inset-0">
          <DisciplineHero color={d.pin_color} slug={d.slug} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/30 to-black/75" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 pt-14 md:pt-24 pb-10 md:pb-16 text-white min-h-[400px] md:min-h-[480px] flex flex-col justify-end">
          <nav className="text-[13px] text-white/80 flex items-center gap-1.5 mb-5">
            <Link href="/disciplines" className="hover:text-white">
              {isHe ? "אומנויות לחימה" : "Disciplines"}
            </Link>
            <Chevron className="size-3" />
            <span className="text-white">{isHe ? d.name_he : d.name_en}</span>
          </nav>
          <DisciplinePill color={d.pin_color} variant="solid" size="md">
            {t(`family_labels.${d.family}`)}
          </DisciplinePill>
          <h1 className="display text-4xl md:text-6xl lg:text-7xl font-extrabold mt-3 leading-[1.05]">
            {isHe ? d.name_he : d.name_en}
          </h1>
          <p className="mt-3 text-white/85 text-lg md:text-xl max-w-2xl leading-relaxed">
            {isHe ? d.short_he : d.short_en}
          </p>
        </div>
      </header>

      {/* Fact strip */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-5 grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          <Fact
            icon={<MapPin className="size-4" />}
            label={t("origin")}
            value={isHe ? d.origin_he : d.origin_en}
          />
          {d.founded_year && (
            <Fact
              icon={<Clock className="size-4" />}
              label={t("founded")}
              value={String(d.founded_year)}
            />
          )}
          <Fact
            icon={<Activity className="size-4" />}
            label={t("difficulty")}
            value={renderBars(d.difficulty)}
          />
          <Fact
            icon={<Award className="size-4" />}
            label={t("contact")}
            value={renderBars(d.contact_level)}
          />
          <Fact
            icon={<Users className="size-4" />}
            label={t("good_for")}
            value={d.good_for
              .slice(0, 2)
              .map((g) => t(`good_for_labels.${g}`))
              .join(" • ")}
          />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid lg:grid-cols-[260px_1fr] gap-10 py-10 md:py-14">
        {/* TOC sidebar */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1 text-sm">
            <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-subtle mb-3">
              {isHe ? "תוכן עניינים" : "On this page"}
            </p>
            {[
              ["history", t("history")],
              ["philosophy", t("philosophy")],
              ["techniques", t("techniques")],
              ["famous", t("famous")],
              ["benefits", t("benefits")],
              ["who", t("who_for")],
              ["where", t("where")],
              ["faq", t("faq")],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="block py-1.5 text-ink-muted hover:text-brand transition-colors border-s-2 border-transparent hover:border-brand-500 ps-3"
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <article className="min-w-0 space-y-12 md:space-y-16">
          {(isHe ? d.body_he : d.body_en) && (
            <section className="text-lg leading-[1.75] text-ink-muted max-w-3xl">
              {isHe ? d.body_he : d.body_en}
            </section>
          )}

          {(isHe ? d.history_he : d.history_en) && (
            <Section id="history" title={t("history")}>
              <p>{isHe ? d.history_he : d.history_en}</p>
            </Section>
          )}

          {(isHe ? d.philosophy_he : d.philosophy_en) && (
            <Section id="philosophy" title={t("philosophy")}>
              <p>{isHe ? d.philosophy_he : d.philosophy_en}</p>
            </Section>
          )}

          {d.techniques && d.techniques.length > 0 && (
            <Section id="techniques" title={t("techniques")}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {d.techniques.map((tech) => (
                  <div
                    key={tech.name_en}
                    className="rounded-2xl border border-border bg-surface p-5"
                  >
                    <h3 className="font-bold text-[16px] mb-2">
                      {isHe ? tech.name_he : tech.name_en}
                    </h3>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      {isHe ? tech.description_he : tech.description_en}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {d.famous_practitioners && d.famous_practitioners.length > 0 && (
            <Section id="famous" title={t("famous")}>
              <ul className="grid sm:grid-cols-2 gap-4">
                {d.famous_practitioners.map((p) => (
                  <li
                    key={p.name}
                    className="flex gap-4 items-start p-4 rounded-xl bg-surface-2"
                  >
                    <div
                      className="size-12 rounded-full grid place-items-center text-white font-bold display shrink-0"
                      style={{ background: d.pin_color }}
                    >
                      {p.name.slice(0, 1)}
                    </div>
                    <div>
                      <h3 className="font-bold">{p.name}</h3>
                      <p className="text-sm text-ink-muted">
                        {isHe ? p.achievement_he : p.achievement_en}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {(isHe ? d.benefits_he : d.benefits_en)?.length ? (
            <Section id="benefits" title={t("benefits")}>
              <ul className="grid sm:grid-cols-2 gap-2.5">
                {(isHe ? d.benefits_he : d.benefits_en)!.map((b) => (
                  <li key={b} className="flex gap-2.5 items-start">
                    <Check className="size-5 mt-0.5 text-success shrink-0" />
                    <span className="text-ink leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {(isHe ? d.who_for_he : d.who_for_en) && (
            <Section id="who" title={t("who_for")}>
              <div className="rounded-2xl bg-brand/5 border border-brand/20 p-6">
                <p className="text-ink leading-relaxed">
                  {isHe ? d.who_for_he : d.who_for_en}
                </p>
              </div>
            </Section>
          )}

          {Object.keys(byCity).length > 0 && (
            <Section
              id="where"
              title={t("where")}
              subtitle={t("where_subtitle")}
            >
              <div className="space-y-7">
                {Object.entries(byCity).map(([citySlug, list]) => {
                  const city = findCity(citySlug)!;
                  return (
                    <div key={citySlug}>
                      <div className="flex items-end justify-between mb-3">
                        <h3 className="display font-bold text-xl">
                          {isHe ? city.name_he : city.name_en}
                        </h3>
                        <Link
                          href={`/${citySlug}/${slug}`}
                          className="text-sm font-semibold text-brand hover:text-brand-700"
                        >
                          {t("all_in_city", {
                            city: isHe ? city.name_he : city.name_en,
                          })}
                          {" "}
                          <Chevron className="inline size-3.5" />
                        </Link>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {list.slice(0, 3).map((g) => (
                          <GymCard key={g.slug} gym={g} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {d.faq && d.faq.length > 0 && (
            <Section id="faq" title={t("faq")}>
              <div className="space-y-3">
                {d.faq.map((f) => (
                  <details
                    key={f.q_en}
                    className="group rounded-2xl border border-border bg-surface p-5 open:shadow-sm"
                  >
                    <summary className="cursor-pointer font-semibold text-[16px] flex items-center justify-between gap-3 list-none">
                      <span>{isHe ? f.q_he : f.q_en}</span>
                      <Chevron className="size-4 text-ink-subtle transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-ink-muted leading-relaxed">
                      {isHe ? f.a_he : f.a_en}
                    </p>
                  </details>
                ))}
              </div>
            </Section>
          )}

          {/* Related */}
          {d.related && d.related.length > 0 && (
            <Section title={t("compare")}>
              <div className="flex flex-wrap gap-3">
                {d.related.map((r) => {
                  const rd = findDiscipline(r);
                  if (!rd) return null;
                  return (
                    <Link
                      key={r}
                      href={`/disciplines/${r}`}
                      className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-ink-muted transition-colors"
                    >
                      {isHe ? rd.name_he : rd.name_en}
                    </Link>
                  );
                })}
              </div>
            </Section>
          )}
        </article>
      </div>
    </>
  );
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="display text-2xl md:text-3xl font-extrabold mb-2">
        {title}
      </h2>
      {subtitle && <p className="text-ink-muted mb-5">{subtitle}</p>}
      <div className="prose prose-neutral max-w-none text-[16px] leading-[1.75] text-ink-muted">
        {children}
      </div>
    </section>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
        {icon}
        {label}
      </span>
      <span className="text-[15px] font-semibold text-ink">{value}</span>
    </div>
  );
}

function renderBars(level: number) {
  return (
    <span className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`block w-3 h-2 rounded-sm ${
            i < level ? "bg-ink" : "bg-border"
          }`}
        />
      ))}
    </span>
  );
}
