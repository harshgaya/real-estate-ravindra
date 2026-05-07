const BASE = process.env.BASE_URL || "http://localhost:3001";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@jyothi.in";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMeBeforeProd";
const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "";
const GOOGLE_KEY = process.env.GOOGLE_LEADS_WEBHOOK_KEY || "";
const CRON_SECRET = process.env.CRON_SECRET || "";

const RUN_ID = Date.now().toString().slice(-6);

let cookie = "";
const created = {};
let pass = 0,
  fail = 0,
  skip = 0;

async function api(path, opts = {}) {
  const r = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
      ...(opts.headers || {}),
    },
  });
  const setCookie = r.headers.get("set-cookie");
  if (setCookie) {
    const sessionCookie = setCookie
      .split(",")
      .find((c) => c.includes("session"));
    if (sessionCookie) cookie = sessionCookie.split(";")[0].trim();
  }
  const text = await r.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text.slice(0, 300);
  }
  return { status: r.status, ok: r.ok, body };
}

function log(name, ok, info = "") {
  const icon = ok === "skip" ? "⊘" : ok ? "✓" : "✗";
  const pad = name.padEnd(50);
  console.log(`${icon} ${pad} ${info}`);
  if (ok === "skip") skip++;
  else if (ok) pass++;
  else fail++;
}

async function step(name, fn) {
  try {
    const result = await fn();
    if (result === "skip") return log(name, "skip", "(prereqs missing)");
    log(name, true, result || "");
    return true;
  } catch (err) {
    log(name, false, err.message);
    return false;
  }
}

async function expect(condition, message) {
  if (!condition) throw new Error(message || "assertion failed");
}

(async () => {
  console.log(`\n=== Smoke test against ${BASE} ===\n`);
  console.log(`RUN_ID: ${RUN_ID}\n`);

  // ============ AUTH ============
  await step("Login as admin", async () => {
    const r = await api("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    expect(r.ok, `${r.status} ${JSON.stringify(r.body)}`);
    expect(cookie, "no session cookie set");
    return `cookie set`;
  });

  await step("GET /me returns admin", async () => {
    const r = await api("/api/admin/me");
    expect(r.ok && r.body.user?.role === "admin", `got ${r.body.user?.role}`);
    return `${r.body.user.email} (${r.body.user.role})`;
  });

  // ============ READ-ONLY LISTS ============
  for (const path of [
    "/api/admin/dashboard",
    "/api/admin/leads?limit=10",
    "/api/admin/properties",
    "/api/admin/projects",
    "/api/admin/users",
    "/api/admin/settings",
    "/api/admin/templates",
    "/api/admin/testimonials",
    "/api/admin/tasks",
    "/api/admin/bookings",
    "/api/admin/site-visits",
    "/api/admin/notifications",
    "/api/admin/reports",
    "/api/admin/autoassign",
  ]) {
    await step(`GET ${path}`, async () => {
      const r = await api(path);
      expect(r.ok, `${r.status} ${JSON.stringify(r.body).slice(0, 200)}`);
      return `${r.status}`;
    });
  }

  // ============ PUBLIC ENDPOINTS ============
  for (const path of [
    "/api/properties",
    "/api/projects",
    "/api/testimonials",
    "/api/settings",
  ]) {
    await step(`GET ${path} (public)`, async () => {
      const r = await fetch(`${BASE}${path}`);
      expect(r.ok, `${r.status}`);
      return `${r.status}`;
    });
  }

  // ============ USER CRUD ============
  await step("Create test user (manager)", async () => {
    const r = await api("/api/admin/users", {
      method: "POST",
      body: JSON.stringify({
        name: `Test Manager ${RUN_ID}`,
        email: `manager${RUN_ID}@test.local`,
        password: "TestPass123!",
        role: "manager",
        phone: "9999900001",
      }),
    });
    expect(r.ok, JSON.stringify(r.body));
    created.userId = r.body.user.id;
    return `id=${created.userId}`;
  });

  await step("Update user designation", async () => {
    const r = await api(`/api/admin/users/${created.userId}`, {
      method: "PATCH",
      body: JSON.stringify({ designation: "Senior Sales Manager" }),
    });
    expect(r.ok, JSON.stringify(r.body));
    return "patched";
  });

  // ============ PROPERTY CRUD ============
  await step("Create test property", async () => {
    const r = await api("/api/admin/properties", {
      method: "POST",
      body: JSON.stringify({
        name: `Smoke Test Tower ${RUN_ID}`,
        location: "Whitefield, Bengaluru",
        city: "bengaluru",
        type: "apartment",
        bedrooms: 3,
        priceMin: 8000000,
        priceMax: 12000000,
      }),
    });
    expect(r.ok, JSON.stringify(r.body).slice(0, 200));
    created.propertyId = r.body.property.id;
    return `id=${created.propertyId}`;
  });

  await step("Update property featured flag", async () => {
    const r = await api(`/api/admin/properties/${created.propertyId}`, {
      method: "PATCH",
      body: JSON.stringify({ isFeatured: true }),
    });
    expect(r.ok);
    return "patched";
  });

  // ============ PROJECT CRUD ============
  await step("Create test project", async () => {
    const r = await api("/api/admin/projects", {
      method: "POST",
      body: JSON.stringify({
        name: `Smoke Project ${RUN_ID}`,
        location: "HSR Layout, Bengaluru",
        city: "bengaluru",
        priceMin: 5000000,
        priceMax: 15000000,
      }),
    });
    expect(r.ok, JSON.stringify(r.body).slice(0, 200));
    created.projectId = r.body.project.id;
    return `id=${created.projectId}`;
  });

  // ============ TESTIMONIAL CRUD ============
  await step("Create testimonial", async () => {
    const r = await api("/api/admin/testimonials", {
      method: "POST",
      body: JSON.stringify({
        customerName: `Test Customer ${RUN_ID}`,
        text: "Great service throughout the buying process.",
        rating: 5,
        type: "text",
        isFeatured: true,
        isActive: true,
      }),
    });
    expect(r.ok, JSON.stringify(r.body));
    created.testimonialId = r.body.testimonial.id;
    return `id=${created.testimonialId}`;
  });

  // ============ TEMPLATE CRUD ============
  await step("Create template", async () => {
    const r = await api("/api/admin/templates", {
      method: "POST",
      body: JSON.stringify({
        name: `Smoke WhatsApp ${RUN_ID}`,
        channel: "whatsapp",
        category: "welcome",
        body: "Hi {{lead.firstName}}, thanks for showing interest in {{property.name}}. - {{site.name}}",
      }),
    });
    expect(r.ok, JSON.stringify(r.body));
    created.templateId = r.body.template.id;
    return `id=${created.templateId}`;
  });

  // ============ LEAD CRUD (admin manual) ============
  await step("Create lead (admin manual)", async () => {
    const r = await api("/api/admin/leads", {
      method: "POST",
      body: JSON.stringify({
        firstName: "SmokeAdmin",
        lastName: RUN_ID,
        primaryPhone: "9876543201",
        primaryEmail: `admin-lead-${RUN_ID}@test.local`,
        source: "Manual",
        propertyId: created.propertyId,
        budgetMin: 8000000,
        budgetMax: 12000000,
      }),
    });
    expect(r.ok, JSON.stringify(r.body));
    created.leadId = r.body.lead.id;
    return `id=${created.leadId}`;
  });

  await step("GET lead detail with relations", async () => {
    const r = await api(`/api/admin/leads/${created.leadId}`);
    expect(r.ok && r.body.lead, JSON.stringify(r.body));
    expect(r.body.lead.activities?.length > 0, "no activity logged");
    return `${r.body.lead.activities.length} activities`;
  });

  await step("Patch lead status to contacted", async () => {
    const r = await api(`/api/admin/leads/${created.leadId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "contacted", temperature: "warm" }),
    });
    expect(r.ok);
    return "patched";
  });

  await step("Add note activity to lead", async () => {
    const r = await api(`/api/admin/leads/${created.leadId}/activities`, {
      method: "POST",
      body: JSON.stringify({
        type: "note",
        title: "Note",
        body: "Smoke test note",
      }),
    });
    expect(r.ok, JSON.stringify(r.body));
    return "logged";
  });

  // ============ PUBLIC LEAD CAPTURE ============
  await step("Public lead capture (website form)", async () => {
    const r = await fetch(`${BASE}/api/leads/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `WebVisitor ${RUN_ID}`,
        phone: "9876543202",
        email: `website-${RUN_ID}@test.local`,
        source: "Website",
        message: "Interested in 3 BHK",
      }),
    });
    const body = await r.json();
    expect(r.ok && body.leadId, JSON.stringify(body));
    created.publicLeadId = body.leadId;
    return `id=${created.publicLeadId}`;
  });

  // ============ AUTO-ASSIGN RULE + WEBHOOK TEST ============
  let autoAssignWorks = false;
  await step("Configure auto-assign rotation", async () => {
    const r = await api("/api/admin/autoassign", {
      method: "PATCH",
      body: JSON.stringify({
        isActive: true,
        rotationAgents: [created.userId],
      }),
    });
    expect(r.ok, JSON.stringify(r.body));
    autoAssignWorks = true;
    return "rotation set";
  });

  // ============ META WEBHOOK ============
  await step("Meta webhook GET verify", async () => {
    if (!META_VERIFY_TOKEN) return "skip";
    const r = await fetch(
      `${BASE}/api/webhooks/meta-leads?hub.mode=subscribe&hub.verify_token=${META_VERIFY_TOKEN}&hub.challenge=test_challenge_${RUN_ID}`,
    );
    const text = await r.text();
    expect(
      r.ok && text.includes(`test_challenge_${RUN_ID}`),
      `${r.status} ${text}`,
    );
    return "challenge echoed";
  });

  // Note: Real Meta POST requires fetching from Graph API which won't work without real token
  // We skip POST simulation since it depends on FB Graph response

  // ============ GOOGLE WEBHOOK + AUTO-ASSIGN ============
  await step("Google webhook creates lead", async () => {
    const headers = { "Content-Type": "application/json" };
    if (GOOGLE_KEY) headers["x-google-key"] = GOOGLE_KEY;
    const r = await fetch(`${BASE}/api/webhooks/google-leads`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        google_key: GOOGLE_KEY,
        user_column_data: [
          { column_id: "FULL_NAME", string_value: `Google Lead ${RUN_ID}` },
          { column_id: "PHONE_NUMBER", string_value: "9876543203" },
          { column_id: "EMAIL", string_value: `google-${RUN_ID}@test.local` },
          { column_id: "CITY", string_value: "Bengaluru" },
        ],
        campaign_id: `smoke_campaign_${RUN_ID}`,
      }),
    });
    const body = await r.json();
    expect(r.ok && body.leadId, JSON.stringify(body));
    created.googleLeadId = body.leadId;
    return `id=${created.googleLeadId}`;
  });

  await step("Verify auto-assigned to test manager", async () => {
    if (!autoAssignWorks || !created.googleLeadId) return "skip";
    // wait briefly for async auto-assign
    await new Promise((r) => setTimeout(r, 500));
    const r = await api(`/api/admin/leads/${created.googleLeadId}`);
    expect(r.ok, JSON.stringify(r.body));
    expect(
      r.body.lead.assignedToId === created.userId,
      `assigned to ${r.body.lead.assignedToId}, expected ${created.userId}`,
    );
    return `assigned ✓`;
  });

  // ============ NOTIFICATIONS ============
  await step("Test manager has notification for new lead", async () => {
    if (!created.userId) return "skip";
    // login as the test manager to check their inbox
    const savedCookie = cookie;
    cookie = "";
    const login = await api("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({
        email: `manager${RUN_ID}@test.local`,
        password: "TestPass123!",
      }),
    });
    expect(login.ok, "login as manager failed");
    const notifs = await api("/api/admin/notifications");
    expect(
      notifs.ok && notifs.body.items.some((n) => n.type === "new_lead"),
      "no new_lead notification",
    );
    cookie = savedCookie; // restore admin
    return `${notifs.body.unread} unread`;
  });

  await step("Mark all notifications read (as admin)", async () => {
    // re-login as admin since cookie may have been clobbered
    cookie = "";
    await api("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    const r = await api("/api/admin/notifications", { method: "PATCH" });
    expect(r.ok);
    return "marked";
  });

  // ============ SITE VISITS ============
  await step("Schedule site visit", async () => {
    const r = await api("/api/admin/site-visits", {
      method: "POST",
      body: JSON.stringify({
        leadId: created.leadId,
        propertyId: created.propertyId,
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        durationMins: 60,
        meetingPoint: "Site office, Whitefield",
      }),
    });
    expect(r.ok, JSON.stringify(r.body));
    created.visitId = r.body.visit.id;
    return `id=${created.visitId}`;
  });

  await step("Mark visit completed (auto-progresses lead)", async () => {
    const r = await api(`/api/admin/site-visits/${created.visitId}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: "completed",
        feedback: "Showed interest, wants 3 BHK",
      }),
    });
    expect(r.ok, JSON.stringify(r.body));
    // Verify lead status auto-moved
    const lead = await api(`/api/admin/leads/${created.leadId}`);
    expect(
      lead.body.lead.status === "site_visit_done",
      `status=${lead.body.lead.status}`,
    );
    return "lead -> site_visit_done";
  });

  // ============ TASKS ============
  await step("Create task", async () => {
    const r = await api("/api/admin/tasks", {
      method: "POST",
      body: JSON.stringify({
        title: `Followup ${RUN_ID}`,
        leadId: created.leadId,
        dueAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        priority: "high",
      }),
    });
    expect(r.ok, JSON.stringify(r.body));
    created.taskId = r.body.task.id;
    return `id=${created.taskId}`;
  });

  await step("Complete task", async () => {
    const r = await api(`/api/admin/tasks/${created.taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "done" }),
    });
    expect(r.ok);
    return "done";
  });

  // ============ BOOKINGS ============
  await step("Create booking (auto-progresses lead to booked)", async () => {
    const r = await api("/api/admin/bookings", {
      method: "POST",
      body: JSON.stringify({
        leadId: created.leadId,
        propertyId: created.propertyId,
        unitNumber: "A-1201",
        configuration: "3 BHK",
        totalValue: 10500000,
        bookingAmount: 500000,
        amountReceived: 500000,
        paymentMode: "NEFT",
      }),
    });
    expect(r.ok, JSON.stringify(r.body));
    created.bookingId = r.body.booking.id;
    expect(r.body.booking.bookingNumber, "no booking number");
    const lead = await api(`/api/admin/leads/${created.leadId}`);
    expect(
      lead.body.lead.status === "booked",
      `status=${lead.body.lead.status}`,
    );
    return `${r.body.booking.bookingNumber}, lead -> booked`;
  });

  // ============ SETTINGS UPDATE ============
  await step("Update settings", async () => {
    const r = await api("/api/admin/settings", {
      method: "PATCH",
      body: JSON.stringify({ site_name: `Smoke Test Site ${RUN_ID}` }),
    });
    expect(r.ok, JSON.stringify(r.body));
    return "updated";
  });

  await step("Verify public settings reflect change", async () => {
    const r = await fetch(`${BASE}/api/settings`);
    const body = await r.json();
    expect(
      body.settings.site_name === `Smoke Test Site ${RUN_ID}`,
      `got ${body.settings.site_name}`,
    );
    return "synced";
  });

  // ============ CRON ============
  await step("Cron tick", async () => {
    const headers = {};
    if (CRON_SECRET) headers["Authorization"] = `Bearer ${CRON_SECRET}`;
    const r = await fetch(`${BASE}/api/cron/tick`, { headers });
    expect(r.ok, `${r.status}`);
    const body = await r.json();
    return `reminders=${body.siteVisitReminders || 0} overdue=${body.taskOverdueReminders || 0}`;
  });

  // ============ S3 PRESIGN ============
  await step("S3 presign URL", async () => {
    const r = await api("/api/admin/s3", {
      method: "POST",
      body: JSON.stringify({
        filename: "test.png",
        contentType: "image/png",
        folder: "properties",
      }),
    });
    if (r.body?.error?.includes("not configured")) return "skip";
    expect(r.ok && r.body.uploadUrl, JSON.stringify(r.body));
    return "url returned";
  });

  // ============ CLEANUP ============
  console.log("\n--- Cleanup ---\n");

  await step("Delete booking via DB (no API)", async () => "skip");

  if (created.taskId) {
    await step("Delete task", async () => {
      const r = await api(`/api/admin/tasks/${created.taskId}`, {
        method: "DELETE",
      });
      expect(r.ok);
      return "deleted";
    });
  }

  if (created.visitId) {
    await step("Delete site visit", async () => {
      const r = await api(`/api/admin/site-visits/${created.visitId}`, {
        method: "DELETE",
      });
      expect(r.ok);
      return "deleted";
    });
  }

  if (created.testimonialId) {
    await step("Delete testimonial", async () => {
      const r = await api(`/api/admin/testimonials/${created.testimonialId}`, {
        method: "DELETE",
      });
      expect(r.ok);
      return "deleted";
    });
  }

  if (created.templateId) {
    await step("Delete template", async () => {
      const r = await api(`/api/admin/templates/${created.templateId}`, {
        method: "DELETE",
      });
      expect(r.ok);
      return "deleted";
    });
  }

  if (created.propertyId) {
    await step("Soft-delete property", async () => {
      const r = await api(`/api/admin/properties/${created.propertyId}`, {
        method: "DELETE",
      });
      expect(r.ok);
      return "deactivated";
    });
  }

  if (created.projectId) {
    await step("Soft-delete project", async () => {
      const r = await api(`/api/admin/projects/${created.projectId}`, {
        method: "DELETE",
      });
      expect(r.ok);
      return "deactivated";
    });
  }

  if (created.leadId) {
    await step("Delete lead", async () => {
      const r = await api(`/api/admin/leads/${created.leadId}`, {
        method: "DELETE",
      });
      expect(r.ok);
      return "deleted";
    });
  }
  if (created.publicLeadId) {
    await step("Delete public lead", async () => {
      const r = await api(`/api/admin/leads/${created.publicLeadId}`, {
        method: "DELETE",
      });
      expect(r.ok);
      return "deleted";
    });
  }
  if (created.googleLeadId) {
    await step("Delete google lead", async () => {
      const r = await api(`/api/admin/leads/${created.googleLeadId}`, {
        method: "DELETE",
      });
      expect(r.ok);
      return "deleted";
    });
  }

  if (created.userId) {
    await step("Deactivate test user", async () => {
      const r = await api(`/api/admin/users/${created.userId}`, {
        method: "DELETE",
      });
      expect(r.ok);
      return "deactivated";
    });
  }

  // Reset auto-assign
  await step("Reset auto-assign", async () => {
    const r = await api("/api/admin/autoassign", {
      method: "PATCH",
      body: JSON.stringify({ isActive: false, rotationAgents: [] }),
    });
    expect(r.ok);
    return "disabled";
  });

  // ============ LOGOUT ============
  await step("Logout", async () => {
    const r = await api("/api/admin/logout", { method: "POST" });
    expect(r.ok);
    return "ok";
  });

  console.log(
    `\n=== Result: ${pass} passed, ${fail} failed, ${skip} skipped ===\n`,
  );
  process.exit(fail > 0 ? 1 : 0);
})().catch((err) => {
  console.error("\nFATAL:", err);
  process.exit(1);
});
