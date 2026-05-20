"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowLeft, ArrowRight, Calendar, MapPin, Sparkles, Wand2, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { DisciplinePill } from "@/components/ui/DisciplinePill";
import { disciplines, findDiscipline } from "@/data/disciplines";
import { cities, findCity } from "@/data/cities";
import { buildPackage, totalCost, type PackageConstraints } from "@/lib/packages/score";
import { isRtl, cityName, disciplineName } from "@/lib/i18n/localize";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type Stage = 1 | 2 | 3 | 4 | 5 | 6;
type Trip = "now" | "planned";

export function PackageBuilderClient() {
  const locale = useLocale() as Locale;
  const rtl = isRtl(locale);
  const Arrow = rtl ? ArrowLeft : ArrowRight;
  const Back = rtl ? ArrowRight : ArrowLeft;
  const t = COPY[locale] ?? COPY.en;

  const [stage, setStage] = useState<Stage>(1);
  const [trip, setTrip] = useState<Trip>("planned");
  const [dates, setDates] = useState<{ start?: string; end?: string }>({});
  const [citySlugs, setCitySlugs] = useState<string[]>([]);
  const [disciplineSlugs, setDisciplineSlugs] = useState<string[]>([]);
  const [womenOnly, setWomenOnly] = useState(false);
  const [englishSpeaking, setEnglishSpeaking] = useState(true);
  const [level, setLevel] = useState<PackageConstraints["level"]>("beginner");
  const [sessionsPerWeek, setSessionsPerWeek] = useState(4);
  const [timeOfDay, setTimeOfDay] = useState<PackageConstraints["timeOfDay"]>("any");
  const [budgetMax, setBudgetMax] = useState(1500);

  const constraints: PackageConstraints = useMemo(
    () => ({
      disciplineSlugs, citySlugs, level, womenOnly, englishSpeaking,
      budgetNIS: [300, budgetMax], sessionsPerWeek, timeOfDay,
    }),
    [disciplineSlugs, citySlugs, level, womenOnly, englishSpeaking, budgetMax, sessionsPerWeek, timeOfDay],
  );

  const result = useMemo(
    () => (stage === 6 ? buildPackage(constraints) : []),
    [stage, constraints],
  );
  const totals = useMemo(() => totalCost(result), [result]);

  const canNext: Record<Stage, boolean> = {
    1: !!trip,
    2: citySlugs.length > 0,
    3: disciplineSlugs.length > 0,
    4: true,
    5: true,
    6: true,
  };

  function next() { setStage((s) => Math.min(6, s + 1) as Stage); }
  function back() { setStage((s) => Math.max(1, s - 1) as Stage); }

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-ink-muted mb-2">
          <span className="font-semibold inline-flex items-center gap-2">
            <Sparkles className="size-4 text-accent" />
            {t.kicker}
          </span>
          <span>{stage}/6</span>
        </div>
        <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${(stage / 6) * 100}%` }}
          />
        </div>
      </div>

      {stage === 1 && (
        <Step
          title={t.q1.title}
          subtitle={t.q1.subtitle}
        >
          <div className="grid grid-cols-2 gap-3">
            <Choice active={trip === "now"} onClick={() => setTrip("now")} label={t.q1.now} />
            <Choice active={trip === "planned"} onClick={() => setTrip("planned")} label={t.q1.planned} />
          </div>
          {trip === "planned" && (
            <div className="grid grid-cols-2 gap-3 mt-5">
              <DateField label={t.q1.from} value={dates.start} onChange={(v) => setDates({ ...dates, start: v })} />
              <DateField label={t.q1.to} value={dates.end} onChange={(v) => setDates({ ...dates, end: v })} />
            </div>
          )}
        </Step>
      )}

      {stage === 2 && (
        <Step title={t.q2.title} subtitle={t.q2.subtitle}>
          <div className="flex flex-wrap gap-2">
            {cities.map((c) => {
              const active = citySlugs.includes(c.slug);
              return (
                <button
                  key={c.slug}
                  onClick={() =>
                    setCitySlugs(active ? citySlugs.filter((s) => s !== c.slug) : [...citySlugs, c.slug])
                  }
                  className={cn(
                    "h-10 px-4 rounded-full border-2 text-sm font-medium transition-all",
                    active ? "border-ink bg-ink text-white" : "border-border bg-surface hover:border-ink-muted",
                  )}
                >
                  <MapPin className="size-3.5 inline me-1.5" />
                  {cityName(c, locale)}
                </button>
              );
            })}
          </div>
        </Step>
      )}

      {stage === 3 && (
        <Step title={t.q3.title} subtitle={t.q3.subtitle}>
          <div className="grid sm:grid-cols-2 gap-2">
            {disciplines.slice(0, 10).map((d) => {
              const active = disciplineSlugs.includes(d.slug);
              return (
                <button
                  key={d.slug}
                  onClick={() =>
                    setDisciplineSlugs(active ? disciplineSlugs.filter((s) => s !== d.slug) : [...disciplineSlugs, d.slug])
                  }
                  className={cn(
                    "text-start p-4 rounded-xl border-2 transition-all flex items-center gap-3",
                    active ? "border-ink bg-surface-2" : "border-border bg-surface hover:border-ink-muted",
                  )}
                >
                  <span className="size-3 rounded-full" style={{ background: d.pin_color }} />
                  <span className="font-semibold">{disciplineName(d, locale)}</span>
                  {active && <Check className="size-4 text-success ms-auto" />}
                </button>
              );
            })}
          </div>
        </Step>
      )}

      {stage === 4 && (
        <Step title={t.q4.title} subtitle={t.q4.subtitle}>
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold mb-2">{t.q4.level}</p>
              <div className="flex flex-wrap gap-2">
                {(["beginner", "intermediate", "advanced", "any"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={cn(
                      "h-9 px-3.5 rounded-full text-sm font-semibold border-2",
                      level === l ? "border-ink bg-ink text-white" : "border-border",
                    )}
                  >
                    {t.q4.levels[l]}
                  </button>
                ))}
              </div>
            </div>
            <Toggle label={t.q4.women} value={womenOnly} onChange={setWomenOnly} />
            <Toggle label={t.q4.english} value={englishSpeaking} onChange={setEnglishSpeaking} />
            <div>
              <p className="text-sm font-semibold mb-2">
                {t.q4.budget} · ₪{budgetMax} {t.q4.budget_suffix}
              </p>
              <input
                type="range"
                min={500} max={3000} step={100}
                value={budgetMax}
                onChange={(e) => setBudgetMax(parseInt(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
          </div>
        </Step>
      )}

      {stage === 5 && (
        <Step title={t.q5.title} subtitle={t.q5.subtitle}>
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold mb-2">{t.q5.sessions}</p>
              <div className="flex flex-wrap gap-2">
                {[2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSessionsPerWeek(n)}
                    className={cn(
                      "size-12 rounded-full text-sm font-bold border-2",
                      sessionsPerWeek === n ? "border-ink bg-ink text-white" : "border-border",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">{t.q5.tod}</p>
              <div className="flex flex-wrap gap-2">
                {(["morning", "evening", "any"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setTimeOfDay(v)}
                    className={cn(
                      "h-10 px-4 rounded-full text-sm font-semibold border-2",
                      timeOfDay === v ? "border-ink bg-ink text-white" : "border-border",
                    )}
                  >
                    {t.q5.tods[v]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Step>
      )}

      {stage === 6 && (
        <Step title={t.q6.title} subtitle={t.q6.subtitle}>
          {result.length === 0 ? (
            <p className="text-ink-muted">{t.q6.empty}</p>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl bg-surface-2 border border-border p-5 flex flex-wrap gap-6 items-center">
                <Stat label={t.q6.sessions} value={String(result.length)} />
                <Stat label={t.q6.cost} value={`₪${totals.min}–${totals.max}`} sub={t.q6.cost_sub} />
                <Stat label={t.q6.cities} value={String(new Set(result.map((r) => r.gym.city_slug)).size)} />
              </div>
              <ul className="space-y-3">
                {result.map((r, i) => {
                  const d = findDiscipline(r.slot.discipline_slug);
                  const c = findCity(r.gym.city_slug)!;
                  return (
                    <li
                      key={r.slot.id}
                      className="rounded-xl border border-border bg-surface p-4 flex items-center gap-4"
                    >
                      <span className="display text-3xl font-extrabold text-ink-subtle w-10 text-center">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[15px] truncate">
                          {locale === "he" ? r.gym.name_he : r.gym.name_en}
                        </p>
                        <p className="text-[12px] text-ink-muted truncate">
                          {cityName(c, locale)} · {DAY_NAMES[locale][r.slot.day]} {r.slot.start}
                        </p>
                      </div>
                      {d && (
                        <DisciplinePill color={d.pin_color} size="sm">
                          {disciplineName(d, locale)}
                        </DisciplinePill>
                      )}
                      <span className="ms-2 inline-flex items-center justify-center size-9 rounded-full bg-success/15 text-success text-xs font-bold">
                        {r.score}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 mt-6">
                <p className="font-bold mb-2 inline-flex items-center gap-2">
                  <Wand2 className="size-4 text-accent" />
                  {t.q6.send_title}
                </p>
                <p className="text-sm text-ink-muted mb-4">{t.q6.send_body}</p>
                <InquiryForm
                  variant="package"
                  packagePayload={{ constraints, slots: result.map((r) => r.slot.id) }}
                  compact
                />
              </div>
            </div>
          )}
        </Step>
      )}

      <footer className="mt-10 flex items-center justify-between">
        {stage > 1 ? (
          <button onClick={back} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink">
            <Back className="size-4" />
            {t.back}
          </button>
        ) : <span />}
        {stage < 6 && (
          <Button onClick={next} variant="ink" size="lg" disabled={!canNext[stage]}>
            {stage === 5 ? t.build : t.next}
            <Arrow className="size-4" />
          </Button>
        )}
      </footer>
    </section>
  );
}

function Step({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="display text-3xl md:text-5xl font-extrabold leading-tight">{title}</h1>
      {subtitle && <p className="mt-3 text-ink-muted text-lg">{subtitle}</p>}
      <div className="mt-8">{children}</div>
    </div>
  );
}

function Choice({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-20 rounded-2xl border-2 font-semibold text-[15px] transition-all",
        active ? "border-ink bg-ink text-white" : "border-border bg-surface hover:border-ink-muted",
      )}
    >
      {label}
    </button>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface cursor-pointer">
      <span className="font-medium">{label}</span>
      <span className={cn("relative w-11 h-6 rounded-full transition-colors", value ? "bg-success" : "bg-border")}>
        <span
          className="absolute top-0.5 size-5 bg-white rounded-full transition-transform"
          style={{ insetInlineStart: value ? "calc(100% - 22px)" : "2px" }}
        />
      </span>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="hidden" />
    </label>
  );
}

function DateField({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-ink-muted mb-1 block">{label}</span>
      <input
        type="date"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-3 rounded-xl border border-border bg-surface focus:border-ink outline-none"
      />
    </label>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider font-bold text-ink-subtle">{label}</p>
      <p className="display text-2xl font-extrabold text-ink">{value}</p>
      {sub && <p className="text-[10px] text-ink-subtle">{sub}</p>}
    </div>
  );
}

const DAY_NAMES: Record<Locale, string[]> = {
  he: ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  ar: ["أحد", "اث", "ث", "ر", "خ", "ج", "س"],
  es: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  fr: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
};

const COPY: Record<string, any> = {
  en: {
    kicker: "Package Builder", next: "Next", back: "Back", build: "Build my package",
    q1: { title: "When will you train?", subtitle: "We'll match your schedule.", now: "I'm in Israel now", planned: "I'm planning a trip", from: "Arrive", to: "Leave" },
    q2: { title: "Where will you be staying?", subtitle: "Pick one or more cities. We'll work around them." },
    q3: { title: "What do you want to train?", subtitle: "Pick any combination — your package will mix and match." },
    q4: { title: "Any constraints?", subtitle: "Tell us how to filter.", level: "Level", levels: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced", any: "Any level" }, women: "Women-only classes", english: "Coach must speak English", budget: "Budget (max)", budget_suffix: "/month" },
    q5: { title: "Schedule shape", subtitle: "How intense should it feel?", sessions: "Sessions per week", tod: "Time of day", tods: { morning: "Mornings", evening: "Evenings", any: "Either" } },
    q6: { title: "Your package", subtitle: "Tweak any slot. When you're ready, hit Send and we'll have a human follow up within 24 hours.", empty: "We couldn't fill your week with these constraints. Try relaxing one — broader discipline list, more cities, or no women-only filter.", sessions: "Sessions", cost: "Est. cost", cost_sub: "this week", cities: "Cities", send_title: "Send me this package", send_body: "Your details + the package itself reach our team. We respond within 24 hours with bookings + a WhatsApp confirmation." },
  },
  he: {
    kicker: "בונה חבילות", next: "הבא", back: "חזור", build: "בנה לי חבילה",
    q1: { title: "מתי תתאמני?", subtitle: "נתאים את הלו\"ז.", now: "אני בארץ עכשיו", planned: "אני מתכנן/ת ביקור", from: "הגעה", to: "יציאה" },
    q2: { title: "איפה תשהי?", subtitle: "בחרי עיר אחת או יותר. נעבוד סביבן." },
    q3: { title: "מה תרצה לאמן?", subtitle: "בחרי כל שילוב — החבילה תערבב." },
    q4: { title: "אילוצים?", subtitle: "ספרי לנו איך לסנן.", level: "רמה", levels: { beginner: "מתחילים", intermediate: "בינוני", advanced: "מתקדם", any: "כל רמה" }, women: "שיעורי נשים בלבד", english: "המאמן חייב לדבר אנגלית", budget: "תקציב (מקסימום)", budget_suffix: "לחודש" },
    q5: { title: "צורת הלוז", subtitle: "כמה אינטנסיבי?", sessions: "אימונים בשבוע", tod: "שעות", tods: { morning: "בקרים", evening: "ערבים", any: "שניהם" } },
    q6: { title: "החבילה שלך", subtitle: "החליפי כל שיעור שתרצי. כשמוכן, שלחי — נחזור תוך 24 שעות.", empty: "לא הצלחנו למלא את השבוע עם האילוצים האלה. נסי להקל באחד — יותר דיסציפלינות, יותר ערים, או בלי 'נשים בלבד'.", sessions: "שיעורים", cost: "עלות מוערכת", cost_sub: "השבוע", cities: "ערים", send_title: "שלחי לי את החבילה", send_body: "הפרטים שלך + החבילה מגיעים אלינו. נחזור תוך 24 שעות עם אישורים + אישור בוואטסאפ." },
  },
  ar: {
    kicker: "بناء الباقة", next: "التالي", back: "رجوع", build: "ابني الباقة",
    q1: { title: "متى ستتدرب؟", subtitle: "سنطابق جدولك.", now: "أنا في إسرائيل الآن", planned: "أخطط لزيارة", from: "الوصول", to: "المغادرة" },
    q2: { title: "أين ستقيم؟", subtitle: "اختر مدينة أو أكثر." },
    q3: { title: "ماذا تريد أن تتدرب؟", subtitle: "اختر أي مزيج." },
    q4: { title: "قيود؟", subtitle: "أخبرنا كيف نصفي.", level: "المستوى", levels: { beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدم", any: "أي مستوى" }, women: "للنساء فقط", english: "مدرب يتحدث الإنجليزية", budget: "الميزانية", budget_suffix: "/شهر" },
    q5: { title: "شكل الجدول", subtitle: "ما مدى الكثافة؟", sessions: "حصص في الأسبوع", tod: "الوقت", tods: { morning: "صباحًا", evening: "مساءً", any: "أي" } },
    q6: { title: "باقتك", subtitle: "عدّل أي خانة. ثم اضغط إرسال.", empty: "لم نتمكن من ملء الأسبوع. خفف القيود.", sessions: "حصص", cost: "تكلفة تقديرية", cost_sub: "هذا الأسبوع", cities: "مدن", send_title: "أرسلوا لي الباقة", send_body: "تفاصيلك + الباقة تصلنا. نرد خلال 24 ساعة." },
  },
  es: {
    kicker: "Constructor de paquetes", next: "Siguiente", back: "Atrás", build: "Construir mi paquete",
    q1: { title: "¿Cuándo entrenarás?", subtitle: "Ajustamos a tu calendario.", now: "Estoy en Israel ahora", planned: "Estoy planeando un viaje", from: "Llegada", to: "Salida" },
    q2: { title: "¿Dónde te quedarás?", subtitle: "Elige una o más ciudades." },
    q3: { title: "¿Qué quieres entrenar?", subtitle: "Cualquier combinación." },
    q4: { title: "¿Restricciones?", subtitle: "Cómo filtramos.", level: "Nivel", levels: { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzado", any: "Cualquiera" }, women: "Solo-mujeres", english: "Entrenador habla inglés", budget: "Presupuesto", budget_suffix: "/mes" },
    q5: { title: "Forma del horario", subtitle: "¿Qué tan intenso?", sessions: "Sesiones por semana", tod: "Hora", tods: { morning: "Mañanas", evening: "Tardes", any: "Cualquiera" } },
    q6: { title: "Tu paquete", subtitle: "Cambia lo que quieras y envía.", empty: "No pudimos llenar la semana. Suaviza alguna restricción.", sessions: "Sesiones", cost: "Costo est.", cost_sub: "esta semana", cities: "Ciudades", send_title: "Envíame este paquete", send_body: "Tus datos + el paquete nos llegan. Respondemos en 24 horas." },
  },
  fr: {
    kicker: "Constructeur de package", next: "Suivant", back: "Retour", build: "Construire mon package",
    q1: { title: "Quand vous entraînerez-vous ?", subtitle: "On s'aligne sur votre calendrier.", now: "Je suis en Israël maintenant", planned: "Je planifie un voyage", from: "Arrivée", to: "Départ" },
    q2: { title: "Où séjournez-vous ?", subtitle: "Sélectionnez une ou plusieurs villes." },
    q3: { title: "Que voulez-vous entraîner ?", subtitle: "N'importe quelle combinaison." },
    q4: { title: "Des contraintes ?", subtitle: "Comment filtrer.", level: "Niveau", levels: { beginner: "Débutant", intermediate: "Intermédiaire", advanced: "Avancé", any: "Tous niveaux" }, women: "Cours femmes uniquement", english: "Coach anglophone", budget: "Budget", budget_suffix: "/mois" },
    q5: { title: "Forme du planning", subtitle: "Quelle intensité ?", sessions: "Séances par semaine", tod: "Horaire", tods: { morning: "Matin", evening: "Soir", any: "Indifférent" } },
    q6: { title: "Votre package", subtitle: "Modifiez n'importe quelle séance puis envoyez.", empty: "Impossible de remplir la semaine. Allégez une contrainte.", sessions: "Séances", cost: "Coût est.", cost_sub: "cette semaine", cities: "Villes", send_title: "Envoyez-moi ce package", send_body: "Vos coordonnées + le package nous arrivent. Réponse sous 24 heures." },
  },
};
