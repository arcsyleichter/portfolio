import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n/config";
import { hasAdminSession } from "@/lib/builder/auth";
import { listSectionOverrides } from "@/lib/builder/site-content";
import { SECTION_KEYS } from "@/lib/builder/site-content-schema";

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

  const overrides = await listSectionOverrides(locale);
  const sections = SECTION_KEYS.map((key) => ({
    key,
    edited: Object.prototype.hasOwnProperty.call(overrides, key),
  }));
  return NextResponse.json({ sections });
}
