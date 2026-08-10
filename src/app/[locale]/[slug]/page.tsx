import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getPublishedCustomPage } from "@/lib/builder/pages-store";
import { CustomPageView } from "@/components/blocks/custom-page-view";

// Same reasoning as the blog post route: admin-created content in Postgres
// that can change at any time, with an unpredictable set of slugs — never
// statically prerendered.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const page = await getPublishedCustomPage(locale, slug);
  if (!page) return {};

  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
  };
}

export default async function CustomPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const page = await getPublishedCustomPage(locale as Locale, slug);
  if (!page) notFound();

  return <CustomPageView blocks={page.blocks} />;
}
