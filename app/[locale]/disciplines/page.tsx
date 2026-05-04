import { setRequestLocale } from "next-intl/server";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { disciplines } from "@/data/disciplines";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isHe = locale === "he";
  return {
    title: isHe
      ? "אנציקלופדיית אומנויות לחימה — 50+ דיסציפלינות"
      : "Martial Arts Encyclopedia — 50+ Disciplines",
    description: isHe
      ? "המדריך המעמיק ביותר לאומנויות לחימה הנלמדות בישראל. היסטוריה, טכניקות, פילוסופיה, ומועדונים."
      : "The most thorough guide to martial arts taught in Israel. History, techniques, philosophy, and gyms.",
  };
}

export default async function DisciplinesHubPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DisciplinesHubInner />;
}

function DisciplinesHubInner() {
  const t = useTranslations("disciplines_hub");
  const tDisc = useTranslations("discipline");
  const locale = useLocale() as "he" | "en";
  const isHe = locale === "he";

  // Group by family
  const families = Array.from(new Set(disciplines.map((d) => d.family)));

  return (
    <>
      <header className="bg-warm-radial border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-20">
          <p className="text-[12px] uppercase tracking-[0.2em] font-semibold text-brand mb-3">
            {t("kicker")}
          </p>
          <h1 className="display text-4xl md:text-6xl font-extrabold leading-[1.05] max-w-3xl">
            {t("title")}
          </h1>
          <p className="mt-5 text-ink-muted max-w-2xl text-[16px] md:text-lg leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-14 space-y-14">
        {families.map((fam) => {
          const list = disciplines.filter((d) => d.family === fam);
          return (
            <section key={fam}>
              <h2 className="display text-xl md:text-2xl font-bold mb-5 flex items-baseline gap-3">
                <span>
                  {tDisc(`family_labels.${fam}`)}
                </span>
                <span className="text-sm text-ink-subtle font-normal">
                  · {list.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/disciplines/${d.slug}`}
                    className="group flex gap-4 p-4 rounded-2xl border border-border bg-surface hover:shadow-md hover:border-border-strong transition-all"
                  >
                    <div
                      className="size-14 shrink-0 rounded-xl grid place-items-center text-white font-extrabold text-lg display"
                      style={{
                        background: `linear-gradient(135deg, ${d.pin_color}, ${d.pin_color}cc)`,
                      }}
                    >
                      {(isHe ? d.name_he : d.name_en).slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[16px] leading-tight group-hover:text-brand transition-colors">
                        {isHe ? d.name_he : d.name_en}
                      </h3>
                      <p className="text-[13px] text-ink-muted line-clamp-2 mt-1 leading-snug">
                        {isHe ? d.short_he : d.short_en}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-ink-subtle font-medium">
                        <span>{isHe ? d.origin_he : d.origin_en}</span>
                        {d.founded_year && (
                          <>
                            <span>•</span>
                            <span>{d.founded_year}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
