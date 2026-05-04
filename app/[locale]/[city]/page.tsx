import { setRequestLocale } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { findCity, cities } from "@/data/cities";
import { findDiscipline, disciplines } from "@/data/disciplines";
import { gymsByCity } from "@/data/gyms";
import { GymCard } from "@/components/ui/GymCard";
import { DisciplinePill } from "@/components/ui/DisciplinePill";
import { CityHero } from "@/components/ui/CityHero";
import type { Locale } from "@/i18n/routing";

export async function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; city: string }>;
}): Promise<Metadata> {
  const { locale, city } = await params;
  const c = findCity(city);
  if (!c) return {};
  const isHe = locale === "he";
  const name = isHe ? c.name_he : c.name_en;
  return {
    title: isHe ? `אומנויות לחימה ב${name}` : `Martial Arts in ${name}`,
    description: isHe
      ? `כל המועדונים הטובים ב${name}. מאומתים, מדורגים, וזמינים לשיעור ניסיון.`
      : `Every great gym in ${name}. Verified, reviewed, and bookable.`,
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ locale: Locale; city: string }>;
}) {
  const { locale, city } = await params;
  setRequestLocale(locale);
  const c = findCity(city);
  if (!c) notFound();
  return <Inner citySlug={city} />;
}

function Inner({ citySlug }: { citySlug: string }) {
  const c = findCity(citySlug)!;
  const t = useTranslations("city");
  const locale = useLocale() as "he" | "en";
  const isHe = locale === "he";
  const list = gymsByCity(citySlug);
  const cityName = isHe ? c.name_he : c.name_en;

  const disciplineCounts = list
    .flatMap((g) => g.discipline_slugs)
    .reduce<Record<string, number>>((acc, slug) => {
      acc[slug] = (acc[slug] ?? 0) + 1;
      return acc;
    }, {});
  const topDisciplines = Object.entries(disciplineCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([slug, count]) => ({
      d: findDiscipline(slug)!,
      count,
    }))
    .filter((x) => x.d);

  return (
    <>
      <header className="relative">
        <div className="absolute inset-0">
          <CityHero citySlug={citySlug} variant="banner" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/30 to-black/70" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-10 md:pb-16 text-white min-h-[360px] flex flex-col justify-end">
          <p className="text-[12px] uppercase tracking-[0.18em] font-semibold text-white/80 mb-2">
            {isHe ? c.district_he : c.district_en}
          </p>
          <h1 className="display text-5xl md:text-7xl font-extrabold leading-[1]">
            {t("page_title_prefix")}
            {cityName}
          </h1>
          <p className="mt-4 text-white/85 text-lg max-w-2xl">
            {t("subtitle", { count: list.length, city: cityName })}
          </p>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16 space-y-14">
        {topDisciplines.length > 0 && (
          <section>
            <h2 className="display text-2xl md:text-3xl font-extrabold mb-5">
              {t("top_disciplines", { city: cityName })}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {topDisciplines.map(({ d, count }) => (
                <Link
                  key={d.slug}
                  href={`/${citySlug}/${d.slug}`}
                  className="group rounded-2xl border border-border bg-surface p-4 hover:shadow-md transition-all"
                >
                  <DisciplinePill color={d.pin_color} variant="soft" size="sm">
                    {isHe ? d.name_he : d.name_en}
                  </DisciplinePill>
                  <p className="text-[13px] text-ink-muted mt-3">
                    {count} {isHe ? "מועדונים" : "gyms"}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="display text-2xl md:text-3xl font-extrabold mb-5">
            {t("all_gyms", { city: cityName })}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((g) => (
              <GymCard key={g.slug} gym={g} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="display text-2xl md:text-3xl font-extrabold mb-5">
            {t("related_cities")}
          </h2>
          <div className="flex flex-wrap gap-3">
            {cities
              .filter((other) => other.slug !== citySlug)
              .map((other) => (
                <Link
                  key={other.slug}
                  href={`/${other.slug}`}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-ink-muted transition-colors"
                >
                  {isHe ? other.name_he : other.name_en}
                </Link>
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
