import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!prisma) return NextResponse.json({ items: [] });
  try {
    const items = await prisma.testimonial.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  try {
    const body = await req.json();
    if (!body.customerName) return NextResponse.json({ error: "Customer name required" }, { status: 400 });
    if (body.type === "text" && !body.text) return NextResponse.json({ error: "Text required for text type" }, { status: 400 });
    if (body.type === "video" && !body.videoUrl) return NextResponse.json({ error: "Video URL required for video type" }, { status: 400 });

    const t = await prisma.testimonial.create({
      data: {
        customerName: String(body.customerName).slice(0, 200),
        customerPhoto: body.customerPhoto || null,
        customerTitle: body.customerTitle || null,
        rating: parseInt(body.rating) || 5,
        type: body.type || "text",
        text: body.text || null,
        videoUrl: body.videoUrl || null,
        videoThumbnail: body.videoThumbnail || null,
        propertyId: body.propertyId || null,
        testimonialDate: body.testimonialDate ? new Date(body.testimonialDate) : null,
        displayOrder: parseInt(body.displayOrder) || 0,
        isFeatured: !!body.isFeatured,
        isActive: body.isActive !== false,
      },
    });
    return NextResponse.json({ success: true, testimonial: t });
  } catch (err) {
    console.error("[TESTIMONIAL CREATE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
