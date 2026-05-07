"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function NotificationsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => { load(); }, []);
  async function load() {
    const r = await fetch("/api/admin/notifications");
    const d = await r.json();
    setItems(d.items || []);
  }

  async function markRead(id) {
    await fetch(`/api/admin/notifications/${id}`, { method: "PATCH" });
    load();
  }

  async function markAllRead() {
    await fetch("/api/admin/notifications", { method: "PATCH" });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Notifications</h1>
          <p className="text-xs text-[var(--color-ink-500)] mt-0.5">{items.length} total</p>
        </div>
        <button onClick={markAllRead} className="px-4 py-2 rounded-lg border border-[var(--color-ink-200)] text-sm">Mark all read</button>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-ink-100)] overflow-hidden">
        {items.length === 0 ? <div className="text-center py-12 text-sm text-[var(--color-ink-500)]">No notifications</div> : (
          <div className="divide-y divide-[var(--color-ink-100)]">
            {items.map((n) => (
              <div key={n.id} className={`p-4 ${!n.isRead ? "bg-blue-50/30" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{n.title}</p>
                      {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500"/>}
                      <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider rounded bg-[var(--color-bg-soft)]">{n.priority}</span>
                    </div>
                    {n.body && <p className="text-xs text-[var(--color-ink-600)] mt-1">{n.body}</p>}
                    <p className="text-[10px] text-[var(--color-ink-500)] mt-1">{n.type} · {new Date(n.createdAt).toLocaleString("en-IN")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {n.link && <Link href={n.link} className="text-xs text-[var(--color-brand-700)] font-medium">Open</Link>}
                    {!n.isRead && <button onClick={() => markRead(n.id)} className="text-xs text-[var(--color-ink-600)]">Mark read</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
