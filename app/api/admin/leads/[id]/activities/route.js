import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFull, getLeadVisibilityFilter } from "@/lib/auth";

export async function POST(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const user = await getCurrentUserFull();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  try {
    const body = await req.json();
    const visibility = await getLeadVisibilityFilter(user);
    const lead = await prisma.lead.findFirst({ where: { id, ...visibility }, select: { id: true } });
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const type = String(body.type || "note");
    const title = String(body.title || "").trim().slice(0, 200);
    const content = String(body.body || body.content || "").trim().slice(0, 4000);
    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

    const activity = await prisma.leadActivity.create({
      data: {
        leadId: id,
        type,
        title,
        body: content || null,
        userId: user.id,
        callDuration: body.callDuration ? parseInt(body.callDuration) : null,
        callOutcome: body.callOutcome || null,
        emailSubject: body.emailSubject || null,
        templateId: body.templateId || null,
      },
    });
    await prisma.lead.update({ where: { id }, data: { lastActivityAt: new Date() } });
    return NextResponse.json({ success: true, activity });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
