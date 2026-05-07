import { NextResponse } from "next/server";
import { getCurrentUserFull } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUserFull();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user });
}
