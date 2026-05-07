"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const TABS = [
  { id: "active", label: "Active", filter: "" },
  { id: "followups", label: "Followups", filter: "followups=true" },
  { id: "lead_pool", label: "Lead Pool", filter: "lead_pool=true" },
  { id: "junk", label: "Junk", filter: "junk=true" },
];

export default function DataPage() {
  const [tab, setTab] = useState("active");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = TABS.find((x) => x.id === tab);
    const url = `/api/admin/leads?${t.filter}&limit=200`;
    fetch(url).then((r) => r.json()).then((d) => {
      setItems(d.items || []);
      setLoading(false);
    });
  }, [tab]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Data</h1>
        <p className="text-xs text-[var(--color-ink-500)] mt-0.5">Browse leads by category</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[var(--color-ink-100)]">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t.id ? "border-[var(--color-brand-700)] text-[var(--color-brand-700)]" : "border-transparent text-[var(--color-ink-600)]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-ink-100)] overflow-hidden">
        {loading ? <div className="text-center py-12 text-sm text-[var(--color-ink-500)]">Loading...</div> :
        items.length === 0 ? <div className="text-center py-12 text-sm text-[var(--color-ink-500)]">No leads in this category</div> : (
          <div className="divide-y divide-[var(--color-ink-100)]">
            {items.map((l) => (
              <Link key={l.id} href={`/admin/leads/${l.id}`} className="flex items-center justify-between gap-3 p-3 hover:bg-[var(--color-bg-soft)]">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{l.name}</p>
                  <p className="text-xs text-[var(--color-ink-600)] mt-0.5">{l.primaryPhone} · {l.source}</p>
                </div>
                <div className="text-right text-xs text-[var(--color-ink-500)]">
                  <p className="capitalize">{l.status.replace(/_/g, " ")}</p>
                  <p className="text-[10px] mt-0.5">{l.assignedTo?.name || "Unassigned"}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
