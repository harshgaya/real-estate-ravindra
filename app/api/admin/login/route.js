import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, setSessionCookie, getRequestIp } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (!prisma) {
      return NextResponse.json({ error: "Database not connected. Run: npm run setup" }, { status: 500 });
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase().trim() },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const h = await headers();
    const ip = await getRequestIp();
    const ua = h.get("user-agent") || null;

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress: ip,
        userAgent: ua,
      },
    }).catch(() => {});

    const token = signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        forcePasswordChange: user.forcePasswordChange,
      },
    });
  } catch (err) {
    console.error("[LOGIN]", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
