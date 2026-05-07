"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LuPlus } from "react-icons/lu";

const STATUSES = ["pending", "confirmed", "registered", "cancelled", "refunded"];

export default function BookingsPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [showNew, setShowNew] = useState(false);

  useEffect(() => { load(); }, [filter]);

  async function load() {
    const url = filter ? `/api/admin/bookings?status=${filter}` : "/api/admin/bookings";
    const r = await fetch(url);
    const d = await r.json();
    setItems(d.items || []);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Bookings</h1>
          <p className="text-xs text-[var(--color-ink-500)] mt-0.5">{items.length} bookings</p>
        </div>
        <button onClick={() => setShowNew(true)} className="px-4 py-2 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium flex items-center gap-1.5"><LuPlus/>New Booking</button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter("")} className={`px-3 py-1.5 text-xs rounded-lg ${!filter ? "bg-[var(--color-brand-700)] text-white" : "bg-white border border-[var(--color-ink-200)]"}`}>All</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-xs rounded-lg capitalize ${filter === s ? "bg-[var(--color-brand-700)] text-white" : "bg-white border border-[var(--color-ink-200)]"}`}>{s}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-ink-100)] overflow-hidden">
        {items.length === 0 ? <div className="text-center py-12 text-sm text-[var(--color-ink-500)]">No bookings</div> : (
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-bg-soft)] text-[10px] uppercase tracking-wider text-[var(--color-ink-600)]">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Booking #</th>
                  <th className="px-4 py-2.5 text-left font-medium">Lead</th>
                  <th className="px-4 py-2.5 text-left font-medium">Property</th>
                  <th className="px-4 py-2.5 text-left font-medium">Unit</th>
                  <th className="px-4 py-2.5 text-right font-medium">Total Value</th>
                  <th className="px-4 py-2.5 text-right font-medium">Received</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-left font-medium">KYC</th>
                </tr>
              </thead>
              <tbody>
                {items.map((b) => (
                  <tr key={b.id} className="border-t border-[var(--color-ink-100)] hover:bg-[var(--color-bg-soft)]">
                    <td className="px-4 py-2.5 font-mono text-xs">{b.bookingNumber}</td>
                    <td className="px-4 py-2.5">{b.lead?.name}</td>
                    <td className="px-4 py-2.5">{b.property?.name || "-"}</td>
                    <td className="px-4 py-2.5">{b.unitNumber || "-"}</td>
                    <td className="px-4 py-2.5 text-right">Rs {Number(b.totalValue || 0).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-2.5 text-right">Rs {Number(b.amountReceived || 0).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-2.5"><span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded bg-[var(--color-bg-soft)]">{b.status}</span></td>
                    <td className="px-4 py-2.5">{b.kycComplete ? <span className="text-green-700 text-xs font-medium">✓ Done</span> : <span className="text-amber-700 text-xs font-medium">Pending</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="lg:hidden divide-y divide-[var(--color-ink-100)]">
          {items.map((b) => (
            <div key={b.id} className="p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium font-mono">{b.bookingNumber}</p>
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded bg-[var(--color-bg-soft)]">{b.status}</span>
              </div>
              <p className="text-xs text-[var(--color-ink-600)] mt-1">{b.lead?.name} · {b.property?.name || "-"}</p>
              <p className="text-xs font-medium mt-1">Rs {Number(b.totalValue || 0).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      </div>

      {showNew && <NewBookingModal onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); load(); }}/>}
    </div>
  );
}

function NewBookingModal({ onClose, onCreated }) {
  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({ leadId: "", propertyId: "", unitNumber: "", configuration: "", totalValue: "", bookingAmount: "", paymentMode: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/leads?limit=200").then((r) => r.json()).then((d) => setLeads(d.items || []));
    fetch("/api/admin/properties").then((r) => r.json()).then((d) => setProperties(d.items || []));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/admin/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      onCreated();
    } finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <form onSubmit={submit} className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b"><h3 className="text-base font-semibold">New Booking</h3></div>
        <div className="p-5 space-y-3 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium mb-1.5">Lead *</label>
            <select required value={form.leadId} onChange={(e) => setForm({ ...form, leadId: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white">
              <option value="">Select lead</option>
              {leads.map((l) => <option key={l.id} value={l.id}>{l.name} - {l.primaryPhone}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Property</label>
            <select value={form.propertyId} onChange={(e) => setForm({ ...form, propertyId: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white">
              <option value="">None</option>
              {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5">Unit number</label>
              <input type="text" value={form.unitNumber} onChange={(e) => setForm({ ...form, unitNumber: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)]"/>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">Configuration</label>
              <input type="text" value={form.configuration} onChange={(e) => setForm({ ...form, configuration: e.target.value })} placeholder="3 BHK" className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)]"/>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">Total value (Rs)</label>
              <input type="number" value={form.totalValue} onChange={(e) => setForm({ ...form, totalValue: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)]"/>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">Booking amount</label>
              <input type="number" value={form.bookingAmount} onChange={(e) => setForm({ ...form, bookingAmount: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)]"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Payment mode</label>
            <input type="text" value={form.paymentMode} onChange={(e) => setForm({ ...form, paymentMode: e.target.value })} placeholder="Cheque, NEFT, UPI..." className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)]"/>
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
