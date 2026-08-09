import { NextResponse } from "next/server";
import { verifyPassword, setAdminSessionCookie, clearAdminSessionCookie } from "@/lib/builder/auth";

interface LoginPayload {
  password?: string;
}

export async function POST(request: Request) {
  let body: LoginPayload;
  try {
    body = (await request.json()) as LoginPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body.password) {
    return NextResponse.json({ error: "missing_password" }, { status: 400 });
  }

  try {
    if (!verifyPassword(body.password)) {
      return NextResponse.json({ error: "invalid_password" }, { status: 401 });
    }
  } catch (err) {
    console.error("[admin/auth]", err);
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

  await setAdminSessionCookie();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearAdminSessionCookie();
  return NextResponse.json({ ok: true });
}
