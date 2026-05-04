import { setRequestLocale } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { findCity, cities } from "@/data/cities";
import { findDiscipline, disciplines } from "@/data/disciplines";
import { gymsByCityDiscipline } from "@/data/gyms";
import { GymCard } from "@/components/ui/GymCard";
import type { Locale } from "@/i18n/routing";

export async function generateStaticParams() {
  const params: { city: string; discipline: string }[] = [];
  for (const c of cities) {
    for (const d of disciplines) {
      params.push({ city: c.slug, discipline: d.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; city: string; discipline: string }>;
}): Promise<Metadata> {
  const { locale, city, discipline } = await params;
  const c = findCity(city);
  const d = findDiscipline(discipline);
  if (!c || !d) return {};
  const isHe = locale === "he";
  const cityName = isHe ? c.name_he : c.name_en;
  const discName = isHe ? d.name_he : d.name_en;
  return {
    title: isHe ? `${discName} ב${cityName}` : `${discName} in ${cityName}`,
    description: isHe
      ? `מועדוני ${discName} מובילים ב${cityName}. שיעורי ניסיון, ביקורות, ולוח זמנים מלא.`
      : `Top ${discName} gyms in ${cityName}. Trial classes, reviews, full schedules.`,
  };
}

export default async function CityDisciplinePage({
  params,
}: {
  params: Promise<{ locale: Locale; city: string; discipline: string }>;
}) {
  const { locale, city, discipline } = await params;
  setRequestLocale(locale);
  if (!findCity(city) || !findDiscipline(discipline)) notFound();
  return <Inner citySlug={city} disciplineSlug={discipline} />;
}

function Inner({
  citySlug,
  disciplineSlug,
}: {
  citySlug: string;
  disciplineSlug: string;
}) {
  const c = findCity(citySlug)!;
  const d = findDiscipline(disciplineSlug)!;
  const t = useTranslations("city_discipline");
  const locale = useLocale() as "he" | "en";
  const isHe = locale === "he";
  const list = gymsByCityDiscipline(citySlug, disciplineSlug);
  const cityName = isHe ? c.name_he : c.name_en;
  const discName = isHe ? d.name_he : d.name_en;

  return (
    <>
      <header
        className="border-b border-border"
        style={{
          background: `linear-gradient(135deg, ${d.pin_color}10, ${d.pin_color}03)`,
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <nav className="text-[13px] text-ink-muted flex items-center gap-1.5 mb-4">
            <Link href="/cities" className="hover:text-ink">
              {isHe ? "ערים" : "Cities"}
            </Link>
            <span>·</span>
            <Link href={`/${citySlug}`} className="hover:text-ink">
              {cityName}
            </Link>
          </nav>
          <h1 className="display text-4xl md:text-6xl font-extrabold leading-[1.05]">
            {t("title", { discipline: discName, city: cityName })}
          </h1>
          <p className="mt-4 text-ink-muted max-w-2xl text-[16px] md:text-lg">
            {t("subtitle", {
              discipline: discName,
              city: cityName,
              count: list.length,
            })}
          </p>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 space-y-14">
        <section>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.length === 0 ? (
              <p className="col-span-full text-ink-muted">
                {isHe
                  ? "אין עדיין מועדוני " +
                    discName +
                    " ב" +
                    cityName +
                    ". בקרוב נוסיף!"
                  : `No ${discName} gyms yet in ${cityName}. Coming soon!`}
              </p>
            ) : (
              list.map((g) => <GymCard key={g.slug} gym={g} />)
            )}
          </div>
        </section>

        <section>
          <h2 className="display text-2xl md:text-3xl font-extrabold mb-5">
            {t("related_disciplines", { city: cityName })}
          </h2>
          <div className="flex flex-wrap gap-2">
            {d.related && d.related.length > 0 ? (
              d.related.map((r) => {
                const rd = findDiscipline(r);
                if (!rd) return null;
                return (
                  <Link
                    key={r}
                    href={`/${citySlug}/${r}`}
                    className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-ink-muted transition-colors"
                  >
                    {isHe ? rd.name_he : rd.name_en}
                  </Link>
                );
              })
            ) : (
              <p className="text-ink-muted text-sm">
                {isHe ? "מועדונים נוספים בקרוב." : "More disciplines coming soon."}
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="display text-2xl md:text-3xl font-extrabold mb-5">
            {t("related_cities", { discipline: discName })}
          </h2>
          <div className="flex flex-wrap gap-2">
            {cities
              .filter((other) => other.slug !== citySlug)
              .slice(0, 6)
              .map((other) => (
                <Link
                  key={other.slug}
                  href={`/${other.slug}/${disciplineSlug}`}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-ink-muted transition-colors"
                >
                  {discName} {isHe ? "ב" : "in"}{" "}
                  {isHe ? other.name_he : other.name_en}
                </Link>
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
