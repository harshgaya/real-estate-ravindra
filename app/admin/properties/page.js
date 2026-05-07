"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LuPlus, LuPencil, LuTrash, LuEye, LuRotateCcw } from "react-icons/lu";

export default function PropertiesPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [q, statusFilter]);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("status", statusFilter);
    const r = await fetch(`/api/admin/properties?${params.toString()}`);
    const d = await r.json();
    setItems(d.items || []);
    setLoading(false);
  }

  async function remove(id, name) {
    if (
      !confirm(
        `Deactivate "${name}"? It will be hidden from the public site but kept in the database.`,
      )
    )
      return;
    await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    load();
  }

  async function reactivate(id) {
    await fetch(`/api/admin/properties/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });
    load();
  }

  const counts = {
    active: items.filter((p) => p.isActive).length,
    inactive: items.filter((p) => !p.isActive).length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Properties</h1>
          <p className="text-xs text-[var(--color-ink-500)] mt-0.5">
            {items.length} {statusFilter === "all" ? "total" : statusFilter}
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="px-4 py-2 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium flex items-center gap-1.5"
        >
          <LuPlus />
          Add Property
        </Link>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
          className="flex-1 min-w-[200px] max-w-md px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
        />

        <div className="flex bg-white border border-[var(--color-ink-200)] rounded-lg overflow-hidden text-sm">
          {[
            { key: "active", label: "Active" },
            { key: "inactive", label: "Inactive" },
            { key: "all", label: "All" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-2 transition-colors ${
                statusFilter === tab.key
                  ? "bg-[var(--color-brand-700)] text-white font-medium"
                  : "text-[var(--color-ink-700)] hover:bg-[var(--color-bg-soft)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-12 text-sm text-[var(--color-ink-500)]">
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-12 text-sm text-[var(--color-ink-500)]">
            No {statusFilter === "all" ? "" : statusFilter} properties found
          </div>
        ) : (
          items.map((p) => (
            <div
              key={p.id}
              className={`bg-white rounded-xl border border-[var(--color-ink-100)] overflow-hidden transition-opacity ${
                !p.isActive ? "opacity-60" : ""
              }`}
            >
              <div className="aspect-[4/3] bg-[var(--color-bg-soft)] relative">
                {p.coverImage && (
                  <img
                    src={p.coverImage}
                    alt={p.name}
                    className={`w-full h-full object-cover ${!p.isActive ? "grayscale" : ""}`}
                  />
                )}
                {!p.isActive && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded bg-red-600 text-white">
                    Inactive
                  </span>
                )}
                {p.isActive && p.isFeatured && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded bg-amber-500 text-white">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-medium text-sm truncate">{p.name}</p>
                <p className="text-xs text-[var(--color-ink-500)] truncate mt-0.5">
                  {p.location}
                </p>
                <p className="text-xs font-medium mt-1">
                  {p.priceLabel || `Rs ${p.priceMin}`}
                </p>
                <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-[var(--color-ink-100)]">
                  <Link
                    href={`/properties/${p.slug}`}
                    target="_blank"
                    className="w-8 h-8 grid place-items-center rounded hover:bg-[var(--color-bg-soft)]"
                    title="View public page"
                  >
                    <LuEye />
                  </Link>
                  <Link
                    href={`/admin/properties/${p.id}/edit`}
                    className="w-8 h-8 grid place-items-center rounded hover:bg-[var(--color-bg-soft)]"
                    title="Edit"
                  >
                    <LuPencil />
                  </Link>
                  {p.isActive ? (
                    <button
                      onClick={() => remove(p.id, p.name)}
                      className="w-8 h-8 grid place-items-center rounded hover:bg-red-50 text-red-600"
                      title="Deactivate"
                    >
                      <LuTrash />
                    </button>
                  ) : (
                    <button
                      onClick={() => reactivate(p.id)}
                      className="w-8 h-8 grid place-items-center rounded hover:bg-green-50 text-green-700"
                      title="Reactivate"
                    >
                      <LuRotateCcw />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
