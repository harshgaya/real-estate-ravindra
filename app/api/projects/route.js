import { NextResponse } from "next/server";
import { getProjects } from "@/lib/data/projects";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const filters = {
      city: searchParams.get("city") || undefined,
      status: searchParams.get("status") || undefined,
      q: searchParams.get("q") || undefined,
      limit: searchParams.get("limit") || 20,
      offset: searchParams.get("offset") || 0,
    };

    const data = await getProjects(filters);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[API /api/projects]", err);
    return NextResponse.json(
      { error: "Could not load projects" },
      { status: 500 }
    );
  }
}
