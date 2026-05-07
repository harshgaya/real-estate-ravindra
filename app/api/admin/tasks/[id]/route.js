import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const { id } = await params;
  try {
    const body = await req.json();
    const data = {};
    const allowed = ["title", "description", "type", "dueAt", "priority", "status", "assignedToId", "completionNotes"];
    for (const f of allowed) {
      if (f in body) {
        if (f === "dueAt") data[f] = body[f] ? new Date(body[f]) : null;
        else data[f] = body[f] === "" ? null : body[f];
      }
    }
    if (body.status === "done") data.completedAt = new Date();
    const task = await prisma.task.update({ where: { id }, data });
    return NextResponse.json({ success: true, task });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const { id } = await params;
  try {
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
