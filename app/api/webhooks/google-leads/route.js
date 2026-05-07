import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { autoAssignLead } from "@/lib/auto-assign";

const SECRET = process.env.GOOGLE_LEADS_WEBHOOK_KEY || "";

function getValue(answers, columnIds) {
  if (!Array.isArray(answers)) return null;
  for (const c of columnIds) {
    const a = answers.find((x) => x.column_id === c);
    if (a?.string_value) return a.string_value;
  }
  return null;
}

export async function POST(req) {
  if (!prisma)
    return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  try {
    const body = await req.json();

    if (SECRET) {
      const provided =
        body.google_key || body.key || req.headers.get("x-google-key");
      if (provided !== SECRET)
        return NextResponse.json({ error: "Invalid key" }, { status: 401 });
    }

    const answers = body.user_column_data || body.lead_field_array || [];

    const fullName =
      getValue(answers, ["FULL_NAME", "FIRST_NAME"]) ||
      body.full_name ||
      "Unknown";
    const phoneRaw =
      getValue(answers, ["PHONE_NUMBER"]) || body.phone_number || "";
    const phone = phoneRaw.replace(/\D/g, "").slice(-10);
    const email = (
      getValue(answers, ["EMAIL"]) ||
      body.email ||
      ""
    ).toLowerCase();
    const city = getValue(answers, ["CITY"]) || null;

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }

    const recent = await prisma.lead.findFirst({
      where: {
        primaryPhone: phone,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: "desc" },
    });

    if (recent) {
      await prisma.leadActivity.create({
        data: {
          leadId: recent.id,
          type: "system",
          title: "Re-inquired via Google Ads (within 24h)",
          body: `Campaign: ${body.campaign_id || "unknown"}`,
        },
      });
      await prisma.lead.update({
        where: { id: recent.id },
        data: { lastActivityAt: new Date() },
      });
      return NextResponse.json({ ok: true, leadId: recent.id, merged: true });
    }

    const existsAny = await prisma.lead.findFirst({
      where: { primaryPhone: phone },
      select: { id: true },
    });
    const isDuplicate = !!existsAny;

    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ") || null;

    const lead = await prisma.lead.create({
      data: {
        firstName: firstName || "Unknown",
        lastName,
        name: fullName,
        primaryPhone: phone,
        primaryEmail: email || `${phone}@noemail.local`,
        source: "Google Ads",
        subSource: body.campaign_id || body.gcl_id || null,
        utmCampaign: body.campaign_id || null,
        cityPref: city,
        status: "new",
        isDuplicate,
        lastActivityAt: new Date(),
        activities: {
          create: {
            type: "system",
            title: isDuplicate
              ? "Repeat customer - new lead from Google Ads"
              : "Lead from Google Ads lead form",
          },
        },
      },
    });
    await autoAssignLead(lead.id);

    return NextResponse.json({ ok: true, leadId: lead.id, isDuplicate });
  } catch (err) {
    console.error("[GOOGLE WEBHOOK]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
