import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STR = ["slug", "name", "tagline", "description", "type", "status", "city", "locality", "address", "location", "coverImage", "masterPlanImage", "virtualTourUrl", "videoTourUrl", "priceLabel", "landArea", "floors", "possessionDate", "launchDate", "rera", "builderName", "builderEstd", "builderAwards", "metaTitle", "metaDescription", "metaKeywords"];
const INT = ["totalUnits", "totalTowers", "builderProjects"];
const BIGINT = ["priceMin", "priceMax"];
const FLOAT = ["latitude", "longitude"];
const BOOL = ["isFeatured", "isActive"];
const JSON_F = { gallery: "galleryJson", videos: "videosJson", pdfs: "pdfsJson", configurations: "configurationsJson", amenities: "amenitiesJson", phases: "phasesJson", progressPhotos: "progressPhotosJson", approvals: "approvalsJson", tags: "tagsJson" };

function ser(p) {
  if (!p) return p;
  const out = { ...p };
  BIGINT.forEach((k) => { if (out[k] !== undefined && out[k] !== null) out[k] = out[k].toString(); });
  return out;
}

export async function GET(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const { id } = await params;
  try {
    const p = await prisma.project.findUnique({ where: { id } });
    if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ project: ser(p) });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const { id } = await params;
  try {
    const body = await req.json();
    const data = {};
    for (const f of STR) if (f in body) data[f] = body[f] === "" ? null : body[f];
    for (const f of INT) if (f in body) data[f] = parseInt(body[f]) || 0;
    for (const f of BIGINT) if (f in body) data[f] = body[f] ? BigInt(body[f]) : 0n;
    for (const f of FLOAT) if (f in body) data[f] = body[f] ? parseFloat(body[f]) : null;
    for (const f of BOOL) if (f in body) data[f] = !!body[f];
    for (const [k, db] of Object.entries(JSON_F)) {
      if (k in body) data[db] = typeof body[k] === "string" ? body[k] : JSON.stringify(body[k] || []);
    }
    const p = await prisma.project.update({ where: { id }, data });
    return NextResponse.json({ success: true, project: ser(p) });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const { id } = await params;
  try {
    await prisma.project.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
