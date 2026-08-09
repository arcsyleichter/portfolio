import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isLocale } from "@/lib/i18n/config";
import { hasAdminSession } from "@/lib/builder/auth";
import { getPost, savePost, deletePost } from "@/lib/builder/store";
import { blogPostDocumentSchema } from "@/lib/builder/validate";

interface RouteParams {
  params: Promise<{ locale: string; slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    return NextResponse.json({ error: "invalid_locale" }, { status: 400 });
  }

  const doc = await getPost(locale, slug);
  if (!doc) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ post: doc });
}

export async function PUT(request: Request, { params }: RouteParams) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    return NextResponse.json({ error: "invalid_locale" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = blogPostDocumentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_document", issues: parsed.error.issues }, { status: 400 });
  }
  if (parsed.data.locale !== locale || parsed.data.slug !== slug) {
    return NextResponse.json({ error: "locale_slug_mismatch" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const isPublished = parsed.data.status === "published";
  const doc = {
    ...parsed.data,
    updatedAt: now,
    publishedAt: isPublished ? (parsed.data.publishedAt ?? now) : parsed.data.publishedAt,
  };

  await savePost(doc);
  revalidatePath(`/${locale}/blog`);
  revalidatePath(`/${locale}/blog/${slug}`);

  return NextResponse.json({ post: doc });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    return NextResponse.json({ error: "invalid_locale" }, { status: 400 });
  }

  await deletePost(locale, slug);
  revalidatePath(`/${locale}/blog`);
  revalidatePath(`/${locale}/blog/${slug}`);

  return NextResponse.json({ ok: true });
}
