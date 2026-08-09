import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { GradientBackground } from "@/components/ui/gradient-background";
import { getPost } from "@/lib/builder/store";
import { BlockRenderer } from "@/components/blocks/block-renderer";

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

  return (
    <article className="section-light relative isolate bg-background px-4 py-20 text-foreground sm:px-6 lg:py-28">
      <GradientBackground tone="light" className="absolute inset-0 -z-10" />
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
        {post.excerpt && <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>}
        <div className="mt-10 flex flex-col gap-6">
          <BlockRenderer blocks={post.blocks} />
        </div>
      </div>
    </article>
  );
}
