import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { hasAdminSession } from "@/lib/builder/auth";
import { getSectionOverride, saveSectionOverride, clearSectionOverride } from "@/lib/builder/site-content";
import { isSectionKey } from "@/lib/builder/site-content-schema";
import { sectionContentSchemas } from "@/lib/builder/validate";

interface RouteParams {
  params: Promise<{ locale: string; section: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { locale, section } = await params;
  if (!isLocale(locale) || !isSectionKey(section)) {
    return NextResponse.json({ error: "invalid_section" }, { status: 400 });
  }

  const override = await getSectionOverride(locale, section);
  const dict = getDictionary(locale);
  const content = override ?? dict[section];
  return NextResponse.json({ content, edited: override !== null });
}

export async function PUT(request: Request, { params }: RouteParams) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { locale, section } = await params;
  if (!isLocale(locale) || !isSectionKey(section)) {
    return NextResponse.json({ error: "invalid_section" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const schema = sectionContentSchemas[section];
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_content", issues: parsed.error.issues }, { status: 400 });
  }

  await saveSectionOverride(locale, section, parsed.data);
  revalidatePath(`/${locale}`);

  return NextResponse.json({ content: parsed.data });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { locale, section } = await params;
  if (!isLocale(locale) || !isSectionKey(section)) {
    return NextResponse.json({ error: "invalid_section" }, { status: 400 });
  }

  await clearSectionOverride(locale, section);
  revalidatePath(`/${locale}`);

  const dict = getDictionary(locale);
  return NextResponse.json({ content: dict[section] });
}
