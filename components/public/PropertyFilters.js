"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { HiX } from "react-icons/hi";
import { LuSlidersHorizontal } from "react-icons/lu";
import {
  PROPERTY_TYPES,
  BUDGET_RANGES,
  CITIES,
  BEDROOM_OPTIONS,
  INTENT_OPTIONS,
} from "@/lib/constants";

export default function PropertyFilters({ totalCount = 0 }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [filters, setFilters] = useState({
    intent: searchParams.get("intent") || "buy",
    city: searchParams.get("city") || "",
    type: searchParams.get("type") || "",
    budget: searchParams.get("budget") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    q: searchParams.get("q") || "",
  });

  useEffect(() => {
    setFilters({
      intent: searchParams.get("intent") || "buy",
      city: searchParams.get("city") || "",
      type: searchParams.get("type") || "",
      budget: searchParams.get("budget") || "",
      bedrooms: searchParams.get("bedrooms") || "",
      q: searchParams.get("q") || "",
    });
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    apply(newFilters);
  };

  const apply = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/properties?${params.toString()}`, { scroll: false });
  };

  const reset = () => {
    setFilters({
      intent: "buy",
      city: "",
      type: "",
      budget: "",
      bedrooms: "",
      q: "",
    });
    router.push("/properties", { scroll: false });
  };

  const hasActiveFilters =
    filters.city || filters.type || filters.budget || filters.bedrooms || filters.q;

  const activeCount =
    [filters.city, filters.type, filters.budget, filters.bedrooms, filters.q].filter(Boolean)
      .length;

  return (
    <>
      {/* Mobile filter toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden flex items-center justify-between w-full px-4 py-3 bg-white rounded-xl border border-[var(--color-ink-100)] mb-4"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink-900)]">
          <LuSlidersHorizontal />
          Filters {activeCount > 0 && `(${activeCount})`}
        </span>
        <span className="text-xs text-[var(--color-ink-500)]">
          {mobileOpen ? "Hide" : "Show"}
        </span>
      </button>

      <aside
        className={`bg-white rounded-2xl border border-[var(--color-ink-100)] p-5 lg:p-6 lg:sticky lg:top-24 ${
          mobileOpen ? "block" : "hidden lg:block"
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-[var(--color-ink-900)]">
            Filters
          </h3>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1 text-xs text-[var(--color-brand-700)] hover:text-[var(--color-brand-800)]"
            >
              <HiX />
              Clear all
            </button>
          )}
        </div>

        {totalCount > 0 && (
          <p className="text-xs text-[var(--color-ink-500)] mb-5 numeral">
            Showing {totalCount} {totalCount === 1 ? "result" : "results"}
          </p>
        )}

        <FilterGroup label="Looking to">
          <div className="flex gap-1.5 p-1 bg-[var(--color-bg-soft)] rounded-lg">
            {INTENT_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => updateFilter("intent", o.value)}
                className={`flex-1 py-2 px-3 text-xs rounded-md transition-colors ${
                  filters.intent === o.value
                    ? "bg-white text-[var(--color-ink-900)] font-medium shadow-sm"
                    : "text-[var(--color-ink-600)] hover:text-[var(--color-ink-900)]"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="City">
          <select
            value={filters.city}
            onChange={(e) => updateFilter("city", e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] focus:ring-2 focus:ring-[var(--color-brand-600)]/15 outline-none bg-white"
          >
            <option value="">All cities</option>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </FilterGroup>

        <FilterGroup label="Property type">
          <div className="flex flex-wrap gap-1.5">
            {PROPERTY_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => updateFilter("type", t.value)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  filters.type === t.value
                    ? "bg-[var(--color-brand-700)] text-white border-[var(--color-brand-700)]"
                    : "bg-white text-[var(--color-ink-700)] border-[var(--color-ink-200)] hover:border-[var(--color-ink-400)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Bedrooms">
          <div className="grid grid-cols-5 gap-1.5">
            {BEDROOM_OPTIONS.map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => updateFilter("bedrooms", b.value)}
                className={`py-2 text-xs rounded-md border transition-colors ${
                  filters.bedrooms === b.value
                    ? "bg-[var(--color-brand-700)] text-white border-[var(--color-brand-700)]"
                    : "bg-white text-[var(--color-ink-700)] border-[var(--color-ink-200)] hover:border-[var(--color-ink-400)]"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Budget" last>
          <div className="space-y-1.5">
            {BUDGET_RANGES.map((b) => (
              <label
                key={b.value}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="budget"
                  checked={filters.budget === b.value}
                  onChange={() => updateFilter("budget", b.value)}
                  className="w-4 h-4 accent-[var(--color-brand-700)]"
                />
                <span
                  className={`text-sm ${
                    filters.budget === b.value
                      ? "text-[var(--color-ink-900)] font-medium"
                      : "text-[var(--color-ink-700)] group-hover:text-[var(--color-ink-900)]"
                  }`}
                >
                  {b.label}
                </span>
              </label>
            ))}
          </div>
        </FilterGroup>
      </aside>
    </>
  );
}

function FilterGroup({ label, children, last = false }) {
  return (
    <div className={`pb-5 ${last ? "" : "mb-5 border-b border-[var(--color-ink-100)]"}`}>
      <p className="text-[11px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] font-medium mb-2.5">
        {label}
      </p>
      {children}
    </div>
  );
}
