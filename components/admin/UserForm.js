"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MediaUploader from "@/components/admin/MediaUploader";
import { ROLES } from "@/lib/constants";

export default function UserForm({ userId }) {
  const router = useRouter();
  const isEdit = !!userId;
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "agent",
    team: "",
    managerId: "",
    designation: "",
    photo: "",
  });
  const [managers, setManagers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => {
        setManagers(
          (d.items || []).filter(
            (u) => u.role === "manager" || u.role === "admin",
          ),
        );
      });
    if (isEdit) {
      fetch(`/api/admin/users/${userId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.user) {
            setForm({
              name: d.user.name || "",
              email: d.user.email || "",
              password: "",
              phone: d.user.phone || "",
              role: d.user.role || "agent",
              team: d.user.team || "",
              managerId: d.user.managerId || "",
              designation: d.user.designation || "",
              photo: d.user.photo || "",
            });
          }
        });
    }
  }, [userId, isEdit]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const url = isEdit ? `/api/admin/users/${userId}` : "/api/admin/users";
      const method = isEdit ? "PATCH" : "POST";
      const body = { ...form };
      if (isEdit && !body.password) delete body.password;
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed");
      router.push("/admin/users");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {isEdit ? "Edit User" : "Add User"}
        </h1>
        <Link
          href="/admin/users"
          className="text-sm text-[var(--color-ink-600)]"
        >
          Cancel
        </Link>
      </div>
      <form
        onSubmit={submit}
        className="bg-white rounded-xl border border-[var(--color-ink-100)] p-5 lg:p-6 space-y-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Field
            label="Full name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            required
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            required
          />
          <Field
            label={isEdit ? "New password (leave blank to keep)" : "Password"}
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            required={!isEdit}
          />
          <Field
            label="Phone"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(v) => setForm({ ...form, role: v })}
            options={ROLES}
          />

          <Field
            label="Team"
            value={form.team}
            onChange={(v) => setForm({ ...form, team: v })}
            placeholder="north / south"
          />
          <Field
            label="Designation"
            value={form.designation}
            onChange={(v) => setForm({ ...form, designation: v })}
          />
          <Select
            label="Reports to"
            value={form.managerId}
            onChange={(v) => setForm({ ...form, managerId: v })}
            options={[
              { value: "", label: "None" },
              ...managers.map((m) => ({
                value: m.id,
                label: `${m.name} (${m.role})`,
              })),
            ]}
          />
        </div>
        <div>
          <MediaUploader
            folder="users"
            accept="image/*"
            multiple={false}
            label="Profile photo"
            value={form.photo ? [{ url: form.photo, name: "photo" }] : []}
            onChange={(arr) => setForm({ ...form, photo: arr[0]?.url || "" })}
          />
        </div>
        {error && (
          <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Link
            href="/admin/users"
            className="px-4 py-2 rounded-lg border border-[var(--color-ink-200)] text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium disabled:opacity-60"
          >
            {submitting ? "Saving..." : isEdit ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5">
        {label}
        {required && " *"}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"
      />
    </div>
  );
}
function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5">{label}</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
