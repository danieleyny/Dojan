import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PackageBuilderClient } from "@/components/packages/PackageBuilderClient";
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
        ? "בונה החבילה — שבוע אימונים מותאם אישית"
        : "Package Builder — A Custom Training Week",
  };
}

export default async function PackageBuilderPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PackageBuilderClient />;
}
