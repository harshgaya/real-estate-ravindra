"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CalendarPage() {
  const [view, setView] = useState("agenda");
  const [date, setDate] = useState(new Date());
  const [visits, setVisits] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const from = new Date(date.getFullYear(), date.getMonth(), 1);
    const to = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    fetch(`/api/admin/site-visits?from=${from.toISOString()}&to=${to.toISOString()}`).then((r) => r.json()).then((d) => setVisits(d.items || []));
    fetch(`/api/admin/tasks`).then((r) => r.json()).then((d) => setTasks(d.items || []));
  }, [date]);

  const events = [
    ...visits.map((v) => ({ id: v.id, type: "visit", title: `${v.lead?.name || "Visit"} - ${v.property?.name || ""}`, at: new Date(v.scheduledAt), color: "blue", link: `/admin/site-visits` })),
    ...tasks.filter((t) => t.dueAt).map((t) => ({ id: t.id, type: "task", title: t.title, at: new Date(t.dueAt), color: "purple", link: `/admin/tasks` })),
  ].sort((a, b) => a.at - b.at);

  const grouped = {};
  for (const e of events) {
    const k = e.at.toDateString();
    if (!grouped[k]) grouped[k] = [];
    grouped[k].push(e);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold">Calendar</h1>
          <p className="text-xs text-[var(--color-ink-500)] mt-0.5">{events.length} events this month</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { const d = new Date(date); d.setMonth(d.getMonth() - 1); setDate(d); }} className="px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] hover:bg-[var(--color-bg-soft)]">←</button>
          <span className="px-3 py-2 text-sm font-medium">{date.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span>
          <button onClick={() => { const d = new Date(date); d.setMonth(d.getMonth() + 1); setDate(d); }} className="px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] hover:bg-[var(--color-bg-soft)]">→</button>
          <button onClick={() => setDate(new Date())} className="px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] hover:bg-[var(--color-bg-soft)]">Today</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-ink-100)] p-5">
        {Object.keys(grouped).length === 0 ? (
          <p className="text-sm text-[var(--color-ink-500)] text-center py-12">No events this month</p>
        ) : Object.entries(grouped).map(([day, items]) => (
          <div key={day} className="mb-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-500)] mb-2">{new Date(day).toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}</div>
            <div className="space-y-2">
              {items.map((e) => (
                <Link key={`${e.type}-${e.id}`} href={e.link} className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${e.color === "blue" ? "border-blue-500 bg-blue-50" : "border-purple-500 bg-purple-50"} hover:shadow-sm`}>
                  <span className="text-xs font-medium w-16 flex-shrink-0">{e.at.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                  <span className="text-sm flex-1">{e.title}</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white">{e.type}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
