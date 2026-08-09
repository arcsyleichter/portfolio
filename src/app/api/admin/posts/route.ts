import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/builder/auth";
import { listAllPosts } from "@/lib/builder/store";

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const posts = await listAllPosts();
  return NextResponse.json({ posts });
}
