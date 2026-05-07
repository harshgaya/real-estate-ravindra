import { prisma } from "@/lib/prisma";

let _cache = null;
let _cacheTime = 0;
const CACHE_TTL = 60 * 1000;

export async function getAllSettings() {
  if (_cache && Date.now() - _cacheTime < CACHE_TTL) return _cache;
  if (!prisma) return getDefaults();
  try {
    const items = await prisma.setting.findMany();
    const map = {};
    for (const s of items) map[s.key] = s.value;
    _cache = { ...getDefaults(), ...map };
    _cacheTime = Date.now();
    return _cache;
  } catch {
    return getDefaults();
  }
}

export function clearSettingsCache() {
  _cache = null;
  _cacheTime = 0;
}

export async function getSetting(key, fallback = "") {
  const all = await getAllSettings();
  return all[key] || fallback;
}

export async function setSettings(updates) {
  if (!prisma) return false;
  const ops = [];
  for (const [key, value] of Object.entries(updates)) {
    if (typeof value === "string") {
      ops.push(
        prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value, category: "general" },
        })
      );
    }
  }
  await Promise.all(ops);
  clearSettingsCache();
  return true;
}

function getDefaults() {
  return {
    site_name: "Jyothi Properties",
    site_tagline: "Find your dream home",
    site_logo: "",
    site_favicon: "",
    brand_color: "#0f766e",
    site_phone_primary: "+91 9337104909",
    site_phone_secondary: "",
    site_email: "jyothi.propertyagent@gmail.com",
    site_address: "",
    site_working_hours: "Mon - Sat: 10:00 AM - 7:00 PM",
    whatsapp_number: "919337104909",
    rera_number: "",
    gst_number: "",
    cin_number: "",
    instagram_url: "",
    facebook_url: "",
    youtube_url: "",
    linkedin_url: "",
    twitter_url: "",
    ga4_id: "",
    meta_pixel_id: "",
    google_ads_id: "",
    gtm_id: "",
    hotjar_id: "",
    meta_title: "Jyothi Properties - Premium Real Estate",
    meta_description: "Discover premium properties for sale and rent.",
    meta_keywords: "real estate, apartments, villas, properties",
    footer_copy: "© Jyothi Properties. All rights reserved.",
    privacy_policy: "",
    terms: "",
    lead_sources: JSON.stringify(["Website", "Facebook", "Instagram", "Google Ads", "Direct Call", "Walk-in", "Referral", "WhatsApp", "Other"]),
    lost_reasons: JSON.stringify(["Budget mismatch", "Already bought", "Not interested", "Other"]),
    lead_tags: JSON.stringify([]),
  };
}

export function siteFromSettings(settings) {
  return {
    name: settings.site_name,
    tagline: settings.site_tagline,
    logo: settings.site_logo,
    favicon: settings.site_favicon,
    brandColor: settings.brand_color,
    phone: settings.site_phone_primary,
    phoneSecondary: settings.site_phone_secondary,
    email: settings.site_email,
    address: settings.site_address,
    workingHours: settings.site_working_hours,
    whatsappNumber: settings.whatsapp_number,
    rera: settings.rera_number,
    gst: settings.gst_number,
    cin: settings.cin_number,
    social: {
      instagram: settings.instagram_url,
      facebook: settings.facebook_url,
      youtube: settings.youtube_url,
      linkedin: settings.linkedin_url,
      twitter: settings.twitter_url,
    },
    analytics: {
      ga4: settings.ga4_id,
      metaPixel: settings.meta_pixel_id,
      googleAds: settings.google_ads_id,
      gtm: settings.gtm_id,
      hotjar: settings.hotjar_id,
    },
    seo: {
      title: settings.meta_title,
      description: settings.meta_description,
      keywords: settings.meta_keywords,
    },
    footerCopy: settings.footer_copy,
  };
}
