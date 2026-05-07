import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const slugify = (n) => String(n || "").toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 100);

function ser(p) {
  if (!p) return p;
  const out = { ...p };
  ["priceMin", "priceMax", "allInclusivePrice"].forEach((k) => {
    if (out[k] !== undefined && out[k] !== null) out[k] = out[k].toString();
  });
  return out;
}

export async function GET(req) {
  if (!prisma) return NextResponse.json({ items: [] });
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const city = searchParams.get("city");
    const type = searchParams.get("type");
    const isActive = searchParams.get("isActive");
    const where = {};
    if (city) where.city = city;
    if (type) where.type = type;
    if (isActive === "true") where.isActive = true;
    if (isActive === "false") where.isActive = false;
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
      ];
    }
    const items = await prisma.property.findMany({ where, orderBy: { createdAt: "desc" }, take: 300 });
    return NextResponse.json({ items: items.map(ser), total: items.length });
  } catch (err) {
    console.error("[PROPS]", err);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  try {
    const body = await req.json();
    if (!body.name || !body.location) return NextResponse.json({ error: "Name and location required" }, { status: 400 });

    let slug = body.slug || slugify(body.name);
    let existing = await prisma.property.findUnique({ where: { slug } });
    let c = 1;
    const base = slug;
    while (existing) {
      slug = `${base}-${c++}`;
      existing = await prisma.property.findUnique({ where: { slug } });
    }

    const data = {
      slug,
      name: String(body.name).slice(0, 200),
      tagline: body.tagline || null,
      description: body.description || null,
      type: body.type || "apartment",
      intent: body.intent || "buy",
      config: body.config || null,
      status: body.status || "Now Selling",
      bedrooms: parseInt(body.bedrooms) || 0,
      bathrooms: parseInt(body.bathrooms) || 0,
      parking: parseInt(body.parking) || 0,
      floors: parseInt(body.floors) || 0,
      totalUnits: parseInt(body.totalUnits) || 0,
      area: body.area || null,
      carpetArea: body.carpetArea || null,
      builtUpArea: body.builtUpArea || null,
      superBuiltUpArea: body.superBuiltUpArea || null,
      facing: body.facing || null,
      view: body.view || null,
      furnishing: body.furnishing || null,
      priceMin: body.priceMin ? BigInt(body.priceMin) : 0n,
      priceMax: body.priceMax ? BigInt(body.priceMax) : 0n,
      priceLabel: body.priceLabel || null,
      pricePerSqft: parseInt(body.pricePerSqft) || 0,
      negotiable: !!body.negotiable,
      city: String(body.city || "bengaluru").toLowerCase(),
      locality: body.locality || null,
      address: body.address || null,
      location: String(body.location),
      latitude: body.latitude ? parseFloat(body.latitude) : null,
      longitude: body.longitude ? parseFloat(body.longitude) : null,
      builderName: body.builderName || null,
      builderEstd: body.builderEstd || null,
      rera: body.rera || null,
      coverImage: body.coverImage || body.image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=85",
      galleryJson: typeof body.gallery === "string" ? body.gallery : JSON.stringify(body.gallery || []),
      videosJson: typeof body.videos === "string" ? body.videos : JSON.stringify(body.videos || []),
      pdfsJson: typeof body.pdfs === "string" ? body.pdfs : JSON.stringify(body.pdfs || []),
      floorPlanImage: body.floorPlanImage || null,
      masterPlanImage: body.masterPlanImage || null,
      virtualTourUrl: body.virtualTourUrl || null,
      videoTourUrl: body.videoTourUrl || null,
      amenitiesJson: typeof body.amenities === "string" ? body.amenities : JSON.stringify(body.amenities || []),
      configurationsJson: typeof body.configurations === "string" ? body.configurations : JSON.stringify(body.configurations || []),
      nearbyJson: typeof body.nearby === "string" ? body.nearby : JSON.stringify(body.nearby || []),
      tagsJson: typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags || []),
      possessionDate: body.possessionDate || null,
      launchDate: body.launchDate || null,
      isFeatured: !!body.isFeatured,
      isHotDeal: !!body.isHotDeal,
      discountText: body.discountText || null,
      isActive: body.isActive !== false,
      projectId: body.projectId || null,
      metaTitle: body.metaTitle || null,
      metaDescription: body.metaDescription || null,
      metaKeywords: body.metaKeywords || null,
    };

    const property = await prisma.property.create({ data });
    return NextResponse.json({ success: true, property: ser(property) });
  } catch (err) {
    console.error("[PROP CREATE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
