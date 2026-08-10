import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { SectionKey } from "@/lib/builder/site-content-schema";
import { Hero } from "./hero";
import { About } from "./about";
import { Services } from "./services";
import { Projects } from "./projects";
import { StyleShowcase } from "./style-showcase";
import { Process } from "./process";
import { TechStack } from "./tech-stack";
import { Testimonials } from "./testimonials";
import { Pricing } from "./pricing";
import { Contact } from "./contact";

export interface SectionRenderProps {
  locale: Locale;
  dict: Dictionary;
  overrides: Partial<Record<SectionKey, unknown>>;
}

/**
 * One entry per built-in section, wrapping each component's own (slightly
 * differing — Hero/Pricing also need `locale`) prop signature behind a
 * uniform call shape so page.tsx can dispatch on a PageItem's sectionKey
 * without a hand-written switch.
 */
export const SECTION_COMPONENTS: Record<SectionKey, (props: SectionRenderProps) => ReactNode> = {
  hero: ({ locale, dict, overrides }) => (
    <Hero locale={locale} dict={dict} override={overrides.hero as Dictionary["hero"] | undefined} />
  ),
  about: ({ dict, overrides }) => (
    <About dict={dict} override={overrides.about as Dictionary["about"] | undefined} />
  ),
  services: ({ dict, overrides }) => (
    <Services dict={dict} override={overrides.services as Dictionary["services"] | undefined} />
  ),
  projects: ({ dict, overrides }) => (
    <Projects dict={dict} override={overrides.projects as Dictionary["projects"] | undefined} />
  ),
  styleShowcase: ({ dict, overrides }) => (
    <StyleShowcase dict={dict} override={overrides.styleShowcase as Dictionary["styleShowcase"] | undefined} />
  ),
  process: ({ dict, overrides }) => (
    <Process dict={dict} override={overrides.process as Dictionary["process"] | undefined} />
  ),
  tech: ({ dict, overrides }) => (
    <TechStack dict={dict} override={overrides.tech as Dictionary["tech"] | undefined} />
  ),
  testimonials: ({ dict, overrides }) => (
    <Testimonials dict={dict} override={overrides.testimonials as Dictionary["testimonials"] | undefined} />
  ),
  pricing: ({ locale, dict, overrides }) => (
    <Pricing locale={locale} dict={dict} override={overrides.pricing as Dictionary["pricing"] | undefined} />
  ),
  contact: ({ dict, overrides }) => (
    <Contact dict={dict} override={overrides.contact as Dictionary["contact"] | undefined} />
  ),
};

/**
 * Which built-in sections have a navbar anchor link, and under which anchor
 * id / dict.nav label key. Hero and Testimonials intentionally have no entry
 * (they never had a nav link) — Contact also has no entry here because it
 * gets its own dedicated CTA button in the navbar, not a plain anchor link.
 */
export const SECTION_NAV_META: Partial<Record<SectionKey, { anchor: string; labelKey: keyof Dictionary["nav"] }>> = {
  about: { anchor: "about", labelKey: "about" },
  services: { anchor: "services", labelKey: "services" },
  projects: { anchor: "projects", labelKey: "projects" },
  styleShowcase: { anchor: "style-showcase", labelKey: "styles" },
  process: { anchor: "process", labelKey: "process" },
  tech: { anchor: "tech", labelKey: "tech" },
  pricing: { anchor: "pricing", labelKey: "pricing" },
};
