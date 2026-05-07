"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiSearch, FiMapPin } from "react-icons/fi";
import {
  SEARCH_TABS,
  PROPERTY_TYPES,
  BUDGET_RANGES,
  TRENDING_SEARCHES,
  STATS,
} from "@/lib/constants";

export default function Hero() {
  const router = useRouter();
  const [active, setActive] = useState("buy");
  const [location, setLocation] = useState("");
  const [propType, setPropType] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("intent", active);
    if (location.trim()) params.set("q", location.trim());
    if (propType) params.set("type", propType);
    if (budget) params.set("budget", budget);

    const target = active === "projects" ? "/projects" : "/properties";
    router.push(`${target}?${params.toString()}`);
  };

  const handleTrendingClick = (query) => {
    router.push(`/properties?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative bg-[var(--color-ink-900)] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="ken-burns absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=85"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink-900)]/90 via-[var(--color-ink-900)]/65 to-[var(--color-ink-900)]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink-900)]/85 via-transparent to-[var(--color-ink-900)]/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-x pt-14 pb-20 sm:pt-20 sm:pb-28 lg:pt-28 lg:pb-36">
        {/* Eyebrow */}
        <div
          className="reveal-fade flex items-center gap-3 mb-4 sm:mb-6"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="h-px w-8 sm:w-10 bg-[var(--color-accent-500)]" />
          <span className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-[var(--color-accent-500)] font-medium">
            Curated since 2014
          </span>
        </div>

        {/* Headline */}
        <h1
          className="reveal-up text-[clamp(28px,7vw,80px)] leading-[1.05] tracking-tight font-semibold text-white max-w-4xl text-balance"
          style={{ animationDelay: "0.2s" }}
        >
          Find your next home, the right way.
        </h1>

        <p
          className="reveal-up mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-white/75 max-w-xl leading-relaxed"
          style={{ animationDelay: "0.3s" }}
        >
          A small, opinionated catalog of residences and projects across India,
          chosen for build quality, neighbourhood, and quiet livability.
        </p>

        {/* Search */}
        <div
          className="reveal-up mt-8 sm:mt-10 max-w-4xl"
          style={{ animationDelay: "0.5s" }}
        >
          {/* Tabs - horizontal scroll on mobile */}
          <div className="flex items-center gap-1 mb-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {SEARCH_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(t.id)}
                className={`px-4 sm:px-5 py-2.5 text-xs sm:text-sm rounded-t-lg transition-all duration-200 whitespace-nowrap ${
                  active === t.id
                    ? "bg-white text-[var(--color-ink-900)] font-medium"
                    : "bg-white/10 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/15"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search form - stacks on mobile, row on desktop */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-xl sm:rounded-r-xl sm:rounded-bl-xl shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_auto] divide-y md:divide-y-0 md:divide-x divide-[var(--color-ink-100)]">
              <div className="p-3.5 sm:p-4 lg:p-5">
                <label
                  htmlFor="hero-location"
                  className="block text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] font-medium mb-1.5"
                >
                  Location
                </label>
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-[var(--color-brand-700)] flex-shrink-0" />
                  <input
                    id="hero-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bengaluru, Whitefield..."
                    className="w-full text-sm text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-400)] bg-transparent outline-none min-w-0"
                  />
                </div>
              </div>

              <div className="p-3.5 sm:p-4 lg:p-5">
                <label
                  htmlFor="hero-type"
                  className="block text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] font-medium mb-1.5"
                >
                  Property Type
                </label>
                <select
                  id="hero-type"
                  value={propType}
                  onChange={(e) => setPropType(e.target.value)}
                  className="w-full text-sm text-[var(--color-ink-900)] bg-transparent outline-none cursor-pointer"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 sm:p-4 lg:p-5">
                <label
                  htmlFor="hero-budget"
                  className="block text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] font-medium mb-1.5"
                >
                  Budget
                </label>
                <select
                  id="hero-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full text-sm text-[var(--color-ink-900)] bg-transparent outline-none cursor-pointer"
                >
                  {BUDGET_RANGES.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-2.5 sm:p-3 flex items-stretch">
                <button
                  type="submit"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 lg:px-8 py-3 md:py-0 bg-[var(--color-brand-700)] hover:bg-[var(--color-brand-800)] text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <FiSearch className="text-base" />
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Trending - horizontal scroll on mobile */}
          <div className="mt-4 sm:mt-5 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-white/60 mr-2 font-medium">
              Trending
            </span>
            {TRENDING_SEARCHES.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTrendingClick(tag)}
                className="px-3 sm:px-3.5 py-1.5 rounded-full border border-white/25 text-[11px] sm:text-[12px] text-white hover:bg-white hover:text-[var(--color-ink-900)] hover:border-transparent transition-all whitespace-nowrap"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Stats - hidden on small mobile, 2 col on tablet, 4 col on desktop */}
        <div
          className="reveal-up hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12 mt-12 sm:mt-16 lg:mt-20 pt-8 lg:pt-10 border-t border-white/15 max-w-4xl"
          style={{ animationDelay: "0.7s" }}
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="numeral text-2xl lg:text-3xl text-white font-semibold leading-none">
                {s.num}
              </p>
              <p className="text-[10px] tracking-[0.22em] uppercase text-white/60 mt-2">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
