"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LuPlus, LuPhone, LuMessageCircle, LuMapPin } from "react-icons/lu";

const STATUSES = [
  { value: "scheduled", label: "Scheduled" },
  { value: "confirmed", label: "Confirmed" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "no_show", label: "No Show" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function SiteVisitsPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [showNew, setShowNew] = useState(false);

  useEffect(() => { load(); }, [filter]);

  async function load() {
    const url = filter ? `/api/admin/site-visits?status=${filter}` : "/api/admin/site-visits";
    const r = await fetch(url);
    const d = await r.json();
    setItems(d.items || []);
  }

  async function updateStatus(id, status) {
    await fetch(`/api/admin/site-visits/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Site Visits</h1>
          <p className="text-xs text-[var(--color-ink-500)] mt-0.5">{items.length} visits</p>
        </div>
        <button onClick={() => setShowNew(true)} className="px-4 py-2 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium flex items-center gap-1.5"><LuPlus/>Schedule Visit</button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter("")} className={`px-3 py-1.5 text-xs rounded-lg ${!filter ? "bg-[var(--color-brand-700)] text-white" : "bg-white border border-[var(--color-ink-200)]"}`}>All</button>
        {STATUSES.map((s) => (
          <button key={s.value} onClick={() => setFilter(s.value)} className={`px-3 py-1.5 text-xs rounded-lg ${filter === s.value ? "bg-[var(--color-brand-700)] text-white" : "bg-white border border-[var(--color-ink-200)]"}`}>{s.label}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-ink-100)] overflow-hidden">
        {items.length === 0 ? (
          <div className="text-center py-12 text-sm text-[var(--color-ink-500)]">No visits found</div>
        ) : (
          <div className="divide-y divide-[var(--color-ink-100)]">
            {items.map((v) => (
              <div key={v.id} className="p-4 hover:bg-[var(--color-bg-soft)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/admin/leads/${v.lead?.id}`} className="text-sm font-medium hover:text-[var(--color-brand-700)]">{v.lead?.name || "Unknown"}</Link>
                      <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded bg-[var(--color-bg-soft)]">{v.status}</span>
                    </div>
                    <p className="text-xs text-[var(--color-ink-600)] mt-1">{v.property?.name || "Site visit"} {v.property?.location && `· ${v.property.location}`}</p>
                    <p className="text-xs text-[var(--color-brand-700)] font-medium mt-1">{new Date(v.scheduledAt).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} · {v.durationMins}min</p>
                    {v.meetingPoint && <p className="text-xs text-[var(--color-ink-500)] mt-1 flex items-center gap-1"><LuMapPin/>{v.meetingPoint}</p>}
                    <p className="text-[11px] text-[var(--color-ink-500)] mt-1">Assigned: {v.assignedTo?.name || "Unassigned"}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {v.lead?.primaryPhone && <a href={`tel:${v.lead.primaryPhone}`} className="w-8 h-8 grid place-items-center rounded bg-[var(--color-bg-soft)]"><LuPhone className="text-sm"/></a>}
                    {v.lead?.primaryPhone && <a href={`https://wa.me/91${v.lead.primaryPhone.slice(-10)}`} target="_blank" rel="noopener" className="w-8 h-8 grid place-items-center rounded bg-[var(--color-bg-soft)]"><LuMessageCircle className="text-sm"/></a>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[var(--color-ink-100)]">
                  {STATUSES.map((s) => (
                    <button key={s.value} onClick={() => updateStatus(v.id, s.value)} className={`px-2 py-1 text-[10px] rounded ${v.status === s.value ? "bg-[var(--color-brand-700)] text-white" : "bg-[var(--color-bg-soft)] hover:bg-[var(--color-ink-100)]"}`}>{s.label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showNew && <NewVisitModal onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); load(); }}/>}
    </div>
  );
}

function NewVisitModal({ onClose, onCreated }) {
  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ leadId: "", propertyId: "", scheduledAt: "", durationMins: 60, meetingPoint: "", assignedToId: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/leads?limit=200").then((r) => r.json()).then((d) => setLeads(d.items || []));
    fetch("/api/admin/properties").then((r) => r.json()).then((d) => setProperties(d.items || []));
    fetch("/api/admin/users").then((r) => r.json()).then((d) => setUsers(d.items || []));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/admin/site-visits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      onCreated();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <form onSubmit={submit} className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b">
          <h3 className="text-base font-semibold">Schedule Site Visit</h3>
        </div>
        <div className="p-5 space-y-3 overflow-y-auto">
          <Select label="Lead" value={form.leadId} onChange={(v) => setForm({ ...form, leadId: v })} required options={[{ value: "", label: "Select lead" }, ...leads.map((l) => ({ value: l.id, label: `${l.name} - ${l.primaryPhone}` }))]}/>
          <Select label="Property" value={form.propertyId} onChange={(v) => setForm({ ...form, propertyId: v })} options={[{ value: "", label: "Select property" }, ...properties.map((p) => ({ value: p.id, label: p.name }))]}/>
          <div>
            <label className="block text-xs font-medium mb-1.5">Scheduled at *</label>
            <input type="datetime-local" required value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"/>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Duration (min)</label>
            <input type="number" value={form.durationMins} onChange={(e) => setForm({ ...form, durationMins: parseInt(e.target.value) || 60 })} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"/>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Meeting point</label>
            <input type="text" value={form.meetingPoint} onChange={(e) => setForm({ ...form, meetingPoint: e.target.value })} placeholder="Site office, Sales gallery..." className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"/>
          </div>
          <Select label="Assigned to" value={form.assignedToId} onChange={(v) => setForm({ ...form, assignedToId: v })} options={[{ value: "", label: "Me" }, ...users.map((u) => ({ value: u.id, label: u.name }))]}/>
        </div>
        <div className="border-t px-5 py-3 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-ink-200)] text-sm">Cancel</button>
          <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium disabled:opacity-60">{submitting ? "Saving..." : "Schedule"}</button>
        </div>
      </form>
    </div>
  );
}

function Select({ label, value, onChange, options, required }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5">{label}{required && " *"}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none bg-white">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
