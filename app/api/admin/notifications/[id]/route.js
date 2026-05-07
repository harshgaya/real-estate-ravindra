import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFull } from "@/lib/auth";

export async function PATCH(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const user = await getCurrentUserFull();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const r = await prisma.notification.updateMany({
      where: { id, userId: user.id },
      data: { isRead: true, readAt: new Date() },
    });
    return NextResponse.json({ success: true, updated: r.count });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
