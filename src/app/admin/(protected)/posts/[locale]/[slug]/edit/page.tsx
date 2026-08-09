import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getPost } from "@/lib/builder/store";
import { PostEditor } from "@/components/admin/post-editor";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const doc = await getPost(locale, slug);
  if (!doc) notFound();

  return <PostEditor initialDoc={doc} />;
}
