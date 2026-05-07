"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get("redirect") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Login failed");
      window.location.href = redirect;
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-ink-900)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="flex items-center gap-2.5 justify-center mb-8"
        >
          <span className="w-10 h-10 rounded-lg bg-[var(--color-accent-500)] grid place-items-center text-[var(--color-ink-900)]">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M12 3 L21 10 L21 21 L15 21 L15 14 L9 14 L9 21 L3 21 L3 10 Z" />
            </svg>
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-semibold text-white">CRM</span>
            <span className="text-[10px] tracking-[0.22em] uppercase text-white/55 mt-0.5">
              Admin
            </span>
          </div>
        </Link>
        <div className="bg-white rounded-2xl p-7 lg:p-8 shadow-2xl">
          <h1 className="text-xl font-semibold mb-1">Sign in</h1>
          <p className="text-sm text-[var(--color-ink-600)] mb-6">
            Enter your credentials
          </p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
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
              className="w-full py-3 rounded-lg bg-[var(--color-brand-700)] hover:bg-[var(--color-brand-800)] disabled:opacity-60 text-white text-sm font-medium"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
