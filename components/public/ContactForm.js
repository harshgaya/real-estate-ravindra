"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CONTACT_SUBJECTS, VALIDATION, LEAD_SOURCES } from "@/lib/constants";

export default function ContactForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: CONTACT_SUBJECTS[0],
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || form.name.trim().length < VALIDATION.minNameLength)
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
          message: `[${form.subject}] ${form.message}`.trim(),
          source: LEAD_SOURCES.CONTACT_PAGE,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not submit. Please try again.");
      }
      router.replace("/thank-you");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          What can we help with?
        </label>
        <select
          name="subject"
          value={form.subject}
          onChange={onChange}
          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none bg-white"
        >
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-[var(--color-ink-700)] mb-1.5">
          Message (optional)
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={onChange}
          rows={4}
          placeholder="Tell us a bit about what you're looking for..."
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
        className="w-full sm:w-auto px-7 py-3 rounded-lg bg-[var(--color-brand-700)] hover:bg-[var(--color-brand-800)] disabled:opacity-60 text-white text-sm font-medium transition-colors"
      >
        {submitting ? "Sending..." : "Send message"}
      </button>

      <p className="text-[11px] text-[var(--color-ink-500)] pt-1">
        By submitting, you agree to our privacy policy. We won't spam.
      </p>
    </form>
  );
}
