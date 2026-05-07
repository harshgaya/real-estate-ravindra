"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MediaUploader from "@/components/admin/MediaUploader";

export default function TestimonialForm({ id }) {
  const router = useRouter();
  const isEdit = !!id;
  const [form, setForm] = useState({
    customerName: "", customerTitle: "", customerPhoto: "",
    rating: 5, type: "text", text: "", videoUrl: "", videoThumbnail: "",
    propertyId: "", displayOrder: 0, isFeatured: false, isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    fetch("/api/admin/testimonials").then((r) => r.json()).then((d) => {
      const t = (d.items || []).find((x) => x.id === id);
      if (t) setForm({
        customerName: t.customerName || "",
        customerTitle: t.customerTitle || "",
        customerPhoto: t.customerPhoto || "",
        rating: t.rating || 5,
        type: t.type || "text",
        text: t.text || "",
        videoUrl: t.videoUrl || "",
        videoThumbnail: t.videoThumbnail || "",
        propertyId: t.propertyId || "",
        displayOrder: t.displayOrder || 0,
        isFeatured: t.isFeatured || false,
        isActive: t.isActive !== false,
      });
    });
  }, [id, isEdit]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const url = isEdit ? `/api/admin/testimonials/${id}` : "/api/admin/testimonials";
      const method = isEdit ? "PATCH" : "POST";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed");
      router.push("/admin/testimonials");
    } catch (err) {
      setError(err.message);
    } finally { setSubmitting(false); }
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{isEdit ? "Edit Testimonial" : "Add Testimonial"}</h1>
        <Link href="/admin/testimonials" className="text-sm text-[var(--color-ink-600)]">Cancel</Link>
      </div>
      <form onSubmit={submit} className="bg-white rounded-xl border border-[var(--color-ink-100)] p-5 lg:p-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Field label="Customer name" value={form.customerName} onChange={(v) => setForm({ ...form, customerName: v })} required/>
          <Field label="Customer title (e.g. Software Engineer, Bengaluru)" value={form.customerTitle} onChange={(v) => setForm({ ...form, customerTitle: v })}/>
        </div>
        <MediaUploader folder="testimonials" accept="image/*" multiple={false} label="Customer photo (optional)" value={form.customerPhoto ? [{ url: form.customerPhoto, name: "photo" }] : []} onChange={(arr) => setForm({ ...form, customerPhoto: arr[0]?.url || "" })}/>

        <div>
          <label className="block text-xs font-medium mb-2">Type</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setForm({ ...form, type: "text" })} className={`px-4 py-2 text-sm rounded-lg border ${form.type === "text" ? "bg-[var(--color-brand-700)] border-[var(--color-brand-700)] text-white" : "border-[var(--color-ink-200)]"}`}>Text</button>
            <button type="button" onClick={() => setForm({ ...form, type: "video" })} className={`px-4 py-2 text-sm rounded-lg border ${form.type === "video" ? "bg-[var(--color-brand-700)] border-[var(--color-brand-700)] text-white" : "border-[var(--color-ink-200)]"}`}>Video</button>
          </div>
        </div>

        {form.type === "text" && (
          <div>
            <label className="block text-xs font-medium mb-1.5">Testimonial text</label>
            <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={5} required className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"/>
          </div>
        )}

        {form.type === "video" && (
          <>
            <Field label="Video URL (YouTube, Vimeo, or direct link)" value={form.videoUrl} onChange={(v) => setForm({ ...form, videoUrl: v })} required placeholder="https://youtube.com/watch?v=..."/>
            <MediaUploader folder="testimonials" accept="image/*" multiple={false} label="Video thumbnail (optional)" value={form.videoThumbnail ? [{ url: form.videoThumbnail, name: "thumb" }] : []} onChange={(arr) => setForm({ ...form, videoThumbnail: arr[0]?.url || "" })}/>
          </>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5">Rating</label>
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] bg-white">
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
            </select>
          </div>
          <Field label="Display order" type="number" value={form.displayOrder} onChange={(v) => setForm({ ...form, displayOrder: parseInt(v) || 0 })}/>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}/>
            Featured (show on homepage)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}/>
            Active (show on public site)
          </label>
        </div>

        {error && <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">{error}</div>}
        <div className="flex justify-end gap-2 pt-2">
          <Link href="/admin/testimonials" className="px-4 py-2 rounded-lg border border-[var(--color-ink-200)] text-sm">Cancel</Link>
          <button type="submit" disabled={submitting} className="px-5 py-2 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium disabled:opacity-60">{submitting ? "Saving..." : isEdit ? "Update" : "Create"}</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5">{label}{required && " *"}</label>
      <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"/>
    </div>
  );
}
