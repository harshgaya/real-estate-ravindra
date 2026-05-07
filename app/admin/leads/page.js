"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LuSearch,
  LuFilter,
  LuRefreshCw,
  LuPlus,
  LuPencil,
  LuFileText,
  LuClock,
  LuUpload,
  LuMail,
  LuMessageCircle,
  LuPhone,
  LuArrowUpDown,
  LuX,
} from "react-icons/lu";
import { LEAD_STATUSES } from "@/lib/constants";
import LeadDrawer from "@/components/admin/LeadDrawer";

const COLUMNS = [
  { key: "name", label: "Name", sortable: true, default: true },
  { key: "primaryPhone", label: "Phone", default: true },
  { key: "primaryEmail", label: "Email" },
  { key: "source", label: "Source", default: true },
  { key: "status", label: "Status", default: true },
  { key: "temperature", label: "Temp", default: true },
  { key: "assignedTo", label: "Assigned", default: true },
  { key: "createdAt", label: "Created", sortable: true, default: true },
  { key: "lastActivityAt", label: "Last Activity", sortable: true },
];

export default function LeadsListPage() {
  const sp = useSearchParams();
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [drawerLeadId, setDrawerLeadId] = useState(null);
  const [drawerIntent, setDrawerIntent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [columns, setColumns] = useState(
    COLUMNS.filter((c) => c.default).map((c) => c.key),
  );
  const [stats, setStats] = useState({
    new: 0,
    callback: 0,
    meeting_scheduled: 0,
    site_visit_scheduled: 0,
    eoi: 0,
  });

  const initialStatus = sp.get("status") || "";
  const [filters, setFilters] = useState({
    q: "",
    status: initialStatus,
    source: "",
    temperature: "",
    assignedTo: "",
    from: "",
    to: "",
    sort: "createdAt",
    order: "desc",
  });

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  async function fetchLeads() {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v) qs.set(k, v);
      });
      const r = await fetch(`/api/admin/leads?${qs.toString()}&limit=200`);
      const d = await r.json();
      setLeads(d.items || []);
      setTotal(d.total || 0);

      const allR = await fetch(`/api/admin/leads?limit=500`);
      const allD = await allR.json();
      computeStats(allD.items || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  function computeStats(items) {
    const counts = items.reduce((acc, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    }, {});
    setStats(counts);
  }

  const openDrawer = (id, intent) => {
    setDrawerLeadId(id);
    setDrawerIntent(intent || "overview");
  };

  const closeDrawer = () => {
    setDrawerLeadId(null);
    setDrawerIntent(null);
  };

  const visibleColumns = COLUMNS.filter((c) => columns.includes(c.key));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Leads</h1>
          <p className="text-xs text-[var(--color-ink-500)] mt-0.5">
            {total} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLeads}
            className="px-3 py-2 rounded-lg border border-[var(--color-ink-200)] hover:bg-[var(--color-bg-soft)]"
          >
            <LuRefreshCw />
          </button>
          <button
            onClick={() => setShowNew(true)}
            className="px-4 py-2 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium flex items-center gap-1.5"
          >
            <LuPlus />
            Add Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {[
          { key: "new", label: "New", color: "blue" },
          { key: "callback", label: "Callbacks", color: "yellow" },
          { key: "meeting_scheduled", label: "Meetings", color: "indigo" },
          { key: "site_visit_scheduled", label: "Site Visits", color: "cyan" },
          { key: "eoi", label: "EOI", color: "pink" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() =>
              setFilters({
                ...filters,
                status: filters.status === s.key ? "" : s.key,
              })
            }
            className={`p-3 rounded-lg border text-left transition-colors ${filters.status === s.key ? "bg-[var(--color-brand-700)] border-[var(--color-brand-700)] text-white" : "bg-white border-[var(--color-ink-100)] hover:border-[var(--color-brand-600)]"}`}
          >
            <p className="text-xl font-semibold">{stats[s.key] || 0}</p>
            <p className="text-[11px] uppercase tracking-wider mt-1">
              {s.label}
            </p>
          </button>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-ink-100)] rounded-xl">
        <div className="p-3 border-b border-[var(--color-ink-100)] flex flex-wrap items-center gap-2">
          <div className="flex-1 min-w-[200px] relative">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-500)]" />
            <input
              type="text"
              placeholder="Search by name, phone, email..."
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg border text-sm flex items-center gap-1.5 ${showFilters ? "bg-[var(--color-brand-700)] border-[var(--color-brand-700)] text-white" : "border-[var(--color-ink-200)] hover:bg-[var(--color-bg-soft)]"}`}
          >
            <LuFilter />
            Filter
          </button>
          <button
            onClick={() => setShowColumns(!showColumns)}
            className="px-3 py-2 rounded-lg border border-[var(--color-ink-200)] text-sm hover:bg-[var(--color-bg-soft)]"
          >
            Columns
          </button>
        </div>

        {showFilters && (
          <div className="p-3 border-b border-[var(--color-ink-100)] bg-[var(--color-bg-soft)] grid grid-cols-2 lg:grid-cols-4 gap-2">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white"
            >
              <option value="">All status</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              value={filters.temperature}
              onChange={(e) =>
                setFilters({ ...filters, temperature: e.target.value })
              }
              className="px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white"
            >
              <option value="">All temp</option>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              className="px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white"
              placeholder="From"
            />
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              className="px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white"
              placeholder="To"
            />
          </div>
        )}

        {showColumns && (
          <div className="p-3 border-b border-[var(--color-ink-100)] bg-[var(--color-bg-soft)] flex flex-wrap gap-2">
            {COLUMNS.map((c) => (
              <label
                key={c.key}
                className="flex items-center gap-2 px-2 py-1 text-xs"
              >
                <input
                  type="checkbox"
                  checked={columns.includes(c.key)}
                  onChange={(e) => {
                    if (e.target.checked) setColumns([...columns, c.key]);
                    else setColumns(columns.filter((k) => k !== c.key));
                  }}
                />
                {c.label}
              </label>
            ))}
          </div>
        )}

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-bg-soft)] text-[10px] uppercase tracking-wider text-[var(--color-ink-600)]">
              <tr>
                {visibleColumns.map((c) => (
                  <th key={c.key} className="px-3 py-2.5 text-left font-medium">
                    {c.sortable ? (
                      <button
                        onClick={() =>
                          setFilters({
                            ...filters,
                            sort: c.key,
                            order:
                              filters.sort === c.key && filters.order === "desc"
                                ? "asc"
                                : "desc",
                          })
                        }
                        className="flex items-center gap-1 hover:text-[var(--color-brand-700)]"
                      >
                        {c.label}
                        <LuArrowUpDown className="text-[10px]" />
                      </button>
                    ) : (
                      c.label
                    )}
                  </th>
                ))}
                <th className="px-3 py-2.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + 1}
                    className="text-center py-12 text-[var(--color-ink-500)]"
                  >
                    Loading...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + 1}
                    className="text-center py-12 text-[var(--color-ink-500)]"
                  >
                    No leads found
                  </td>
                </tr>
              ) : (
                leads.map((l) => (
                  <tr
                    key={l.id}
                    className="border-t border-[var(--color-ink-100)] hover:bg-[var(--color-bg-soft)] cursor-pointer"
                    onClick={() => openDrawer(l.id, "overview")}
                  >
                    {columns.includes("name") && (
                      <td className="px-3 py-2.5 font-medium">{l.name}</td>
                    )}
                    {columns.includes("primaryPhone") && (
                      <td className="px-3 py-2.5">{l.primaryPhone}</td>
                    )}
                    {columns.includes("primaryEmail") && (
                      <td className="px-3 py-2.5 truncate max-w-[200px]">
                        {l.primaryEmail}
                      </td>
                    )}
                    {columns.includes("source") && (
                      <td className="px-3 py-2.5">{l.source}</td>
                    )}
                    {columns.includes("status") && (
                      <td className="px-3 py-2.5">
                        <StatusBadge status={l.status} />
                      </td>
                    )}
                    {columns.includes("temperature") && (
                      <td className="px-3 py-2.5">{l.temperature || "-"}</td>
                    )}
                    {columns.includes("assignedTo") && (
                      <td className="px-3 py-2.5">
                        {l.assignedTo?.name || (
                          <span className="text-[var(--color-ink-500)]">
                            Unassigned
                          </span>
                        )}
                      </td>
                    )}
                    {columns.includes("createdAt") && (
                      <td className="px-3 py-2.5 text-[var(--color-ink-600)]">
                        {new Date(l.createdAt).toLocaleDateString("en-IN")}
                      </td>
                    )}
                    {columns.includes("lastActivityAt") && (
                      <td className="px-3 py-2.5 text-[var(--color-ink-600)]">
                        {l.lastActivityAt
                          ? new Date(l.lastActivityAt).toLocaleDateString(
                              "en-IN",
                            )
                          : "-"}
                      </td>
                    )}
                    <td className="px-3 py-2.5">
                      <div
                        className="flex items-center justify-end gap-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <RowAction
                          icon={LuPencil}
                          onClick={() => openDrawer(l.id, "overview")}
                          title="Edit"
                        />
                        <RowAction
                          icon={LuFileText}
                          onClick={() => openDrawer(l.id, "notes")}
                          title="Notes"
                        />
                        <RowAction
                          icon={LuClock}
                          onClick={() => openDrawer(l.id, "history")}
                          title="History"
                        />
                        <RowAction
                          icon={LuMail}
                          onClick={() => openDrawer(l.id, "compose:email")}
                          title="Email"
                        />
                        <RowAction
                          icon={LuMessageCircle}
                          onClick={() => openDrawer(l.id, "compose:whatsapp")}
                          title="WhatsApp"
                        />
                        <RowAction
                          icon={LuPhone}
                          onClick={() => openDrawer(l.id, "compose:call")}
                          title="Call"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden divide-y divide-[var(--color-ink-100)]">
          {loading ? (
            <div className="text-center py-12 text-[var(--color-ink-500)] text-sm">
              Loading...
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-ink-500)] text-sm">
              No leads found
            </div>
          ) : (
            leads.map((l) => (
              <div
                key={l.id}
                onClick={() => openDrawer(l.id, "overview")}
                className="p-3 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{l.name}</p>
                    <p className="text-xs text-[var(--color-ink-600)]">
                      {l.primaryPhone}
                    </p>
                    <p className="text-[11px] text-[var(--color-ink-500)] mt-0.5">
                      {l.source} · {l.assignedTo?.name || "Unassigned"}
                    </p>
                  </div>
                  <StatusBadge status={l.status} />
                </div>
                <div
                  className="flex items-center gap-1 mt-2 pt-2 border-t border-[var(--color-ink-100)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => openDrawer(l.id, "compose:call")}
                    className="flex-1 py-1.5 text-xs rounded bg-[var(--color-bg-soft)] flex items-center justify-center gap-1"
                  >
                    <LuPhone />
                    Call
                  </button>
                  <button
                    onClick={() => openDrawer(l.id, "compose:whatsapp")}
                    className="flex-1 py-1.5 text-xs rounded bg-[var(--color-bg-soft)] flex items-center justify-center gap-1"
                  >
                    <LuMessageCircle />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => openDrawer(l.id, "overview")}
                    className="flex-1 py-1.5 text-xs rounded bg-[var(--color-bg-soft)] flex items-center justify-center gap-1"
                  >
                    <LuPencil />
                    Open
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {drawerLeadId && (
        <LeadDrawer
          leadId={drawerLeadId}
          intent={drawerIntent}
          onClose={closeDrawer}
          onUpdated={fetchLeads}
        />
      )}
      {showNew && (
        <NewLeadModal
          onClose={() => setShowNew(false)}
          onCreated={() => {
            setShowNew(false);
            fetchLeads();
          }}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const s = LEAD_STATUSES.find((x) => x.value === status);
  if (!s) return <span className="text-xs">{status}</span>;
  return (
    <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded bg-[var(--color-bg-soft)]">
      {s.label}
    </span>
  );
}

function RowAction({ icon: Icon, onClick, href, title }) {
  const cls =
    "w-7 h-7 grid place-items-center rounded hover:bg-[var(--color-ink-100)] text-[var(--color-ink-700)]";
  if (href)
    return (
      <a href={href} className={cls} title={title}>
        <Icon className="text-sm" />
      </a>
    );
  return (
    <button onClick={onClick} className={cls} title={title}>
      <Icon className="text-sm" />
    </button>
  );
}

function NewLeadModal({ onClose, onCreated }) {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    primaryPhone: "",
    secondaryPhone: "",
    primaryEmail: "",
    source: "Manual",
    bhkPreference: "",
    cityPref: "",
    budgetMin: "",
    budgetMax: "",
    timeline: "",
    purpose: "",
    funding: "",
    propertyId: "",
    assignedToId: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.items || []));
    fetch("/api/admin/properties")
      .then((r) => r.json())
      .then((d) => setProperties(d.items || []));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const r = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed to create");
      onCreated(d.lead?.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <form
        onSubmit={submit}
        className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="text-base font-semibold">Add New Lead</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-lg hover:bg-[var(--color-bg-soft)]"
          >
            <LuX />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5">
                First name *
              </label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">
                Last name
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">
                Primary phone *
              </label>
              <input
                type="tel"
                required
                value={form.primaryPhone}
                onChange={(e) =>
                  setForm({ ...form, primaryPhone: e.target.value })
                }
                placeholder="9876543210"
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">
                Secondary phone
              </label>
              <input
                type="tel"
                value={form.secondaryPhone}
                onChange={(e) =>
                  setForm({ ...form, secondaryPhone: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Email *</label>
            <input
              type="email"
              required
              value={form.primaryEmail}
              onChange={(e) =>
                setForm({ ...form, primaryEmail: e.target.value })
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5">Source</label>
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white"
              >
                <option value="Manual">Manual</option>
                <option value="Direct Call">Direct Call</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Referral">Referral</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Website">Website</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Newspaper">Newspaper</option>
                <option value="Hoarding">Hoarding</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">
                BHK preference
              </label>
              <input
                type="text"
                value={form.bhkPreference}
                onChange={(e) =>
                  setForm({ ...form, bhkPreference: e.target.value })
                }
                placeholder="2 BHK, 3 BHK"
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">
                Budget min (Rs)
              </label>
              <input
                type="number"
                value={form.budgetMin}
                onChange={(e) =>
                  setForm({ ...form, budgetMin: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">
                Budget max (Rs)
              </label>
              <input
                type="number"
                value={form.budgetMax}
                onChange={(e) =>
                  setForm({ ...form, budgetMax: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">
                City preference
              </label>
              <input
                type="text"
                value={form.cityPref}
                onChange={(e) => setForm({ ...form, cityPref: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">
                Timeline
              </label>
              <select
                value={form.timeline}
                onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white"
              >
                <option value="">Not specified</option>
                <option value="immediate">Immediate</option>
                <option value="1month">Within 1 month</option>
                <option value="3months">Within 3 months</option>
                <option value="6months">Within 6 months</option>
                <option value="exploring">Just exploring</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">
                Purpose
              </label>
              <select
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white"
              >
                <option value="">Not specified</option>
                <option value="self-use">Self use</option>
                <option value="investment">Investment</option>
                <option value="rental">Rental income</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">
                Funding
              </label>
              <select
                value={form.funding}
                onChange={(e) => setForm({ ...form, funding: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white"
              >
                <option value="">Not specified</option>
                <option value="own-funds">Own funds</option>
                <option value="home-loan">Home loan</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">
              Property of interest
            </label>
            <select
              value={form.propertyId}
              onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white"
            >
              <option value="">None</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">
              Assign to
            </label>
            <select
              value={form.assignedToId}
              onChange={(e) =>
                setForm({ ...form, assignedToId: e.target.value })
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white"
            >
              <option value="">Me</option>
              {users
                .filter((u) => u.isActive)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">
              Notes / requirement
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
            />
          </div>
          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}
        </div>
        <div className="border-t px-5 py-3 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-ink-200)] text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-4 py-2 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Lead"}
          </button>
        </div>
      </form>
    </div>
  );
}
