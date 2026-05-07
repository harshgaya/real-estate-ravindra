import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { VALIDATION, LEAD_SOURCES } from "@/lib/constants";
import { autoAssignLead } from "@/lib/auto-assign";

const sanitize = (s, m = 500) =>
  String(s || "")
    .trim()
    .slice(0, m);
const isPhone = (p) =>
  VALIDATION.phoneRegex.test(
    String(p || "")
      .replace(/\D/g, "")
      .slice(-10),
  );
const isEmail = (e) => VALIDATION.emailRegex.test(String(e || ""));

export async function POST(req) {
  try {
    const body = await req.json();

    const fullName = sanitize(body.name, 100);
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ") || null;

    const phone = sanitize(body.phone).replace(/\D/g, "").slice(-10);
    const email = sanitize(body.email, 200).toLowerCase();
    const source = sanitize(body.source, 100) || LEAD_SOURCES.WEBSITE;

    if (!fullName || fullName.length < VALIDATION.minNameLength) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!isPhone(phone)) {
      return NextResponse.json(
        { error: "Valid 10-digit Indian mobile required" },
        { status: 400 },
      );
    }
    if (!isEmail(email)) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 },
      );
    }

    if (!prisma) {
      return NextResponse.json({
        success: true,
        leadId: crypto.randomUUID(),
        warning: "Database not connected",
      });
    }

    const propertySlug = sanitize(body.propertySlug, 200) || null;
    let propertyId = null,
      projectId = null;
    if (propertySlug) {
      const [p, pr] = await Promise.all([
        prisma.property.findUnique({
          where: { slug: propertySlug },
          select: { id: true },
        }),
        prisma.project.findUnique({
          where: { slug: propertySlug },
          select: { id: true },
        }),
      ]);
      if (p) propertyId = p.id;
      else if (pr) projectId = pr.id;
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;
    const ua = req.headers.get("user-agent") || null;

    const lead = await prisma.lead.create({
      data: {
        firstName: firstName || fullName,
        lastName,
        name: fullName,
        primaryPhone: phone,
        primaryEmail: email,
        message: sanitize(body.message, 1000) || null,
        source,
        page: sanitize(body.page, 200) || null,
        propertySlug,
        propertyId,
        projectId,
        utmSource: sanitize(body.utmSource, 100) || null,
        utmMedium: sanitize(body.utmMedium, 100) || null,
        utmCampaign: sanitize(body.utmCampaign, 100) || null,
        ipAddress: ip,
        userAgent: ua,
        status: "new",
        lastActivityAt: new Date(),
        activities: {
          create: { type: "system", title: `Lead from ${source}` },
        },
      },
    });

    const assigned = await autoAssignLead(lead.id);

    const recipients = await prisma.user.findMany({
      where: { isActive: true, role: { in: ["admin", "manager"] } },
      select: { id: true },
    });

    const userIds = new Set(recipients.map((u) => u.id));
    if (assigned?.id) userIds.add(assigned.id);

    if (userIds.size > 0) {
      await prisma.notification.createMany({
        data: Array.from(userIds).map((userId) => ({
          userId,
          type: "new_lead",
          title: `New lead: ${fullName}`,
          body: `${source} · ${phone}`,
          link: `/admin/leads/${lead.id}`,
          refType: "lead",
          refId: lead.id,
        })),
      });
    }

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (err) {
    console.error("[LEAD CAPTURE]", err);
    return NextResponse.json(
      { error: "Could not process request" },
      { status: 500 },
    );
  }
}
