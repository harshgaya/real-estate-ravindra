import { prisma } from "@/lib/prisma";

export async function autoAssignLead(leadId) {
  if (!prisma) return null;
  const rule = await prisma.autoAssignRule.findUnique({ where: { id: "default" } });
  if (!rule || !rule.isActive) return null;
  let agents = [];
  try {
    agents = JSON.parse(rule.rotationAgentsJson);
  } catch {
    return null;
  }
  if (!Array.isArray(agents) || agents.length === 0) return null;

  const activeAgents = await prisma.user.findMany({
    where: { id: { in: agents }, isActive: true },
    select: { id: true, name: true, email: true },
  });
  if (activeAgents.length === 0) return null;

  const orderMap = new Map(agents.map((id, i) => [id, i]));
  activeAgents.sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999));

  const nextIndex = (rule.lastAssignedIndex + 1) % activeAgents.length;
  const assignee = activeAgents[nextIndex];

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      assignedToId: assignee.id,
      assignedAt: new Date(),
    },
  });

  await prisma.autoAssignRule.update({
    where: { id: "default" },
    data: { lastAssignedIndex: nextIndex },
  });

  await prisma.leadActivity.create({
    data: {
      leadId,
      type: "system",
      title: `Auto-assigned to ${assignee.name}`,
    },
  });

  await prisma.notification.create({
    data: {
      userId: assignee.id,
      type: "new_lead",
      title: "New lead assigned to you",
      body: "Click to view lead details",
      link: `/admin/leads/${leadId}`,
      refType: "lead",
      refId: leadId,
      priority: "high",
    },
  });

  try {
    const { sendPushToUser } = await import("@/lib/push");
    const lead = await prisma.lead.findUnique({ where: { id: leadId }, select: { name: true, primaryPhone: true, source: true } });
    await sendPushToUser(assignee.id, {
      title: "New lead assigned",
      body: `${lead?.name || "Unknown"} via ${lead?.source || "Unknown"}`,
      url: `/admin/leads/${leadId}`,
    });
  } catch {}

  return assignee;
}
