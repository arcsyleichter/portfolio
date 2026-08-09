import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
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

  return (
    <>
      <Hero locale={typedLocale} dict={dict} />
      <About dict={dict} />
      <Services dict={dict} />
      <Projects dict={dict} />
      <StyleShowcase dict={dict} />
      <Process dict={dict} />
      <TechStack dict={dict} />
      <Testimonials dict={dict} />
      <Pricing locale={typedLocale} dict={dict} />
      <Contact dict={dict} />
    </>
  );
}
