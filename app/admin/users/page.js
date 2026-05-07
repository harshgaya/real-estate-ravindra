"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LuPlus, LuPencil, LuPower } from "react-icons/lu";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/users");
    const d = await r.json();
    setUsers(d.items || []);
    setLoading(false);
  }

  async function toggleActive(u) {
    await fetch(`/api/admin/users/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !u.isActive }),
    });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Users</h1>
          <p className="text-xs text-[var(--color-ink-500)] mt-0.5">{users.length} users · admin can add, edit, deactivate</p>
        </div>
        <Link href="/admin/users/new" className="px-4 py-2 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium flex items-center gap-1.5"><LuPlus/>Add User</Link>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-ink-100)] overflow-hidden">
        {loading ? <div className="p-8 text-center text-sm text-[var(--color-ink-500)]">Loading...</div> : (
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-bg-soft)] text-[10px] uppercase tracking-wider text-[var(--color-ink-600)]">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Name</th>
                  <th className="px-4 py-2.5 text-left font-medium">Email</th>
                  <th className="px-4 py-2.5 text-left font-medium">Phone</th>
                  <th className="px-4 py-2.5 text-left font-medium">Role</th>
                  <th className="px-4 py-2.5 text-left font-medium">Team</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-[var(--color-ink-100)]">
                    <td className="px-4 py-2.5 font-medium">{u.name}</td>
                    <td className="px-4 py-2.5">{u.email}</td>
                    <td className="px-4 py-2.5">{u.phone || "-"}</td>
                    <td className="px-4 py-2.5"><span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded bg-[var(--color-bg-soft)]">{u.role}</span></td>
                    <td className="px-4 py-2.5">{u.team || "-"}</td>
                    <td className="px-4 py-2.5">{u.isActive ? <span className="text-green-700 text-xs font-medium">Active</span> : <span className="text-red-700 text-xs font-medium">Inactive</span>}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/users/${u.id}/edit`} className="w-8 h-8 grid place-items-center rounded hover:bg-[var(--color-bg-soft)]"><LuPencil/></Link>
                        <button onClick={() => toggleActive(u)} className="w-8 h-8 grid place-items-center rounded hover:bg-[var(--color-bg-soft)]" title={u.isActive ? "Deactivate" : "Activate"}><LuPower/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <div className="lg:hidden divide-y divide-[var(--color-ink-100)]">
            {users.map((u) => (
              <div key={u.id} className="p-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-[var(--color-ink-600)]">{u.email}</p>
                  <p className="text-[11px] text-[var(--color-ink-500)] mt-0.5">{u.role} · {u.isActive ? "Active" : "Inactive"}</p>
                </div>
                <Link href={`/admin/users/${u.id}/edit`} className="px-3 py-1.5 text-xs rounded bg-[var(--color-bg-soft)]"><LuPencil/></Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
