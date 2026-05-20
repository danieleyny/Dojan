import { setRequestLocale } from "next-intl/server";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Shield, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { gyms } from "@/data/gyms";
import { GymCard } from "@/components/ui/GymCard";
import { Button } from "@/components/ui/Button";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { isRtl } from "@/lib/i18n/localize";
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
      ? "הגנה עצמית לנשים — ישראל | Dojan"
      : "Women's Self-Defense — Israel | Dojan",
    description: isHe
      ? "תוכניות הגנה עצמית מבוססות-תרחישים לנשים, מאומנות על ידי מאמנות מובילות בכל הארץ."
      : "Scenario-based self-defense programs for women, taught by leading female coaches across Israel.",
  };
}

export default async function WomensSelfDefensePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Inner />;
}

function Inner() {
  const locale = useLocale() as Locale;
  const isHe = locale === "he";
  const Arrow = isRtl(locale) ? ArrowLeft : ArrowRight;

  const list = gyms
    .filter((g) => g.discipline_slugs.includes("krav-maga"))
    .slice(0, 6);

  const benefits = isHe
    ? [
        "מודעות מצבית — לזהות סכנה 15 שניות לפני שהיא קורית",
        "טכניקות שעובדות בלי כושר מוקדם",
        "תרחישים אמיתיים: רכב, מעלית, מועדון, אלימות במשפחה",
        "אווירה תומכת — אין מבחני כניסה ואין מקצוענים",
      ]
    : [
        "Situational awareness — spot danger 15 seconds before it happens",
        "Techniques that work without prior fitness",
        "Real-world scenarios: cars, elevators, clubs, intimate partner violence",
        "Supportive culture — no fitness gatekeeping, no pros required",
      ];

  return (
    <>
      <header className="relative bg-warm-radial border-b border-border overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 100 100%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M50 5 L95 30 V70 L50 95 L5 70 V30 Z%27 fill=%27none%27 stroke=%27%230F4C5C%27/%3E%3C/svg%3E')]" />
        <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 py-14 md:py-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.18em] font-semibold text-brand bg-brand/10 rounded-full px-3 py-1.5 mb-5">
              <Shield className="size-3.5" />
              {isHe ? "להגן על עצמי" : "Self-defense"}
            </p>
            <h1 className="display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05]">
              {isHe
                ? "ההגנה העצמית הכי מציאותית בארץ — לנשים."
                : "The most realistic self-defense in Israel — for women."}
            </h1>
            <p className="mt-5 text-lg text-ink-muted max-w-xl leading-relaxed">
              {isHe
                ? "מבוסס על מצבים אמיתיים שנשים נתקלות בהם. לא ספורט, לא טורניר. רק לחזור הביתה בשלום."
                : "Built around situations women actually face. No tournaments, no sport-style. Just getting home safe."}
            </p>
            <Link href="#book" className="inline-block mt-6">
              <Button variant="ink" size="lg">
                {isHe ? "מצאי תוכנית קרובה" : "Find a program near me"}
                <Arrow className="size-4" />
              </Button>
            </Link>
          </div>
          <ul className="rounded-2xl bg-surface border border-border p-6 space-y-3 shadow-md">
            {benefits.map((b) => (
              <li key={b} className="flex gap-3 items-start">
                <Check className="size-5 text-success shrink-0 mt-0.5" />
                <span className="text-[15px] leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="display text-2xl md:text-3xl font-extrabold mb-5">
          {isHe ? "תוכניות מומלצות" : "Recommended programs"}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((g) => <GymCard key={g.slug} gym={g} />)}
        </div>
      </section>

      <section id="book" className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-start">
          <div>
            <h2 className="display text-2xl md:text-3xl font-extrabold mb-3">
              {isHe ? "ספרי לנו מה את צריכה" : "Tell us what you need"}
            </h2>
            <p className="text-ink-muted leading-relaxed">
              {isHe
                ? "סדנה חד-פעמית? סדרת שיעורים? שיעור פרטי בבית? אנחנו נחבר אותך למאמנת הנכונה ב-24 שעות."
                : "One-time workshop? Series? Private at home? We'll match you with the right coach within 24 hours."}
            </p>
          </div>
          <InquiryForm variant="women_only" />
        </div>
      </section>
    </>
  );
}
