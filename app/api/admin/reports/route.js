import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFull, getLeadVisibilityFilter } from "@/lib/auth";

export async function GET(req) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const user = await getCurrentUserFull();
  if (!user || (user.role !== "admin" && user.role !== "manager")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const visibility = await getLeadVisibilityFilter(user);

    const [bySource, byStatus, byUser, byCity, leadsByDay] = await Promise.all([
      prisma.lead.groupBy({ by: ["source"], where: visibility, _count: true }),
      prisma.lead.groupBy({ by: ["status"], where: visibility, _count: true }),
      prisma.lead.groupBy({ by: ["assignedToId"], where: visibility, _count: true }),
      prisma.lead.groupBy({ by: ["cityPref"], where: visibility, _count: true }),
      prisma.lead.findMany({ where: { ...visibility, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }, select: { createdAt: true, source: true } }),
    ]);

    const userIds = byUser.map((b) => b.assignedToId).filter(Boolean);
    const users = userIds.length > 0 ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true } }) : [];
    const userMap = Object.fromEntries(users.map((u) => [u.id, u.name]));

    return NextResponse.json({
      bySource: bySource.map((s) => ({ source: s.source, count: s._count })),
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
      byUser: byUser.map((s) => ({ userId: s.assignedToId, name: userMap[s.assignedToId] || "Unassigned", count: s._count })),
      byCity: byCity.map((s) => ({ city: s.cityPref || "Unknown", count: s._count })),
      leadsByDay,
    });
  } catch (err) {
    console.error("[REPORTS]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
