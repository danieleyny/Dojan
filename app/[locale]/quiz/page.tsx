import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { QuizClient } from "@/components/quiz/QuizClient";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "he"
        ? "איזו אומנות לחימה מתאימה לי? — מבחן התאמה"
        : "Which Martial Art Is Right For You?",
  };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <QuizClient />;
}
