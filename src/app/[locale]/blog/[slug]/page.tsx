import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getPost } from "@/lib/builder/store";
import { PostArticleView } from "@/components/blocks/post-article-view";

// Same reasoning as the blog list page — Netlify Blobs content, never
// statically prerendered.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const post = await getPost(locale, slug);
  if (!post || post.status !== "published") return {};

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const post = await getPost(locale as Locale, slug);
  if (!post || post.status !== "published") notFound();

  return <PostArticleView title={post.title} excerpt={post.excerpt} blocks={post.blocks} />;
}
