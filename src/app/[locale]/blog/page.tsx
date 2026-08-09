import Link from "next/link";
import { Newspaper } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { GradientBackground } from "@/components/ui/gradient-background";
import { notFound } from "next/navigation";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale as Locale);
  const b = dict.blog;

  return (
    <section className="section-light relative isolate flex min-h-[60vh] items-center justify-center bg-background px-4 py-24 text-foreground sm:px-6">
      <GradientBackground tone="light" className="absolute inset-0 -z-10" />
      <div className="relative mx-auto max-w-md text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-text">
          {b.eyebrow}
        </span>
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
