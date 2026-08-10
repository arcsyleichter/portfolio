import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isLocale } from "@/lib/i18n/config";
import { hasAdminSession } from "@/lib/builder/auth";
import { listSectionOverrides } from "@/lib/builder/site-content";
import { getPageLayout, savePageLayout, pageLayoutCacheTag } from "@/lib/builder/page-layout";
import { pageLayoutSchema } from "@/lib/builder/validate";

interface RouteParams {
  params: Promise<{ locale: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { locale } = await params;
  if (!isLocale(locale)) {
    return NextResponse.json({ error: "invalid_locale" }, { status: 400 });
  }

  const [items, overrides] = await Promise.all([getPageLayout(locale), listSectionOverrides(locale)]);
  return NextResponse.json({ items, overrides });
}

export async function PUT(request: Request, { params }: RouteParams) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { locale } = await params;
  if (!isLocale(locale)) {
    return NextResponse.json({ error: "invalid_locale" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = pageLayoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_layout", issues: parsed.error.issues }, { status: 400 });
  }

  await savePageLayout(locale, parsed.data);
  revalidateTag(pageLayoutCacheTag(locale), "max");

  return NextResponse.json({ items: parsed.data });
}
