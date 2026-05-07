"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiOutlineMenuAlt4,
  HiOutlineX,
  HiOutlineSearch,
  HiOutlinePhone,
} from "react-icons/hi";
import { FiArrowUpRight } from "react-icons/fi";
import { SITE, NAV_LINKS, CONTACT } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/properties?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[var(--color-ink-200)]"
          : "bg-white border-b border-[var(--color-ink-100)]"
      }`}
    >
      <nav className="container-x h-16 md:h-18 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-9 h-9 rounded-lg bg-[var(--color-brand-700)] grid place-items-center text-white">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M12 3 L21 10 L21 21 L15 21 L15 14 L9 14 L9 21 L3 21 L3 10 Z" />
            </svg>
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-semibold text-[var(--color-ink-900)] tracking-tight">
              {SITE.logoText}
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-500)] mt-0.5">
              {SITE.logoSub}
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="px-4 py-2 text-sm text-[var(--color-ink-700)] hover:text-[var(--color-brand-700)] hover:bg-[var(--color-brand-50)] rounded-md transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Search button */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search properties"
            className="w-10 h-10 grid place-items-center rounded-md text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)] transition-colors"
          >
            <HiOutlineSearch className="text-xl" />
          </button>

          {/* Phone (desktop) */}
          <a
            href={CONTACT.phoneHref}
            className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-ink-700)] hover:text-[var(--color-brand-700)] transition-colors"
          >
            <HiOutlinePhone className="text-base" />
            <span className="hidden xl:inline">{CONTACT.phone}</span>
          </a>

          {/* CTA */}
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-[var(--color-brand-700)] hover:bg-[var(--color-brand-800)] text-white text-sm font-medium transition-colors"
          >
            Schedule Visit
            <FiArrowUpRight />
          </Link>

          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="lg:hidden w-10 h-10 grid place-items-center rounded-md text-[var(--color-ink-900)] hover:bg-[var(--color-ink-100)] transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <HiOutlineX size={22} /> : <HiOutlineMenuAlt4 size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-[var(--color-ink-200)]">
          <ul className="container-x py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-base text-[var(--color-ink-800)] hover:bg-[var(--color-brand-50)] hover:text-[var(--color-brand-700)] rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-3 px-4 flex flex-col gap-3">
              <a
                href={CONTACT.phoneHref}
                className="flex items-center gap-2 text-sm text-[var(--color-ink-700)]"
              >
                <HiOutlinePhone />
                {CONTACT.phone}
              </a>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-md bg-[var(--color-brand-700)] text-white text-sm font-medium"
              >
                Schedule Visit
                <FiArrowUpRight />
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-[var(--color-ink-900)]/60 backdrop-blur-sm animate-overlay-in"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="container-x pt-24"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-2xl shadow-2xl p-2 max-w-3xl mx-auto animate-popup-in"
            >
              <div className="flex items-center gap-3 px-4">
                <HiOutlineSearch className="text-2xl text-[var(--color-ink-500)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by city, locality, project, or builder..."
                  autoFocus
                  className="flex-1 py-4 text-base text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-400)] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="w-9 h-9 grid place-items-center rounded-md text-[var(--color-ink-500)] hover:bg-[var(--color-ink-100)]"
                >
                  <HiOutlineX />
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-md bg-[var(--color-brand-700)] hover:bg-[var(--color-brand-800)] text-white text-sm font-medium"
                >
                  Search
                </button>
              </div>
              <div className="px-4 py-3 border-t border-[var(--color-ink-100)] mt-1">
                <p className="text-xs text-[var(--color-ink-500)] mb-2">
                  Popular searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Whitefield 3BHK",
                    "Bandra Sea View",
                    "HSR Villas",
                    "Gachibowli",
                  ].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        router.push(
                          `/properties?q=${encodeURIComponent(q)}`
                        );
                        setSearchOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-full bg-[var(--color-ink-100)] hover:bg-[var(--color-brand-50)] hover:text-[var(--color-brand-700)] text-xs text-[var(--color-ink-700)] transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
