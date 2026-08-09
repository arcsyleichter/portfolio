import { NextResponse } from "next/server";
import { getImage } from "@/lib/builder/store";

interface RouteParams {
  params: Promise<{ key: string[] }>;
}

/** Public, unauthenticated — serves images out of the private Blobs store. */
export async function GET(_request: Request, { params }: RouteParams) {
  const { key } = await params;
  const image = await getImage(key.join("/"));
  if (!image) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return new NextResponse(image.data, {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
