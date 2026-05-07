import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFull, getLeadVisibilityFilter } from "@/lib/auth";

export async function GET() {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const user = await getCurrentUserFull();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStart = new Date(todayStart); tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const visibility = await getLeadVisibilityFilter(user);
    const visitFilter = { lead: { is: visibility } };
    const taskFilter = user.role === "agent" ? { assignedToId: user.id } : {};

    const [
      totalLeads, newLeads, monthLeads, bookedLeads, lostLeads, droppedLeads, notInterested,
      activeProperties, activeProjects,
      todayVisits, pendingTasks, overdueTasks,
      callbackCount, eoiCount, meetingScheduledCount, meetingDoneCount, siteVisitScheduledCount,
      recentLeads, upcomingVisits, byStatus, bySource,
    ] = await Promise.all([
      prisma.lead.count({ where: visibility }),
      prisma.lead.count({ where: { ...visibility, status: "new" } }),
      prisma.lead.count({ where: { ...visibility, createdAt: { gte: monthStart } } }),
      prisma.lead.count({ where: { ...visibility, status: "booked" } }),
      prisma.lead.count({ where: { ...visibility, status: "lost" } }),
      prisma.lead.count({ where: { ...visibility, status: "dropped" } }),
      prisma.lead.count({ where: { ...visibility, status: "not_interested" } }),
      prisma.property.count({ where: { isActive: true } }),
      prisma.project.count({ where: { isActive: true } }),
      prisma.siteVisit.count({ where: { ...visitFilter, scheduledAt: { gte: todayStart, lt: tomorrowStart }, status: { in: ["scheduled", "confirmed"] } } }),
      prisma.task.count({ where: { ...taskFilter, status: "open" } }),
      prisma.task.count({ where: { ...taskFilter, status: "open", dueAt: { lt: now } } }),
      prisma.lead.count({ where: { ...visibility, status: "callback" } }),
      prisma.lead.count({ where: { ...visibility, status: "eoi" } }),
      prisma.lead.count({ where: { ...visibility, status: "meeting_scheduled" } }),
      prisma.siteVisit.count({ where: { ...visitFilter, status: "completed" } }),
      prisma.lead.count({ where: { ...visibility, status: "site_visit_scheduled" } }),
      prisma.lead.findMany({ where: visibility, orderBy: { createdAt: "desc" }, take: 8, select: { id: true, name: true, primaryPhone: true, source: true, status: true, createdAt: true } }),
      prisma.siteVisit.findMany({ where: { ...visitFilter, scheduledAt: { gte: now }, status: { in: ["scheduled", "confirmed"] } }, orderBy: { scheduledAt: "asc" }, take: 5, include: { lead: { select: { name: true, primaryPhone: true } }, property: { select: { name: true } } } }),
      prisma.lead.groupBy({ by: ["status"], where: visibility, _count: true }),
      prisma.lead.groupBy({ by: ["source"], where: visibility, _count: true, orderBy: { _count: { source: "desc" } }, take: 10 }),
    ]);

    return NextResponse.json({
      kpis: {
        totalLeads, newLeads, monthLeads, bookedLeads, lostLeads, droppedLeads, notInterested,
        activeProperties, activeProjects,
        todayVisits, pendingTasks, overdueTasks,
        callbackCount, eoiCount, meetingScheduledCount, meetingDoneCount, siteVisitScheduledCount,
        conversionRate: totalLeads > 0 ? Math.round((bookedLeads / totalLeads) * 100) : 0,
      },
      bySource: bySource.map((s) => ({ source: s.source, count: s._count })),
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
      recentLeads,
      upcomingVisits,
    });
  } catch (err) {
    console.error("[DASH]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
