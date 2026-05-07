import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const { id } = await params;
  try {
    const body = await req.json();
    const data = {};
    const allowed = ["name", "channel", "category", "subject", "body", "isActive", "displayOrder"];
    for (const f of allowed) if (f in body) data[f] = body[f];
    const t = await prisma.template.update({ where: { id }, data });
    return NextResponse.json({ success: true, template: t });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const { id } = await params;
  try {
    await prisma.template.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
