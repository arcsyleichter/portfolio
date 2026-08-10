import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";
import { getCachedSectionOverrides } from "@/lib/builder/site-content";
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale as Locale);
  const typedLocale = locale as Locale;
  const overrides = await getCachedSectionOverrides(typedLocale);

  return (
    <>
      <Hero locale={typedLocale} dict={dict} override={overrides.hero as Dictionary["hero"] | undefined} />
      <About dict={dict} override={overrides.about as Dictionary["about"] | undefined} />
      <Services dict={dict} override={overrides.services as Dictionary["services"] | undefined} />
      <Projects dict={dict} override={overrides.projects as Dictionary["projects"] | undefined} />
      <StyleShowcase dict={dict} override={overrides.styleShowcase as Dictionary["styleShowcase"] | undefined} />
      <Process dict={dict} override={overrides.process as Dictionary["process"] | undefined} />
      <TechStack dict={dict} override={overrides.tech as Dictionary["tech"] | undefined} />
      <Testimonials dict={dict} override={overrides.testimonials as Dictionary["testimonials"] | undefined} />
      <Pricing locale={typedLocale} dict={dict} override={overrides.pricing as Dictionary["pricing"] | undefined} />
      <Contact dict={dict} override={overrides.contact as Dictionary["contact"] | undefined} />
    </>
  );
}
