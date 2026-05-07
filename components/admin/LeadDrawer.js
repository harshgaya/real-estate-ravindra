"use client";
import { useState, useEffect } from "react";
import {
  LuX,
  LuPencil,
  LuFileText,
  LuClock,
  LuUpload,
  LuMail,
  LuPhone,
  LuMessageCircle,
  LuSave,
  LuSend,
  LuExternalLink,
} from "react-icons/lu";
import {
  LEAD_STATUSES,
  TEMPERATURES,
  TIMELINES,
  PURPOSES,
  FUNDINGS,
} from "@/lib/constants";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "status", label: "Status" },
  { id: "history", label: "History" },
  { id: "notes", label: "Notes" },
  { id: "documents", label: "Documents" },
];

export default function LeadDrawer({ leadId, intent, onClose, onUpdated }) {
  const [lead, setLead] = useState(null);
  const [tab, setTab] = useState("overview");
  const [composer, setComposer] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!leadId) return;
    fetchLead();
  }, [leadId]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.items || []))
      .catch(() => {});
    fetch("/api/admin/properties")
      .then((r) => r.json())
      .then((d) => setProperties(d.items || []))
      .catch(() => {});
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.items || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!intent) return;
    if (intent.startsWith("compose:")) {
      setComposer({ channel: intent.split(":")[1] });
    } else {
      setTab(intent);
    }
  }, [intent]);

  async function fetchLead() {
    try {
      const r = await fetch(`/api/admin/leads/${leadId}`);
      if (!r.ok) return;
      const d = await r.json();
      setLead(d.lead);
    } catch {}
  }

  async function patch(updates) {
    const r = await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (r.ok) {
      await fetchLead();
      onUpdated?.();
    }
  }

  if (!leadId) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[560px] bg-white z-50 shadow-2xl overflow-hidden flex flex-col">
        {!lead ? (
          <div className="flex-1 grid place-items-center text-sm text-[var(--color-ink-500)]">
            Loading...
          </div>
        ) : (
          <>
            <div className="border-b border-[var(--color-ink-100)]">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--color-ink-500)] uppercase tracking-wider">
                    Lead Preview
                  </p>
                  <h2 className="text-base font-semibold truncate">
                    {lead.name}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 grid place-items-center rounded-lg hover:bg-[var(--color-bg-soft)]"
                >
                  <LuX />
                </button>
              </div>

              <div className="flex items-center gap-1 px-3 pb-3 overflow-x-auto">
                <ActionIcon
                  icon={LuPencil}
                  label="Edit"
                  active={tab === "overview"}
                  onClick={() => setTab("overview")}
                />
                <ActionIcon
                  icon={LuFileText}
                  label="Notes"
                  active={tab === "notes"}
                  onClick={() => setTab("notes")}
                />
                <ActionIcon
                  icon={LuClock}
                  label="History"
                  active={tab === "history"}
                  onClick={() => setTab("history")}
                />
                <ActionIcon
                  icon={LuUpload}
                  label="Upload"
                  active={tab === "documents"}
                  onClick={() => setTab("documents")}
                />
                <ActionIcon
                  icon={LuMail}
                  label="Email"
                  onClick={() => setComposer({ channel: "email" })}
                />
                <ActionIcon
                  icon={LuMessageCircle}
                  label="WhatsApp"
                  onClick={() => setComposer({ channel: "whatsapp" })}
                />
                <ActionIcon
                  icon={LuPhone}
                  label="Call"
                  onClick={() => setComposer({ channel: "call" })}
                />
              </div>

              <div className="px-4 py-2 bg-[var(--color-bg-soft)] grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                <div>
                  <span className="text-[var(--color-ink-500)]">Phone:</span>{" "}
                  <a
                    href={`tel:${lead.primaryPhone}`}
                    className="font-medium text-[var(--color-brand-700)]"
                  >
                    {lead.primaryPhone}
                  </a>
                </div>
                <div className="truncate">
                  <span className="text-[var(--color-ink-500)]">Email:</span>{" "}
                  <span className="font-medium">{lead.primaryEmail}</span>
                </div>
                <div>
                  <span className="text-[var(--color-ink-500)]">Source:</span>{" "}
                  <span className="font-medium">{lead.source}</span>
                </div>
                <div>
                  <span className="text-[var(--color-ink-500)]">Assigned:</span>{" "}
                  <span className="font-medium">
                    {lead.assignedTo?.name || "Unassigned"}
                  </span>
                </div>
                {lead.property && (
                  <div className="col-span-2 truncate">
                    <span className="text-[var(--color-ink-500)]">
                      Property:
                    </span>{" "}
                    <a
                      href={`/properties/${lead.property.slug}`}
                      target="_blank"
                      rel="noopener"
                      className="font-medium text-[var(--color-brand-700)] hover:underline inline-flex items-center gap-1"
                    >
                      {lead.property.name}
                      <LuExternalLink className="text-[10px]" />
                    </a>
                  </div>
                )}
                {lead.project && (
                  <div className="col-span-2 truncate">
                    <span className="text-[var(--color-ink-500)]">
                      Project:
                    </span>{" "}
                    <a
                      href={`/projects/${lead.project.slug}`}
                      target="_blank"
                      rel="noopener"
                      className="font-medium text-[var(--color-brand-700)] hover:underline inline-flex items-center gap-1"
                    >
                      {lead.project.name}
                      <LuExternalLink className="text-[10px]" />
                    </a>
                  </div>
                )}
              </div>

              <div className="flex border-t border-[var(--color-ink-100)] overflow-x-auto">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 ${
                      tab === t.id
                        ? "border-[var(--color-brand-700)] text-[var(--color-brand-700)]"
                        : "border-transparent text-[var(--color-ink-600)]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {tab === "overview" && (
                <OverviewTab
                  lead={lead}
                  users={users}
                  properties={properties}
                  projects={projects}
                  onSave={patch}
                />
              )}
              {tab === "status" && <StatusTab lead={lead} onSave={patch} />}
              {tab === "history" && (
                <HistoryTab activities={lead.activities || []} />
              )}
              {tab === "notes" && <NotesTab lead={lead} onAdded={fetchLead} />}
              {tab === "documents" && (
                <DocsTab lead={lead} onChanged={fetchLead} />
              )}
            </div>
          </>
        )}
      </div>

      {composer && lead && (
        <Composer
          lead={lead}
          channel={composer.channel}
          properties={properties}
          projects={projects}
          onClose={() => setComposer(null)}
          onSent={fetchLead}
        />
      )}
    </>
  );
}

function ActionIcon({ icon: Icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg flex-shrink-0 ${
        active
          ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
          : "hover:bg-[var(--color-bg-soft)]"
      }`}
    >
      <Icon
        className={`text-base ${active ? "text-[var(--color-brand-700)]" : "text-[var(--color-ink-700)]"}`}
      />
      <span
        className={`text-[10px] ${active ? "text-[var(--color-brand-700)] font-medium" : "text-[var(--color-ink-600)]"}`}
      >
        {label}
      </span>
    </button>
  );
}

function OverviewTab({ lead, users, properties, projects, onSave }) {
  const [form, setForm] = useState({
    firstName: lead.firstName || "",
    lastName: lead.lastName || "",
    primaryPhone: lead.primaryPhone || "",
    secondaryPhone: lead.secondaryPhone || "",
    primaryEmail: lead.primaryEmail || "",
    alternateEmail: lead.alternateEmail || "",
    bhkPreference: lead.bhkPreference || "",
    cityPref: lead.cityPref || "",
    timeline: lead.timeline || "",
    purpose: lead.purpose || "",
    funding: lead.funding || "",
    budgetMin: lead.budgetMin || "",
    budgetMax: lead.budgetMax || "",
    occupation: lead.occupation || "",
    propertyId: lead.propertyId || "",
    projectId: lead.projectId || "",
    assignedToId: lead.assignedToId || "",
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="First name"
          value={form.firstName}
          onChange={(v) => setForm({ ...form, firstName: v })}
        />
        <Field
          label="Last name"
          value={form.lastName}
          onChange={(v) => setForm({ ...form, lastName: v })}
        />
        <Field
          label="Primary phone"
          value={form.primaryPhone}
          onChange={(v) => setForm({ ...form, primaryPhone: v })}
        />
        <Field
          label="Secondary phone"
          value={form.secondaryPhone}
          onChange={(v) => setForm({ ...form, secondaryPhone: v })}
        />
        <Field
          label="Email"
          value={form.primaryEmail}
          onChange={(v) => setForm({ ...form, primaryEmail: v })}
        />
        <Field
          label="Alt email"
          value={form.alternateEmail}
          onChange={(v) => setForm({ ...form, alternateEmail: v })}
        />
        <Field
          label="BHK"
          value={form.bhkPreference}
          onChange={(v) => setForm({ ...form, bhkPreference: v })}
        />
        <Field
          label="City"
          value={form.cityPref}
          onChange={(v) => setForm({ ...form, cityPref: v })}
        />
        <Field
          label="Budget min"
          value={form.budgetMin}
          onChange={(v) => setForm({ ...form, budgetMin: v })}
        />
        <Field
          label="Budget max"
          value={form.budgetMax}
          onChange={(v) => setForm({ ...form, budgetMax: v })}
        />
        <Select
          label="Timeline"
          value={form.timeline}
          onChange={(v) => setForm({ ...form, timeline: v })}
          options={TIMELINES}
        />
        <Select
          label="Purpose"
          value={form.purpose}
          onChange={(v) => setForm({ ...form, purpose: v })}
          options={PURPOSES}
        />
        <Select
          label="Funding"
          value={form.funding}
          onChange={(v) => setForm({ ...form, funding: v })}
          options={FUNDINGS}
        />
        <Field
          label="Occupation"
          value={form.occupation}
          onChange={(v) => setForm({ ...form, occupation: v })}
        />
        <Select
          label="Property"
          value={form.propertyId}
          onChange={(v) => setForm({ ...form, propertyId: v })}
          options={[
            { value: "", label: "None" },
            ...(properties || []).map((p) => ({ value: p.id, label: p.name })),
          ]}
        />
        <Select
          label="Project"
          value={form.projectId}
          onChange={(v) => setForm({ ...form, projectId: v })}
          options={[
            { value: "", label: "None" },
            ...(projects || []).map((p) => ({ value: p.id, label: p.name })),
          ]}
        />
        <Select
          label="Assigned"
          value={form.assignedToId}
          onChange={(v) => setForm({ ...form, assignedToId: v })}
          options={[
            { value: "", label: "Unassigned" },
            ...(users || []).map((u) => ({ value: u.id, label: u.name })),
          ]}
        />
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="w-full mt-3 py-2.5 rounded-lg bg-[var(--color-brand-700)] hover:bg-[var(--color-brand-800)] disabled:opacity-60 text-white text-sm font-medium flex items-center justify-center gap-2"
      >
        <LuSave />
        {saving ? "Saving..." : "Save changes"}
      </button>
    </div>
  );
}

function StatusTab({ lead, onSave }) {
  const [status, setStatus] = useState(lead.status);
  const [temperature, setTemperature] = useState(lead.temperature || "");
  const [lostReason, setLostReason] = useState(lead.lostReason || "");
  const [nextFollowupAt, setNextFollowupAt] = useState(
    lead.nextFollowupAt
      ? new Date(lead.nextFollowupAt).toISOString().slice(0, 16)
      : "",
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await onSave({
      status,
      temperature,
      lostReason: lostReason || null,
      nextFollowupAt: nextFollowupAt || null,
    });
    setSaving(false);
  };

  const showLostReason = ["lost", "dropped", "not_interested"].includes(status);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium mb-2">Status</label>
        <div className="grid grid-cols-2 gap-2">
          {LEAD_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value)}
              className={`px-3 py-2 text-xs rounded-lg border ${
                status === s.value
                  ? "bg-[var(--color-brand-700)] border-[var(--color-brand-700)] text-white font-medium"
                  : "border-[var(--color-ink-200)] hover:border-[var(--color-brand-600)]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-2">Temperature</label>
        <div className="grid grid-cols-3 gap-2">
          {TEMPERATURES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTemperature(t.value)}
              className={`px-3 py-2 text-xs rounded-lg border ${
                temperature === t.value
                  ? "bg-[var(--color-brand-700)] border-[var(--color-brand-700)] text-white font-medium"
                  : "border-[var(--color-ink-200)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {showLostReason && (
        <Field
          label="Lost / drop reason"
          value={lostReason}
          onChange={setLostReason}
        />
      )}
      <div>
        <label className="block text-xs font-medium mb-1.5">
          Next follow-up
        </label>
        <input
          type="datetime-local"
          value={nextFollowupAt}
          onChange={(e) => setNextFollowupAt(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
        />
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="w-full py-2.5 rounded-lg bg-[var(--color-brand-700)] hover:bg-[var(--color-brand-800)] disabled:opacity-60 text-white text-sm font-medium"
      >
        {saving ? "Saving..." : "Save status"}
      </button>
    </div>
  );
}

function HistoryTab({ activities }) {
  if (activities.length === 0)
    return (
      <p className="text-sm text-[var(--color-ink-500)] text-center py-8">
        No activity yet
      </p>
    );
  return (
    <div className="space-y-3">
      {activities.map((a) => (
        <div
          key={a.id}
          className="border-l-2 border-[var(--color-brand-300)] pl-3 pb-2"
        >
          <p className="text-sm font-medium">{a.title}</p>
          {a.body && (
            <p className="text-xs text-[var(--color-ink-600)] mt-0.5 whitespace-pre-wrap">
              {a.body}
            </p>
          )}
          <p className="text-[10px] text-[var(--color-ink-500)] mt-1">
            {a.user?.name || "System"} ·{" "}
            {new Date(a.createdAt).toLocaleString("en-IN")}
          </p>
        </div>
      ))}
    </div>
  );
}

function NotesTab({ lead, onAdded }) {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const notes = (lead.activities || []).filter((a) => a.type === "note");

  const submit = async () => {
    if (!text.trim()) return;
    setSaving(true);
    await fetch(`/api/admin/leads/${lead.id}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "note", title: "Note", body: text }),
    });
    setText("");
    setSaving(false);
    onAdded?.();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Add a note..."
          className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
        />
        <button
          onClick={submit}
          disabled={!text.trim() || saving}
          className="self-end px-4 py-2 rounded-lg bg-[var(--color-brand-700)] disabled:opacity-50 text-white text-xs font-medium"
        >
          {saving ? "Saving..." : "Add note"}
        </button>
      </div>
      <div className="space-y-2">
        {notes.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-500)] text-center py-4">
            No notes yet
          </p>
        ) : (
          notes.map((n) => (
            <div
              key={n.id}
              className="p-3 bg-[var(--color-bg-soft)] rounded-lg"
            >
              <p className="text-sm whitespace-pre-wrap">{n.body}</p>
              <p className="text-[10px] text-[var(--color-ink-500)] mt-1.5">
                {n.user?.name || "Unknown"} ·{" "}
                {new Date(n.createdAt).toLocaleString("en-IN")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DocsTab({ lead, onChanged }) {
  const [docs, setDocs] = useState(lead.documents || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const presign = await fetch("/api/admin/s3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder: "documents",
        }),
      });
      if (!presign.ok) {
        const d = await presign.json().catch(() => ({}));
        throw new Error(d.error || "S3 not configured");
      }
      const { uploadUrl, publicUrl } = await presign.json();

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error("Upload failed"));
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(file);
      });

      const save = await fetch(`/api/admin/leads/${lead.id}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          fileUrl: publicUrl,
          fileSize: file.size,
          mimeType: file.type,
          type: file.type.startsWith("image/")
            ? "image"
            : file.type === "application/pdf"
              ? "pdf"
              : "other",
        }),
      });
      const d = await save.json();
      if (!save.ok) throw new Error(d.error || "Failed to save");
      setDocs((prev) => [d.document, ...prev]);
      onChanged?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function remove(docId) {
    if (!confirm("Delete this document?")) return;
    await fetch(`/api/admin/leads/${lead.id}/documents?docId=${docId}`, {
      method: "DELETE",
    });
    setDocs((prev) => prev.filter((d) => d.id !== docId));
    onChanged?.();
  }

  return (
    <div className="space-y-3">
      <label className="block">
        <input
          type="file"
          onChange={handleFile}
          disabled={uploading}
          className="hidden"
        />
        <span className="block w-full px-4 py-6 border-2 border-dashed border-[var(--color-ink-200)] rounded-lg hover:border-[var(--color-brand-600)] cursor-pointer text-center">
          <LuUpload className="text-2xl mx-auto mb-1.5 text-[var(--color-ink-500)]" />
          <span className="text-sm text-[var(--color-ink-700)]">
            {uploading ? "Uploading..." : "Click to upload document"}
          </span>
          <span className="block text-[11px] text-[var(--color-ink-500)] mt-1">
            PDF, images, any file
          </span>
        </span>
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}

      {docs.length === 0 ? (
        <p className="text-sm text-[var(--color-ink-500)] text-center py-4">
          No documents yet
        </p>
      ) : (
        <div className="space-y-2">
          {docs.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-3 p-3 bg-[var(--color-bg-soft)] rounded-lg"
            >
              <LuFileText className="text-lg flex-shrink-0 text-[var(--color-ink-500)]" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{d.filename}</p>
                <p className="text-[11px] text-[var(--color-ink-500)]">
                  {d.type} · {Math.round((d.fileSize || 0) / 1024)} KB ·{" "}
                  {new Date(d.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <a
                href={d.fileUrl}
                target="_blank"
                rel="noopener"
                className="text-xs text-[var(--color-brand-700)] font-medium px-2"
              >
                View
              </a>
              <button
                onClick={() => remove(d.id)}
                className="w-7 h-7 grid place-items-center rounded text-red-600 hover:bg-red-50"
              >
                <LuX />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Composer({ lead, channel, properties, projects, onClose, onSent }) {
  const [templates, setTemplates] = useState([]);
  const [templateId, setTemplateId] = useState("");
  const [propertyId, setPropertyId] = useState(lead.propertyId || "");
  const [projectId, setProjectId] = useState(lead.projectId || "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [phone, setPhone] = useState(lead.primaryPhone);
  const [callOutcome, setCallOutcome] = useState("connected");
  const [callDuration, setCallDuration] = useState("");

  useEffect(() => {
    fetch(`/api/admin/templates?channel=${channel}`)
      .then((r) => r.json())
      .then((d) => setTemplates(d.items || []));
  }, [channel]);

  const applyTemplate = (id) => {
    setTemplateId(id);
    const t = templates.find((x) => x.id === id);
    if (!t) return;
    if (t.subject) setSubject(t.subject);
    let b = t.body;
    const prop = (properties || []).find((p) => p.id === propertyId);
    const proj = (projects || []).find((p) => p.id === projectId);
    const item = prop || proj;
    const itemKind = prop ? "properties" : "projects";
    const replacements = {
      "{{lead.firstName}}": lead.firstName,
      "{{lead.lastName}}": lead.lastName || "",
      "{{lead.phone}}": lead.primaryPhone,
      "{{lead.email}}": lead.primaryEmail,
      "{{property.name}}": item?.name || "",
      "{{property.location}}": item?.location || "",
      "{{property.url}}": item
        ? `${typeof window !== "undefined" ? window.location.origin : ""}/${itemKind}/${item.slug}`
        : "",
      "{{site.name}}": "Jyothi Properties",
      "{{site.phone}}": "+91 9337104909",
      "{{user.name}}": "Sales Team",
      "{{date}}": new Date().toLocaleDateString("en-IN"),
      "{{time}}": new Date().toLocaleTimeString("en-IN"),
    };
    for (const [k, v] of Object.entries(replacements)) {
      b = b.split(k).join(v);
      if (channel === "email") setSubject((s) => s.split(k).join(v));
    }
    setBody(b);
  };

  const send = async () => {
    if (channel === "email") {
      const url = `mailto:${lead.primaryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(url, "_blank");
      await fetch(`/api/admin/leads/${lead.id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "email",
          title: `Email sent: ${subject}`,
          body,
          emailSubject: subject,
          templateId: templateId || null,
        }),
      });
    } else if (channel === "whatsapp") {
      const num = String(phone).replace(/\D/g, "");
      const wa = num.startsWith("91") ? num : `91${num.slice(-10)}`;
      const url = `https://wa.me/${wa}?text=${encodeURIComponent(body)}`;
      window.open(url, "_blank");
      await fetch(`/api/admin/leads/${lead.id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "whatsapp",
          title: "WhatsApp message sent",
          body,
          templateId: templateId || null,
        }),
      });
    } else if (channel === "call") {
      window.open(`tel:${phone}`, "_self");
      if (callDuration) {
        await fetch(`/api/admin/leads/${lead.id}/activities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "call",
            title: `Call: ${callOutcome}`,
            body,
            callDuration: parseInt(callDuration) || 0,
            callOutcome,
          }),
        });
      }
    }
    onSent?.();
    onClose();
  };

  const phoneOptions = [
    lead.primaryPhone,
    lead.secondaryPhone,
    lead.alternatePhone,
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-sm font-semibold">
            {channel === "email"
              ? "Send email"
              : channel === "whatsapp"
                ? "Send WhatsApp"
                : "Make call"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-lg hover:bg-[var(--color-bg-soft)]"
          >
            <LuX />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {templates.length > 0 && (
            <Select
              label="Template"
              value={templateId}
              onChange={applyTemplate}
              options={[
                { value: "", label: "No template" },
                ...templates.map((t) => ({ value: t.id, label: t.name })),
              ]}
            />
          )}
          <Select
            label="Property"
            value={propertyId}
            onChange={setPropertyId}
            options={[
              { value: "", label: "None" },
              ...(properties || []).map((p) => ({
                value: p.id,
                label: p.name,
              })),
            ]}
          />
          <Select
            label="Project"
            value={projectId}
            onChange={setProjectId}
            options={[
              { value: "", label: "None" },
              ...(projects || []).map((p) => ({ value: p.id, label: p.name })),
            ]}
          />

          {(channel === "whatsapp" || channel === "call") &&
            phoneOptions.length > 1 && (
              <Select
                label="Phone"
                value={phone}
                onChange={setPhone}
                options={phoneOptions.map((p) => ({ value: p, label: p }))}
              />
            )}

          {channel === "email" && (
            <Field label="Subject" value={subject} onChange={setSubject} />
          )}

          {channel !== "call" && (
            <div>
              <label className="block text-xs font-medium mb-1.5">
                Message
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
              />
            </div>
          )}

          {channel === "call" && (
            <>
              {body && (
                <div className="p-3 bg-[var(--color-bg-soft)] rounded-lg text-xs whitespace-pre-wrap">
                  {body}
                </div>
              )}
              <Select
                label="Outcome (after call)"
                value={callOutcome}
                onChange={setCallOutcome}
                options={[
                  { value: "connected", label: "Connected" },
                  { value: "no_answer", label: "No answer" },
                  { value: "busy", label: "Busy" },
                  { value: "wrong_number", label: "Wrong number" },
                  { value: "not_interested", label: "Not interested" },
                  { value: "callback_requested", label: "Callback requested" },
                ]}
              />
              <Field
                label="Duration (minutes)"
                value={callDuration}
                onChange={setCallDuration}
              />
            </>
          )}
        </div>
        <div className="border-t px-4 py-3 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-ink-200)] text-sm font-medium hover:bg-[var(--color-bg-soft)]"
          >
            Cancel
          </button>
          <button
            onClick={send}
            className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium flex items-center justify-center gap-2"
          >
            <LuSend />
            {channel === "email"
              ? "Open email"
              : channel === "whatsapp"
                ? "Open WhatsApp"
                : "Call now"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-[10px] font-medium uppercase tracking-wider text-[var(--color-ink-500)] mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2.5 py-1.5 text-sm rounded border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-[10px] font-medium uppercase tracking-wider text-[var(--color-ink-500)] mb-1">
        {label}
      </label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2.5 py-1.5 text-sm rounded border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
