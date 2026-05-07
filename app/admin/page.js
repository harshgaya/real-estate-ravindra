import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFull, getLeadVisibilityFilter } from "@/lib/auth";
import {
  LuUsers, LuPhone, LuCalendar, LuClipboardCheck, LuTrendingUp,
  LuClock, LuStar, LuCircleCheck, LuCircleAlert,
} from "react-icons/lu";

export const dynamic = "force-dynamic";

async function getStats(user) {
  if (!prisma || !user) return null;
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart); tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const visibility = await getLeadVisibilityFilter(user);
  const visitFilter = { lead: { is: visibility } };
  const taskFilter = user.role === "agent" ? { assignedToId: user.id } : {};

  const [
    totalLeads, newLeads, monthLeads, bookedLeads, lostLeads,
    callbackCount, eoiCount, meetingScheduledCount, siteVisitScheduledCount,
    todayVisits, pendingTasks, overdueTasks,
    recentLeads, upcomingVisits,
  ] = await Promise.all([
    prisma.lead.count({ where: visibility }),
    prisma.lead.count({ where: { ...visibility, status: "new" } }),
    prisma.lead.count({ where: { ...visibility, createdAt: { gte: monthStart } } }),
    prisma.lead.count({ where: { ...visibility, status: "booked" } }),
    prisma.lead.count({ where: { ...visibility, status: "lost" } }),
    prisma.lead.count({ where: { ...visibility, status: "callback" } }),
    prisma.lead.count({ where: { ...visibility, status: "eoi" } }),
    prisma.lead.count({ where: { ...visibility, status: "meeting_scheduled" } }),
    prisma.lead.count({ where: { ...visibility, status: "site_visit_scheduled" } }),
    prisma.siteVisit.count({ where: { ...visitFilter, scheduledAt: { gte: todayStart, lt: tomorrowStart } } }),
    prisma.task.count({ where: { ...taskFilter, status: "open" } }),
    prisma.task.count({ where: { ...taskFilter, status: "open", dueAt: { lt: now } } }),
    prisma.lead.findMany({ where: visibility, orderBy: { createdAt: "desc" }, take: 8, select: { id: true, name: true, primaryPhone: true, source: true, status: true, createdAt: true, assignedTo: { select: { name: true } } } }),
    prisma.siteVisit.findMany({ where: { ...visitFilter, scheduledAt: { gte: now }, status: { in: ["scheduled", "confirmed"] } }, orderBy: { scheduledAt: "asc" }, take: 5, include: { lead: { select: { name: true, primaryPhone: true } }, property: { select: { name: true } } } }),
  ]);

  return {
    totalLeads, newLeads, monthLeads, bookedLeads, lostLeads,
    callbackCount, eoiCount, meetingScheduledCount, siteVisitScheduledCount,
    todayVisits, pendingTasks, overdueTasks,
    conversionRate: totalLeads > 0 ? Math.round((bookedLeads / totalLeads) * 100) : 0,
    recentLeads, upcomingVisits,
  };
}

export default async function AdminDashboard() {
  const user = await getCurrentUserFull();
  if (!user) return <div>Loading...</div>;
  const s = await getStats(user);
  if (!s) return <div>Database not connected. Run npm run setup.</div>;

  const topKpis = [
    { label: "Total Leads", value: s.totalLeads, icon: LuUsers, color: "blue", href: "/admin/leads" },
    { label: "New Leads", value: s.newLeads, icon: LuStar, color: "amber", href: "/admin/leads?status=new" },
    { label: "This Month", value: s.monthLeads, icon: LuTrendingUp, color: "purple" },
    { label: "Booked", value: s.bookedLeads, icon: LuCircleCheck, color: "green", href: "/admin/leads?status=booked" },
    { label: "Conversion", value: `${s.conversionRate}%`, icon: LuTrendingUp, color: "teal" },
    { label: "Lost", value: s.lostLeads, icon: LuCircleAlert, color: "red", href: "/admin/leads?status=lost" },
  ];

  const stageKpis = [
    { label: "Callbacks", value: s.callbackCount, icon: LuPhone, color: "yellow", href: "/admin/leads?status=callback" },
    { label: "Meetings", value: s.meetingScheduledCount, icon: LuCalendar, color: "indigo", href: "/admin/leads?status=meeting_scheduled" },
    { label: "Site Visits", value: s.siteVisitScheduledCount, icon: LuCalendar, color: "cyan", href: "/admin/leads?status=site_visit_scheduled" },
    { label: "EOI", value: s.eoiCount, icon: LuStar, color: "pink", href: "/admin/leads?status=eoi" },
    { label: "Today's Visits", value: s.todayVisits, icon: LuCalendar, color: "blue", href: "/admin/site-visits" },
    { label: "Pending Tasks", value: s.pendingTasks, icon: LuClipboardCheck, color: "purple", href: "/admin/tasks" },
    { label: "Overdue", value: s.overdueTasks, icon: LuClock, color: "red", href: "/admin/tasks?overdue=true" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-semibold">Welcome back, {user.name?.split(" ")[0]}</h1>
        <p className="text-sm text-[var(--color-ink-600)] mt-1">Here's what's happening with your pipeline today.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {topKpis.map((k) => <KpiCard key={k.label} {...k}/>)}
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-500)] mb-3">Pipeline Stages</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {stageKpis.map((k) => <KpiCard key={k.label} {...k} small/>)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-ink-100)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Recent Leads</h2>
            <Link href="/admin/leads" className="text-xs text-[var(--color-brand-700)]">View all</Link>
          </div>
          <div className="space-y-2">
            {s.recentLeads.length === 0 ? (
              <p className="text-sm text-[var(--color-ink-500)] py-8 text-center">No leads yet</p>
            ) : s.recentLeads.map((l) => (
              <Link key={l.id} href={`/admin/leads/${l.id}`} className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-[var(--color-bg-soft)] transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{l.name}</p>
                  <p className="text-xs text-[var(--color-ink-500)] mt-0.5 truncate">{l.primaryPhone} · {l.source}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] tracking-wider uppercase font-medium text-[var(--color-ink-500)]">{l.status.replace(/_/g, " ")}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[var(--color-ink-100)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Upcoming Visits</h2>
            <Link href="/admin/site-visits" className="text-xs text-[var(--color-brand-700)]">View all</Link>
          </div>
          <div className="space-y-2">
            {s.upcomingVisits.length === 0 ? (
              <p className="text-sm text-[var(--color-ink-500)] py-8 text-center">No upcoming visits</p>
            ) : s.upcomingVisits.map((v) => (
              <div key={v.id} className="p-3 rounded-lg bg-[var(--color-bg-soft)]">
                <p className="text-sm font-medium truncate">{v.lead?.name || "Unknown"}</p>
                <p className="text-xs text-[var(--color-ink-600)] mt-0.5 truncate">{v.property?.name || "Site visit"}</p>
                <p className="text-[11px] text-[var(--color-brand-700)] mt-1 font-medium">
                  {new Date(v.scheduledAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const COLORS = {
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  purple: "bg-purple-50 text-purple-700",
  green: "bg-green-50 text-green-700",
  teal: "bg-teal-50 text-teal-700",
  red: "bg-red-50 text-red-700",
  yellow: "bg-yellow-50 text-yellow-700",
  indigo: "bg-indigo-50 text-indigo-700",
  cyan: "bg-cyan-50 text-cyan-700",
  pink: "bg-pink-50 text-pink-700",
};

function KpiCard({ label, value, icon: Icon, color, href, small }) {
  const inner = (
    <div className={`bg-white rounded-xl border border-[var(--color-ink-100)] ${small ? "p-3" : "p-4"} hover:border-[var(--color-ink-200)] transition-colors`}>
      <div className={`w-8 h-8 rounded-lg ${COLORS[color] || COLORS.blue} grid place-items-center mb-2`}>
        <Icon className="text-base"/>
      </div>
      <p className={`${small ? "text-lg" : "text-2xl"} font-semibold leading-none`}>{value}</p>
      <p className="text-[11px] text-[var(--color-ink-500)] mt-1.5 uppercase tracking-wider">{label}</p>
    </div>
  );
  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}
