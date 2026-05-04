import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Search, MapPin, Sparkles, BadgeCheck, Languages, ArrowLeft, ArrowRight } from "lucide-react";
import { gyms } from "@/data/gyms";
import { disciplines, featuredDisciplines } from "@/data/disciplines";
import { cities } from "@/data/cities";
import { GymCard } from "@/components/ui/GymCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DisciplinePill } from "@/components/ui/DisciplinePill";
import { Button } from "@/components/ui/Button";
import { CityHero } from "@/components/ui/CityHero";
import { DisciplineHero } from "@/components/ui/DisciplineHero";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <DisciplineRail />
      <NearYouRail />
      <QuizCTA />
      <KidsRail />
      <CitiesGrid />
      <Trust />
      <EncyclopediaTeaser />
      <FooterCTA />
    </>
  );
}

function Hero() {
  const t = useTranslations("home.hero");
  const locale = useLocale();
  const isHe = locale === "he";
  const Arrow = isHe ? ArrowLeft : ArrowRight;
  const popular = t.raw("popular_terms") as string[];

  return (
    <section className="relative bg-warm-radial overflow-hidden">
      {/* Decorative blurred shapes */}
      <div
        aria-hidden
        className="absolute -top-40 start-1/3 size-[480px] rounded-full bg-accent/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute top-20 end-0 size-[360px] rounded-full bg-brand/10 blur-3xl"
      />

      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-14 md:pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        <div className="relative z-10 max-w-2xl">
          <p className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] font-semibold text-brand bg-brand/10 px-3 py-1.5 rounded-full mb-5">
            <Sparkles className="size-3.5" />
            {t("kicker")}
          </p>
          <h1 className="display text-[40px] md:text-[64px] lg:text-[72px] font-extrabold leading-[1.02] tracking-tight text-ink">
            {t("title")}{" "}
            <span className="text-brand">{t("title_accent")}</span>
          </h1>
          <p className="mt-5 text-[16px] md:text-lg text-ink-muted leading-relaxed max-w-xl">
            {t("subtitle")}
          </p>

          <form
            action="/search"
            className="mt-8 flex flex-col sm:flex-row gap-2 p-2 bg-surface rounded-2xl shadow-md border border-border max-w-xl"
          >
            <div className="flex items-center gap-2 px-3 flex-1">
              <Search className="size-5 text-ink-subtle shrink-0" />
              <input
                type="text"
                name="q"
                placeholder={t("search_placeholder")}
                className="bg-transparent outline-none flex-1 py-3 text-[15px] placeholder:text-ink-subtle"
              />
            </div>
            <Button type="submit" variant="primary" size="md" className="sm:w-auto">
              {t("search_btn")}
              <Arrow className="size-4" />
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <button className="inline-flex items-center gap-1.5 text-ink-muted hover:text-brand transition-colors font-medium">
              <MapPin className="size-4" />
              {t("near_me")}
            </button>
            <span className="text-ink-subtle hidden sm:inline">•</span>
            <span className="text-ink-subtle">{t("popular_searches")}:</span>
            <div className="flex flex-wrap gap-1.5">
              {popular.slice(0, 3).map((term) => (
                <Link
                  key={term}
                  href="/search"
                  className="text-[13px] text-brand-500 hover:text-brand underline-offset-2 hover:underline"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Hero photo collage */}
        <div className="relative hidden lg:block min-h-[520px]">
          <div className="absolute top-0 end-0 w-[58%] aspect-[3/4] rounded-3xl overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&auto=format&fit=crop"
              alt=""
              fill
              priority
              sizes="600px"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-12 start-0 w-[55%] aspect-[4/3] rounded-3xl overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=80&auto=format&fit=crop"
              alt=""
              fill
              sizes="600px"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 end-8 w-44 bg-surface rounded-2xl shadow-md p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-8 rounded-full bg-accent/20 grid place-items-center">
                <Sparkles className="size-4 text-accent" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                {isHe ? "מאומת" : "Verified"}
              </span>
            </div>
            <p className="text-sm font-semibold leading-snug">
              {isHe ? "847 מועדונים בישראל" : "847 gyms across Israel"}
            </p>
            <p className="text-xs text-ink-muted mt-1">
              {isHe ? "מאומתים על ידינו" : "Vetted by our team"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DisciplineRail() {
  const t = useTranslations("home.rails");
  const locale = useLocale() as "he" | "en";

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 mt-14 md:mt-20">
      <SectionHeader
        title={t("disciplines_title")}
        subtitle={t("disciplines_subtitle")}
        href="/disciplines"
        cta={t("see_all")}
      />
      <div className="mt-7 -mx-4 md:mx-0 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-4 md:px-0 md:grid md:grid-cols-4 lg:grid-cols-6">
          {featuredDisciplines.map((d) => (
            <Link
              key={d.slug}
              href={`/disciplines/${d.slug}`}
              className="group flex flex-col w-[140px] md:w-auto shrink-0 rounded-2xl border border-border bg-surface p-4 hover:shadow-md hover:border-border-strong transition-all"
            >
              <div
                className="size-12 rounded-2xl grid place-items-center mb-3 transition-transform group-hover:scale-110"
                style={{ background: `${d.pin_color}1f`, color: d.pin_color }}
              >
                <DisciplineGlyph slug={d.slug} className="size-6" />
              </div>
              <h3 className="font-bold text-[15px] leading-tight">
                {locale === "he" ? d.name_he : d.name_en}
              </h3>
              <p className="text-[12px] text-ink-muted mt-1 line-clamp-2 leading-snug">
                {locale === "he" ? d.short_he : d.short_en}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function NearYouRail() {
  const t = useTranslations("home.rails");
  const list = gyms.filter((g) => g.city_slug === "tel-aviv").slice(0, 6);
  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 mt-16 md:mt-24">
      <SectionHeader
        kicker={undefined}
        title={t("near_you_title")}
        subtitle={t("near_you_subtitle")}
        href="/search"
        cta={t("see_all")}
      />
      <div className="mt-7 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {list.map((g, i) => (
          <GymCard key={g.slug} gym={g} priority={i < 2} />
        ))}
      </div>
    </section>
  );
}

function QuizCTA() {
  const t = useTranslations("home.quiz_card");
  const locale = useLocale();
  const Arrow = locale === "he" ? ArrowLeft : ArrowRight;
  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 mt-16 md:mt-24">
      <div className="relative overflow-hidden rounded-3xl bg-ink text-white p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="absolute -end-20 -top-20 size-[400px] rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -start-20 -bottom-20 size-[300px] rounded-full bg-brand/30 blur-3xl" />
        <div className="relative">
          <p className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] font-semibold text-accent bg-accent/15 px-3 py-1.5 rounded-full">
            <Sparkles className="size-3.5" />
            {t("kicker")}
          </p>
          <h2 className="display text-3xl md:text-5xl font-extrabold mt-4 leading-tight">
            {t("title")}
          </h2>
          <p className="mt-3 text-white/70 text-[15px] md:text-base max-w-md">
            {t("subtitle")}
          </p>
          <Link href="/quiz">
            <Button variant="primary" size="lg" className="mt-7">
              {t("cta")}
              <Arrow className="size-4" />
            </Button>
          </Link>
        </div>
        <div className="relative hidden md:flex justify-center">
          <div className="relative grid grid-cols-3 gap-3 w-full max-w-md rotate-3">
            {featuredDisciplines.slice(0, 9).map((d, i) => (
              <div
                key={d.slug}
                className="aspect-square rounded-2xl grid place-items-center font-bold text-white text-[11px] text-center px-2 leading-tight shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${d.pin_color}, ${d.pin_color}c0)`,
                  transform: `translateY(${(i % 3) * -8}px)`,
                }}
              >
                {locale === "he" ? d.name_he : d.name_en}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function KidsRail() {
  const t = useTranslations("home.rails");
  const list = gyms
    .filter((g) =>
      g.classes.some((c) => c.age_group === "kids-7-12" || c.age_group === "teens"),
    )
    .slice(0, 4);
  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 mt-16 md:mt-24">
      <SectionHeader
        title={t("kids_title")}
        subtitle={t("kids_subtitle")}
        href="/search"
        cta={t("see_all")}
      />
      <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {list.map((g) => (
          <GymCard key={g.slug} gym={g} />
        ))}
      </div>
    </section>
  );
}

function CitiesGrid() {
  const t = useTranslations("home.rails");
  const locale = useLocale() as "he" | "en";
  const featured = cities.filter((c) => c.is_featured);

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 mt-16 md:mt-24">
      <SectionHeader
        title={t("cities_title")}
        subtitle={t("cities_subtitle")}
        href="/cities"
        cta={t("see_all")}
      />
      <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {featured.map((c) => {
          const count = gyms.filter((g) => g.city_slug === c.slug).length;
          return (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="group relative aspect-[5/4] rounded-2xl overflow-hidden block"
            >
              <CityHero citySlug={c.slug} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent group-hover:from-black/70 transition-colors" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white">
                <h3 className="display font-extrabold text-xl md:text-2xl">
                  {locale === "he" ? c.name_he : c.name_en}
                </h3>
                <p className="text-[12px] text-white/85 mt-0.5">
                  {count} {locale === "he" ? "מועדונים" : "gyms"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Trust() {
  const t = useTranslations("home.trust");
  const items = [
    {
      icon: BadgeCheck,
      title: t("verified.title"),
      body: t("verified.body"),
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      icon: Sparkles,
      title: t("trial.title"),
      body: t("trial.body"),
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: Languages,
      title: t("bilingual.title"),
      body: t("bilingual.body"),
      color: "text-brand",
      bg: "bg-brand/10",
    },
  ];
  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 mt-16 md:mt-24">
      <h2 className="display text-2xl md:text-4xl font-extrabold text-center">
        {t("title")}
      </h2>
      <div className="mt-10 grid md:grid-cols-3 gap-5 md:gap-7">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border bg-surface p-7 hover:shadow-md transition-all"
          >
            <div className={`size-12 rounded-xl grid place-items-center mb-5 ${item.bg} ${item.color}`}>
              <item.icon className="size-6" />
            </div>
            <h3 className="font-bold text-[18px] leading-tight">{item.title}</h3>
            <p className="mt-2 text-ink-muted text-[15px] leading-relaxed">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EncyclopediaTeaser() {
  const t = useTranslations("home.encyclopedia_teaser");
  const locale = useLocale() as "he" | "en";
  const Arrow = locale === "he" ? ArrowLeft : ArrowRight;
  const items = disciplines.slice(0, 3);
  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 mt-16 md:mt-24">
      <SectionHeader
        kicker={t("kicker")}
        title={t("title")}
        subtitle={t("subtitle")}
        href="/disciplines"
        cta={t("cta")}
      />
      <div className="mt-7 grid md:grid-cols-3 gap-4 md:gap-6">
        {items.map((d) => (
          <Link
            key={d.slug}
            href={`/disciplines/${d.slug}`}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden block"
          >
            <DisciplineHero color={d.pin_color} slug={d.slug} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <span className="inline-flex items-center text-[11px] uppercase tracking-wider font-bold bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
                {locale === "he"
                  ? `${d.founded_year ?? ""} • ${d.origin_he}`
                  : `${d.founded_year ?? ""} • ${d.origin_en}`}
              </span>
              <h3 className="display font-extrabold text-2xl md:text-3xl mt-3 leading-tight">
                {locale === "he" ? d.name_he : d.name_en}
              </h3>
              <p className="text-[13px] text-white/85 mt-1.5 line-clamp-2">
                {locale === "he" ? d.short_he : d.short_en}
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:gap-2.5 transition-all">
                {locale === "he" ? "המאמר המלא" : "Read the article"}
                <Arrow className="size-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FooterCTA() {
  const t = useTranslations("home.footer_cta");
  const locale = useLocale();
  const Arrow = locale === "he" ? ArrowLeft : ArrowRight;
  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 mt-16 md:mt-24">
      <div className="rounded-3xl bg-sand border border-border p-8 md:p-14 grid md:grid-cols-[2fr_1fr] gap-6 items-center grain">
        <div>
          <h2 className="display text-2xl md:text-4xl font-extrabold text-ink leading-tight">
            {t("title")}
          </h2>
          <p className="mt-3 text-ink-muted max-w-xl">{t("subtitle")}</p>
        </div>
        <div className="flex md:justify-end">
          <Link href="/list-your-gym">
            <Button variant="ink" size="lg">
              {t("cta")}
              <Arrow className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Tiny inline SVG glyphs per discipline (placeholders — abstract symbolic forms)
function DisciplineGlyph({ slug, className }: { slug: string; className?: string }) {
  // Use a hash-based variant to give different abstract symbols per slug
  const variant = slug.length % 6;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      {variant === 0 && (
        <path d="M12 2 L20 7 V17 L12 22 L4 17 V7 Z" />
      )}
      {variant === 1 && (
        <>
          <circle cx="12" cy="12" r="9" fillOpacity="0.2" />
          <circle cx="12" cy="12" r="5" />
        </>
      )}
      {variant === 2 && (
        <path d="M3 12 L9 4 L15 12 L9 20 Z M21 12 L15 4 L9 12 L15 20 Z" fillOpacity="0.6" />
      )}
      {variant === 3 && (
        <>
          <rect x="4" y="4" width="16" height="16" rx="3" fillOpacity="0.2" />
          <path d="M8 12 L12 8 L16 12 L12 16 Z" />
        </>
      )}
      {variant === 4 && (
        <path d="M12 2 L14 9 L21 9 L15.5 13 L17.5 20 L12 16 L6.5 20 L8.5 13 L3 9 L10 9 Z" />
      )}
      {variant === 5 && (
        <>
          <path d="M5 5 L19 19" strokeWidth="3" stroke="currentColor" />
          <path d="M19 5 L5 19" strokeWidth="3" stroke="currentColor" />
        </>
      )}
    </svg>
  );
}
