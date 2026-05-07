import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFull } from "@/lib/auth";
import { getPublicKey } from "@/lib/push";

export async function GET() {
  return NextResponse.json({ publicKey: getPublicKey() });
}

export async function POST(req) {
  const user = await getCurrentUserFull();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  try {
    const body = await req.json();
    const { endpoint, keys, device } = body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh: keys.p256dh, authKey: keys.auth, userId: user.id, device: device || null },
      create: {
        userId: user.id,
        endpoint,
        p256dh: keys.p256dh,
        authKey: keys.auth,
        device: device || null,
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const user = await getCurrentUserFull();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  try {
    const body = await req.json();
    const { endpoint } = body;
    if (!endpoint) return NextResponse.json({ error: "endpoint required" }, { status: 400 });
    await prisma.pushSubscription.deleteMany({ where: { endpoint, userId: user.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
