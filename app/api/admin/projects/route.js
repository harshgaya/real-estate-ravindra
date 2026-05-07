import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const slugify = (n) => String(n || "").toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 100);

function ser(p) {
  if (!p) return p;
  const out = { ...p };
  ["priceMin", "priceMax"].forEach((k) => { if (out[k] !== undefined && out[k] !== null) out[k] = out[k].toString(); });
  return out;
}

export async function GET(req) {
  if (!prisma) return NextResponse.json({ items: [] });
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const city = searchParams.get("city");
    const where = {};
    if (city) where.city = city;
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
      ];
    }
    const items = await prisma.project.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 });
    return NextResponse.json({ items: items.map(ser) });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  try {
    const body = await req.json();
    if (!body.name || !body.location) return NextResponse.json({ error: "Name and location required" }, { status: 400 });

    let slug = body.slug || slugify(body.name);
    let existing = await prisma.project.findUnique({ where: { slug } });
    let c = 1;
    const base = slug;
    while (existing) {
      slug = `${base}-${c++}`;
      existing = await prisma.project.findUnique({ where: { slug } });
    }

    const project = await prisma.project.create({
      data: {
        slug,
        name: String(body.name).slice(0, 200),
        tagline: body.tagline || null,
        description: body.description || null,
        type: body.type || "Residential",
        status: body.status || "Now Selling",
        city: String(body.city || "bengaluru").toLowerCase(),
        locality: body.locality || null,
        location: String(body.location),
        coverImage: body.coverImage || body.image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=85",
        galleryJson: typeof body.gallery === "string" ? body.gallery : JSON.stringify(body.gallery || []),
        videosJson: typeof body.videos === "string" ? body.videos : JSON.stringify(body.videos || []),
        pdfsJson: typeof body.pdfs === "string" ? body.pdfs : JSON.stringify(body.pdfs || []),
        masterPlanImage: body.masterPlanImage || null,
        virtualTourUrl: body.virtualTourUrl || null,
        videoTourUrl: body.videoTourUrl || null,
        configurationsJson: typeof body.configurations === "string" ? body.configurations : JSON.stringify(body.configurations || []),
        amenitiesJson: typeof body.amenities === "string" ? body.amenities : JSON.stringify(body.amenities || []),
        phasesJson: typeof body.phases === "string" ? body.phases : JSON.stringify(body.phases || []),
        priceMin: body.priceMin ? BigInt(body.priceMin) : 0n,
        priceMax: body.priceMax ? BigInt(body.priceMax) : 0n,
        priceLabel: body.priceLabel || null,
        totalUnits: parseInt(body.totalUnits) || 0,
        totalTowers: parseInt(body.totalTowers) || 0,
        landArea: body.landArea || null,
        floors: body.floors || null,
        possessionDate: body.possessionDate || null,
        launchDate: body.launchDate || null,
        rera: body.rera || null,
        builderName: body.builderName || null,
        builderEstd: body.builderEstd || null,
        builderProjects: parseInt(body.builderProjects) || 0,
        isFeatured: !!body.isFeatured,
        isActive: body.isActive !== false,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        metaKeywords: body.metaKeywords || null,
      },
    });
    return NextResponse.json({ success: true, project: ser(project) });
  } catch (err) {
    console.error("[PROJ CREATE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
