import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFull, getLeadVisibilityFilter } from "@/lib/auth";

export async function GET(req) {
  if (!prisma) return NextResponse.json({ items: [] });
  const user = await getCurrentUserFull();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const leadId = searchParams.get("leadId");

    const visibility = await getLeadVisibilityFilter(user);
    const where = leadId ? { leadId } : { lead: { is: visibility } };
    if (status) where.status = status;
    if (from || to) {
      where.scheduledAt = {};
      if (from) where.scheduledAt.gte = new Date(from);
      if (to) where.scheduledAt.lte = new Date(to);
    }

    const items = await prisma.siteVisit.findMany({
      where,
      orderBy: { scheduledAt: "asc" },
      include: {
        lead: { select: { id: true, name: true, primaryPhone: true, primaryEmail: true } },
        property: { select: { id: true, slug: true, name: true, location: true } },
        assignedTo: { select: { id: true, name: true } },
      },
      take: parseInt(searchParams.get("limit")) || 200,
    });
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[VISITS]", err);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const user = await getCurrentUserFull();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    if (!body.leadId || !body.scheduledAt) {
      return NextResponse.json({ error: "leadId and scheduledAt required" }, { status: 400 });
    }
    const visit = await prisma.siteVisit.create({
      data: {
        leadId: body.leadId,
        propertyId: body.propertyId || null,
        scheduledAt: new Date(body.scheduledAt),
        durationMins: parseInt(body.durationMins) || 60,
        meetingPoint: body.meetingPoint || null,
        meetingMapUrl: body.meetingMapUrl || null,
        notes: body.notes || null,
        assignedToId: body.assignedToId || user.id,
        status: "scheduled",
      },
    });

    await prisma.lead.update({
      where: { id: body.leadId },
      data: {
        status: "site_visit_scheduled",
        lastActivityAt: new Date(),
        activities: {
          create: {
            type: "site_visit",
            title: `Site visit scheduled for ${new Date(body.scheduledAt).toLocaleString("en-IN")}`,
            userId: user.id,
          },
        },
      },
    });

    return NextResponse.json({ success: true, visit });
  } catch (err) {
    console.error("[VISIT CREATE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
