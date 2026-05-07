"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LuPlus, LuPencil, LuTrash, LuMail, LuMessageCircle, LuPhone } from "react-icons/lu";

const ICONS = { email: LuMail, whatsapp: LuMessageCircle, call: LuPhone };

export default function TemplatesPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => { load(); }, [filter]);

  async function load() {
    const url = filter ? `/api/admin/templates?channel=${filter}` : "/api/admin/templates";
    const r = await fetch(url);
    const d = await r.json();
    setItems(d.items || []);
  }

  async function remove(id) {
    if (!confirm("Delete this template?")) return;
    await fetch(`/api/admin/templates/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Templates</h1>
          <p className="text-xs text-[var(--color-ink-500)] mt-0.5">{items.length} templates · email, WhatsApp, call scripts</p>
        </div>
        <Link href="/admin/templates/new" className="px-4 py-2 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium flex items-center gap-1.5"><LuPlus/>Add Template</Link>
      </div>

      <div className="flex gap-2">
        {[{ v: "", l: "All" }, { v: "email", l: "Email" }, { v: "whatsapp", l: "WhatsApp" }, { v: "call", l: "Call" }].map((f) => (
          <button key={f.v} onClick={() => setFilter(f.v)} className={`px-3 py-1.5 text-xs rounded-lg ${filter === f.v ? "bg-[var(--color-brand-700)] text-white" : "bg-white border border-[var(--color-ink-200)]"}`}>{f.l}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {items.map((t) => {
          const Icon = ICONS[t.channel] || LuMail;
          return (
            <div key={t.id} className="bg-white rounded-xl border border-[var(--color-ink-100)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[var(--color-bg-soft)] grid place-items-center flex-shrink-0"><Icon/></div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{t.name}</p>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-500)]">{t.channel} · {t.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/admin/templates/${t.id}/edit`} className="w-8 h-8 grid place-items-center rounded hover:bg-[var(--color-bg-soft)]"><LuPencil/></Link>
                  <button onClick={() => remove(t.id)} className="w-8 h-8 grid place-items-center rounded hover:bg-red-50 text-red-600"><LuTrash/></button>
                </div>
              </div>
              {t.subject && <p className="mt-3 text-xs font-medium text-[var(--color-ink-700)]">Subject: {t.subject}</p>}
              <p className="mt-2 text-xs text-[var(--color-ink-600)] whitespace-pre-wrap line-clamp-3">{t.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
