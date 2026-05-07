import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFull } from "@/lib/auth";

export async function GET(req) {
  if (!prisma) return NextResponse.json({ items: [] });
  const user = await getCurrentUserFull();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const leadId = searchParams.get("leadId");
    const overdue = searchParams.get("overdue");
    const ownOnly = searchParams.get("own") === "true" || user.role === "agent";

    const where = {};
    if (ownOnly) where.assignedToId = user.id;
    if (status) where.status = status;
    if (leadId) where.leadId = leadId;
    if (overdue === "true") {
      where.status = "open";
      where.dueAt = { lt: new Date() };
    }

    const items = await prisma.task.findMany({
      where,
      orderBy: [{ dueAt: "asc" }, { priority: "desc" }],
      include: {
        lead: { select: { id: true, name: true, primaryPhone: true } },
        assignedTo: { select: { id: true, name: true } },
      },
      take: 300,
    });
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[TASKS]", err);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const user = await getCurrentUserFull();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.title) return NextResponse.json({ error: "Title required" }, { status: 400 });
    const task = await prisma.task.create({
      data: {
        title: String(body.title).trim().slice(0, 200),
        description: body.description || null,
        type: body.type || "followup",
        leadId: body.leadId || null,
        assignedToId: body.assignedToId || user.id,
        dueAt: body.dueAt ? new Date(body.dueAt) : null,
        priority: body.priority || "medium",
        status: "open",
      },
    });
    return NextResponse.json({ success: true, task });
  } catch (err) {
    console.error("[TASK CREATE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
