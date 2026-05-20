"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Variant = "trial" | "package" | "private" | "corporate" | "tourism" | "women_only" | "general";

interface Props {
  variant: Variant;
  gymSlug?: string;
  coachSlug?: string;
  disciplineSlug?: string;
  citySlug?: string;
  packagePayload?: object;
  className?: string;
  compact?: boolean;
}

/**
 * Universal lead-capture form. Mirrors BUILD_PROMPT_EXPANSION §4.2.
 *
 * Today: persists to localStorage so the user can see leads accumulate
 * in /admin/leads while we're on Pages with no backend.
 *
 * Real-backend wiring (later, when on Vercel + Supabase):
 *   1. INSERT INTO bookings with full context
 *   2. Resend templated email to gym owner
 *   3. Confirmation email to user
 *   4. WhatsApp Cloud API template to gym whatsapp number
 *   5. PostHog `lead_submitted` event
 */
export function InquiryForm({
  variant,
  gymSlug,
  coachSlug,
  disciplineSlug,
  citySlug,
  packagePayload,
  className,
  compact,
}: Props) {
  const locale = useLocale() as "he" | "en" | "ar" | "es" | "fr";
  const [state, setState] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setState("submitting");
    const fd = new FormData(e.currentTarget);
    const payload = {
      id: crypto.randomUUID(),
      inquiry_type: variant,
      gym_slug: gymSlug,
      coach_slug: coachSlug,
      discipline_slug: disciplineSlug,
      city_slug: citySlug,
      package_payload: packagePayload,
      participant_name: fd.get("name"),
      participant_phone: fd.get("phone"),
      participant_email: fd.get("email"),
      notes: fd.get("notes"),
      preferred_date: fd.get("date"),
      source_locale: locale,
      source_url: typeof window !== "undefined" ? window.location.href : "",
      source_referrer: typeof document !== "undefined" ? document.referrer : "",
      created_at: new Date().toISOString(),
      status: "requested",
      lead_score: 50 + Math.floor(Math.random() * 30),
    };
    try {
      const existing = JSON.parse(localStorage.getItem("dojan_leads") ?? "[]");
      existing.unshift(payload);
      localStorage.setItem("dojan_leads", JSON.stringify(existing.slice(0, 200)));
      // Simulate API latency so the UI feels real
      await new Promise((r) => setTimeout(r, 500));
      setState("done");
    } catch (err) {
      setError(String(err));
      setState("idle");
    }
  }

  const t = LABELS[locale] ?? LABELS.en;
  const variantCopy = t.variants[variant];

  if (state === "done") {
    return (
      <div className={`rounded-2xl border border-success/30 bg-success/5 p-6 text-center ${className ?? ""}`}>
        <CheckCircle2 className="size-9 text-success mx-auto mb-2" />
        <h3 className="display font-extrabold text-xl">{t.success_title}</h3>
        <p className="text-ink-muted mt-1 max-w-md mx-auto">{t.success_body}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`rounded-2xl border border-border bg-surface p-5 md:p-6 space-y-3 ${className ?? ""}`}
    >
      {!compact && (
        <header className="mb-2">
          <h3 className="display font-extrabold text-xl">{variantCopy.title}</h3>
          <p className="text-sm text-ink-muted mt-1">{variantCopy.subtitle}</p>
        </header>
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        <Field name="name" label={t.name} required />
        <Field name="phone" label={t.phone} type="tel" required />
      </div>
      <Field name="email" label={t.email} type="email" required />
      {(variant === "trial" || variant === "package" || variant === "tourism") && (
        <Field name="date" label={t.preferred_date} type="date" />
      )}
      <Field name="notes" label={t.notes} multiline />

      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={state === "submitting"}
        className="w-full"
      >
        {state === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t.sending}
          </>
        ) : (
          variantCopy.cta
        )}
      </Button>
      {error && <p className="text-xs text-danger">{error}</p>}
      <p className="text-[11px] text-ink-subtle text-center">{t.privacy}</p>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  multiline,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-ink-muted mb-1 block">
        {label}
        {required && <span className="text-accent ms-0.5">*</span>}
      </span>
      {multiline ? (
        <textarea
          name={name}
          rows={3}
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-2 text-[14px] focus:border-ink focus:outline-none resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-2 text-[14px] focus:border-ink focus:outline-none"
        />
      )}
    </label>
  );
}

const LABELS = {
  en: {
    name: "Your name",
    phone: "Phone",
    email: "Email",
    preferred_date: "Preferred date",
    notes: "Anything we should know?",
    sending: "Sending…",
    privacy: "We never sell your data. By submitting you accept our Terms & Privacy.",
    success_title: "Lead sent.",
    success_body: "The gym will reach out via WhatsApp + email within 24 hours.",
    variants: {
      trial: { title: "Book a trial class", subtitle: "Free or low-cost. Cancel anytime.", cta: "Book trial class" },
      package: { title: "Get your package", subtitle: "We'll have someone build your week within 24 hours.", cta: "Send my package" },
      private: { title: "Request a private lesson", subtitle: "1-on-1 with this coach.", cta: "Request" },
      corporate: { title: "Corporate inquiry", subtitle: "We work with teams, retreats, and security units.", cta: "Get a quote" },
      tourism: { title: "Train while you visit", subtitle: "We'll match you with English-speaking gyms in your area.", cta: "Get options" },
      women_only: { title: "Join a women-only class", subtitle: "All-female coach and group.", cta: "Reserve a spot" },
      general: { title: "General inquiry", subtitle: "We respond within 24 hours.", cta: "Send" },
    },
  },
  he: {
    name: "השם שלך", phone: "טלפון", email: "אימייל", preferred_date: "תאריך מועדף", notes: "משהו שכדאי שנדע?",
    sending: "שולח…", privacy: "אנחנו לא מוכרים את הנתונים שלך. בשליחה את/ה מסכים/ה לתנאי השימוש ופרטיות.",
    success_title: "הליד נשלח.", success_body: "המועדון יחזור אליך בוואטסאפ ובאימייל תוך 24 שעות.",
    variants: {
      trial: { title: "הזמן/י שיעור ניסיון", subtitle: "חינם או בזול. אפשר לבטל בכל רגע.", cta: "הזמן שיעור ניסיון" },
      package: { title: "קבלי את החבילה שלך", subtitle: "מישהו מאיתנו יבנה לך את השבוע תוך 24 שעות.", cta: "שלחי לי את החבילה" },
      private: { title: "בקשי שיעור פרטי", subtitle: "אחד על אחד עם המאמן הזה.", cta: "בקשה" },
      corporate: { title: "פנייה לארגונים", subtitle: "אנחנו עובדים עם צוותים, ימי גיבוש, יחידות אבטחה.", cta: "קבלי הצעה" },
      tourism: { title: "אמן/י בזמן הביקור", subtitle: "נחבר אותך למועדונים דוברי אנגלית באזורך.", cta: "קבלי אפשרויות" },
      women_only: { title: "הצטרפי לקבוצת נשים", subtitle: "מאמנת אישה, קבוצה כולה נשית.", cta: "שריני מקום" },
      general: { title: "פנייה כללית", subtitle: "מגיבים תוך 24 שעות.", cta: "שלחי" },
    },
  },
  ar: {
    name: "اسمك", phone: "الهاتف", email: "البريد الإلكتروني", preferred_date: "التاريخ المفضل", notes: "أي ملاحظات؟",
    sending: "جاري الإرسال…", privacy: "لا نبيع بياناتك. بالإرسال أنت توافق على الشروط والخصوصية.",
    success_title: "تم إرسال طلبك.", success_body: "سيتواصل النادي معك عبر واتساب والبريد خلال 24 ساعة.",
    variants: {
      trial: { title: "احجز/ي حصة تجريبية", subtitle: "مجانية أو رمزية. يمكن الإلغاء.", cta: "احجز التجريبية" },
      package: { title: "احصل/ي على باقتك", subtitle: "سنبني لك أسبوعك خلال 24 ساعة.", cta: "أرسلي الباقة" },
      private: { title: "اطلب/ي درسًا خاصًا", subtitle: "واحد على واحد مع المدرب.", cta: "طلب" },
      corporate: { title: "للشركات", subtitle: "نعمل مع الفرق ووحدات الأمن.", cta: "اطلب عرضًا" },
      tourism: { title: "تدرب/ي أثناء زيارتك", subtitle: "نوصلك بأندية ناطقة بالإنجليزية.", cta: "خيارات" },
      women_only: { title: "انضمي لحصة نسائية", subtitle: "مدربة ومجموعة نسائية بالكامل.", cta: "احجزي مقعدك" },
      general: { title: "استفسار عام", subtitle: "نرد خلال 24 ساعة.", cta: "إرسال" },
    },
  },
  es: {
    name: "Tu nombre", phone: "Teléfono", email: "Email", preferred_date: "Fecha preferida", notes: "¿Algo que debamos saber?",
    sending: "Enviando…", privacy: "Nunca vendemos tus datos. Al enviar aceptas los Términos y la Privacidad.",
    success_title: "Solicitud enviada.", success_body: "El gimnasio te contactará por WhatsApp y email en 24 horas.",
    variants: {
      trial: { title: "Reserva una clase de prueba", subtitle: "Gratis o de bajo costo. Cancelable.", cta: "Reservar prueba" },
      package: { title: "Recibe tu paquete", subtitle: "Te armamos la semana en 24 horas.", cta: "Enviar mi paquete" },
      private: { title: "Solicita una clase privada", subtitle: "Uno a uno con este entrenador.", cta: "Solicitar" },
      corporate: { title: "Consulta corporativa", subtitle: "Trabajamos con equipos y unidades de seguridad.", cta: "Pedir cotización" },
      tourism: { title: "Entrena durante tu visita", subtitle: "Te enlazamos con gimnasios que enseñan en inglés.", cta: "Ver opciones" },
      women_only: { title: "Únete a clase solo-mujeres", subtitle: "Entrenadora y grupo femenino.", cta: "Reservar lugar" },
      general: { title: "Consulta general", subtitle: "Respondemos en 24 horas.", cta: "Enviar" },
    },
  },
  fr: {
    name: "Votre nom", phone: "Téléphone", email: "Email", preferred_date: "Date souhaitée", notes: "Quelque chose à savoir ?",
    sending: "Envoi…", privacy: "Nous ne vendons jamais vos données. En envoyant vous acceptez les Conditions.",
    success_title: "Demande envoyée.", success_body: "Le club vous contactera par WhatsApp et email dans 24 heures.",
    variants: {
      trial: { title: "Réservez un cours d'essai", subtitle: "Gratuit ou à petit prix. Annulable.", cta: "Réserver l'essai" },
      package: { title: "Recevez votre package", subtitle: "On vous construit la semaine en 24 heures.", cta: "Envoyer mon package" },
      private: { title: "Demandez un cours privé", subtitle: "Un-à-un avec ce coach.", cta: "Demander" },
      corporate: { title: "Demande entreprise", subtitle: "Nous travaillons avec équipes et unités de sécurité.", cta: "Demander un devis" },
      tourism: { title: "Entraînez-vous en visite", subtitle: "Clubs anglophones près de chez vous.", cta: "Voir options" },
      women_only: { title: "Rejoignez un cours femmes", subtitle: "Coach et groupe 100% féminin.", cta: "Réserver" },
      general: { title: "Demande générale", subtitle: "Réponse sous 24 heures.", cta: "Envoyer" },
    },
  },
} as const;
