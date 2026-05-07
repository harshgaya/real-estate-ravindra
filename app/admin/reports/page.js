"use client";
import { useState, useEffect } from "react";

export default function ReportsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/admin/reports").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <div className="text-sm text-[var(--color-ink-500)]">Loading reports...</div>;

  const totalLeads = (data.byStatus || []).reduce((sum, s) => sum + s.count, 0);

  function exportCsv() {
    const rows = [
      ["Section", "Key", "Count"],
      ...(data.bySource || []).map((s) => ["Source", s.source, s.count]),
      ...(data.byStatus || []).map((s) => ["Status", s.status, s.count]),
      ...(data.byUser || []).map((s) => ["User", s.name, s.count]),
      ...(data.byCity || []).map((s) => ["City", s.city, s.count]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "reports.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Reports</h1>
          <p className="text-xs text-[var(--color-ink-500)] mt-0.5">{totalLeads} leads tracked</p>
        </div>
        <button onClick={exportCsv} className="px-4 py-2 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium">Export CSV</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ReportCard title="By Source" rows={data.bySource} keyField="source" total={totalLeads}/>
        <ReportCard title="By Status" rows={data.byStatus} keyField="status" total={totalLeads}/>
        <ReportCard title="By User" rows={data.byUser} keyField="name" total={totalLeads}/>
        <ReportCard title="By City" rows={data.byCity} keyField="city" total={totalLeads}/>
      </div>

      <DailyChart data={data.leadsByDay || []}/>
    </div>
  );
}

function ReportCard({ title, rows, keyField, total }) {
  const sorted = [...(rows || [])].sort((a, b) => b.count - a.count);
  const max = Math.max(...sorted.map((r) => r.count), 1);
  return (
    <div className="bg-white rounded-xl border border-[var(--color-ink-100)] p-5">
      <h2 className="text-sm font-semibold mb-4">{title}</h2>
      {sorted.length === 0 ? <p className="text-xs text-[var(--color-ink-500)]">No data</p> : (
        <div className="space-y-2">
          {sorted.map((r) => (
            <div key={r[keyField]}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="capitalize">{(r[keyField] || "Unknown").replace(/_/g, " ")}</span>
                <span className="font-medium">{r.count} ({Math.round((r.count / total) * 100)}%)</span>
              </div>
              <div className="h-1.5 bg-[var(--color-ink-100)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-brand-600)]" style={{ width: `${(r.count / max) * 100}%` }}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DailyChart({ data }) {
  const grouped = {};
  for (const l of data) {
    const k = new Date(l.createdAt).toISOString().slice(0, 10);
    grouped[k] = (grouped[k] || 0) + 1;
  }
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = d.toISOString().slice(0, 10);
    days.push({ date: k, count: grouped[k] || 0 });
  }
  const max = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="bg-white rounded-xl border border-[var(--color-ink-100)] p-5">
      <h2 className="text-sm font-semibold mb-4">Leads (Last 30 Days)</h2>
      <div className="flex items-end gap-1 h-32">
        {days.map((d) => (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group" title={`${d.date}: ${d.count}`}>
            <div className="w-full bg-[var(--color-brand-600)] rounded-t hover:bg-[var(--color-brand-700)] transition-colors" style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count > 0 ? "2px" : "0" }}/>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-[var(--color-ink-500)] mt-2">
        <span>{days[0].date}</span>
        <span>{days[days.length - 1].date}</span>
      </div>
    </div>
  );
}
