"use client";

import { useEffect, useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { HiCheck } from "react-icons/hi2";
import { WELCOME_POPUP, LEAD_SOURCES, VALIDATION } from "@/lib/constants";
import { usePathname } from "next/navigation";

export default function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  useEffect(() => {
    // Check if already shown recently
    if (typeof window === "undefined") return;
    try {
      const seen = localStorage.getItem(WELCOME_POPUP.storageKey);
      if (seen) {
        const days = (Date.now() - parseInt(seen, 10)) / (1000 * 60 * 60 * 24);
        if (days < WELCOME_POPUP.storageDays) return;
      }
    } catch {
      // localStorage blocked - skip silently
    }

    const timer = setTimeout(
      () => setOpen(true),
      WELCOME_POPUP.delaySeconds * 1000,
    );
    return () => clearTimeout(timer);
  }, []);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(WELCOME_POPUP.storageKey, Date.now().toString());
    } catch {
      // ignore
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!form.name.trim() || form.name.trim().length < 2) {
      return setError("Please enter your name");
    }
    if (!VALIDATION.phoneRegex.test(form.phone.replace(/\D/g, "").slice(-10))) {
      return setError("Please enter a valid 10-digit Indian mobile number");
    }
    if (!VALIDATION.emailRegex.test(form.email)) {
      return setError("Please enter a valid email address");
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.replace(/\D/g, "").slice(-10),
          email: form.email.trim().toLowerCase(),
          source: LEAD_SOURCES.WELCOME_POPUP,
          page: typeof window !== "undefined" ? window.location.pathname : "/",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not submit. Please try again.");
      }

      setSubmitted(true);
      try {
        localStorage.setItem(WELCOME_POPUP.storageKey, Date.now().toString());
      } catch {}

      // Auto close after 3s
      setTimeout(() => setOpen(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-[var(--color-ink-900)]/70 backdrop-blur-sm animate-overlay-in grid place-items-center p-4"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-popup-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-popup-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-8 h-8 grid place-items-center rounded-full bg-white/90 hover:bg-white text-[var(--color-ink-700)] shadow-sm"
        >
          <HiOutlineX />
        </button>

        {submitted ? (
          /* Thank you state */
          <div className="p-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-brand-50)] grid place-items-center mb-6">
              <HiCheck className="text-3xl text-[var(--color-brand-700)]" />
            </div>
            <h3 className="text-2xl font-semibold text-[var(--color-ink-900)] mb-3">
              Thanks, {form.name.split(" ")[0]}!
            </h3>
            <p className="text-[var(--color-ink-600)] leading-relaxed">
              Our advisor will reach out within 24 hours with a curated
              shortlist tailored to your needs.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1">
            {/* Top accent */}
            <div className="bg-gradient-to-br from-[var(--color-brand-700)] to-[var(--color-brand-800)] px-8 py-7 text-white">
              <p className="text-[10px] tracking-[0.24em] uppercase text-[var(--color-accent-500)] font-medium mb-3">
                Welcome
              </p>
              <h3
                id="welcome-popup-title"
                className="text-2xl font-semibold leading-tight mb-2"
              >
                {WELCOME_POPUP.title}
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                {WELCOME_POPUP.subtitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="popup-name"
                    className="block text-xs font-medium text-[var(--color-ink-700)] mb-1.5"
                  >
                    Your Name
                  </label>
                  <input
                    id="popup-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full px-3.5 py-3 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] focus:ring-2 focus:ring-[var(--color-brand-600)]/15 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="popup-phone"
                    className="block text-xs font-medium text-[var(--color-ink-700)] mb-1.5"
                  >
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <span className="px-3 grid place-items-center text-sm text-[var(--color-ink-700)] bg-[var(--color-bg-muted)] rounded-lg border border-[var(--color-ink-200)]">
                      +91
                    </span>
                    <input
                      id="popup-phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile"
                      autoComplete="tel"
                      className="flex-1 px-3.5 py-3 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] focus:ring-2 focus:ring-[var(--color-brand-600)]/15 outline-none transition-colors numeral"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="popup-email"
                    className="block text-xs font-medium text-[var(--color-ink-700)] mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="popup-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full px-3.5 py-3 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] focus:ring-2 focus:ring-[var(--color-brand-600)]/15 outline-none transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-5 w-full py-3 rounded-lg bg-[var(--color-brand-700)] hover:bg-[var(--color-brand-800)] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
              >
                {submitting ? "Submitting..." : WELCOME_POPUP.cta}
              </button>

              <p className="mt-4 text-[11px] text-[var(--color-ink-500)] leading-relaxed text-center">
                By submitting, you agree to our privacy policy. We won't spam.
              </p>

              {/* Mini trust list */}
              <ul className="mt-5 pt-5 border-t border-[var(--color-ink-100)] space-y-2">
                {WELCOME_POPUP.benefits.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-xs text-[var(--color-ink-600)]"
                  >
                    <HiCheck className="text-[var(--color-brand-600)] flex-shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
