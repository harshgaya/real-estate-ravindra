import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSettings, clearSettingsCache } from "@/lib/settings";

export async function GET() {
  if (!prisma) return NextResponse.json({ settings: {} });
  try {
    const items = await prisma.setting.findMany();
    const settings = Object.fromEntries(items.map((s) => [s.key, s.value]));
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ settings: {} });
  }
}

export async function PATCH(req) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  try {
    const body = await req.json();
    await setSettings(body);
    clearSettingsCache();
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
