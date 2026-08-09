import Link from "next/link";
import { Newspaper } from "lucide-react";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { GradientBackground } from "@/components/ui/gradient-background";
import { listPublishedPosts } from "@/lib/builder/store";

// Content lives in Netlify Blobs and can change without a redeploy (and
// Blobs credentials aren't necessarily available at *build* time, only at
// request time) — never statically prerender this page.
export const dynamic = "force-dynamic";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale as Locale);
  const b = dict.blog;
  const posts = await listPublishedPosts(locale as Locale);

  if (posts.length === 0) {
    return (
      <section className="section-light relative isolate flex min-h-[60vh] items-center justify-center bg-background px-4 py-24 text-foreground sm:px-6">
        <GradientBackground tone="light" className="absolute inset-0 -z-10" />
        <div className="relative mx-auto max-w-md text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-text">{b.eyebrow}</span>
          <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand">
            <Newspaper className="h-7 w-7 text-ink" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">{b.title}</h1>
          <p className="mt-4 text-muted-foreground">{b.body}</p>
          <Link
            href={`/${locale}`}
            className="mt-8 inline-block cursor-pointer rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            {b.backHome}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-light relative isolate bg-background px-4 py-20 text-foreground sm:px-6 lg:py-28">
      <GradientBackground tone="light" className="absolute inset-0 -z-10" />
      <div className="mx-auto max-w-5xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-text">{b.eyebrow}</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{b.listTitle}</h1>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-border bg-card/60 p-6 shadow-md shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-lg hover:shadow-black/20"
            >
              <h2 className="min-h-14 font-heading text-lg font-semibold">{post.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
              <span className="mt-5 text-sm font-medium text-accent-text">{b.readMore} →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
