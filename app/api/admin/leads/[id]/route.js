import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFull, getLeadVisibilityFilter } from "@/lib/auth";

const ALLOWED = [
  "firstName",
  "lastName",
  "primaryPhone",
  "secondaryPhone",
  "alternatePhone",
  "whatsappPhone",
  "primaryEmail",
  "alternateEmail",
  "status",
  "temperature",
  "subStatus",
  "leadScore",
  "budgetMin",
  "budgetMax",
  "bhkPreference",
  "propertyTypePref",
  "cityPref",
  "timeline",
  "purpose",
  "funding",
  "loanStatus",
  "panNumber",
  "occupation",
  "company",
  "designation",
  "incomeRange",
  "familySize",
  "currentAddress",
  "commPreference",
  "bestTimeToCall",
  "language",
  "lostReason",
  "lostReasonNotes",
  "wonReason",
  "assignedToId",
  "propertyId",
  "projectId",
  "message",
  "notes",
  "isJunk",
  "nextFollowupAt",
];

const NUM_BIGINT = ["budgetMin", "budgetMax"];
const NUM_INT = ["leadScore", "familySize"];
const BOOL = ["isJunk"];
const DATE_FIELDS = ["nextFollowupAt"];

const BOOKING_BIGINT = [
  "totalValue",
  "agreementValue",
  "registrationValue",
  "bookingAmount",
  "amountReceived",
  "stampDuty",
  "registration",
  "gst",
  "loanAmount",
  "refundAmount",
];

function serBooking(b) {
  if (!b) return b;
  const out = { ...b };
  for (const k of BOOKING_BIGINT) {
    if (out[k] !== undefined && out[k] !== null) out[k] = out[k].toString();
  }
  return out;
}

function ser(l) {
  if (!l) return l;
  const out = { ...l };
  if (l.budgetMin !== null && l.budgetMin !== undefined)
    out.budgetMin = l.budgetMin.toString();
  if (l.budgetMax !== null && l.budgetMax !== undefined)
    out.budgetMax = l.budgetMax.toString();
  if (Array.isArray(l.bookings)) out.bookings = l.bookings.map(serBooking);
  return out;
}

export async function GET(req, { params }) {
  if (!prisma)
    return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const user = await getCurrentUserFull();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const visibility = await getLeadVisibilityFilter(user);
  const lead = await prisma.lead.findFirst({
    where: { id, ...visibility },
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true, phone: true },
      },
      property: {
        select: { id: true, slug: true, name: true, location: true },
      },
      project: { select: { id: true, slug: true, name: true } },
      activities: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true } } },
      },
      siteVisits: {
        orderBy: { scheduledAt: "desc" },
        include: {
          property: { select: { name: true, slug: true } },
          assignedTo: { select: { id: true, name: true } },
        },
      },
      tasks: {
        orderBy: { createdAt: "desc" },
        include: { assignedTo: { select: { id: true, name: true } } },
      },
      bookings: true,
      documents: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ lead: ser(lead) });
}

export async function PATCH(req, { params }) {
  if (!prisma)
    return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const user = await getCurrentUserFull();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  try {
    const body = await req.json();
    const visibility = await getLeadVisibilityFilter(user);
    const existing = await prisma.lead.findFirst({
      where: { id, ...visibility },
    });
    if (!existing)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data = { lastActivityAt: new Date() };
    const activities = [];

    for (const f of ALLOWED) {
      if (!(f in body)) continue;
      let v = body[f];
      if (NUM_BIGINT.includes(f)) v = v ? BigInt(v) : null;
      else if (NUM_INT.includes(f)) v = v ? parseInt(v) : 0;
      else if (BOOL.includes(f)) v = !!v;
      else if (DATE_FIELDS.includes(f)) v = v ? new Date(v) : null;
      else v = v === "" ? null : v;

      const oldVal = existing[f];
      const isDifferent = NUM_BIGINT.includes(f)
        ? String(oldVal || "") !== String(v || "")
        : oldVal !== v;

      if (isDifferent) {
        data[f] = v;
        if (f === "status") {
          activities.push({
            type: "status_change",
            title: `Status: ${oldVal || "none"} -> ${v}`,
            oldValue: oldVal || null,
            newValue: v || null,
            userId: user.id,
          });
          if (v === "contacted" && !existing.contactedAt)
            data.contactedAt = new Date();
        } else if (f === "temperature") {
          activities.push({
            type: "system",
            title: `Temperature: ${oldVal || "none"} -> ${v}`,
            userId: user.id,
          });
        } else if (f === "assignedToId") {
          activities.push({
            type: "system",
            title: v ? "Lead reassigned" : "Lead unassigned",
            userId: user.id,
          });
          if (v) data.assignedAt = new Date();
        }
      }
    }

    if ("firstName" in data || "lastName" in data) {
      const fn = data.firstName ?? existing.firstName;
      const ln = data.lastName ?? existing.lastName;
      data.name = ln ? `${fn} ${ln}` : fn;
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        ...data,
        ...(activities.length > 0
          ? { activities: { create: activities } }
          : {}),
      },
    });

    return NextResponse.json({ success: true, lead: ser(updated) });
  } catch (err) {
    console.error("[LEAD UPDATE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!prisma)
    return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const user = await getCurrentUserFull();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin" && user.role !== "manager") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  try {
    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
