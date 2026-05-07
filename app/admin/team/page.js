"use client";
import { useState, useEffect } from "react";
import { LuPhone, LuMail } from "react-icons/lu";

export default function TeamPage() {
  const [users, setUsers] = useState([]);
  useEffect(() => { fetch("/api/admin/users").then((r) => r.json()).then((d) => setUsers((d.items || []).filter((u) => u.isActive))); }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Team</h1>
        <p className="text-xs text-[var(--color-ink-500)] mt-0.5">{users.length} active members</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <div key={u.id} className="bg-white rounded-xl border border-[var(--color-ink-100)] p-5">
            <div className="flex items-center gap-3">
              {u.photo ? (
                <img src={u.photo} alt={u.name} className="w-12 h-12 rounded-full object-cover"/>
              ) : (
                <div className="w-12 h-12 rounded-full bg-[var(--color-bg-soft)] grid place-items-center text-base font-medium">{u.name?.[0]?.toUpperCase()}</div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{u.name}</p>
                <p className="text-[11px] uppercase tracking-wider text-[var(--color-ink-500)]">{u.role}</p>
                {u.designation && <p className="text-xs text-[var(--color-ink-600)]">{u.designation}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-[var(--color-ink-100)]">
              {u.phone && <a href={`tel:${u.phone}`} className="flex items-center gap-2 text-xs text-[var(--color-ink-700)] hover:text-[var(--color-brand-700)]"><LuPhone/>{u.phone}</a>}
              <a href={`mailto:${u.email}`} className="flex items-center gap-2 text-xs text-[var(--color-ink-700)] hover:text-[var(--color-brand-700)] truncate"><LuMail/>{u.email}</a>
              {u.team && <p className="text-[11px] text-[var(--color-ink-500)] mt-1">Team: {u.team}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
