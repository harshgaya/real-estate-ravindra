import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  if (!prisma) return NextResponse.json({ items: [] });
  try {
    const items = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true, email: true, name: true, phone: true, designation: true,
        role: true, team: true, managerId: true, photo: true, isActive: true,
        joiningDate: true, lastLoginAt: true, createdAt: true,
      },
    });
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  try {
    const body = await req.json();
    const { email, password, name, phone, role, team, managerId, designation, photo, joiningDate } = body;
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name required" }, { status: 400 });
    }
    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (exists) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name: String(name).trim(),
        phone: phone || null,
        role: role || "agent",
        team: team || null,
        managerId: managerId || null,
        designation: designation || null,
        photo: photo || null,
        joiningDate: joiningDate ? new Date(joiningDate) : null,
        isActive: true,
        forcePasswordChange: false,
      },
      select: {
        id: true, email: true, name: true, phone: true, role: true, team: true,
        managerId: true, photo: true, designation: true, isActive: true,
      },
    });
    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("[USER CREATE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
