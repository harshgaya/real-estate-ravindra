"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LuPlus, LuCheck } from "react-icons/lu";

const PRIO_COLORS = { urgent: "border-red-500 bg-red-50", high: "border-orange-500 bg-orange-50", medium: "border-blue-500 bg-blue-50", low: "border-gray-400 bg-gray-50" };

export default function TasksPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("today");
  const [showNew, setShowNew] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const r = await fetch("/api/admin/tasks");
    const d = await r.json();
    setItems(d.items || []);
  }

  async function complete(id) {
    await fetch(`/api/admin/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "done" }),
    });
    load();
  }

  const now = new Date();
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  const weekEnd = new Date(now); weekEnd.setDate(weekEnd.getDate() + 7);

  const filtered = items.filter((t) => {
    if (filter === "done") return t.status === "done";
    if (t.status === "done") return false;
    if (filter === "overdue") return t.dueAt && new Date(t.dueAt) < now;
    if (filter === "today") return t.dueAt && new Date(t.dueAt) <= todayEnd;
    if (filter === "week") return t.dueAt && new Date(t.dueAt) <= weekEnd;
    if (filter === "upcoming") return t.dueAt && new Date(t.dueAt) > weekEnd;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Tasks</h1>
          <p className="text-xs text-[var(--color-ink-500)] mt-0.5">{filtered.length} {filter}</p>
        </div>
        <button onClick={() => setShowNew(true)} className="px-4 py-2 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium flex items-center gap-1.5"><LuPlus/>New Task</button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { v: "today", l: "Today" }, { v: "week", l: "This Week" },
          { v: "upcoming", l: "Upcoming" }, { v: "overdue", l: "Overdue" },
          { v: "done", l: "Done" }, { v: "all", l: "All" },
        ].map((f) => (
          <button key={f.v} onClick={() => setFilter(f.v)} className={`px-3 py-1.5 text-xs rounded-lg ${filter === f.v ? "bg-[var(--color-brand-700)] text-white" : "bg-white border border-[var(--color-ink-200)]"}`}>{f.l}</button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? <p className="text-sm text-[var(--color-ink-500)] text-center py-12">No tasks</p> : filtered.map((t) => {
          const prio = PRIO_COLORS[t.priority] || PRIO_COLORS.medium;
          const overdue = t.dueAt && new Date(t.dueAt) < now && t.status !== "done";
          return (
            <div key={t.id} className={`bg-white rounded-lg border-l-4 ${prio} p-4 flex items-start justify-between gap-3`}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${t.status === "done" ? "line-through text-[var(--color-ink-500)]" : ""}`}>{t.title}</p>
                  <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded bg-white">{t.priority}</span>
                </div>
                {t.description && <p className="text-xs text-[var(--color-ink-600)] mt-1">{t.description}</p>}
                {t.lead && <Link href={`/admin/leads/${t.lead.id}`} className="text-[11px] text-[var(--color-brand-700)] mt-1 inline-block">Lead: {t.lead.name}</Link>}
                <p className={`text-[11px] mt-1 ${overdue ? "text-red-600 font-medium" : "text-[var(--color-ink-500)]"}`}>
                  {t.dueAt ? `Due ${new Date(t.dueAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}` : "No due date"}
                  {t.assignedTo && ` · ${t.assignedTo.name}`}
                </p>
              </div>
              {t.status !== "done" && (
                <button onClick={() => complete(t.id)} className="w-9 h-9 grid place-items-center rounded-lg bg-green-50 hover:bg-green-100 text-green-700"><LuCheck/></button>
              )}
            </div>
          );
        })}
      </div>

      {showNew && <NewTaskModal onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); load(); }}/>}
    </div>
  );
}

function NewTaskModal({ onClose, onCreated }) {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", type: "followup", leadId: "", dueAt: "", priority: "medium", assignedToId: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/leads?limit=200").then((r) => r.json()).then((d) => setLeads(d.items || []));
    fetch("/api/admin/users").then((r) => r.json()).then((d) => setUsers(d.items || []));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/admin/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      onCreated();
    } finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <form onSubmit={submit} className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b"><h3 className="text-base font-semibold">New Task</h3></div>
        <div className="p-5 space-y-3 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium mb-1.5">Title *</label>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)]"/>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)]"/>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white">
              <option value="followup">Follow-up</option><option value="call">Call</option><option value="email">Email</option><option value="meeting">Meeting</option><option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Lead (optional)</label>
            <select value={form.leadId} onChange={(e) => setForm({ ...form, leadId: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white">
              <option value="">None</option>
              {leads.map((l) => <option key={l.id} value={l.id}>{l.name} - {l.primaryPhone}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Due at</label>
            <input type="datetime-local" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)]"/>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Priority</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Assigned to</label>
            <select value={form.assignedToId} onChange={(e) => setForm({ ...form, assignedToId: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white">
              <option value="">Me</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>
        <div className="border-t px-5 py-3 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-ink-200)] text-sm">Cancel</button>
          <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium disabled:opacity-60">{submitting ? "Saving..." : "Create"}</button>
        </div>
      </form>
    </div>
  );
}
