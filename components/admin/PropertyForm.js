"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MediaUploader from "@/components/admin/MediaUploader";
import { CITIES, PROPERTY_TYPES, PROPERTY_STATUSES } from "@/lib/constants";

export default function PropertyForm({ id }) {
  const router = useRouter();
  const isEdit = !!id;
  const [form, setForm] = useState(empty());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    fetch(`/api/admin/properties/${id}`).then((r) => r.json()).then((d) => {
      if (d.property) loadInto(d.property, setForm);
    });
  }, [id, isEdit]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const url = isEdit ? `/api/admin/properties/${id}` : "/api/admin/properties";
      const method = isEdit ? "PATCH" : "POST";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed");
      router.push("/admin/properties");
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{isEdit ? "Edit Property" : "Add Property"}</h1>
        <Link href="/admin/properties" className="text-sm text-[var(--color-ink-600)]">Cancel</Link>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <Card title="Basic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Field label="Name" value={form.name} onChange={(v) => up(setForm, "name", v)} required/>
            <Field label="Tagline" value={form.tagline} onChange={(v) => up(setForm, "tagline", v)}/>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => up(setForm, "description", e.target.value)} rows={4} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"/>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <Select label="Type" value={form.type} onChange={(v) => up(setForm, "type", v)} options={PROPERTY_TYPES}/>
            <Select label="Intent" value={form.intent} onChange={(v) => up(setForm, "intent", v)} options={[{ value: "buy", label: "Buy" }, { value: "rent", label: "Rent" }]}/>
            <Field label="Configuration" value={form.config} onChange={(v) => up(setForm, "config", v)} placeholder="3 BHK"/>
            <Select label="Status" value={form.status} onChange={(v) => up(setForm, "status", v)} options={PROPERTY_STATUSES.map((s) => ({ value: s, label: s }))}/>
          </div>
        </Card>

        <Card title="Specifications">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Bedrooms" type="number" value={form.bedrooms} onChange={(v) => up(setForm, "bedrooms", parseInt(v) || 0)}/>
            <Field label="Bathrooms" type="number" value={form.bathrooms} onChange={(v) => up(setForm, "bathrooms", parseInt(v) || 0)}/>
            <Field label="Parking" type="number" value={form.parking} onChange={(v) => up(setForm, "parking", parseInt(v) || 0)}/>
            <Field label="Total units" type="number" value={form.totalUnits} onChange={(v) => up(setForm, "totalUnits", parseInt(v) || 0)}/>
            <Field label="Area (e.g. 1840 sq.ft)" value={form.area} onChange={(v) => up(setForm, "area", v)}/>
            <Field label="Carpet area" value={form.carpetArea} onChange={(v) => up(setForm, "carpetArea", v)}/>
            <Field label="Built-up area" value={form.builtUpArea} onChange={(v) => up(setForm, "builtUpArea", v)}/>
            <Field label="Super built-up area" value={form.superBuiltUpArea} onChange={(v) => up(setForm, "superBuiltUpArea", v)}/>
            <Field label="Facing" value={form.facing} onChange={(v) => up(setForm, "facing", v)}/>
            <Field label="View" value={form.view} onChange={(v) => up(setForm, "view", v)}/>
            <Field label="Furnishing" value={form.furnishing} onChange={(v) => up(setForm, "furnishing", v)}/>
            <Field label="Possession date" value={form.possessionDate} onChange={(v) => up(setForm, "possessionDate", v)} placeholder="Dec 2025"/>
          </div>
        </Card>

        <Card title="Pricing">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Price min (rupees, no commas)" type="number" value={form.priceMin} onChange={(v) => up(setForm, "priceMin", v)}/>
            <Field label="Price max" type="number" value={form.priceMax} onChange={(v) => up(setForm, "priceMax", v)}/>
            <Field label="Price label" value={form.priceLabel} onChange={(v) => up(setForm, "priceLabel", v)} placeholder="Rs 2.4 - 4.1 Cr"/>
            <Field label="Price per sqft" type="number" value={form.pricePerSqft} onChange={(v) => up(setForm, "pricePerSqft", parseInt(v) || 0)}/>
          </div>
          <label className="flex items-center gap-2 text-sm mt-3">
            <input type="checkbox" checked={form.negotiable} onChange={(e) => up(setForm, "negotiable", e.target.checked)}/>
            Negotiable
          </label>
        </Card>

        <Card title="Location">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Select label="City" value={form.city} onChange={(v) => up(setForm, "city", v)} options={CITIES}/>
            <Field label="Locality" value={form.locality} onChange={(v) => up(setForm, "locality", v)}/>
            <Field label="Address" value={form.address} onChange={(v) => up(setForm, "address", v)} className="lg:col-span-2"/>
            <Field label="Display location" value={form.location} onChange={(v) => up(setForm, "location", v)} placeholder="Whitefield, Bengaluru" required className="lg:col-span-2"/>
            <Field label="Latitude" value={form.latitude} onChange={(v) => up(setForm, "latitude", v)}/>
            <Field label="Longitude" value={form.longitude} onChange={(v) => up(setForm, "longitude", v)}/>
          </div>
        </Card>

        <Card title="Builder & Compliance">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Field label="Builder name" value={form.builderName} onChange={(v) => up(setForm, "builderName", v)}/>
            <Field label="Builder estd year" value={form.builderEstd} onChange={(v) => up(setForm, "builderEstd", v)}/>
            <Field label="RERA number" value={form.rera} onChange={(v) => up(setForm, "rera", v)}/>
          </div>
        </Card>

        <Card title="Media">
          <MediaUploader folder="properties" accept="image/*" multiple={false} label="Cover image (required)" value={form.coverImage ? [{ url: form.coverImage, name: "cover" }] : []} onChange={(arr) => up(setForm, "coverImage", arr[0]?.url || "")}/>
          <div className="mt-4"><MediaUploader folder="properties" accept="image/*" label="Gallery images" value={form.gallery} onChange={(arr) => up(setForm, "gallery", arr.map((x) => x.url || x))}/></div>
          <div className="mt-4"><MediaUploader folder="properties" accept="video/*" label="Videos" value={form.videos} onChange={(arr) => up(setForm, "videos", arr.map((x) => x.url || x))} maxSizeMB={500}/></div>
          <div className="mt-4"><MediaUploader folder="properties" accept="application/pdf" label="PDFs (brochure, floor plan, master plan)" value={form.pdfs} onChange={(arr) => up(setForm, "pdfs", arr)}/></div>
          <div className="mt-4">
            <Field label="360° tour URL" value={form.virtualTourUrl} onChange={(v) => up(setForm, "virtualTourUrl", v)} placeholder="https://"/>
            <div className="mt-3"><Field label="YouTube/Vimeo video URL" value={form.videoTourUrl} onChange={(v) => up(setForm, "videoTourUrl", v)}/></div>
          </div>
        </Card>

        <Card title="Amenities & Configurations (JSON)">
          <p className="text-xs text-[var(--color-ink-500)] mb-2">Comma-separated for amenities. JSON array for configurations.</p>
          <Field label="Amenities (comma-separated)" value={Array.isArray(form.amenities) ? form.amenities.join(", ") : form.amenities} onChange={(v) => up(setForm, "amenities", v.split(",").map((x) => x.trim()).filter(Boolean))}/>
          <div className="mt-3">
            <label className="block text-xs font-medium mb-1.5">Configurations (JSON array)</label>
            <textarea value={typeof form.configurations === "string" ? form.configurations : JSON.stringify(form.configurations || [], null, 2)} onChange={(e) => up(setForm, "configurations", e.target.value)} rows={5} className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"/>
          </div>
          <div className="mt-3">
            <label className="block text-xs font-medium mb-1.5">Nearby points (JSON array)</label>
            <textarea value={typeof form.nearby === "string" ? form.nearby : JSON.stringify(form.nearby || [], null, 2)} onChange={(e) => up(setForm, "nearby", e.target.value)} rows={4} className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"/>
          </div>
        </Card>

        <Card title="SEO & Display">
          <div className="grid grid-cols-1 gap-4">
            <Field label="Meta title" value={form.metaTitle} onChange={(v) => up(setForm, "metaTitle", v)}/>
            <Field label="Meta description" value={form.metaDescription} onChange={(v) => up(setForm, "metaDescription", v)}/>
            <Field label="Meta keywords" value={form.metaKeywords} onChange={(v) => up(setForm, "metaKeywords", v)}/>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => up(setForm, "isFeatured", e.target.checked)}/>Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isHotDeal} onChange={(e) => up(setForm, "isHotDeal", e.target.checked)}/>Hot deal</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => up(setForm, "isActive", e.target.checked)}/>Active (visible)</label>
          </div>
        </Card>

        {error && <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">{error}</div>}
        <div className="flex justify-end gap-2 pt-2">
          <Link href="/admin/properties" className="px-4 py-2 rounded-lg border border-[var(--color-ink-200)] text-sm">Cancel</Link>
          <button type="submit" disabled={submitting} className="px-5 py-2 rounded-lg bg-[var(--color-brand-700)] text-white text-sm font-medium disabled:opacity-60">{submitting ? "Saving..." : isEdit ? "Update" : "Create"}</button>
        </div>
      </form>
    </div>
  );
}

function empty() {
  return {
    name: "", tagline: "", description: "",
    type: "apartment", intent: "buy", config: "", status: "Now Selling",
    bedrooms: 0, bathrooms: 0, parking: 0, totalUnits: 0,
    area: "", carpetArea: "", builtUpArea: "", superBuiltUpArea: "",
    facing: "", view: "", furnishing: "", possessionDate: "",
    priceMin: 0, priceMax: 0, priceLabel: "", pricePerSqft: 0, negotiable: false,
    city: "bengaluru", locality: "", address: "", location: "",
    latitude: "", longitude: "",
    builderName: "", builderEstd: "", rera: "",
    coverImage: "", gallery: [], videos: [], pdfs: [],
    virtualTourUrl: "", videoTourUrl: "",
    amenities: [], configurations: [], nearby: [],
    metaTitle: "", metaDescription: "", metaKeywords: "",
    isFeatured: false, isHotDeal: false, isActive: true,
  };
}

function loadInto(p, setForm) {
  setForm({
    name: p.name || "",
    tagline: p.tagline || "",
    description: p.description || "",
    type: p.type || "apartment",
    intent: p.intent || "buy",
    config: p.config || "",
    status: p.status || "Now Selling",
    bedrooms: p.bedrooms || 0,
    bathrooms: p.bathrooms || 0,
    parking: p.parking || 0,
    totalUnits: p.totalUnits || 0,
    area: p.area || "",
    carpetArea: p.carpetArea || "",
    builtUpArea: p.builtUpArea || "",
    superBuiltUpArea: p.superBuiltUpArea || "",
    facing: p.facing || "",
    view: p.view || "",
    furnishing: p.furnishing || "",
    possessionDate: p.possessionDate || "",
    priceMin: p.priceMin || 0,
    priceMax: p.priceMax || 0,
    priceLabel: p.priceLabel || "",
    pricePerSqft: p.pricePerSqft || 0,
    negotiable: !!p.negotiable,
    city: p.city || "bengaluru",
    locality: p.locality || "",
    address: p.address || "",
    location: p.location || "",
    latitude: p.latitude || "",
    longitude: p.longitude || "",
    builderName: p.builderName || "",
    builderEstd: p.builderEstd || "",
    rera: p.rera || "",
    coverImage: p.coverImage || "",
    gallery: parseArr(p.galleryJson),
    videos: parseArr(p.videosJson),
    pdfs: parseArr(p.pdfsJson),
    virtualTourUrl: p.virtualTourUrl || "",
    videoTourUrl: p.videoTourUrl || "",
    amenities: parseArr(p.amenitiesJson),
    configurations: parseArr(p.configurationsJson),
    nearby: parseArr(p.nearbyJson),
    metaTitle: p.metaTitle || "",
    metaDescription: p.metaDescription || "",
    metaKeywords: p.metaKeywords || "",
    isFeatured: !!p.isFeatured,
    isHotDeal: !!p.isHotDeal,
    isActive: p.isActive !== false,
  });
}

function parseArr(s) { try { return s ? JSON.parse(s) : []; } catch { return []; } }
function up(setter, key, val) { setter((prev) => ({ ...prev, [key]: val })); }

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-ink-100)] p-5">
      <h2 className="text-sm font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
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
