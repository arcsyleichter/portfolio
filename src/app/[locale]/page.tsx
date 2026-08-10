import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCachedSectionOverrides } from "@/lib/builder/site-content";
import { getCachedPageLayout } from "@/lib/builder/page-layout";
import { SECTION_COMPONENTS } from "@/components/sections/section-registry";
import { PageBlockSection } from "@/components/sections/page-block-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);
  const [overrides, layout] = await Promise.all([
    getCachedSectionOverrides(typedLocale),
    getCachedPageLayout(typedLocale),
  ]);

  return (
    <>
      {layout.map((item) => {
        if (item.kind === "section") {
          if (item.hidden) return null;
          const SectionComponent = SECTION_COMPONENTS[item.sectionKey];
          return <SectionComponent key={item.id} locale={typedLocale} dict={dict} overrides={overrides} />;
        }
        return <PageBlockSection key={item.id} block={item.block} />;
      })}
    </>
  );
}
