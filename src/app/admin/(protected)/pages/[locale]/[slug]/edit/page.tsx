import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCustomPage } from "@/lib/builder/pages-store";
import { CustomPageEditor } from "@/components/admin/custom-page-editor";

export default async function EditCustomPagePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const doc = await getCustomPage(locale, slug);
  if (!doc) notFound();

  return <CustomPageEditor initialDoc={doc} />;
}
