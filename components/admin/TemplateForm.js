"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TEMPLATE_CATEGORIES } from "@/lib/constants";

const TAGS = [
  "{{lead.firstName}}", "{{lead.lastName}}", "{{lead.phone}}", "{{lead.email}}",
  "{{property.name}}", "{{property.location}}", "{{property.url}}",
  "{{site.name}}", "{{site.phone}}", "{{user.name}}", "{{date}}", "{{time}}",
];

export default function TemplateForm({ id }) {
  const router = useRouter();
  const isEdit = !!id;
  const [form, setForm] = useState({
    name: "", channel: "whatsapp", category: "welcome", subject: "", body: "", isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    fetch("/api/admin/templates").then((r) => r.json()).then((d) => {
      const t = (d.items || []).find((x) => x.id === id);
      if (t) setForm({
        name: t.name, channel: t.channel, category: t.category,
        subject: t.subject || "", body: t.body, isActive: t.isActive,
      });
    });
  }, [id, isEdit]);

  function insertTag(tag) {
    setForm((f) => ({ ...f, body: f.body + tag }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const url = isEdit ? `/api/admin/templates/${id}` : "/api/admin/templates";
      const method = isEdit ? "PATCH" : "POST";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed");
      router.push("/admin/templates");
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{isEdit ? "Edit Template" : "Add Template"}</h1>
        <Link href="/admin/templates" className="text-sm text-[var(--color-ink-600)]">Cancel</Link>
      </div>
      <form onSubmit={submit} className="bg-white rounded-xl border border-[var(--color-ink-100)] p-5 lg:p-6 space-y-4">
        <Field label="Template name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required/>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5">Channel</label>
            <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white">
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="call">Call Script</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white">
              {TEMPLATE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        {form.channel === "email" && (
          <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })}/>
        )}

        <div>
          <label className="block text-xs font-medium mb-1.5">Body</label>
          <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={10} required className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"/>
          <p className="text-[11px] text-[var(--color-ink-500)] mt-2">Click a merge tag below to insert it:</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {TAGS.map((t) => (
              <button type="button" key={t} onClick={() => insertTag(t)} className="px-2 py-0.5 text-[10px] font-mono rounded bg-[var(--color-bg-soft)] hover:bg-[var(--color-ink-100)]">{t}</button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}/>
          Active (available for selection)
        </label>

        {error && <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">{error}</div>}
        <div className="flex justify-end gap-2 pt-2">
          <Link href="/admin/templates" className="px-4 py-2 rounded-lg border border-[var(--color-ink-200)] text-sm">Cancel</Link>
          <button type="submit" disabled={submitting} className="px-5 py-2 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium disabled:opacity-60">{submitting ? "Saving..." : isEdit ? "Update" : "Create"}</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, required }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5">{label}{required && " *"}</label>
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} required={required} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"/>
    </div>
  );
}
