import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  if (!prisma) return NextResponse.json({ items: [] });
  try {
    const { searchParams } = new URL(req.url);
    const channel = searchParams.get("channel");
    const where = {};
    if (channel) where.channel = channel;
    const items = await prisma.template.findMany({
      where,
      orderBy: [{ channel: "asc" }, { displayOrder: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  try {
    const body = await req.json();
    if (!body.name || !body.channel || !body.body) {
      return NextResponse.json({ error: "Name, channel, and body required" }, { status: 400 });
    }
    const t = await prisma.template.create({
      data: {
        name: String(body.name).slice(0, 200),
        channel: body.channel,
        category: body.category || "other",
        subject: body.subject || null,
        body: body.body,
        isActive: body.isActive !== false,
      },
    });
    return NextResponse.json({ success: true, template: t });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
