"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LuPlus, LuPencil, LuTrash, LuStar } from "react-icons/lu";

export default function TestimonialsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/testimonials");
    const d = await r.json();
    setItems(d.items || []);
    setLoading(false);
  }

  async function remove(id) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Testimonials</h1>
          <p className="text-xs text-[var(--color-ink-500)] mt-0.5">{items.length} total · text and video supported</p>
        </div>
        <Link href="/admin/testimonials/new" className="px-4 py-2 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium flex items-center gap-1.5"><LuPlus/>Add Testimonial</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? <div className="col-span-2 text-center py-12 text-sm text-[var(--color-ink-500)]">Loading...</div> :
        items.length === 0 ? <div className="col-span-2 text-center py-12 text-sm text-[var(--color-ink-500)]">No testimonials yet</div> :
        items.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-[var(--color-ink-100)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {t.customerPhoto ? (
                  <img src={t.customerPhoto} alt={t.customerName} className="w-10 h-10 rounded-full object-cover flex-shrink-0"/>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[var(--color-bg-soft)] grid place-items-center text-sm font-medium flex-shrink-0">{t.customerName?.[0]?.toUpperCase()}</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">{t.customerName}</p>
                  {t.customerTitle && <p className="text-xs text-[var(--color-ink-500)]">{t.customerTitle}</p>}
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: t.rating }).map((_, i) => <LuStar key={i} className="text-amber-500 text-xs fill-amber-500"/>)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/admin/testimonials/${t.id}/edit`} className="w-8 h-8 grid place-items-center rounded hover:bg-[var(--color-bg-soft)]"><LuPencil/></Link>
                <button onClick={() => remove(t.id)} className="w-8 h-8 grid place-items-center rounded hover:bg-red-50 text-red-600"><LuTrash/></button>
              </div>
            </div>
            {t.type === "video" ? (
              <div className="mt-3 px-3 py-2 bg-[var(--color-bg-soft)] rounded text-xs">
                <span className="font-medium">Video:</span> <a href={t.videoUrl} target="_blank" rel="noopener" className="text-[var(--color-brand-700)] truncate">{t.videoUrl}</a>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[var(--color-ink-700)] line-clamp-3">{t.text}</p>
            )}
            <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-wider">
              {t.isFeatured && <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">Featured</span>}
              {t.isActive ? <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 font-medium">Active</span> : <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-medium">Hidden</span>}
              <span className="text-[var(--color-ink-500)]">Order: {t.displayOrder}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
