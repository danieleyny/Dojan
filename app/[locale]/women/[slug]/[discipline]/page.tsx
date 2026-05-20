import { setRequestLocale } from "next-intl/server";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { findCity, cities } from "@/data/cities";
import { findDiscipline, disciplines } from "@/data/disciplines";
import { gymsByCityDiscipline } from "@/data/gyms";
import { GymCard } from "@/components/ui/GymCard";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { cityName, disciplineName } from "@/lib/i18n/localize";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  const params: { slug: string; discipline: string }[] = [];
  for (const c of cities) {
    for (const d of disciplines) {
      params.push({ slug: c.slug, discipline: d.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string; discipline: string }>;
}): Promise<Metadata> {
  const { locale, slug, discipline } = await params;
  const c = findCity(slug);
  const d = findDiscipline(discipline);
  if (!c || !d) return {};
  const isHe = locale === "he";
  const cn = cityName(c, locale);
  const dn = disciplineName(d, locale);
  return {
    title: isHe
      ? `${dn} לנשים ב${cn}`
      : `${dn} for Women in ${cn}`,
    description: isHe
      ? `מועדוני ${dn} עם תוכניות נשים ב${cn}.`
      : `${dn} gyms with women's programs in ${cn}.`,
  };
}

export default async function WomenCityDisciplinePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string; discipline: string }>;
}) {
  const { locale, slug, discipline } = await params;
  setRequestLocale(locale);
  if (!findCity(slug) || !findDiscipline(discipline)) notFound();
  return <Inner citySlug={slug} disciplineSlug={discipline} />;
}

function Inner({ citySlug, disciplineSlug }: { citySlug: string; disciplineSlug: string }) {
  const c = findCity(citySlug)!;
  const d = findDiscipline(disciplineSlug)!;
  const locale = useLocale() as Locale;
  const isHe = locale === "he";
  const list = gymsByCityDiscipline(citySlug, disciplineSlug);
  const cn = cityName(c, locale);
  const dn = disciplineName(d, locale);

  return (
    <>
      <header
        className="border-b border-border"
        style={{
          background: `linear-gradient(135deg, ${d.pin_color}1a, #FBFAF7 70%)`,
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <nav className="text-[13px] text-ink-muted flex items-center gap-1.5 mb-4">
            <Link href="/women" className="hover:text-ink">{isHe ? "נשים" : "Women"}</Link>
            <span>·</span>
            <Link href={`/women/${c.slug}`} className="hover:text-ink">{cn}</Link>
            <span>·</span>
            <span className="text-ink font-semibold">{dn}</span>
          </nav>
          <h1 className="display text-4xl md:text-6xl font-extrabold leading-[1.05]">
            {isHe ? `${dn} לנשים ב${cn}` : `${dn} for Women in ${cn}`}
          </h1>
          <p className="mt-3 text-ink-muted max-w-2xl">
            {list.length}{" "}
            {isHe ? "מועדונים מאומתים." : "verified gyms. Trial classes, female coaches, schedules."}
          </p>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 space-y-14">
        <section>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.length === 0 ? (
              <p className="col-span-full text-ink-muted">
                {isHe ? "אין עדיין מועדוני " + dn + " לנשים ב" + cn + ". מלאי את הטופס ונחזור אליך." : `No women's ${dn} gyms in ${cn} yet. Fill out the form and we'll match you.`}
              </p>
            ) : (
              list.map((g) => <GymCard key={g.slug} gym={g} />)
            )}
          </div>
        </section>
        <section>
          <h2 className="display text-2xl md:text-3xl font-extrabold mb-5">
            {isHe ? "לא רואה את המועדון שלך?" : "Don't see your option?"}
          </h2>
          <InquiryForm variant="women_only" citySlug={citySlug} disciplineSlug={disciplineSlug} className="max-w-xl" />
        </section>
      </div>
    </>
  );
}
