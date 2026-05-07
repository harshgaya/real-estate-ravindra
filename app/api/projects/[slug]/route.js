import { NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/data/projects";

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (err) {
    console.error("[API /api/projects/[slug]]", err);
    return NextResponse.json(
      { error: "Could not load project" },
      { status: 500 }
    );
  }
}
