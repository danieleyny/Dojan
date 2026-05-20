import { setRequestLocale } from "next-intl/server";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Shield, Users, Heart, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";

import { gyms } from "@/data/gyms";
import { cities } from "@/data/cities";
import { disciplines } from "@/data/disciplines";
import { coaches } from "@/data/coaches";
import { GymCard } from "@/components/ui/GymCard";
import { Button } from "@/components/ui/Button";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { isRtl, cityName, disciplineName } from "@/lib/i18n/localize";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = COPY[locale] ?? COPY.en;
  return {
    title: t.meta_title,
    description: t.meta_description,
  };
}

export default async function WomensHubPage({
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
  const rtl = isRtl(locale);
  const t = COPY[locale] ?? COPY.en;
  const Arrow = rtl ? ArrowLeft : ArrowRight;

  // Filter: gyms with women-only classes
  const womenGyms = gyms
    .filter((g) => g.classes.some((c) => c.age_group === "women-only"))
    .slice(0, 6);
  // If none flagged, fall back to highest-rated
  const list = womenGyms.length > 0 ? womenGyms : gyms.slice().sort((a, b) => b.rating - a.rating).slice(0, 6);
  const femaleCoaches = coaches.filter((c) => c.gender === "f");
  const topDisciplines = ["krav-maga", "bjj", "boxing", "muay-thai"]
    .map((s) => disciplines.find((d) => d.slug === s))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <>
      <section
        className="relative overflow-hidden border-b border-border"
        style={{
          background: "linear-gradient(180deg, #FDF1EB 0%, #FBFAF7 100%)",
        }}
      >
        <div className="absolute -top-20 end-0 size-[400px] rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute -bottom-20 start-1/4 size-[300px] rounded-full bg-brand/10 blur-3xl" />
        <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 py-14 md:py-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.18em] font-semibold text-accent bg-accent/10 rounded-full px-3 py-1.5 mb-5">
              <Sparkles className="size-3.5" />
              {t.kicker}
            </p>
            <h1 className="display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05]">
              {t.title}
            </h1>
            <p className="mt-5 text-lg text-ink-muted max-w-xl leading-relaxed">
              {t.subtitle}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/women/self-defense">
                <Button variant="ink" size="lg">
                  {t.cta_primary}
                  <Arrow className="size-4" />
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="outline" size="lg">
                  {t.cta_secondary}
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Shield, label: t.pill_safety, color: "text-brand bg-brand/10" },
              { icon: Users, label: t.pill_groups, color: "text-accent bg-accent/10" },
              { icon: Heart, label: t.pill_inclusive, color: "text-success bg-success/10" },
              { icon: Sparkles, label: t.pill_native, color: "text-warning bg-warning/10" },
            ].map((p) => (
              <div key={p.label} className="rounded-2xl bg-surface border border-border p-5">
                <div className={`size-10 rounded-xl grid place-items-center mb-3 ${p.color}`}>
                  <p.icon className="size-5" />
                </div>
                <p className="text-sm font-semibold leading-snug">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-rails */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="display text-2xl md:text-3xl font-extrabold mb-5">{t.rail_disciplines}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {topDisciplines.map((d) => (
            <Link
              key={d.slug}
              href={`/women/${d.slug}`}
              className="rounded-2xl border border-border bg-surface p-5 hover:shadow-md transition-all group"
            >
              <div
                className="size-10 rounded-lg mb-3"
                style={{ background: `linear-gradient(135deg, ${d.pin_color}, ${d.pin_color}c0)` }}
              />
              <h3 className="font-bold text-[15px] group-hover:text-brand transition-colors">
                {disciplineName(d, locale)}
              </h3>
              <p className="text-[12px] text-ink-muted mt-1">
                {t.women_in} {disciplineName(d, locale)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="display text-2xl md:text-3xl font-extrabold mb-5">{t.rail_gyms}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {list.slice(0, 6).map((g) => <GymCard key={g.slug} gym={g} />)}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="display text-2xl md:text-3xl font-extrabold mb-5">{t.rail_cities}</h2>
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <Link
              key={c.slug}
              href={`/women/${c.slug}`}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-ink-muted transition-colors"
            >
              {t.women_in} {cityName(c, locale)}
            </Link>
          ))}
        </div>
      </section>

      {femaleCoaches.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <h2 className="display text-2xl md:text-3xl font-extrabold mb-5">{t.rail_coaches}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {femaleCoaches.map((c) => (
              <Link
                key={c.slug}
                href={`/instructors/${c.slug}`}
                className="rounded-2xl border border-border bg-surface p-5 hover:shadow-md transition-all flex gap-4"
              >
                {/* Disabled image to avoid pravatar dependency on static export */}
                <div
                  className="size-16 rounded-full shrink-0 grid place-items-center text-white font-bold display text-xl"
                  style={{ background: "#0F4C5C" }}
                >
                  {(locale === "he" ? c.name_he : c.name_en).slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-[15px] leading-tight">
                    {locale === "he" ? c.name_he : c.name_en}
                  </h3>
                  <p className="text-[12px] text-ink-muted mt-1 line-clamp-2">
                    {locale === "he" ? c.headline_he : c.headline_en}
                  </p>
                  <p className="text-[11px] text-brand font-semibold mt-1.5">
                    {c.rank}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-start">
          <div>
            <h2 className="display text-2xl md:text-3xl font-extrabold mb-3">{t.cta_form_title}</h2>
            <p className="text-ink-muted leading-relaxed">{t.cta_form_body}</p>
          </div>
          <InquiryForm variant="women_only" />
        </div>
      </section>
    </>
  );
}

const COPY: Record<string, {
  kicker: string; title: string; subtitle: string;
  cta_primary: string; cta_secondary: string;
  pill_safety: string; pill_groups: string; pill_inclusive: string; pill_native: string;
  rail_disciplines: string; rail_gyms: string; rail_cities: string; rail_coaches: string;
  women_in: string;
  cta_form_title: string; cta_form_body: string;
  meta_title: string; meta_description: string;
}> = {
  en: {
    kicker: "Built for women",
    title: "Train your way.\nFrom self-defense to BJJ.",
    subtitle: "Women-only classes, female head coaches, real safety scenarios. Every gym vetted for inclusive, intentional training — not pink-it-and-shrink-it.",
    cta_primary: "Start with self-defense", cta_secondary: "Browse all gyms",
    pill_safety: "Safety-first scenarios", pill_groups: "Women-only groups", pill_inclusive: "Inclusive culture", pill_native: "Female coaches",
    rail_disciplines: "By discipline", rail_gyms: "Women-led gyms",
    rail_cities: "By city", rail_coaches: "Female head coaches",
    women_in: "Women in",
    cta_form_title: "Tell us what you need.",
    cta_form_body: "Self-defense workshop? Weekly BJJ group? Women-only Muay Thai 6am? We'll match you with the right coach in your city.",
    meta_title: "Women's Martial Arts in Israel — Dojan",
    meta_description: "Women-only classes, female head coaches, and safety-first self-defense across Israel. The largest women's martial arts directory in the country.",
  },
  he: {
    kicker: "נבנה לנשים",
    title: "אמני בדרך שלך.\nמהגנה עצמית ועד BJJ.",
    subtitle: "שיעורי נשים בלבד, מאמנות ראשיות, תרחישי אבטחה אמיתיים. כל מועדון אומת לתרבות מכילה ומכוונת — לא 'ורוד עם הנחה'.",
    cta_primary: "התחילי בהגנה עצמית", cta_secondary: "כל המועדונים",
    pill_safety: "תרחישי בטיחות אמיתיים", pill_groups: "קבוצות נשים בלבד", pill_inclusive: "תרבות מכילה", pill_native: "מאמנות",
    rail_disciplines: "לפי דיסציפלינה", rail_gyms: "מועדונים נשיים",
    rail_cities: "לפי עיר", rail_coaches: "מאמנות ראשיות",
    women_in: "נשים ב",
    cta_form_title: "ספרי לנו מה את צריכה.",
    cta_form_body: "סדנת הגנה עצמית? קבוצת BJJ שבועית? מואי תאי לנשים בבוקר? נחבר אותך למאמנת הנכונה בעיר שלך.",
    meta_title: "אומנויות לחימה לנשים בישראל — Dojan",
    meta_description: "שיעורי נשים בלבד, מאמנות ראשיות, והגנה עצמית. הקטלוג הרחב ביותר של אומנויות לחימה לנשים בישראל.",
  },
  ar: {
    kicker: "مصممة للنساء",
    title: "تدربي بطريقتك.\nمن الدفاع عن النفس إلى BJJ.",
    subtitle: "حصص للنساء فقط، مدربات نساء، سيناريوهات أمان واقعية. كل نادٍ موثّق لثقافة شاملة ومدروسة.",
    cta_primary: "ابدئي بالدفاع عن النفس", cta_secondary: "كل الأندية",
    pill_safety: "سيناريوهات أمان", pill_groups: "مجموعات نسائية", pill_inclusive: "ثقافة شاملة", pill_native: "مدربات",
    rail_disciplines: "حسب الرياضة", rail_gyms: "أندية بقيادة نساء",
    rail_cities: "حسب المدينة", rail_coaches: "مدربات رئيسيات",
    women_in: "نساء في",
    cta_form_title: "أخبرينا ماذا تحتاجين.",
    cta_form_body: "ورشة دفاع؟ مجموعة BJJ أسبوعية؟ مواي تاي للنساء صباحًا؟ سنوصلك بالمدربة المناسبة.",
    meta_title: "فنون قتالية للنساء في إسرائيل — Dojan",
    meta_description: "حصص للنساء فقط، مدربات نساء، ودفاع عن النفس آمن. أكبر دليل لفنون القتال النسائية في البلاد.",
  },
  es: {
    kicker: "Pensada para mujeres",
    title: "Entrena a tu manera.\nDesde defensa personal hasta BJJ.",
    subtitle: "Clases solo-mujeres, entrenadoras principales, escenarios de seguridad reales. Cada gimnasio verificado para una cultura inclusiva e intencional.",
    cta_primary: "Empieza con defensa personal", cta_secondary: "Ver todos",
    pill_safety: "Escenarios de seguridad", pill_groups: "Grupos solo-mujeres", pill_inclusive: "Cultura inclusiva", pill_native: "Entrenadoras",
    rail_disciplines: "Por disciplina", rail_gyms: "Gimnasios liderados por mujeres",
    rail_cities: "Por ciudad", rail_coaches: "Entrenadoras principales",
    women_in: "Mujeres en",
    cta_form_title: "Cuéntanos qué necesitas.",
    cta_form_body: "¿Taller de defensa? ¿Grupo de BJJ semanal? ¿Muay Thai mañanero? Te conectamos con la entrenadora adecuada.",
    meta_title: "Artes Marciales para Mujeres en Israel — Dojan",
    meta_description: "Clases solo-mujeres, entrenadoras y defensa personal. El mayor directorio de artes marciales femeninas del país.",
  },
  fr: {
    kicker: "Pensé pour les femmes",
    title: "Entraînez-vous à votre façon.\nDe la self-défense au BJJ.",
    subtitle: "Cours 100% féminins, coachs principaux femmes, scénarios de sécurité réels. Chaque club vérifié pour une culture inclusive et intentionnelle.",
    cta_primary: "Commencer par la self-défense", cta_secondary: "Tous les clubs",
    pill_safety: "Scénarios de sécurité", pill_groups: "Groupes 100% femmes", pill_inclusive: "Culture inclusive", pill_native: "Coachs femmes",
    rail_disciplines: "Par discipline", rail_gyms: "Clubs dirigés par des femmes",
    rail_cities: "Par ville", rail_coaches: "Coachs principales",
    women_in: "Femmes en",
    cta_form_title: "Dites-nous ce que vous cherchez.",
    cta_form_body: "Atelier self-défense ? Groupe BJJ hebdo ? Muay Thai femmes matin ? On vous trouve la bonne coach.",
    meta_title: "Arts Martiaux Femmes en Israël — Dojan",
    meta_description: "Cours 100% féminins, coachs femmes et self-défense. Le plus grand annuaire d'arts martiaux féminins du pays.",
  },
};
