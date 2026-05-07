import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const { id } = await params;
  try {
    const body = await req.json();
    const data = {};
    const allowed = ["customerName", "customerPhoto", "customerTitle", "type", "text", "videoUrl", "videoThumbnail", "propertyId", "isFeatured", "isActive"];
    for (const f of allowed) if (f in body) data[f] = body[f] === "" ? null : body[f];
    if ("rating" in body) data.rating = parseInt(body.rating) || 5;
    if ("displayOrder" in body) data.displayOrder = parseInt(body.displayOrder) || 0;
    if (body.testimonialDate !== undefined) data.testimonialDate = body.testimonialDate ? new Date(body.testimonialDate) : null;

    const t = await prisma.testimonial.update({ where: { id }, data });
    return NextResponse.json({ success: true, testimonial: t });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const { id } = await params;
  try {
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
