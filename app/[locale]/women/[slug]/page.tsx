import { setRequestLocale } from "next-intl/server";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { findCity, cities } from "@/data/cities";
import { findDiscipline, disciplines } from "@/data/disciplines";
import { gymsByCity, gymsByDiscipline } from "@/data/gyms";
import { coaches } from "@/data/coaches";
import { GymCard } from "@/components/ui/GymCard";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { cityName, disciplineName } from "@/lib/i18n/localize";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return [
    ...cities.map((c) => ({ slug: c.slug })),
    ...disciplines.map((d) => ({ slug: d.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const city = findCity(slug);
  const discipline = findDiscipline(slug);
  if (!city && !discipline) return {};
  const isHe = locale === "he";
  if (city) {
    const n = cityName(city, locale);
    return {
      title: isHe ? `אומנויות לחימה לנשים ב${n}` : `Women's Martial Arts in ${n}`,
      description: isHe
        ? `מועדונים, מאמנות, ושיעורי נשים בלבד ב${n}.`
        : `Women-led gyms, female coaches, and women-only classes in ${n}.`,
    };
  }
  const n = disciplineName(discipline!, locale);
  return {
    title: isHe ? `${n} לנשים בישראל` : `${n} for Women — Israel`,
    description: isHe
      ? `מועדוני ${n} עם תוכניות לנשים בכל הארץ.`
      : `${n} gyms with dedicated programs for women across Israel.`,
  };
}

export default async function WomenSlugPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!findCity(slug) && !findDiscipline(slug)) notFound();
  return <Inner slug={slug} />;
}

function Inner({ slug }: { slug: string }) {
  const locale = useLocale() as Locale;
  const isHe = locale === "he";
  const city = findCity(slug);
  const discipline = findDiscipline(slug);
  const list = city
    ? gymsByCity(city.slug)
    : discipline
      ? gymsByDiscipline(discipline.slug)
      : [];
  const femaleCoaches = coaches.filter((c) => {
    if (c.gender !== "f") return false;
    if (city) return c.city_slug === city.slug;
    if (discipline) return c.disciplines.includes(discipline.slug);
    return false;
  });

  const heading = city
    ? isHe
      ? `אומנויות לחימה לנשים ב${cityName(city, locale)}`
      : `Women's Martial Arts in ${cityName(city, locale)}`
    : isHe
      ? `${disciplineName(discipline!, locale)} לנשים`
      : `${disciplineName(discipline!, locale)} for Women`;

  return (
    <>
      <header
        className="border-b border-border"
        style={{
          background: city
            ? "linear-gradient(160deg, #FDF1EB 0%, #FBFAF7 100%)"
            : `linear-gradient(135deg, ${discipline!.pin_color}10, #FBFAF7 70%)`,
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <nav className="text-[13px] text-ink-muted flex items-center gap-1.5 mb-4">
            <Link href="/women" className="hover:text-ink">
              {isHe ? "נשים" : "Women"}
            </Link>
            <span>·</span>
            <span className="text-ink font-semibold">{heading}</span>
          </nav>
          <h1 className="display text-4xl md:text-6xl font-extrabold leading-[1.05] max-w-3xl">
            {heading}
          </h1>
          <p className="mt-3 text-ink-muted max-w-2xl">
            {list.length}{" "}
            {isHe ? "מועדונים עם שיעורים מותאמים לנשים" : "gyms with women-friendly programs"}
            {femaleCoaches.length > 0 && (
              <>
                {" · "}
                {femaleCoaches.length}{" "}
                {isHe ? "מאמנות" : "female coaches"}
              </>
            )}
          </p>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 space-y-14">
        {city && (
          <section>
            <h2 className="display text-2xl md:text-3xl font-extrabold mb-4">
              {isHe ? "לפי דיסציפלינה" : "By discipline"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {disciplines.slice(0, 10).map((d) => (
                <Link
                  key={d.slug}
                  href={`/women/${city.slug}/${d.slug}`}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-ink-muted transition-colors"
                >
                  {disciplineName(d, locale)}
                </Link>
              ))}
            </div>
          </section>
        )}

        {discipline && (
          <section>
            <h2 className="display text-2xl md:text-3xl font-extrabold mb-4">
              {isHe ? "לפי עיר" : "By city"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {cities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/women/${c.slug}/${discipline.slug}`}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-ink-muted transition-colors"
                >
                  {cityName(c, locale)}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="display text-2xl md:text-3xl font-extrabold mb-5">
            {isHe ? "המועדונים" : "Gyms"}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.length === 0 ? (
              <p className="col-span-full text-ink-muted">
                {isHe ? "אין עדיין מועדונים תואמים. נמשיך לחפש עבורך." : "No matching gyms yet. We'll keep looking for you."}
              </p>
            ) : (
              list.slice(0, 9).map((g) => <GymCard key={g.slug} gym={g} />)
            )}
          </div>
        </section>

        <section>
          <h2 className="display text-2xl md:text-3xl font-extrabold mb-3">
            {isHe ? "אין את המועדון שלך?" : "Don't see your option?"}
          </h2>
          <p className="text-ink-muted max-w-xl mb-5">
            {isHe
              ? "תני לנו לדעת מה את מחפשת. נשלח לך 3 התאמות אישיות תוך 24 שעות."
              : "Tell us what you're looking for. We'll send you 3 personal matches within 24 hours."}
          </p>
          <InquiryForm
            variant="women_only"
            citySlug={city?.slug}
            disciplineSlug={discipline?.slug}
            className="max-w-xl"
          />
        </section>
      </div>
    </>
  );
}
