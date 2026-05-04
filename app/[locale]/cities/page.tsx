import { setRequestLocale } from "next-intl/server";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cities } from "@/data/cities";
import { gyms } from "@/data/gyms";
import { CityHero } from "@/components/ui/CityHero";
import type { Locale } from "@/i18n/routing";

export default async function CitiesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Inner />;
}

function Inner() {
  const locale = useLocale() as "he" | "en";
  const isHe = locale === "he";
  return (
    <>
      <header className="bg-warm-radial border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <h1 className="display text-4xl md:text-6xl font-extrabold leading-[1.05] max-w-3xl">
            {isHe ? "חפשי מועדון לפי עיר" : "Browse gyms by city"}
          </h1>
          <p className="mt-4 text-ink-muted max-w-2xl text-[16px] md:text-lg">
            {isHe
              ? "הערים המובילות בישראל. כל מועדון מאומת. כל ביקורת אמיתית."
              : "Leading cities across Israel. Every gym verified. Every review real."}
          </p>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cities.map((c) => {
            const count = gyms.filter((g) => g.city_slug === c.slug).length;
            return (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden block"
              >
                <CityHero citySlug={c.slug} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent group-hover:from-black/70 transition-colors" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="display font-extrabold text-2xl">
                    {isHe ? c.name_he : c.name_en}
                  </h3>
                  <p className="text-sm text-white/85 mt-1">
                    {count} {isHe ? "מועדונים" : "gyms"}
                    {" · "}
                    {isHe ? c.district_he : c.district_en}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
