import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFull, getLeadVisibilityFilter } from "@/lib/auth";

function gen() {
  const d = new Date();
  const yymm = `${String(d.getFullYear()).slice(-2)}${String(d.getMonth() + 1).padStart(2, "0")}`;
  const r = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
  return `BK${yymm}${r}`;
}

function ser(b) {
  if (!b) return b;
  const out = { ...b };
  ["totalValue", "agreementValue", "registrationValue", "bookingAmount", "amountReceived", "stampDuty", "registration", "gst", "loanAmount", "refundAmount"].forEach((k) => {
    if (out[k] !== undefined && out[k] !== null) out[k] = out[k].toString();
  });
  return out;
}

export async function GET(req) {
  if (!prisma) return NextResponse.json({ items: [] });
  const user = await getCurrentUserFull();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const visibility = await getLeadVisibilityFilter(user);
    const where = { lead: { is: visibility } };
    if (status) where.status = status;
    const items = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        lead: { select: { id: true, name: true, primaryPhone: true } },
        property: { select: { id: true, name: true, slug: true } },
        createdBy: { select: { id: true, name: true } },
      },
      take: 300,
    });
    return NextResponse.json({ items: items.map(ser) });
  } catch (err) {
    console.error("[BOOKINGS]", err);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const user = await getCurrentUserFull();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 });
    const booking = await prisma.booking.create({
      data: {
        bookingNumber: gen(),
        leadId: body.leadId,
        propertyId: body.propertyId || null,
        unitNumber: body.unitNumber || null,
        configuration: body.configuration || null,
        totalValue: body.totalValue ? BigInt(body.totalValue) : 0n,
        bookingAmount: body.bookingAmount ? BigInt(body.bookingAmount) : 0n,
        amountReceived: body.amountReceived ? BigInt(body.amountReceived) : 0n,
        status: body.status || "pending",
        kycComplete: !!body.kycComplete,
        paymentMode: body.paymentMode || null,
        paymentRef: body.paymentRef || null,
        paidAt: body.paidAt ? new Date(body.paidAt) : null,
        internalNotes: body.internalNotes || body.notes || null,
        createdById: user.id,
      },
    });
    await prisma.lead.update({
      where: { id: body.leadId },
      data: {
        status: "booked",
        lastActivityAt: new Date(),
        activities: { create: { type: "system", title: `Booking: ${booking.bookingNumber}`, userId: user.id } },
      },
    });
    return NextResponse.json({ success: true, booking: ser(booking) });
  } catch (err) {
    console.error("[BOOKING CREATE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
