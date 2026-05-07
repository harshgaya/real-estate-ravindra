import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPushToUser } from "@/lib/push";

const CRON_SECRET = process.env.CRON_SECRET || "";
const CRON_INTERVAL_MIN = 5;
const WINDOW_BUFFER_MIN = CRON_INTERVAL_MIN + 1;

async function handle(req) {
  if (CRON_SECRET) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  if (!prisma)
    return NextResponse.json({ error: "DB not ready" }, { status: 500 });

  const now = new Date();
  const summary = {
    siteVisit1DayReminders: 0,
    siteVisit1HourReminders: 0,
    siteVisit10MinReminders: 0,
    taskOverdueReminders: 0,
    pushSent: 0,
    pushFailed: 0,
  };
  const errors = [];

  async function pushSafe(userId, payload) {
    try {
      const r = await sendPushToUser(userId, payload);
      if (r?.sent) summary.pushSent += r.sent;
      if (r?.failed) summary.pushFailed += r.failed;
    } catch (err) {
      errors.push(`push to ${userId}: ${err.message}`);
    }
  }

  // ============ SITE VISIT REMINDERS ============
  const reminderConfigs = [
    {
      field: "reminder1DaySent",
      label: "1 day",
      targetMins: 24 * 60,
      statKey: "siteVisit1DayReminders",
    },
    {
      field: "reminder1HourSent",
      label: "1 hour",
      targetMins: 60,
      statKey: "siteVisit1HourReminders",
    },
    {
      field: "reminder10MinSent",
      label: "10 min",
      targetMins: 10,
      statKey: "siteVisit10MinReminders",
    },
  ];

  for (const cfg of reminderConfigs) {
    try {
      const targetTime = now.getTime() + cfg.targetMins * 60 * 1000;
      const lower = new Date(targetTime - WINDOW_BUFFER_MIN * 60 * 1000);
      const upper = new Date(targetTime + WINDOW_BUFFER_MIN * 60 * 1000);

      const visits = await prisma.siteVisit.findMany({
        where: {
          scheduledAt: { gte: lower, lte: upper },
          [cfg.field]: false,
          status: { in: ["scheduled", "confirmed"] },
        },
        include: {
          lead: { select: { name: true, primaryPhone: true } },
          property: { select: { name: true } },
          assignedTo: { select: { id: true } },
        },
      });

      for (const v of visits) {
        if (v.assignedTo?.id) {
          const visitTimeStr = new Date(v.scheduledAt).toLocaleString("en-IN", {
            weekday: "short",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          await prisma.notification.create({
            data: {
              userId: v.assignedTo.id,
              type: "site_visit_upcoming",
              title: `Site visit in ${cfg.label}: ${v.lead?.name || "Unknown"}`,
              body: `${visitTimeStr} - ${v.property?.name || v.meetingPoint || "site"}`,
              link: `/admin/site-visits`,
              refType: "site_visit",
              refId: v.id,
              priority: cfg.targetMins <= 60 ? "high" : "normal",
            },
          });
          summary[cfg.statKey]++;
          await pushSafe(v.assignedTo.id, {
            title: `Site visit in ${cfg.label}`,
            body: `${v.lead?.name || ""} at ${v.property?.name || "site"}`,
            url: `/admin/site-visits`,
          });
        }
        await prisma.siteVisit.update({
          where: { id: v.id },
          data: { [cfg.field]: true },
        });
      }
    } catch (e) {
      errors.push(`${cfg.label} reminder: ${e.message}`);
    }
  }

  // ============ TASK OVERDUE ============
  try {
    const overdueTasks = await prisma.task.findMany({
      where: {
        status: { notIn: ["done", "cancelled"] },
        dueAt: { lt: now, not: null },
        reminderOverdueSent: false,
      },
      include: {
        assignedTo: { select: { id: true } },
        lead: { select: { name: true } },
      },
    });

    for (const t of overdueTasks) {
      if (t.assignedTo?.id) {
        await prisma.notification.create({
          data: {
            userId: t.assignedTo.id,
            type: "task_overdue",
            title: `Task overdue: ${t.title}`,
            body: t.lead ? `For: ${t.lead.name}` : null,
            link: `/admin/tasks`,
            refType: "task",
            refId: t.id,
            priority: t.priority === "urgent" ? "high" : "normal",
          },
        });
        summary.taskOverdueReminders++;
        await pushSafe(t.assignedTo.id, {
          title: "Task overdue",
          body: t.title,
          url: "/admin/tasks",
        });
      }
      await prisma.task.update({
        where: { id: t.id },
        data: { reminderOverdueSent: true },
      });
    }
  } catch (e) {
    errors.push(`task overdue: ${e.message}`);
  }

  // ============ TASK DUE NOW (first reminder) ============
  try {
    const targetWindow = WINDOW_BUFFER_MIN * 60 * 1000;
    const dueTasks = await prisma.task.findMany({
      where: {
        status: { notIn: ["done", "cancelled"] },
        dueAt: {
          gte: new Date(now.getTime() - targetWindow),
          lte: new Date(now.getTime() + targetWindow),
        },
        reminderSent: false,
      },
      include: {
        assignedTo: { select: { id: true } },
        lead: { select: { name: true } },
      },
    });

    for (const t of dueTasks) {
      if (t.assignedTo?.id) {
        await prisma.notification.create({
          data: {
            userId: t.assignedTo.id,
            type: "task_due",
            title: `Task due: ${t.title}`,
            body: t.lead ? `For: ${t.lead.name}` : null,
            link: `/admin/tasks`,
            refType: "task",
            refId: t.id,
            priority: t.priority === "urgent" ? "high" : "normal",
          },
        });
        await pushSafe(t.assignedTo.id, {
          title: "Task due now",
          body: t.title,
          url: "/admin/tasks",
        });
      }
      await prisma.task.update({
        where: { id: t.id },
        data: { reminderSent: true },
      });
    }
  } catch (e) {
    errors.push(`task due: ${e.message}`);
  }

  return NextResponse.json({
    success: true,
    ranAt: now.toISOString(),
    ...summary,
    ...(errors.length ? { errors } : {}),
  });
}

export async function POST(req) {
  return handle(req);
}
export async function GET(req) {
  return handle(req);
}
