import { NextResponse } from "next/server";
import { getPropertyBySlug, getSimilarProperties } from "@/lib/data/properties";

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const property = await getPropertyBySlug(slug);

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const similar = await getSimilarProperties(slug, 3);

    return NextResponse.json({ property, similar });
  } catch (err) {
    console.error("[API /api/properties/[slug]]", err);
    return NextResponse.json(
      { error: "Could not load property" },
      { status: 500 }
    );
  }
}
