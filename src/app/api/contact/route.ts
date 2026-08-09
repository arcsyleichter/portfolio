import { NextResponse } from "next/server";

interface ContactPayload {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as ContactPayload;

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  // TODO: wire up a real email provider (e.g. Resend) with an API key
  // before relying on this in production — right now it only logs.
  console.log("[contact]", body);

  return NextResponse.json({ ok: true });
}
