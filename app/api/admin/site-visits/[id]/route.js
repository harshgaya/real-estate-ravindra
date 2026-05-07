import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFull } from "@/lib/auth";

export async function PATCH(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const user = await getCurrentUserFull();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await req.json();
    const existing = await prisma.siteVisit.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data = {};
    const allowed = ["scheduledAt", "durationMins", "status", "meetingPoint", "meetingMapUrl", "pickupNotes", "notes", "outcome", "feedback", "interestLevel", "assignedToId", "checkInLat", "checkInLng"];
    for (const f of allowed) {
      if (f in body) {
        if (f === "scheduledAt") data[f] = body[f] ? new Date(body[f]) : null;
        else if (["durationMins", "interestLevel"].includes(f)) data[f] = body[f] ? parseInt(body[f]) : null;
        else if (["checkInLat", "checkInLng"].includes(f)) data[f] = body[f] ? parseFloat(body[f]) : null;
        else data[f] = body[f] === "" ? null : body[f];
      }
    }

    if (body.checkIn === true && !existing.checkedInAt) {
      data.checkedInAt = new Date();
    }
    if (Array.isArray(body.visitPhotos)) {
      data.visitPhotosJson = JSON.stringify(body.visitPhotos);
    }

    const updated = await prisma.siteVisit.update({ where: { id }, data });

    if (body.status === "completed" && existing.status !== "completed") {
      await prisma.lead.update({
        where: { id: existing.leadId },
        data: {
          status: "site_visit_done",
          lastActivityAt: new Date(),
          activities: {
            create: {
              type: "site_visit",
              title: "Site visit completed",
              body: body.feedback || null,
              userId: user.id,
            },
          },
        },
      });
    }
    return NextResponse.json({ success: true, visit: updated });
  } catch (err) {
    console.error("[VISIT UPDATE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const { id } = await params;
  try {
    await prisma.siteVisit.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
