import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";
import { listSectionOverrides } from "@/lib/builder/site-content";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Projects } from "@/components/sections/projects";
import { StyleShowcase } from "@/components/sections/style-showcase";
import { Process } from "@/components/sections/process";
import { TechStack } from "@/components/sections/tech-stack";
import { Testimonials } from "@/components/sections/testimonials";
import { Pricing } from "@/components/sections/pricing";
import { Contact } from "@/components/sections/contact";

// Interim scaffolding for Phase 2 of the site-content rollout: reads
// per-section admin overrides from Postgres, so this can't be statically
// prerendered at build time without a guaranteed DB connection there.
// Phase 3 replaces this with on-demand ISR (unstable_cache + revalidateTag),
// which keeps the homepage statically served while still updating instantly
// on save — see the plan for the reasoning. Matches the blog pages'
// existing force-dynamic precedent in the meantime.
export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale as Locale);
  const typedLocale = locale as Locale;
  const overrides = await listSectionOverrides(typedLocale);

  return (
    <>
      <Hero locale={typedLocale} dict={dict} />
      <About dict={dict} />
      <Services dict={dict} />
      <Projects dict={dict} />
      <StyleShowcase dict={dict} />
      <Process dict={dict} override={overrides.process as Dictionary["process"] | undefined} />
      <TechStack dict={dict} override={overrides.tech as Dictionary["tech"] | undefined} />
      <Testimonials dict={dict} override={overrides.testimonials as Dictionary["testimonials"] | undefined} />
      <Pricing locale={typedLocale} dict={dict} />
      <Contact dict={dict} />
    </>
  );
}
