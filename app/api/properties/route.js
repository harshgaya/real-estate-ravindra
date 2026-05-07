import { NextResponse } from "next/server";
import { getProperties } from "@/lib/data/properties";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const filters = {
      city: searchParams.get("city") || undefined,
      locality: searchParams.get("locality") || undefined,
      type: searchParams.get("type") || undefined,
      intent: searchParams.get("intent") || undefined,
      budget: searchParams.get("budget") || undefined,
      bedrooms: searchParams.get("bedrooms") || undefined,
      q: searchParams.get("q") || undefined,
      sort: searchParams.get("sort") || undefined,
      limit: searchParams.get("limit") || 20,
      offset: searchParams.get("offset") || 0,
    };

    const data = await getProperties(filters);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[API /api/properties]", err);
    return NextResponse.json(
      { error: "Could not load properties" },
      { status: 500 }
    );
  }
}
