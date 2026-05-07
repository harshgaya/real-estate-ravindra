import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFull, getLeadVisibilityFilter } from "@/lib/auth";
import { autoAssignLead } from "@/lib/auto-assign";

function serializeLead(l) {
  if (!l) return l;
  return {
    ...l,
    budgetMin: l.budgetMin != null ? l.budgetMin.toString() : null,
    budgetMax: l.budgetMax != null ? l.budgetMax.toString() : null,
  };
}

export async function GET(req) {
  if (!prisma)
    return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const user = await getCurrentUserFull();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const statusIn = searchParams.get("statusIn");
    const source = searchParams.get("source");
    const temperature = searchParams.get("temperature");
    const assignedTo = searchParams.get("assignedTo");
    const q = searchParams.get("q");
    const isJunk = searchParams.get("junk");
    const followups = searchParams.get("followups");
    const lead_pool = searchParams.get("lead_pool");
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const limit = parseInt(searchParams.get("limit")) || 50;
    const offset = parseInt(searchParams.get("offset")) || 0;

    const visibility = await getLeadVisibilityFilter(user);
    const where = { ...visibility };

    if (lead_pool === "true") where.assignedToId = null;
    else if (assignedTo === "unassigned") where.assignedToId = null;
    else if (assignedTo) where.assignedToId = assignedTo;

    if (status) where.status = status;
    if (statusIn) {
      const arr = statusIn.split(",").filter(Boolean);
      if (arr.length) where.status = { in: arr };
    }
    if (source) where.source = source;
    if (temperature) where.temperature = temperature;
    if (isJunk === "true") where.isJunk = true;
    else where.isJunk = false;

    if (followups === "true") {
      where.nextFollowupAt = { lte: new Date() };
      where.status = { notIn: ["booked", "lost", "dropped", "not_interested"] };
    }

    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) where.createdAt.lte = new Date(toDate);
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { primaryPhone: { contains: q } },
        { secondaryPhone: { contains: q } },
        { primaryEmail: { contains: q, mode: "insensitive" } },
      ];
    }

    const orderBy = {};
    orderBy[sort] = order === "asc" ? "asc" : "desc";

    const [total, items] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
        include: {
          assignedTo: { select: { id: true, name: true } },
          property: { select: { id: true, name: true, slug: true } },
          project: { select: { id: true, name: true, slug: true } },
          _count: {
            select: { activities: true, siteVisits: true, tasks: true },
          },
        },
      }),
    ]);

    return NextResponse.json({ total, items: items.map(serializeLead) });
  } catch (err) {
    console.error("[LEADS LIST]", err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function POST(req) {
  if (!prisma)
    return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const user = await getCurrentUserFull();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const firstName = String(body.firstName || body.name || "")
      .trim()
      .slice(0, 100);
    const lastName = body.lastName
      ? String(body.lastName).trim().slice(0, 100)
      : null;
    const fullName = lastName ? `${firstName} ${lastName}` : firstName;

    const primaryPhone = String(body.primaryPhone || body.phone || "")
      .replace(/\D/g, "")
      .slice(-10);
    const primaryEmail = String(body.primaryEmail || body.email || "")
      .trim()
      .toLowerCase();

    if (!firstName || firstName.length < 2)
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    if (!/^[6-9]\d{9}$/.test(primaryPhone))
      return NextResponse.json(
        { error: "Valid mobile required" },
        { status: 400 },
      );

    const lead = await prisma.lead.create({
      data: {
        firstName,
        lastName,
        name: fullName,
        primaryPhone,
        secondaryPhone: body.secondaryPhone
          ? String(body.secondaryPhone).replace(/\D/g, "").slice(-10)
          : null,
        alternatePhone: body.alternatePhone
          ? String(body.alternatePhone).replace(/\D/g, "").slice(-10)
          : null,
        whatsappPhone: body.whatsappPhone || null,
        primaryEmail,
        alternateEmail: body.alternateEmail || null,
        source: body.source || "Manual",
        subSource: body.subSource || null,
        status: body.status || "new",
        temperature: body.temperature || null,
        budgetMin: body.budgetMin ? BigInt(body.budgetMin) : null,
        budgetMax: body.budgetMax ? BigInt(body.budgetMax) : null,
        bhkPreference: body.bhkPreference || null,
        timeline: body.timeline || null,
        purpose: body.purpose || null,
        funding: body.funding || null,
        message: body.message || null,
        notes: body.notes || null,
        propertyId: body.propertyId || null,
        projectId: body.projectId || null,
        assignedToId: body.assignedToId || user.id,
        assignedAt: body.assignedToId ? new Date() : new Date(),
        assignedById: user.id,
        createdById: user.id,
        lastActivityAt: new Date(),
        activities: {
          create: {
            type: "system",
            title: "Lead created manually",
            userId: user.id,
          },
        },
      },
    });

    return NextResponse.json({ success: true, lead: serializeLead(lead) });
  } catch (err) {
    console.error("[LEAD CREATE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
