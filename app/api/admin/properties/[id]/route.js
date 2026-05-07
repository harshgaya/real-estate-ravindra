import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STR = ["slug", "name", "tagline", "description", "type", "intent", "config", "status", "area", "carpetArea", "builtUpArea", "superBuiltUpArea", "facing", "view", "furnishing", "priceLabel", "city", "locality", "address", "location", "builderName", "builderEstd", "rera", "coverImage", "floorPlanImage", "masterPlanImage", "virtualTourUrl", "videoTourUrl", "possessionDate", "launchDate", "discountText", "metaTitle", "metaDescription", "metaKeywords", "projectId"];
const INT = ["bedrooms", "bathrooms", "parking", "floors", "totalUnits", "pricePerSqft", "totalInventory", "soldUnits", "blockedUnits", "availableUnits"];
const BIGINT = ["priceMin", "priceMax", "allInclusivePrice"];
const FLOAT = ["latitude", "longitude"];
const BOOL = ["isFeatured", "isActive", "isHotDeal", "negotiable"];
const JSON_F = { gallery: "galleryJson", videos: "videosJson", pdfs: "pdfsJson", amenities: "amenitiesJson", configurations: "configurationsJson", nearby: "nearbyJson", specifications: "specificationsJson", tags: "tagsJson", loanBanks: "loanBanksJson", approvals: "approvalsJson" };

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
    const p = await prisma.property.findUnique({ where: { id } });
    if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ property: ser(p) });
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
    const p = await prisma.property.update({ where: { id }, data });
    return NextResponse.json({ success: true, property: ser(p) });
  } catch (err) {
    console.error("[PROP UPDATE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const { id } = await params;
  try {
    await prisma.property.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
