"use client";

import { useState } from "react";
import { HiCheck } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa6";
import { CONTACT, VALIDATION, LEAD_SOURCES } from "@/lib/constants";

export default function PropertyContactForm({ propertyName, propertySlug, priceLabel }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: `I'm interested in ${propertyName}. Please share more details.`,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || form.name.trim().length < 2)
      return setError("Please enter your name");
    if (!VALIDATION.phoneRegex.test(form.phone.replace(/\D/g, "").slice(-10)))
      return setError("Please enter a valid 10-digit Indian mobile");
    if (!VALIDATION.emailRegex.test(form.email))
      return setError("Please enter a valid email");

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.replace(/\D/g, "").slice(-10),
          email: form.email.trim().toLowerCase(),
          message: form.message,
          source: LEAD_SOURCES.PROPERTY_DETAIL,
          propertySlug,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not submit. Please try again.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white border border-[var(--color-ink-100)] rounded-2xl p-8 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-[var(--color-brand-50)] grid place-items-center mb-5">
          <HiCheck className="text-3xl text-[var(--color-brand-700)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-ink-900)] mb-2">
          Thanks, {form.name.split(" ")[0]}!
        </h3>
        <p className="text-sm text-[var(--color-ink-600)] leading-relaxed">
          Our advisor will contact you within 24 hours about{" "}
          <strong>{propertyName}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[var(--color-ink-100)] rounded-2xl overflow-hidden">
      {/* Price header */}
      {priceLabel && (
        <div className="bg-gradient-to-br from-[var(--color-brand-700)] to-[var(--color-brand-800)] text-white p-5">
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/70 font-medium mb-1">
            Starting from
          </p>
          <p className="numeral text-2xl font-semibold">{priceLabel}</p>
          <p className="text-xs text-white/75 mt-1">All inclusive · EMI options available</p>
        </div>
      )}

      <form onSubmit={submit} className="p-5 lg:p-6 space-y-3.5">
        <div>
          <label className="block text-xs font-medium text-[var(--color-ink-700)] mb-1.5">
            Your Name
          </label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
            placeholder="Full name"
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] focus:ring-2 focus:ring-[var(--color-brand-600)]/15 outline-none"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-ink-700)] mb-1.5">
            Mobile
          </label>
          <div className="flex gap-2">
            <span className="px-3 grid place-items-center text-sm bg-[var(--color-bg-muted)] rounded-lg border border-[var(--color-ink-200)]">
              +91
            </span>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.phone}
              onChange={onChange}
              placeholder="10-digit mobile"
              className="flex-1 px-3.5 py-2.5 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none numeral"
              autoComplete="tel"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-ink-700)] mb-1.5">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-ink-700)] mb-1.5">
            Message
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={onChange}
            rows={3}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none resize-none"
          />
        </div>

        {error && (
          <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-lg bg-[var(--color-brand-700)] hover:bg-[var(--color-brand-800)] disabled:opacity-60 text-white text-sm font-medium transition-colors"
        >
          {submitting ? "Sending..." : "Request a callback"}
        </button>

        {/* WhatsApp option */}
        <a
          href={`${CONTACT.whatsappHref}?text=${encodeURIComponent(`Hi, I'm interested in ${propertyName}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-lg border border-[var(--color-ink-200)] hover:border-[#25D366] hover:bg-[#25D366]/5 text-[var(--color-ink-800)] text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <FaWhatsapp className="text-[#25D366] text-base" />
          Chat on WhatsApp
        </a>

        <p className="text-[10px] text-[var(--color-ink-500)] text-center pt-1">
          By submitting, you agree to our privacy policy.
        </p>
      </form>
    </div>
  );
}
