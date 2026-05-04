import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { SearchClient } from "@/components/search/SearchClient";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "he" ? "חיפוש מועדונים" : "Search Gyms",
  };
}

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SearchClient />;
}
