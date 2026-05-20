import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { storyPosts, findEditorial, localizedField } from "@/data/editorial";
import { EditorialDetail } from "@/components/editorial/EditorialDetail";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export function generateStaticParams() {
  return storyPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = findEditorial(slug, "story");
  if (!p) return {};
  return {
    title: localizedField(p, "title", locale),
    description: localizedField(p, "excerpt", locale),
  };
}

export default async function StoryPostPage({
  params,
}: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = findEditorial(slug, "story");
  if (!post) notFound();
  return <EditorialDetail post={post} locale={locale} />;
}
