import { setRequestLocale } from "next-intl/server";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "he" ? "התחברות" : "Sign in",
    robots: { index: false },
  };
}

export default async function SignInPage({
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

  const t = isHe
    ? {
        kicker: "ברוכה הבאה",
        title: "התחברי לחשבון שלך",
        subtitle: "שמרי מועדונים, נהלי שיעורי ניסיון, וכתבי ביקורות.",
        emailLabel: "אימייל",
        emailHelp: "נשלח אליך קישור התחברות חד-פעמי. בלי סיסמאות, בלי סיבוכים.",
        sendLink: "שלחו לי קישור התחברות",
        or: "או",
        google: "המשך עם Google",
        apple: "המשך עם Apple",
        facebook: "המשך עם Facebook",
        terms:
          "המשך התחברות מהווה הסכמה ל",
        terms_link: "תנאי השימוש",
        and: "ול",
        privacy_link: "מדיניות הפרטיות",
        new_here: "חדשה ב-Dojan?",
        sign_up: "צרי חשבון",
        demo_pill: "דמו",
        demo_text:
          "זוהי גרסת תצוגה. במהדורת ההפקה ההתחברות תהיה דרך Supabase Auth: קישור חד-פעמי באימייל, Google ו-Apple. הצהירו על מה שתרצו לקבל בדמו ונרכיב.",
      }
    : {
        kicker: "Welcome back",
        title: "Sign in to your account",
        subtitle:
          "Save gyms, manage trial bookings, and leave reviews.",
        emailLabel: "Email address",
        emailHelp:
          "We'll email you a one-time sign-in link. No passwords, no hassle.",
        sendLink: "Email me a sign-in link",
        or: "or",
        google: "Continue with Google",
        apple: "Continue with Apple",
        facebook: "Continue with Facebook",
        terms: "By continuing you agree to our",
        terms_link: "Terms",
        and: "and",
        privacy_link: "Privacy Policy",
        new_here: "New to Dojan?",
        sign_up: "Create an account",
        demo_pill: "Demo",
        demo_text:
          "This is a preview. In production, sign-in is via Supabase Auth: email magic link, Google, and Apple. Surface which providers you'd like to ship with and we'll wire them up.",
      };

  return (
    <section className="min-h-[calc(100dvh-4rem)] grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 600px at 30% 30%, rgba(247,107,83,0.45), transparent 60%), radial-gradient(900px 600px at 80% 90%, rgba(15,76,92,0.55), transparent 60%), #0E1116",
          }}
        />
        <div className="absolute inset-0 grain opacity-60" />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <Logo className="h-9 invert brightness-200" />
          <div>
            <p className="text-[12px] uppercase tracking-[0.2em] font-semibold text-accent">
              Dojan
            </p>
            <p className="display text-4xl font-extrabold mt-3 leading-tight max-w-md">
              {isHe
                ? "המפה החדשה של אומנויות הלחימה בישראל."
                : "The new map of martial arts in Israel."}
            </p>
            <p className="text-white/60 mt-3 max-w-sm text-sm">
              {isHe
                ? "847 מועדונים. 50 דיסציפלינות. ביקורות מאומתות."
                : "847 gyms. 50 disciplines. Verified reviews."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12 md:py-20">
        <div className="w-full max-w-sm">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] bg-accent/10 text-accent rounded-full px-2.5 py-1 mb-4">
            {t.demo_pill}
          </span>
          <p className="text-[12px] uppercase tracking-[0.2em] font-semibold text-brand-500 mb-1">
            {t.kicker}
          </p>
          <h1 className="display text-3xl md:text-4xl font-extrabold leading-tight">
            {t.title}
          </h1>
          <p className="mt-2 text-ink-muted">{t.subtitle}</p>

          <form className="mt-7 space-y-3">
            <label className="block">
              <span className="text-[13px] font-semibold text-ink mb-1.5 block">
                {t.emailLabel}
              </span>
              <div className="relative">
                <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-subtle" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-12 ps-10 pe-3 rounded-xl border border-border bg-surface text-[15px] focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
                />
              </div>
              <p className="text-[12px] text-ink-subtle mt-1.5">{t.emailHelp}</p>
            </label>

            <Button type="button" variant="ink" size="lg" className="w-full">
              {t.sendLink}
              <Arrow className="size-4" />
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[12px] uppercase tracking-wider text-ink-subtle">
            <span className="flex-1 h-px bg-border" />
            {t.or}
            <span className="flex-1 h-px bg-border" />
          </div>

          <div className="grid gap-2">
            <button className="h-12 rounded-xl border border-border bg-surface hover:bg-surface-2 font-semibold text-[15px] inline-flex items-center justify-center gap-3 transition-colors">
              <GoogleGlyph />
              {t.google}
            </button>
            <button className="h-12 rounded-xl border border-border bg-surface hover:bg-surface-2 font-semibold text-[15px] inline-flex items-center justify-center gap-3 transition-colors">
              <AppleGlyph />
              {t.apple}
            </button>
            <button className="h-12 rounded-xl border border-border bg-surface hover:bg-surface-2 font-semibold text-[15px] inline-flex items-center justify-center gap-3 transition-colors">
              <FacebookGlyph />
              {t.facebook}
            </button>
          </div>

          <div className="mt-7 rounded-xl border border-dashed border-border bg-surface-2 p-3.5 text-[12px] text-ink-muted leading-relaxed flex gap-2.5">
            <Lock className="size-4 shrink-0 mt-0.5 text-ink-subtle" />
            <span>{t.demo_text}</span>
          </div>

          <p className="mt-6 text-[13px] text-ink-muted text-center">
            {t.new_here}{" "}
            <Link
              href="/auth/sign-in"
              className="font-semibold text-brand hover:text-brand-700"
            >
              {t.sign_up}
            </Link>
          </p>

          <p className="mt-3 text-[11px] text-ink-subtle text-center leading-relaxed">
            {t.terms}{" "}
            <Link href="/terms" className="underline-offset-2 hover:underline">
              {t.terms_link}
            </Link>{" "}
            {t.and}{" "}
            <Link href="/privacy" className="underline-offset-2 hover:underline">
              {t.privacy_link}
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

function GoogleGlyph() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleGlyph() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.36 1.43c0 1.14-.42 2.21-1.27 3.21-1 1.18-2.21 1.86-3.5 1.76-.16-1.13.4-2.27 1.21-3.16.91-1 2.32-1.74 3.42-1.81.07.05.14.05.14 0z M21 17.18c-.51 1.18-.75 1.71-1.41 2.76-.91 1.46-2.2 3.27-3.79 3.28-1.42.01-1.78-.92-3.7-.91-1.92.01-2.32.93-3.74.92-1.6-.01-2.81-1.65-3.72-3.11C2.13 16.54 1.85 11.9 3.4 9.42c1.1-1.76 2.84-2.79 4.47-2.79 1.66 0 2.7.91 4.07.91 1.33 0 2.14-.91 4.06-.91 1.45 0 2.99.79 4.08 2.16-3.59 1.97-3.01 7.1.92 8.39z" />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.43H7.08v-3.5h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.5 0-1.96.93-1.96 1.89v2.26h3.34l-.53 3.5h-2.81V24C19.61 23.08 24 18.09 24 12.07z" />
    </svg>
  );
}
