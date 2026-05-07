"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MediaUploader from "@/components/admin/MediaUploader";
import { CITIES, PROPERTY_STATUSES } from "@/lib/constants";

export default function ProjectForm({ id }) {
  const router = useRouter();
  const isEdit = !!id;
  const [form, setForm] = useState(empty());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    fetch(`/api/admin/projects/${id}`).then((r) => r.json()).then((d) => {
      if (d.project) setForm(loadFrom(d.project));
    });
  }, [id, isEdit]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const url = isEdit ? `/api/admin/projects/${id}` : "/api/admin/projects";
      const method = isEdit ? "PATCH" : "POST";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed");
      router.push("/admin/projects");
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  }

  const up = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{isEdit ? "Edit Project" : "Add Project"}</h1>
        <Link href="/admin/projects" className="text-sm text-[var(--color-ink-600)]">Cancel</Link>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <Card title="Basic">
          <Field label="Name" value={form.name} onChange={(v) => up("name", v)} required/>
          <div className="mt-3"><Field label="Tagline" value={form.tagline} onChange={(v) => up("tagline", v)}/></div>
          <div className="mt-3">
            <label className="block text-xs font-medium mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => up("description", e.target.value)} rows={4} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"/>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <Select label="Type" value={form.type} onChange={(v) => up("type", v)} options={[{ value: "Residential", label: "Residential" }, { value: "Commercial", label: "Commercial" }, { value: "Mixed Use", label: "Mixed Use" }, { value: "Plotted", label: "Plotted" }]}/>
            <Select label="Status" value={form.status} onChange={(v) => up("status", v)} options={PROPERTY_STATUSES.map((s) => ({ value: s, label: s }))}/>
          </div>
        </Card>

        <Card title="Location">
          <div className="grid grid-cols-2 gap-4">
            <Select label="City" value={form.city} onChange={(v) => up("city", v)} options={CITIES}/>
            <Field label="Locality" value={form.locality} onChange={(v) => up("locality", v)}/>
            <Field label="Display location" value={form.location} onChange={(v) => up("location", v)} required className="col-span-2"/>
          </div>
        </Card>

        <Card title="Pricing & Specs">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Price min" type="number" value={form.priceMin} onChange={(v) => up("priceMin", v)}/>
            <Field label="Price max" type="number" value={form.priceMax} onChange={(v) => up("priceMax", v)}/>
            <Field label="Price label" value={form.priceLabel} onChange={(v) => up("priceLabel", v)}/>
            <Field label="Total units" type="number" value={form.totalUnits} onChange={(v) => up("totalUnits", parseInt(v) || 0)}/>
            <Field label="Total towers" type="number" value={form.totalTowers} onChange={(v) => up("totalTowers", parseInt(v) || 0)}/>
            <Field label="Land area" value={form.landArea} onChange={(v) => up("landArea", v)} placeholder="4.2 acres"/>
            <Field label="Floors" value={form.floors} onChange={(v) => up("floors", v)} placeholder="G + 18"/>
            <Field label="Possession date" value={form.possessionDate} onChange={(v) => up("possessionDate", v)}/>
            <Field label="Launch date" value={form.launchDate} onChange={(v) => up("launchDate", v)}/>
          </div>
        </Card>

        <Card title="Builder">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Builder name" value={form.builderName} onChange={(v) => up("builderName", v)}/>
            <Field label="Estd year" value={form.builderEstd} onChange={(v) => up("builderEstd", v)}/>
            <Field label="Total projects" type="number" value={form.builderProjects} onChange={(v) => up("builderProjects", parseInt(v) || 0)}/>
            <Field label="RERA number" value={form.rera} onChange={(v) => up("rera", v)}/>
          </div>
        </Card>

        <Card title="Media">
          <MediaUploader folder="projects" accept="image/*" multiple={false} label="Cover image (required)" value={form.coverImage ? [{ url: form.coverImage, name: "cover" }] : []} onChange={(arr) => up("coverImage", arr[0]?.url || "")}/>
          <div className="mt-4"><MediaUploader folder="projects" accept="image/*" label="Gallery" value={form.gallery} onChange={(arr) => up("gallery", arr.map((x) => x.url || x))}/></div>
          <div className="mt-4"><MediaUploader folder="projects" accept="video/*" label="Videos" value={form.videos} onChange={(arr) => up("videos", arr.map((x) => x.url || x))} maxSizeMB={500}/></div>
          <div className="mt-4"><MediaUploader folder="projects" accept="application/pdf" label="PDFs (master plan, brochure)" value={form.pdfs} onChange={(arr) => up("pdfs", arr)}/></div>
          <div className="mt-4"><Field label="Virtual tour URL" value={form.virtualTourUrl} onChange={(v) => up("virtualTourUrl", v)}/></div>
          <div className="mt-3"><Field label="Video tour URL" value={form.videoTourUrl} onChange={(v) => up("videoTourUrl", v)}/></div>
        </Card>

        <Card title="Configurations & Amenities">
          <Field label="Amenities (comma separated)" value={Array.isArray(form.amenities) ? form.amenities.join(", ") : form.amenities} onChange={(v) => up("amenities", v.split(",").map((x) => x.trim()).filter(Boolean))}/>
          <div className="mt-3">
            <label className="block text-xs font-medium mb-1.5">Configurations (JSON)</label>
            <textarea value={typeof form.configurations === "string" ? form.configurations : JSON.stringify(form.configurations || [], null, 2)} onChange={(e) => up("configurations", e.target.value)} rows={5} className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"/>
          </div>
          <div className="mt-3">
            <label className="block text-xs font-medium mb-1.5">Phases (JSON)</label>
            <textarea value={typeof form.phases === "string" ? form.phases : JSON.stringify(form.phases || [], null, 2)} onChange={(e) => up("phases", e.target.value)} rows={4} className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"/>
          </div>
        </Card>

        <Card title="Display">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => up("isFeatured", e.target.checked)}/>Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => up("isActive", e.target.checked)}/>Active</label>
          </div>
        </Card>

        {error && <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">{error}</div>}
        <div className="flex justify-end gap-2 pt-2">
          <Link href="/admin/projects" className="px-4 py-2 rounded-lg border border-[var(--color-ink-200)] text-sm">Cancel</Link>
          <button type="submit" disabled={submitting} className="px-5 py-2 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium disabled:opacity-60">{submitting ? "Saving..." : isEdit ? "Update" : "Create"}</button>
        </div>
      </form>
    </div>
  );
}

function empty() {
  return {
    name: "", tagline: "", description: "", type: "Residential", status: "Now Selling",
    city: "bengaluru", locality: "", location: "",
    priceMin: 0, priceMax: 0, priceLabel: "",
    totalUnits: 0, totalTowers: 0, landArea: "", floors: "",
    possessionDate: "", launchDate: "",
    builderName: "", builderEstd: "", builderProjects: 0, rera: "",
    coverImage: "", gallery: [], videos: [], pdfs: [],
    virtualTourUrl: "", videoTourUrl: "",
    amenities: [], configurations: [], phases: [],
    isFeatured: false, isActive: true,
  };
}
function loadFrom(p) {
  const parse = (s) => { try { return s ? JSON.parse(s) : []; } catch { return []; } };
  return {
    name: p.name, tagline: p.tagline || "", description: p.description || "",
    type: p.type, status: p.status, city: p.city, locality: p.locality || "",
    location: p.location, priceMin: p.priceMin || 0, priceMax: p.priceMax || 0,
    priceLabel: p.priceLabel || "", totalUnits: p.totalUnits || 0,
    totalTowers: p.totalTowers || 0, landArea: p.landArea || "",
    floors: p.floors || "", possessionDate: p.possessionDate || "",
    launchDate: p.launchDate || "", builderName: p.builderName || "",
    builderEstd: p.builderEstd || "", builderProjects: p.builderProjects || 0,
    rera: p.rera || "", coverImage: p.coverImage || "",
    gallery: parse(p.galleryJson), videos: parse(p.videosJson), pdfs: parse(p.pdfsJson),
    virtualTourUrl: p.virtualTourUrl || "", videoTourUrl: p.videoTourUrl || "",
    amenities: parse(p.amenitiesJson), configurations: parse(p.configurationsJson),
    phases: parse(p.phasesJson),
    isFeatured: !!p.isFeatured, isActive: p.isActive !== false,
  };
}
function Card({ title, children }) {
  return <div className="bg-white rounded-xl border border-[var(--color-ink-100)] p-5"><h2 className="text-sm font-semibold mb-4">{title}</h2>{children}</div>;
}
function Field({ label, value, onChange, type = "text", required, placeholder, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium mb-1.5">{label}{required && " *"}</label>
      <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"/>
    </div>
  );
}
function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5">{label}</label>
      <select value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none bg-white">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
