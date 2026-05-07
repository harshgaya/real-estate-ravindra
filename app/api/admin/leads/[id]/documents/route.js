import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFull, getLeadVisibilityFilter } from "@/lib/auth";

export async function POST(req, { params }) {
  if (!prisma)
    return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const user = await getCurrentUserFull();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  try {
    const visibility = await getLeadVisibilityFilter(user);
    const lead = await prisma.lead.findFirst({
      where: { id, ...visibility },
      select: { id: true },
    });
    if (!lead)
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const body = await req.json();
    const { filename, fileUrl, fileSize, mimeType, type } = body;
    if (!filename || !fileUrl)
      return NextResponse.json(
        { error: "filename and fileUrl required" },
        { status: 400 },
      );

    const doc = await prisma.document.create({
      data: {
        leadId: id,
        filename: String(filename).slice(0, 255),
        fileUrl: String(fileUrl).slice(0, 1000),
        fileSize: parseInt(fileSize) || 0,
        mimeType: mimeType || null,
        type: type || "other",
        uploadedById: user.id,
      },
    });

    await prisma.lead.update({
      where: { id },
      data: {
        lastActivityAt: new Date(),
        activities: {
          create: {
            type: "system",
            title: `Document uploaded: ${filename}`,
            userId: user.id,
          },
        },
      },
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (err) {
    console.error("[LEAD DOC CREATE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!prisma)
    return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const user = await getCurrentUserFull();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  try {
    const { searchParams } = new URL(req.url);
    const docId = searchParams.get("docId");
    if (!docId)
      return NextResponse.json({ error: "docId required" }, { status: 400 });

    await prisma.document.deleteMany({ where: { id: docId, leadId: id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
