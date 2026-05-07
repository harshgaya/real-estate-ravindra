import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { autoAssignLead } from "@/lib/auto-assign";

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "";
const PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || "";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

async function fetchLeadDetails(leadgenId) {
  if (!PAGE_ACCESS_TOKEN) return null;
  try {
    const url = `https://graph.facebook.com/v18.0/${leadgenId}?access_token=${PAGE_ACCESS_TOKEN}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function getField(fields, names) {
  if (!Array.isArray(fields)) return null;
  for (const name of names) {
    const f = fields.find((x) => x.name?.toLowerCase().includes(name));
    if (f && f.values?.[0]) return f.values[0];
  }
  return null;
}

export async function POST(req) {
  if (!prisma)
    return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  try {
    const body = await req.json();
    if (body.object !== "page") return NextResponse.json({ ok: true });

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field !== "leadgen") continue;
        const leadgenId = change.value?.leadgen_id;
        if (!leadgenId) continue;

        const details = await fetchLeadDetails(leadgenId);
        if (!details) continue;

        const fields = details.field_data || [];
        const fullName = getField(fields, ["full_name", "name"]) || "Unknown";
        const phone = (getField(fields, ["phone_number", "phone"]) || "")
          .replace(/\D/g, "")
          .slice(-10);
        const email = (getField(fields, ["email"]) || "").toLowerCase();
        const city = getField(fields, ["city"]) || null;

        if (!phone || !/^[6-9]\d{9}$/.test(phone)) continue;

        const [firstName, ...rest] = fullName.split(" ");
        const lastName = rest.join(" ") || null;

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
              title: "Re-inquired via Facebook ad (within 24h)",
              body: change.value?.form_id
                ? `Form: ${change.value.form_id}`
                : null,
            },
          });
          await prisma.lead.update({
            where: { id: recent.id },
            data: { lastActivityAt: new Date() },
          });
          continue;
        }

        const existsAny = await prisma.lead.findFirst({
          where: { primaryPhone: phone },
          select: { id: true },
        });
        const isDuplicate = !!existsAny;

        const lead = await prisma.lead.create({
          data: {
            firstName: firstName || "Unknown",
            lastName,
            name: fullName,
            primaryPhone: phone,
            primaryEmail: email || `${phone}@noemail.local`,
            source: "Facebook",
            subSource: change.value?.form_id || null,
            cityPref: city,
            status: "new",
            isDuplicate,
            lastActivityAt: new Date(),
            activities: {
              create: {
                type: "system",
                title: isDuplicate
                  ? "Repeat customer - new lead from Facebook ad"
                  : "Lead from Facebook lead ad",
              },
            },
          },
        });
        await autoAssignLead(lead.id);
      }
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[META WEBHOOK]", err);
    return NextResponse.json({ ok: true });
  }
}
