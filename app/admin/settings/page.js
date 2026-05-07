"use client";
import { useState, useEffect } from "react";
import MediaUploader from "@/components/admin/MediaUploader";
import { LuSave, LuCheck } from "react-icons/lu";

const TABS = [
  { id: "branding", label: "Branding" },
  { id: "contact", label: "Contact" },
  { id: "social", label: "Social" },
  { id: "legal", label: "Legal" },
  { id: "analytics", label: "Analytics" },
  { id: "seo", label: "SEO" },
  { id: "policies", label: "Policies" },
];

export default function SettingsPage() {
  const [s, setS] = useState({});
  const [tab, setTab] = useState("branding");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => setS(d.settings || {}));
  }, []);

  const set = (k, v) => setS((prev) => ({ ...prev, [k]: v }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="text-xs text-[var(--color-ink-500)] mt-0.5">Edit website meta data, branding, contact info, and more.</p>
        </div>
        <button onClick={save} disabled={saving} className="px-4 py-2 rounded-lg bg-[var(--color-brand-700)] hover:bg-[var(--color-brand-800)] disabled:opacity-60 text-white text-sm font-medium flex items-center gap-1.5">
          {saved ? <LuCheck/> : <LuSave/>}
          {saving ? "Saving..." : saved ? "Saved!" : "Save changes"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-ink-100)]">
        <div className="flex border-b border-[var(--color-ink-100)] overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${tab === t.id ? "border-[var(--color-brand-700)] text-[var(--color-brand-700)]" : "border-transparent text-[var(--color-ink-600)]"}`}>{t.label}</button>
          ))}
        </div>

        <div className="p-5 lg:p-6 space-y-4">
          {tab === "branding" && (
            <div className="space-y-4">
              <Field label="Site name" value={s.site_name} onChange={(v) => set("site_name", v)}/>
              <Field label="Tagline" value={s.site_tagline} onChange={(v) => set("site_tagline", v)}/>
              <div>
                <MediaUploader folder="logos" accept="image/*" multiple={false} label="Logo" value={s.site_logo ? [{ url: s.site_logo, name: "logo" }] : []} onChange={(arr) => set("site_logo", arr[0]?.url || "")}/>
              </div>
              <div>
                <MediaUploader folder="favicons" accept="image/*" multiple={false} label="Favicon" value={s.site_favicon ? [{ url: s.site_favicon, name: "favicon" }] : []} onChange={(arr) => set("site_favicon", arr[0]?.url || "")}/>
              </div>
              <Field label="Brand color (hex)" value={s.brand_color} onChange={(v) => set("brand_color", v)} placeholder="#0f766e"/>
              <Field label="Footer copy" value={s.footer_copy} onChange={(v) => set("footer_copy", v)}/>
            </div>
          )}

          {tab === "contact" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Field label="Primary phone" value={s.site_phone_primary} onChange={(v) => set("site_phone_primary", v)}/>
              <Field label="Secondary phone" value={s.site_phone_secondary} onChange={(v) => set("site_phone_secondary", v)}/>
              <Field label="Email" value={s.site_email} onChange={(v) => set("site_email", v)}/>
              <Field label="WhatsApp number (with country code, no +)" value={s.whatsapp_number} onChange={(v) => set("whatsapp_number", v)} placeholder="919337104909"/>
              <Field label="Address" value={s.site_address} onChange={(v) => set("site_address", v)} className="lg:col-span-2"/>
              <Field label="Working hours" value={s.site_working_hours} onChange={(v) => set("site_working_hours", v)} className="lg:col-span-2"/>
            </div>
          )}

          {tab === "social" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Field label="Instagram URL" value={s.instagram_url} onChange={(v) => set("instagram_url", v)}/>
              <Field label="Facebook URL" value={s.facebook_url} onChange={(v) => set("facebook_url", v)}/>
              <Field label="YouTube URL" value={s.youtube_url} onChange={(v) => set("youtube_url", v)}/>
              <Field label="LinkedIn URL" value={s.linkedin_url} onChange={(v) => set("linkedin_url", v)}/>
              <Field label="Twitter/X URL" value={s.twitter_url} onChange={(v) => set("twitter_url", v)}/>
            </div>
          )}

          {tab === "legal" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Field label="RERA registration number" value={s.rera_number} onChange={(v) => set("rera_number", v)}/>
              <Field label="GST number" value={s.gst_number} onChange={(v) => set("gst_number", v)}/>
              <Field label="CIN number" value={s.cin_number} onChange={(v) => set("cin_number", v)}/>
            </div>
          )}

          {tab === "analytics" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Field label="Google Analytics 4 ID (G-XXXXXX)" value={s.ga4_id} onChange={(v) => set("ga4_id", v)}/>
              <Field label="Meta Pixel ID" value={s.meta_pixel_id} onChange={(v) => set("meta_pixel_id", v)}/>
              <Field label="Google Ads ID (AW-XXXXXX)" value={s.google_ads_id} onChange={(v) => set("google_ads_id", v)}/>
              <Field label="Google Tag Manager ID (GTM-XXXX)" value={s.gtm_id} onChange={(v) => set("gtm_id", v)}/>
              <Field label="Hotjar ID" value={s.hotjar_id} onChange={(v) => set("hotjar_id", v)}/>
            </div>
          )}

          {tab === "seo" && (
            <div className="space-y-4">
              <Field label="Default meta title" value={s.meta_title} onChange={(v) => set("meta_title", v)}/>
              <TextArea label="Default meta description" value={s.meta_description} onChange={(v) => set("meta_description", v)}/>
              <Field label="Default meta keywords (comma separated)" value={s.meta_keywords} onChange={(v) => set("meta_keywords", v)}/>
            </div>
          )}

          {tab === "policies" && (
            <div className="space-y-4">
              <TextArea label="Privacy policy text" value={s.privacy_policy} onChange={(v) => set("privacy_policy", v)} rows={10}/>
              <TextArea label="Terms and conditions" value={s.terms} onChange={(v) => set("terms", v)} rows={10}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium mb-1.5">{label}</label>
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"/>
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 4 }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5">{label}</label>
      <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-ink-200)] focus:border-[var(--color-brand-600)] outline-none"/>
    </div>
  );
}
