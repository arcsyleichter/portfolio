import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/builder/auth";
import { listAllCustomPages } from "@/lib/builder/pages-store";

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const pages = await listAllCustomPages();
  return NextResponse.json({ pages });
}
