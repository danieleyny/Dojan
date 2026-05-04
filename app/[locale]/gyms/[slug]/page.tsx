import { setRequestLocale } from "next-intl/server";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import {
  Phone,
  MessageCircle,
  Heart,
  Share2,
  MapPin,
  BadgeCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Globe,
  Clock,
} from "lucide-react";
import type { Metadata } from "next";

import { findGym, gyms, distanceKm, type Gym, type ClassSlot } from "@/data/gyms";
import { findCity } from "@/data/cities";
import { findDiscipline } from "@/data/disciplines";
import type { Locale } from "@/i18n/routing";

import { Button } from "@/components/ui/Button";
import { DisciplinePill } from "@/components/ui/DisciplinePill";
import { RatingStars } from "@/components/ui/RatingStars";
import { GymCard } from "@/components/ui/GymCard";

export async function generateStaticParams() {
  return gyms.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const g = findGym(slug);
  if (!g) return {};
  const isHe = locale === "he";
  const name = isHe ? g.name_he : g.name_en;
  return {
    title: name,
    description: isHe ? g.description_he : g.description_en,
    openGraph: { images: [g.cover_image] },
  };
}

export default async function GymPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const g = findGym(slug);
  if (!g) notFound();
  return <GymDetail slug={slug} />;
}

function GymDetail({ slug }: { slug: string }) {
  const g = findGym(slug)!;
  const t = useTranslations("gym");
  const tCommon = useTranslations("common");
  const tDisc = useTranslations("discipline");
  const tDays = useTranslations("days");
  const locale = useLocale() as "he" | "en";
  const isHe = locale === "he";
  const Chevron = isHe ? ChevronLeft : ChevronRight;
  const city = findCity(g.city_slug)!;
  const name = isHe ? g.name_he : g.name_en;
  const desc = isHe ? g.description_he : g.description_en;

  // Similar gyms by overlapping disciplines
  const similar = gyms
    .filter((other) => other.slug !== g.slug)
    .map((other) => ({
      gym: other,
      score:
        other.discipline_slugs.filter((d) => g.discipline_slugs.includes(d))
          .length + (other.city_slug === g.city_slug ? 1 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.gym);

  // JSON-LD
  const ld = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: name,
    image: g.cover_image,
    address: {
      "@type": "PostalAddress",
      streetAddress: g.address,
      addressLocality: isHe ? city.name_he : city.name_en,
      addressCountry: "IL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: g.location[1],
      longitude: g.location[0],
    },
    telephone: g.phone,
    priceRange: `₪${g.price_min}–${g.price_max}/mo`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: g.rating,
      reviewCount: g.review_count,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      {/* Gallery */}
      <Gallery gym={g} />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6 md:mt-8 grid lg:grid-cols-[1fr_380px] gap-10">
        <div className="min-w-0">
          {/* Breadcrumb */}
          <nav className="text-[13px] text-ink-muted flex items-center gap-1.5 mb-4">
            <Link href={`/${city.slug}`} className="hover:text-ink">
              {isHe ? city.name_he : city.name_en}
            </Link>
            <Chevron className="size-3" />
            <span className="text-ink">{name}</span>
          </nav>

          {/* Title row */}
          <div className="flex items-start gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <h1 className="display text-3xl md:text-5xl font-extrabold leading-tight">
                {name}
              </h1>
              <p className="mt-2 text-ink-muted text-[15px] inline-flex items-center gap-1.5 flex-wrap">
                <MapPin className="size-4" />
                <span>
                  {isHe ? g.neighborhood_he : g.neighborhood_en}, {isHe ? city.name_he : city.name_en}
                </span>
                <span className="text-ink-subtle">·</span>
                <span>{g.address}</span>
              </p>
            </div>
            {g.claimed && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand/10 text-brand rounded-full px-3 py-1.5">
                <BadgeCheck className="size-4" />
                {t("claimed")}
              </span>
            )}
            {g.premium && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-ink text-white rounded-full px-3 py-1.5">
                <Sparkles className="size-3.5" />
                {t("premium")}
              </span>
            )}
          </div>

          {/* Rating + actions */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <RatingStars value={g.rating} count={g.review_count} size="md" />
            <div className="flex items-center gap-2 ms-auto">
              <button
                aria-label={t("save")}
                className="size-10 rounded-full border border-border bg-surface grid place-items-center hover:border-ink-muted hover:text-accent transition-colors"
              >
                <Heart className="size-4" />
              </button>
              <button
                aria-label={t("share")}
                className="size-10 rounded-full border border-border bg-surface grid place-items-center hover:border-ink-muted transition-colors"
              >
                <Share2 className="size-4" />
              </button>
            </div>
          </div>

          {/* Discipline pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {g.discipline_slugs.map((slug) => {
              const d = findDiscipline(slug);
              if (!d) return null;
              return (
                <Link key={slug} href={`/disciplines/${slug}`}>
                  <DisciplinePill color={d.pin_color} size="md" variant="soft">
                    {isHe ? d.name_he : d.name_en}
                  </DisciplinePill>
                </Link>
              );
            })}
          </div>

          {/* Quick facts */}
          <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Quick label={t("price_range")} value={t("price_value", { min: g.price_min, max: g.price_max })} />
            <Quick
              label={t("languages")}
              value={t("languages_value")}
            />
            <Quick
              label={t("trial")}
              value={
                g.trial_class_price === 0
                  ? t("trial_free")
                  : t("trial_priced", { price: g.trial_class_price })
              }
              highlight={g.trial_class_available}
            />
            <Quick
              label={isHe ? "ניסיון" : "Try it"}
              value={isHe ? "כן" : "Yes"}
              highlight
            />
          </div>

          {/* About */}
          <Section title={t("about")} className="mt-10">
            <p className="text-[16px] leading-[1.75] text-ink-muted">{desc}</p>
          </Section>

          {/* Schedule */}
          <Section
            title={t("schedule")}
            subtitle={t("schedule_subtitle")}
            className="mt-12"
          >
            <ScheduleGrid classes={g.classes} />
          </Section>

          {/* Instructors */}
          <Section title={t("instructors")} className="mt-12">
            <div className="grid sm:grid-cols-2 gap-4">
              {g.instructors.map((inst) => (
                <div
                  key={inst.slug}
                  className="flex gap-4 items-start p-4 rounded-2xl border border-border bg-surface"
                >
                  <Image
                    src={inst.photo}
                    alt={isHe ? inst.name_he : inst.name_en}
                    width={64}
                    height={64}
                    className="size-16 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-[16px]">
                      {isHe ? inst.name_he : inst.name_en}
                    </h3>
                    <p className="text-sm text-ink-muted">{inst.rank}</p>
                    <p className="text-[13px] text-ink-subtle mt-1">
                      {t("instructor_years", { years: inst.years })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Reviews */}
          <Section title={t("reviews")} className="mt-12">
            <div className="grid md:grid-cols-[280px_1fr] gap-8">
              <div className="rounded-2xl border border-border bg-surface p-6">
                <div className="flex items-baseline gap-2">
                  <span className="display text-5xl font-extrabold">
                    {g.rating.toFixed(1)}
                  </span>
                  <span className="text-ink-muted text-sm">/ 5</span>
                </div>
                <RatingStars value={g.rating} size="md" showValue={false} />
                <p className="text-sm text-ink-muted mt-2">
                  {t("rating_count", { count: g.review_count })}
                </p>

                <div className="mt-5 space-y-2 text-[13px]">
                  {(["instructor", "facilities", "value", "atmosphere", "beginner_friendly"] as const).map((dim) => {
                    const score =
                      (g.reviews[0]?.ratings[dim] ?? 4) +
                      (g.rating - 4) * 0.4;
                    const pct = Math.min(100, Math.max(0, (score / 5) * 100));
                    return (
                      <div key={dim} className="flex items-center gap-3">
                        <span className="w-28 shrink-0 text-ink-muted">
                          {t(`rating_dimensions.${dim}`)}
                        </span>
                        <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-warning rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-7 text-end font-semibold">
                          {score.toFixed(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                {g.reviews.map((r) => (
                  <article
                    key={r.id}
                    className="rounded-2xl border border-border bg-surface p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-brand/10 grid place-items-center font-bold text-brand">
                        {r.author.slice(0, 1)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[14px]">{r.author}</p>
                        <RatingStars value={r.rating} size="sm" showValue={false} />
                      </div>
                      {r.verified && (
                        <span className="text-[11px] font-semibold inline-flex items-center gap-1 text-success bg-success/10 px-2 py-1 rounded-full">
                          <BadgeCheck className="size-3" />
                          {t("verified_review")}
                        </span>
                      )}
                    </div>
                    <h4 className="mt-3 font-bold">
                      {isHe ? r.title_he : r.title_en}
                    </h4>
                    <p className="text-[14px] text-ink-muted mt-1 leading-relaxed">
                      {isHe ? r.body_he : r.body_en}
                    </p>
                  </article>
                ))}
                <Button variant="outline" size="md">
                  {t("all_reviews")}
                </Button>
              </div>
            </div>
          </Section>

          {/* Amenities */}
          <Section title={t("amenities")} className="mt-12">
            <div className="flex flex-wrap gap-2">
              {g.amenities.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-ink-muted"
                >
                  {a}
                </span>
              ))}
            </div>
          </Section>

          {/* Map */}
          <Section title={isHe ? "מיקום" : "Location"} className="mt-12">
            <div className="aspect-[16/9] rounded-2xl bg-surface-2 overflow-hidden grid place-items-center text-center text-ink-muted">
              <div>
                <MapPin className="size-8 mx-auto mb-2" />
                <p className="text-sm">{g.address}</p>
                <div className="mt-3 flex gap-2 justify-center">
                  <a
                    href={`https://waze.com/ul?ll=${g.location[1]},${g.location[0]}&navigate=yes`}
                    target="_blank"
                    rel="noopener"
                    className="text-[13px] font-semibold text-brand hover:text-brand-700"
                  >
                    Waze
                  </a>
                  <span className="text-ink-subtle">•</span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${g.location[1]},${g.location[0]}`}
                    target="_blank"
                    rel="noopener"
                    className="text-[13px] font-semibold text-brand hover:text-brand-700"
                  >
                    Google Maps
                  </a>
                </div>
              </div>
            </div>
          </Section>

          {/* Similar gyms */}
          {similar.length > 0 && (
            <Section title={t("similar")} className="mt-12">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {similar.map((s) => (
                  <GymCard key={s.slug} gym={s} />
                ))}
              </div>
            </Section>
          )}

          <p className="mt-12 text-xs text-ink-subtle">
            {t("last_updated")}: {new Date().toLocaleDateString(isHe ? "he-IL" : "en-US")}
            {" "}·{" "}
            <a href="#" className="hover:text-ink-muted underline-offset-2 hover:underline">
              {t("report_error")}
            </a>
          </p>
        </div>

        {/* Sticky booking card (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-surface p-6 shadow-md">
            <div className="flex items-baseline gap-2">
              <span className="display text-3xl font-extrabold">
                ₪{g.price_min}
              </span>
              <span className="text-sm text-ink-muted">
                {isHe ? "מ-" : "from / mo"}
              </span>
            </div>
            <p className="text-sm text-ink-muted mt-1">
              {g.trial_class_price === 0
                ? t("trial_free")
                : t("trial_priced", { price: g.trial_class_price })}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Button variant="primary" size="lg">
                {t("book_trial")}
              </Button>
              <a
                href={`tel:${g.phone}`}
                className="inline-flex items-center justify-center gap-2 h-11 rounded-full border border-border font-semibold hover:bg-surface-2 transition-colors text-[15px]"
              >
                <Phone className="size-4" />
                {t("call")}
              </a>
              {g.whatsapp && (
                <a
                  href={g.whatsapp}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center justify-center gap-2 h-11 rounded-full bg-[#25D366]/10 text-[#0E5C2D] font-semibold hover:bg-[#25D366]/20 transition-colors text-[15px]"
                >
                  <MessageCircle className="size-4" />
                  {t("whatsapp")}
                </a>
              )}
            </div>

            {/* Top schedule preview */}
            <div className="mt-6 pt-5 border-t border-border">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-ink-subtle mb-3">
                {isHe ? "השיעורים הקרובים" : "Upcoming this week"}
              </p>
              <ul className="space-y-2 text-sm">
                {g.classes.slice(0, 4).map((c) => {
                  const d = findDiscipline(c.discipline_slug);
                  return (
                    <li
                      key={c.id}
                      className="flex items-center gap-3 py-1.5"
                    >
                      <span className="w-10 text-[11px] font-semibold uppercase text-ink-subtle">
                        {(tDays.raw("short") as string[])[c.day]}
                      </span>
                      <span className="font-mono font-semibold text-ink">
                        {c.start}
                      </span>
                      <span
                        className="text-[13px] truncate"
                        style={{ color: d?.pin_color }}
                      >
                        {d ? (isHe ? d.name_he : d.name_en) : ""}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky mobile CTA */}
      <div
        className="lg:hidden fixed bottom-16 inset-x-0 z-30 bg-bg/95 backdrop-blur border-t border-border p-3 flex gap-2"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <Button variant="primary" size="md" className="flex-1">
          {t("book_trial")}
        </Button>
        <a
          href={`tel:${g.phone}`}
          className="size-11 rounded-full bg-surface border border-border grid place-items-center"
          aria-label={t("call")}
        >
          <Phone className="size-4" />
        </a>
      </div>
    </>
  );
}

function Gallery({ gym }: { gym: Gym }) {
  const [hero, ...rest] = [gym.cover_image, ...gym.gallery];
  return (
    <div className="max-w-[1400px] mx-auto px-0 md:px-8 mt-2">
      <div className="md:rounded-3xl overflow-hidden grid md:grid-cols-[1.5fr_1fr] md:gap-2 max-h-[60vh]">
        <div className="relative aspect-[16/10] md:aspect-auto md:h-[460px]">
          <Image
            src={hero}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
            className="object-cover"
          />
        </div>
        <div className="hidden md:grid grid-rows-2 grid-cols-2 gap-2">
          {rest.slice(0, 4).map((src, i) => (
            <div key={i} className="relative">
              <Image
                src={src}
                alt=""
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScheduleGrid({ classes }: { classes: ClassSlot[] }) {
  const tDays = useTranslations("days");
  const days = [0, 1, 2, 3, 4, 5, 6] as const;
  const byDay = days.map((d) => classes.filter((c) => c.day === d));
  const locale = useLocale() as "he" | "en";

  return (
    <div className="overflow-x-auto -mx-4 md:mx-0">
      <div className="min-w-[700px] md:min-w-0 px-4 md:px-0 grid grid-cols-7 gap-2">
        {days.map((d, i) => (
          <div key={d} className="flex flex-col gap-2">
            <h3 className="text-center text-[11px] font-bold uppercase tracking-wider text-ink-subtle py-2 border-b border-border">
              {tDays(`${d}`)}
            </h3>
            {byDay[i].length === 0 ? (
              <p className="text-center text-xs text-ink-subtle py-3">—</p>
            ) : (
              byDay[i].map((c) => {
                const d = findDiscipline(c.discipline_slug);
                return (
                  <div
                    key={c.id}
                    className="rounded-xl p-2.5 text-[12px] border bg-surface hover:shadow-sm transition-shadow cursor-pointer"
                    style={{
                      borderColor: `${d?.pin_color}30`,
                      background: `${d?.pin_color}08`,
                    }}
                  >
                    <p className="font-mono font-bold text-ink">{c.start}</p>
                    <p
                      className="font-semibold mt-0.5 line-clamp-1"
                      style={{ color: d?.pin_color }}
                    >
                      {d ? (locale === "he" ? d.name_he : d.name_en) : ""}
                    </p>
                    <p className="text-[10px] text-ink-subtle line-clamp-1">
                      {locale === "he" ? c.title_he : c.title_en}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={className}>
      <h2 className="display text-2xl md:text-3xl font-extrabold mb-1">
        {title}
      </h2>
      {subtitle && <p className="text-ink-muted mb-5">{subtitle}</p>}
      <div className={subtitle ? "" : "mt-4"}>{children}</div>
    </section>
  );
}

function Quick({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3.5 border ${
        highlight
          ? "border-success/30 bg-success/5 text-ink"
          : "border-border bg-surface"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">
        {label}
      </p>
      <p className="text-sm font-semibold mt-1 leading-tight">{value}</p>
    </div>
  );
}
