import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSectionOverride } from "@/lib/builder/site-content";
import { getSectionSchema } from "@/lib/builder/site-sections";
import { isSectionKey } from "@/lib/builder/site-content-schema";
import { SiteSectionEditor } from "@/components/admin/site-section-editor";

export default async function AdminSiteSectionPage({
  params,
}: {
  params: Promise<{ locale: string; section: string }>;
}) {
  const { locale, section } = await params;
  if (!isLocale(locale) || !isSectionKey(section)) notFound();

  const schema = getSectionSchema(section);
  if (!schema) notFound();

  const override = await getSectionOverride(locale, section);
  const dict = getDictionary(locale);
  const content = (override ?? dict[section]) as Record<string, unknown>;

  return (
    <SiteSectionEditor
      locale={locale}
      section={section}
      schema={schema}
      initialContent={content}
      edited={override !== null}
    />
  );
}
