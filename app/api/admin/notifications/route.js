import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFull } from "@/lib/auth";

export async function GET(req) {
  if (!prisma) return NextResponse.json({ items: [], unread: 0 });
  const user = await getCurrentUserFull();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unread") === "true";
    const where = { userId: user.id };
    if (unreadOnly) where.isRead = false;
    const [items, unread] = await Promise.all([
      prisma.notification.findMany({ where, orderBy: { createdAt: "desc" }, take: 50 }),
      prisma.notification.count({ where: { userId: user.id, isRead: false } }),
    ]);
    return NextResponse.json({ items, unread });
  } catch {
    return NextResponse.json({ items: [], unread: 0 });
  }
}

export async function PATCH() {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const user = await getCurrentUserFull();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
