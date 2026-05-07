import { NextResponse } from "next/server";
import { getAllSettings } from "@/lib/settings";

const PUBLIC_KEYS = [
  "site_name", "site_tagline", "site_logo", "site_favicon", "brand_color",
  "site_phone_primary", "site_phone_secondary", "site_email", "site_address", "site_working_hours",
  "whatsapp_number", "rera_number",
  "instagram_url", "facebook_url", "youtube_url", "linkedin_url", "twitter_url",
  "ga4_id", "meta_pixel_id", "google_ads_id", "gtm_id", "hotjar_id",
  "meta_title", "meta_description", "meta_keywords",
  "footer_copy", "privacy_policy", "terms",
];

export async function GET() {
  try {
    const all = await getAllSettings();
    const settings = {};
    for (const k of PUBLIC_KEYS) settings[k] = all[k] || "";
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ settings: {} });
  }
}
