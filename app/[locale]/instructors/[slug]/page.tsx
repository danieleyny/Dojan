import { setRequestLocale } from "next-intl/server";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { Quote, MapPin, Award, Globe, ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import type { Metadata } from "next";

import { findCoach, coaches } from "@/data/coaches";
import { findGym } from "@/data/gyms";
import { findCity } from "@/data/cities";
import { findDiscipline } from "@/data/disciplines";
import { DisciplinePill } from "@/components/ui/DisciplinePill";
import { RatingStars } from "@/components/ui/RatingStars";
import { Button } from "@/components/ui/Button";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { isRtl } from "@/lib/i18n/localize";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return coaches.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const c = findCoach(slug);
  if (!c) return {};
  const isHe = locale === "he";
  const name = isHe ? c.name_he : c.name_en;
  return {
    title: name,
    description: isHe ? c.headline_he : c.headline_en,
  };
}

export default async function CoachPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const c = findCoach(slug);
  if (!c) notFound();
  return <Inner slug={slug} />;
}

function Inner({ slug }: { slug: string }) {
  const c = findCoach(slug)!;
  const locale = useLocale() as Locale;
  const isHe = locale === "he";
  const Arrow = isRtl(locale) ? ArrowLeft : ArrowRight;
  const name = isHe ? c.name_he : c.name_en;
  const headline = isHe ? c.headline_he : c.headline_en;
  const pullQuote = isHe ? c.pull_quote_he : c.pull_quote_en;
  const origin = isHe ? c.origin_story_he : c.origin_story_en;
  const philosophy = isHe ? c.philosophy_he : c.philosophy_en;
  const lineage = isHe ? c.lineage_he : c.lineage_en;
  const city = findCity(c.city_slug)!;
  const gym = findGym(c.gym_slug);

  const relatedCoaches = coaches
    .filter((other) => other.slug !== c.slug && other.disciplines.some((d) => c.disciplines.includes(d)))
    .slice(0, 3);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: c.name_en,
    description: c.headline_en,
    jobTitle: c.rank,
    knowsLanguage: c.languages_spoken,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <header
        className="relative border-b border-border"
        style={{
          background: "linear-gradient(160deg, #FBFAF7 0%, #F1ECDE 100%)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-16 grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.18em] font-semibold text-brand bg-brand/10 rounded-full px-3 py-1.5 mb-4">
              {c.rank}
            </p>
            <h1 className="display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05]">
              {name}
            </h1>
            <p className="mt-4 text-ink-muted text-lg max-w-xl">{headline}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {c.disciplines.map((slug) => {
                const d = findDiscipline(slug);
                if (!d) return null;
                return (
                  <DisciplinePill key={slug} color={d.pin_color} size="md">
                    {isHe ? d.name_he : d.name_en}
                  </DisciplinePill>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-ink-muted">
              <RatingStars value={c.rating} count={c.review_count} size="md" />
              <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {isHe ? city.name_he : city.name_en}</span>
              <span className="inline-flex items-center gap-1"><Award className="size-3.5" /> {c.years_teaching} {isHe ? "שנות הוראה" : "yrs teaching"}</span>
              <span className="inline-flex items-center gap-1"><Globe className="size-3.5" /> {c.languages_spoken.map((l) => l.toUpperCase()).join(" · ")}</span>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              <a href="#book">
                <Button variant="ink" size="lg">
                  {isHe ? `התאמן עם ${name}` : `Book with ${name}`}
                  <Arrow className="size-4" />
                </Button>
              </a>
              {gym && (
                <Link href={`/gyms/${gym.slug}`}>
                  <Button variant="outline" size="lg">
                    {isHe ? gym.name_he : gym.name_en}
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div
            className="relative aspect-square max-w-[420px] mx-auto rounded-3xl overflow-hidden shadow-lg"
            style={{
              background: "linear-gradient(135deg, #0F4C5C, #1E7A8C 70%)",
            }}
          >
            <div className="absolute inset-0 grid place-items-center">
              <span className="display font-extrabold text-white text-9xl opacity-30">
                {name.slice(0, 1)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <article className="max-w-[760px] mx-auto px-4 md:px-8 py-14 md:py-20 prose prose-neutral [&_p]:leading-[1.85] [&_p]:text-[17px] [&_p]:text-ink-muted">
        <figure className="mb-12">
          <Quote className="size-7 text-accent mb-3" />
          <blockquote className="display text-2xl md:text-3xl font-bold text-ink leading-snug !not-italic !border-none !p-0">
            "{pullQuote}"
          </blockquote>
          <figcaption className="text-sm text-ink-subtle mt-3">— {name}</figcaption>
        </figure>

        <Section title={isHe ? "סיפור הדרך" : "Origin Story"}>
          {origin.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
        </Section>

        <Section title={isHe ? "שושלת" : "Lineage"}>
          <p>{lineage}</p>
        </Section>

        {c.competition_record.length > 0 && (
          <Section title={isHe ? "רקורד תחרותי" : "Competition Record"}>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-start border-b border-border">
                  <th className="text-start py-2 font-semibold w-16">{isHe ? "שנה" : "Year"}</th>
                  <th className="text-start py-2 font-semibold">{isHe ? "אירוע" : "Event"}</th>
                  <th className="text-start py-2 font-semibold">{isHe ? "תוצאה" : "Result"}</th>
                </tr>
              </thead>
              <tbody>
                {c.competition_record.map((r) => (
                  <tr key={`${r.year}-${r.event}`} className="border-b border-border">
                    <td className="py-3 font-mono font-semibold text-ink">{r.year}</td>
                    <td className="py-3">{r.event}</td>
                    <td className="py-3 font-semibold text-brand">{r.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        )}

        <Section title={isHe ? "פילוסופיית האימון" : "Teaching Philosophy"}>
          {philosophy.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
        </Section>

        {gym && (
          <Section title={isHe ? "מתי אפשר להגיע" : "When to come train"}>
            <div className="rounded-2xl border border-border bg-surface p-5 not-prose">
              <p className="text-sm font-semibold text-ink mb-3 inline-flex items-center gap-2">
                <Calendar className="size-4" />
                {isHe ? "השיעורים הקרובים של " + name : "Upcoming classes with " + name}
              </p>
              <ul className="space-y-2">
                {gym.classes.slice(0, 4).map((cls) => {
                  const d = findDiscipline(cls.discipline_slug);
                  return (
                    <li key={cls.id} className="flex items-center gap-3 text-sm">
                      <span className="w-12 text-[11px] font-bold uppercase text-ink-subtle">
                        {[isHe ? "א" : "Sun", isHe ? "ב" : "Mon", isHe ? "ג" : "Tue", isHe ? "ד" : "Wed", isHe ? "ה" : "Thu"][cls.day] ?? "—"}
                      </span>
                      <span className="font-mono font-semibold">{cls.start}</span>
                      <span style={{ color: d?.pin_color }}>{d ? (isHe ? d.name_he : d.name_en) : ""}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Section>
        )}

        {c.faq.length > 0 && (
          <Section title={isHe ? "שאלות נפוצות" : "Frequently asked"}>
            <div className="space-y-3 not-prose">
              {c.faq.map((f) => (
                <details key={f.q_en} className="rounded-xl border border-border bg-surface p-4">
                  <summary className="cursor-pointer font-semibold">{isHe ? f.q_he : f.q_en}</summary>
                  <p className="mt-2 text-sm text-ink-muted">{isHe ? f.a_he : f.a_en}</p>
                </details>
              ))}
            </div>
          </Section>
        )}
      </article>

      <section id="book" className="max-w-[1200px] mx-auto px-4 md:px-8 pb-16">
        <div className="grid md:grid-cols-[1fr_1fr] gap-8 items-start">
          <div>
            <h2 className="display text-2xl md:text-4xl font-extrabold mb-3">
              {isHe ? `התאמן עם ${name}` : `Train with ${name}`}
            </h2>
            <p className="text-ink-muted text-lg leading-relaxed">
              {isHe
                ? "שיעור פרטי, סדנה, או הצטרפות לקבוצה השוטפת — אנחנו נחבר אותך תוך 24 שעות."
                : "Private session, workshop, or join the regular group — we'll connect you within 24 hours."}
            </p>
          </div>
          <InquiryForm variant="private" coachSlug={c.slug} gymSlug={c.gym_slug} />
        </div>
      </section>

      {relatedCoaches.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20">
          <h2 className="display text-2xl md:text-3xl font-extrabold mb-5">
            {isHe ? "מאמנים נוספים" : "Other coaches"}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedCoaches.map((rc) => (
              <Link
                key={rc.slug}
                href={`/instructors/${rc.slug}`}
                className="rounded-2xl border border-border bg-surface p-5 hover:shadow-md transition-all"
              >
                <h3 className="font-bold">{isHe ? rc.name_he : rc.name_en}</h3>
                <p className="text-sm text-ink-muted mt-1">{isHe ? rc.headline_he : rc.headline_en}</p>
                <p className="text-[11px] text-brand font-semibold mt-2">{rc.rank}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="display text-2xl md:text-3xl font-extrabold mb-5 not-prose">{title}</h2>
      {children}
    </section>
  );
}
