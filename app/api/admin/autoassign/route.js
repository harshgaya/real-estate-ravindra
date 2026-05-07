import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!prisma) return NextResponse.json({ rule: null });
  try {
    const rule = await prisma.autoAssignRule.upsert({
      where: { id: "default" },
      update: {},
      create: { id: "default", isActive: false, rotationAgentsJson: "[]" },
    });
    let rotationAgents = [];
    try { rotationAgents = JSON.parse(rule.rotationAgentsJson); } catch {}
    return NextResponse.json({
      rule: {
        id: rule.id,
        isActive: rule.isActive,
        rotationAgents,
        lastAssignedIndex: rule.lastAssignedIndex,
      },
    });
  } catch {
    return NextResponse.json({ rule: null });
  }
}

export async function PATCH(req) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  try {
    const body = await req.json();
    const data = {};
    if ("isActive" in body) data.isActive = !!body.isActive;
    if (Array.isArray(body.rotationAgents)) {
      data.rotationAgentsJson = JSON.stringify(body.rotationAgents);
      data.lastAssignedIndex = -1;
    }
    const rule = await prisma.autoAssignRule.update({ where: { id: "default" }, data });
    return NextResponse.json({ success: true, rule });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
