import { setRequestLocale } from "next-intl/server";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Users,
  Calendar,
  Star,
  Eye,
  Phone,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RatingStars } from "@/components/ui/RatingStars";
import { gyms } from "@/data/gyms";
import { findDiscipline } from "@/data/disciplines";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "he" ? "לבעלי מועדונים" : "For Gym Owners",
    robots: { index: false },
  };
}

export default async function DashboardPage({
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
  const Arrow = isHe ? ArrowLeft : ArrowRight;
  const Chev = isHe ? ChevronLeft : ChevronRight;
  const demoGym = gyms[0]; // Iron Dojo Tel Aviv

  const t = isHe
    ? {
        demo_pill: "תצוגה",
        kicker: "לבעלי מועדונים",
        title: "המועדון שלך, בידיים שלך.",
        subtitle:
          "פרסמי שיעורים, נהלי שיעורי ניסיון, ענה לביקורות, וקבלי תובנות על מי שמחפש מועדון כמו שלך.",
        cta_primary: "פתחו דף מועדון בחינם",
        cta_secondary: "ראו דמו אינטראקטיבי",
        free_pill: "90 ימים חינם — בלי כרטיס אשראי",
        why_title: "מה תקבלי ב-Dojan",
        feature_1_title: "נראות ב-Google בעברית",
        feature_1_body:
          "כל מועדון מקבל דף SSR אופטימלי לחיפוש בעברית. דירוג טבעי גבוה ביעדי החיפוש החשובים בקטגוריה.",
        feature_2_title: "לידים לשיעור ניסיון",
        feature_2_body:
          "תלמידים פוטנציאליים שולחים בקשה לשיעור ניסיון ישירות מהדף שלך. מקבלי הודעת WhatsApp ואימייל.",
        feature_3_title: "ביקורות מאומתות",
        feature_3_body:
          "כל ביקורת ב-Dojan קשורה לשיעור ניסיון אמיתי. לא בוטים, לא הטיות. אתם מגיבים, אנחנו מודעים.",
        feature_4_title: "ניתוח מתחרים",
        feature_4_body:
          "ראי איך התלמידים מוצאים אותך, איזה דיסציפלינות הכי מעניינות, ואיפה את מאבדת לידים.",
        preview_title: "כך זה ייראה",
        preview_subtitle:
          "תצוגה מקדימה של לוח הבקרה שלכם. (זה דמו עם נתוני דמה — אבל המבנה הוא הסופי.)",
        sections: {
          stats: "סקירה — 30 הימים האחרונים",
          views: "צפיות בדף",
          leads: "לידים לניסיון",
          conversion: "אחוז המרה",
          rating: "דירוג ממוצע",
          trial_inbox: "בקשות לשיעור ניסיון",
          recent_reviews: "ביקורות אחרונות",
          schedule: "לוח שיעורים",
          status: {
            new: "חדש",
            confirmed: "אושר",
            attended: "נכח",
          },
          actions: {
            confirm: "אשר",
            decline: "דחה",
            reply: "השב",
          },
        },
        pricing_pill: "תמחור",
        pricing_title: "פשוט. הוגן. גדל יחד איתכם.",
        pricing_free: "חינם — 90 ימי ניסיון",
        pricing_free_body:
          "דף מועדון מלא, לידים, ביקורות, וניתוח. בלי הגבלת תכונות. בלי כרטיס אשראי.",
        pricing_growth: "צמיחה — ₪199/חודש",
        pricing_growth_body:
          "כל מה שיש בחינם, ועוד: עדיפות בחיפוש, פרסום ממומן, ועד 5 לידים מועדפים בחודש.",
        pricing_premium: "פרימיום — ₪499/חודש",
        pricing_premium_body:
          "סדר עדיפות מקסימלי, מודעות חיצוניות, ואחריות 2x ROI או החזר כספי מלא.",
        contact_title: "מוכנה? בואי נדבר.",
        contact_body:
          "צוות הצמיחה שלנו מתקשר אליך תוך 24 שעות, מקים את הדף יחד איתך, ומלמד אותך איך לקרא את הניתוח.",
        contact_email: "growth@dojan.co.il",
      }
    : {
        demo_pill: "Demo",
        kicker: "For gym owners",
        title: "Your gym, in your hands.",
        subtitle:
          "Publish your classes, manage trial bookings, reply to reviews, and see exactly who's looking for a gym like yours.",
        cta_primary: "Open a gym page — free",
        cta_secondary: "See an interactive demo",
        free_pill: "90 days free — no credit card",
        why_title: "What you get on Dojan",
        feature_1_title: "Hebrew SEO visibility",
        feature_1_body:
          "Every gym gets an SSR-optimized page tuned for Hebrew search. Strong organic rankings on the queries that matter.",
        feature_2_title: "Trial-class leads",
        feature_2_body:
          "Prospective students request trial classes directly from your page. You get WhatsApp + email notifications.",
        feature_3_title: "Verified reviews",
        feature_3_body:
          "Every Dojan review is tied to an attended trial. No bots, no astroturf. You respond — we keep it honest.",
        feature_4_title: "Competitive insight",
        feature_4_body:
          "See how students find you, which disciplines drive interest, and where leads drop off.",
        preview_title: "Here's what it looks like",
        preview_subtitle:
          "A preview of your dashboard. (Demo data — the structure is final.)",
        sections: {
          stats: "Last 30 days",
          views: "Page views",
          leads: "Trial leads",
          conversion: "Conversion",
          rating: "Avg. rating",
          trial_inbox: "Trial requests",
          recent_reviews: "Recent reviews",
          schedule: "Class schedule",
          status: {
            new: "New",
            confirmed: "Confirmed",
            attended: "Attended",
          },
          actions: {
            confirm: "Confirm",
            decline: "Decline",
            reply: "Reply",
          },
        },
        pricing_pill: "Pricing",
        pricing_title: "Simple. Fair. Grows with you.",
        pricing_free: "Free — 90-day trial",
        pricing_free_body:
          "Full gym page, leads, reviews, and analytics. No feature limits. No credit card.",
        pricing_growth: "Growth — ₪199/month",
        pricing_growth_body:
          "Everything in Free, plus: search priority, sponsored placements, up to 5 priority leads per month.",
        pricing_premium: "Premium — ₪499/month",
        pricing_premium_body:
          "Maximum priority, external ad placements, and a 2× ROI guarantee or full refund.",
        contact_title: "Ready? Let's talk.",
        contact_body:
          "Our growth team will reach out within 24 hours, set up your page with you, and walk you through the analytics.",
        contact_email: "growth@dojan.co.il",
      };

  // Demo data
  const demoLeads = [
    {
      id: "1",
      name: "מירב כהן",
      time: isHe ? "לפני 2 שעות" : "2 hours ago",
      class: isHe ? "מואי תאי מתחילים" : "Muay Thai Beginners",
      day: isHe ? "ראשון 18:00" : "Sunday 18:00",
      status: "new" as const,
    },
    {
      id: "2",
      name: "Daniel Levy",
      time: isHe ? "לפני 5 שעות" : "5 hours ago",
      class: isHe ? "BJJ כללי" : "BJJ All-Levels",
      day: isHe ? "שני 19:30" : "Monday 19:30",
      status: "confirmed" as const,
    },
    {
      id: "3",
      name: "שירה לוי",
      time: isHe ? "אתמול" : "Yesterday",
      class: isHe ? "MMA" : "MMA",
      day: isHe ? "רביעי 20:00" : "Wednesday 20:00",
      status: "attended" as const,
    },
  ];

  const stats = [
    {
      icon: Eye,
      label: t.sections.views,
      value: "2,847",
      delta: "+18%",
      color: "text-brand",
      bg: "bg-brand/10",
    },
    {
      icon: Phone,
      label: t.sections.leads,
      value: "63",
      delta: "+24%",
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: TrendingUp,
      label: t.sections.conversion,
      value: "8.4%",
      delta: "+1.2pp",
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      icon: Star,
      label: t.sections.rating,
      value: demoGym.rating.toFixed(1),
      delta: `${demoGym.review_count} reviews`,
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-warm-radial border-b border-border">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-14 md:pt-20 pb-12 md:pb-16">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] bg-accent/10 text-accent rounded-full px-2.5 py-1 mb-4">
            {t.demo_pill}
          </span>
          <p className="text-[12px] uppercase tracking-[0.2em] font-semibold text-brand mb-3">
            {t.kicker}
          </p>
          <h1 className="display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] max-w-3xl">
            {t.title}
          </h1>
          <p className="mt-5 text-ink-muted max-w-2xl text-[16px] md:text-lg leading-relaxed">
            {t.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3 items-center">
            <Link href="/auth/sign-in">
              <Button variant="ink" size="lg">
                {t.cta_primary}
                <Arrow className="size-4" />
              </Button>
            </Link>
            <a href="#preview">
              <Button variant="outline" size="lg">
                {t.cta_secondary}
              </Button>
            </a>
            <span className="text-[13px] font-semibold text-success inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4" />
              {t.free_pill}
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-14 md:py-20">
        <h2 className="display text-2xl md:text-4xl font-extrabold mb-10">
          {t.why_title}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Feature icon={TrendingUp} title={t.feature_1_title} body={t.feature_1_body} bg="bg-brand/10" color="text-brand" />
          <Feature icon={Users} title={t.feature_2_title} body={t.feature_2_body} bg="bg-accent/10" color="text-accent" />
          <Feature icon={Star} title={t.feature_3_title} body={t.feature_3_body} bg="bg-warning/10" color="text-warning" />
          <Feature icon={Sparkles} title={t.feature_4_title} body={t.feature_4_body} bg="bg-success/10" color="text-success" />
        </div>
      </section>

      {/* Dashboard preview */}
      <section
        id="preview"
        className="bg-surface-2 border-y border-border py-14 md:py-20"
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <h2 className="display text-2xl md:text-4xl font-extrabold mb-2">
            {t.preview_title}
          </h2>
          <p className="text-ink-muted max-w-2xl">{t.preview_subtitle}</p>

          <div className="mt-8 rounded-2xl bg-surface border border-border shadow-md overflow-hidden">
            {/* Faux titlebar */}
            <div className="flex items-center gap-2 px-4 h-10 border-b border-border bg-bg">
              <span className="size-2.5 rounded-full bg-danger/40" />
              <span className="size-2.5 rounded-full bg-warning/50" />
              <span className="size-2.5 rounded-full bg-success/50" />
              <span className="text-[12px] text-ink-subtle ms-3 font-mono">
                dojan.co.il/dashboard
              </span>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-7">
                <div
                  className="size-12 rounded-xl grid place-items-center text-white font-bold display"
                  style={{ background: "#0F4C5C" }}
                >
                  {(isHe ? demoGym.name_he : demoGym.name_en).slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {isHe ? demoGym.name_he : demoGym.name_en}
                  </h3>
                  <p className="text-[13px] text-ink-muted">
                    {isHe ? demoGym.neighborhood_he : demoGym.neighborhood_en}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <h4 className="text-[11px] uppercase tracking-wider font-bold text-ink-subtle mb-3">
                {t.sections.stats}
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-border p-4 bg-bg"
                  >
                    <div className={`size-9 rounded-lg grid place-items-center mb-2 ${s.bg} ${s.color}`}>
                      <s.icon className="size-4" />
                    </div>
                    <p className="text-[11px] uppercase tracking-wider text-ink-subtle font-semibold">
                      {s.label}
                    </p>
                    <p className="display text-2xl font-extrabold text-ink mt-0.5">
                      {s.value}
                    </p>
                    <p className="text-[11px] text-success font-semibold mt-0.5">
                      {s.delta}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
                {/* Trial inbox */}
                <div className="rounded-xl border border-border bg-bg overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                    <h4 className="font-bold text-sm">
                      {t.sections.trial_inbox}
                    </h4>
                    <span className="text-[11px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      {demoLeads.filter((l) => l.status === "new").length} {t.sections.status.new}
                    </span>
                  </div>
                  <ul className="divide-y divide-border">
                    {demoLeads.map((l) => (
                      <li key={l.id} className="px-5 py-3.5 flex items-center gap-4">
                        <div className="size-9 rounded-full bg-brand/10 grid place-items-center text-brand font-bold text-sm">
                          {l.name.slice(0, 1)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[14px] truncate">
                            {l.name}
                          </p>
                          <p className="text-[12px] text-ink-muted truncate">
                            {l.class} · {l.day}
                          </p>
                        </div>
                        <span className="text-[11px] text-ink-subtle hidden sm:inline">{l.time}</span>
                        {l.status === "new" ? (
                          <button className="text-[12px] font-semibold bg-ink text-white px-3 py-1.5 rounded-full">
                            {t.sections.actions.confirm}
                          </button>
                        ) : l.status === "confirmed" ? (
                          <span className="text-[11px] font-semibold text-brand bg-brand/10 px-2 py-1 rounded-full">
                            {t.sections.status.confirmed}
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-success bg-success/10 px-2 py-1 rounded-full">
                            {t.sections.status.attended}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recent reviews */}
                <div className="rounded-xl border border-border bg-bg overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-border">
                    <h4 className="font-bold text-sm">
                      {t.sections.recent_reviews}
                    </h4>
                  </div>
                  <ul className="divide-y divide-border">
                    {demoGym.reviews.slice(0, 2).map((r) => (
                      <li key={r.id} className="px-5 py-4">
                        <div className="flex items-center gap-3 mb-1">
                          <RatingStars value={r.rating} size="sm" showValue={false} />
                          <span className="text-[12px] font-semibold text-ink">
                            {r.author}
                          </span>
                        </div>
                        <p className="text-[13px] text-ink-muted line-clamp-2 leading-snug">
                          {isHe ? r.body_he : r.body_en}
                        </p>
                        <button className="mt-2 text-[12px] font-semibold text-brand inline-flex items-center gap-1">
                          <MessageSquare className="size-3.5" />
                          {t.sections.actions.reply}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Schedule preview */}
              <div className="mt-5 rounded-xl border border-border bg-bg overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                  <h4 className="font-bold text-sm">{t.sections.schedule}</h4>
                  <span className="text-[11px] font-semibold text-ink-muted inline-flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {demoGym.classes.length}{" "}
                    {isHe ? "שיעורים" : "classes"}
                  </span>
                </div>
                <div className="p-3 grid grid-cols-7 gap-1.5">
                  {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                    const slots = demoGym.classes.filter((c) => c.day === day);
                    return (
                      <div key={day} className="space-y-1">
                        <p className="text-[10px] text-center font-bold uppercase tracking-wider text-ink-subtle py-1">
                          {(isHe ? ["א", "ב", "ג", "ד", "ה", "ו", "ש"] : ["S", "M", "T", "W", "T", "F", "S"])[day]}
                        </p>
                        {slots.slice(0, 3).map((c) => {
                          const d = findDiscipline(c.discipline_slug);
                          return (
                            <div
                              key={c.id}
                              className="rounded-md text-[10px] py-1 px-1.5 font-semibold truncate"
                              style={{
                                background: `${d?.pin_color}1a`,
                                color: d?.pin_color,
                              }}
                            >
                              {c.start.slice(0, 5)}
                            </div>
                          );
                        })}
                        {slots.length === 0 && (
                          <div className="text-center text-[10px] text-ink-subtle py-1">—</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-14 md:py-20">
        <p className="text-[12px] uppercase tracking-[0.2em] font-semibold text-brand mb-3">
          {t.pricing_pill}
        </p>
        <h2 className="display text-3xl md:text-5xl font-extrabold leading-[1.05] mb-10">
          {t.pricing_title}
        </h2>

        <div className="grid md:grid-cols-3 gap-5">
          <PriceCard tier="free" title={t.pricing_free} body={t.pricing_free_body} />
          <PriceCard tier="growth" title={t.pricing_growth} body={t.pricing_growth_body} highlight />
          <PriceCard tier="premium" title={t.pricing_premium} body={t.pricing_premium_body} />
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20">
        <div className="rounded-3xl bg-ink text-white p-8 md:p-14 grid md:grid-cols-[2fr_1fr] gap-6 items-center">
          <div>
            <h2 className="display text-2xl md:text-4xl font-extrabold leading-tight">
              {t.contact_title}
            </h2>
            <p className="mt-3 text-white/70 max-w-lg">{t.contact_body}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/auth/sign-in">
              <Button variant="primary" size="lg" className="w-full">
                {t.cta_primary}
                <Arrow className="size-4" />
              </Button>
            </Link>
            <a
              href={`mailto:${t.contact_email}`}
              className="text-center text-white/70 text-sm font-semibold hover:text-white"
            >
              {t.contact_email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
  bg,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  bg: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className={`size-11 rounded-xl grid place-items-center mb-4 ${bg} ${color}`}>
        <Icon className="size-5" />
      </div>
      <h3 className="font-bold text-[16px] leading-snug mb-1.5">{title}</h3>
      <p className="text-[13px] text-ink-muted leading-relaxed">{body}</p>
    </div>
  );
}

function PriceCard({
  title,
  body,
  highlight,
}: {
  tier: "free" | "growth" | "premium";
  title: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl p-7 border-2 ${
        highlight
          ? "border-ink bg-surface shadow-md"
          : "border-border bg-surface"
      }`}
    >
      {highlight && (
        <span className="absolute -top-3 start-7 text-[10px] font-bold uppercase tracking-[0.18em] bg-accent text-white px-2.5 py-1 rounded-full">
          ★ Recommended
        </span>
      )}
      <h3 className="display font-extrabold text-xl mb-2">{title}</h3>
      <p className="text-[14px] text-ink-muted leading-relaxed">{body}</p>
    </div>
  );
}
