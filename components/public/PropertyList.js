"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PropertyCard from "./PropertyCard";

export default function PropertyList() {
  const searchParams = useSearchParams();
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const params = new URLSearchParams(searchParams.toString());
    if (sort && sort !== "newest") params.set("sort", sort);

    fetch(`/api/properties?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams, sort]);

  return (
    <div>
      {/* Sort + count bar */}
      <div className="flex items-center justify-between mb-5 px-1">
        <p className="text-sm text-[var(--color-ink-700)] numeral">
          {loading ? (
            <span className="inline-block h-4 w-32 bg-[var(--color-ink-100)] rounded animate-pulse" />
          ) : (
            <>
              <strong className="text-[var(--color-ink-900)]">{data.total}</strong>{" "}
              {data.total === 1 ? "property" : "properties"} found
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort"
            className="text-xs text-[var(--color-ink-500)] hidden sm:inline"
          >
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 text-sm rounded-md border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none bg-white"
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          title="Couldn't load properties"
          description={error}
        />
      ) : data.items.length === 0 ? (
        <EmptyState
          title="No properties match your filters"
          description="Try adjusting your filters or clearing them to see more results."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {data.items.map((p) => (
            <PropertyCard key={p.slug} property={p} size="grid" />
          ))}
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-[var(--color-ink-100)] aspect-[4/3] animate-pulse" />
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-ink-100)] p-10 lg:p-16 text-center">
      <div className="w-14 h-14 mx-auto rounded-full bg-[var(--color-bg-muted)] grid place-items-center mb-4">
        <svg
          className="w-6 h-6 text-[var(--color-ink-400)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-ink-900)] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-ink-600)] max-w-sm mx-auto">
        {description}
      </p>
    </div>
  );
}
