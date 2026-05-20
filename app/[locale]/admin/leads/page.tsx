import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { LeadInboxClient } from "@/components/admin/LeadInboxClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "he" ? "תיבת לידים" : "Lead Inbox",
    robots: { index: false },
  };
}

export default async function AdminLeadsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LeadInboxClient />;
}
