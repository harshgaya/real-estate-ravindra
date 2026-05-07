import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function GET(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, email: true, name: true, phone: true, designation: true,
      role: true, team: true, managerId: true, photo: true, isActive: true,
      joiningDate: true, lastLoginAt: true, createdAt: true,
      _count: { select: { assignedLeads: true, bookings: true, siteVisits: true } },
    },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user });
}

export async function PATCH(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const { id } = await params;
  try {
    const body = await req.json();
    const data = {};
    const allowed = ["name", "phone", "role", "team", "managerId", "designation", "photo", "isActive"];
    for (const f of allowed) {
      if (f in body) data[f] = body[f] === "" ? null : body[f];
    }
    if (body.joiningDate !== undefined) data.joiningDate = body.joiningDate ? new Date(body.joiningDate) : null;
    if (body.password) data.passwordHash = await hashPassword(body.password);
    if (body.email) {
      const cleanEmail = body.email.toLowerCase().trim();
      const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
      data.email = cleanEmail;
    }
    const user = await prisma.user.update({ where: { id }, data });
    return NextResponse.json({ success: true, user });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const { id } = await params;
  try {
    await prisma.user.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
