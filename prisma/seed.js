const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const DEFAULT_SETTINGS = [
  { key: "site_name", value: "Jyothi Properties", category: "branding" },
  { key: "site_tagline", value: "Find your dream home", category: "branding" },
  { key: "site_logo", value: "", category: "branding" },
  { key: "site_favicon", value: "", category: "branding" },
  { key: "brand_color", value: "#0f766e", category: "branding" },

  { key: "site_phone_primary", value: "+91 9337104909", category: "contact" },
  { key: "site_phone_secondary", value: "", category: "contact" },
  { key: "site_email", value: "jyothi.propertyagent@gmail.com", category: "contact" },
  { key: "site_address", value: "", category: "contact" },
  { key: "site_working_hours", value: "Mon - Sat: 10:00 AM - 7:00 PM", category: "contact" },
  { key: "whatsapp_number", value: "919337104909", category: "contact" },

  { key: "rera_number", value: "", category: "legal" },
  { key: "gst_number", value: "", category: "legal" },
  { key: "cin_number", value: "", category: "legal" },

  { key: "instagram_url", value: "", category: "social" },
  { key: "facebook_url", value: "", category: "social" },
  { key: "youtube_url", value: "", category: "social" },
  { key: "linkedin_url", value: "", category: "social" },
  { key: "twitter_url", value: "", category: "social" },

  { key: "ga4_id", value: "", category: "analytics" },
  { key: "meta_pixel_id", value: "", category: "analytics" },
  { key: "google_ads_id", value: "", category: "analytics" },
  { key: "gtm_id", value: "", category: "analytics" },
  { key: "hotjar_id", value: "", category: "analytics" },

  { key: "meta_title", value: "Jyothi Properties - Premium Real Estate", category: "seo" },
  { key: "meta_description", value: "Discover premium properties for sale and rent across major cities. Apartments, villas, and plots from trusted builders.", category: "seo" },
  { key: "meta_keywords", value: "real estate, apartments, villas, properties, hyderabad, bengaluru", category: "seo" },

  { key: "footer_copy", value: "© Jyothi Properties. All rights reserved.", category: "branding" },
  { key: "privacy_policy", value: "Privacy policy content here. Edit from admin settings.", category: "legal" },
  { key: "terms", value: "Terms and conditions content here. Edit from admin settings.", category: "legal" },

  { key: "lead_sources", value: JSON.stringify(["Website", "Facebook", "Instagram", "Google Ads", "Direct Call", "Walk-in", "Referral", "WhatsApp", "Newspaper", "Hoarding", "Lead Pool", "Other"]), category: "leads" },
  { key: "lost_reasons", value: JSON.stringify(["Budget mismatch", "Already bought elsewhere", "Wrong number", "Not interested", "No response after multiple attempts", "Bad timing", "Location mismatch", "Configuration mismatch", "Other"]), category: "leads" },
  { key: "lead_tags", value: JSON.stringify(["Hot", "Investor", "End-user", "NRI", "First-time buyer", "Repeat customer", "Walk-in", "Referral"]), category: "leads" },
];

const DEFAULT_TEMPLATES = [
  {
    name: "Initial inquiry response",
    channel: "whatsapp",
    category: "welcome",
    body: "Hi {{lead.firstName}},\n\nThank you for your interest in our properties. This is from {{site.name}}.\n\nI'd love to understand your requirements better. Could you share what you're looking for?\n\nBudget: \nConfiguration: \nLocation preference: \nTimeline: \n\nLooking forward to hearing from you.\n\nRegards,\n{{user.name}}\n{{site.name}}\n{{site.phone}}",
  },
  {
    name: "Property share",
    channel: "whatsapp",
    category: "property_share",
    body: "Hi {{lead.firstName}},\n\nSharing details of {{property.name}} in {{property.location}}.\n\nConfiguration: {{property.bhk}}\nPrice: {{property.price}}\nView details: {{property.url}}\n\nLet me know if you'd like to schedule a site visit.\n\nRegards,\n{{user.name}}",
  },
  {
    name: "Site visit invite",
    channel: "whatsapp",
    category: "visit_invite",
    body: "Hi {{lead.firstName}},\n\nWould you like to visit {{property.name}} this weekend? It's a perfect match for what you're looking for.\n\nI can arrange a personalized tour at your convenience.\n\nRegards,\n{{user.name}}",
  },
  {
    name: "Site visit reminder",
    channel: "whatsapp",
    category: "visit_reminder",
    body: "Hi {{lead.firstName}},\n\nQuick reminder about your scheduled site visit to {{property.name}} on {{date}} at {{time}}.\n\nMeeting point: \nMy contact: {{user.name}} - {{site.phone}}\n\nLooking forward to meeting you.\n\nRegards,\n{{user.name}}",
  },
  {
    name: "Post-visit followup",
    channel: "whatsapp",
    category: "followup",
    body: "Hi {{lead.firstName}},\n\nThank you for visiting {{property.name}} today. Hope you liked it.\n\nDo you have any questions or would you like more details about pricing/payment plans?\n\nHappy to help.\n\nRegards,\n{{user.name}}",
  },
  {
    name: "Re-engagement",
    channel: "whatsapp",
    category: "reengagement",
    body: "Hi {{lead.firstName}},\n\nIt's been a while since we last spoke. We have new launches matching your requirements.\n\nWould you like me to share details?\n\nRegards,\n{{user.name}}\n{{site.name}}",
  },

  {
    name: "Initial inquiry response",
    channel: "email",
    category: "welcome",
    subject: "Thank you for your interest in {{site.name}}",
    body: "Dear {{lead.firstName}},\n\nThank you for reaching out to {{site.name}}.\n\nI'd love to understand your requirements better. Could you share details on:\n\n- Budget range\n- Configuration preference (BHK)\n- Preferred location\n- Timeline for purchase\n\nI will then send you a curated list of properties matching your needs.\n\nBest regards,\n{{user.name}}\n{{site.name}}\n{{site.phone}}",
  },
  {
    name: "Property details",
    channel: "email",
    category: "property_share",
    subject: "Property details: {{property.name}}",
    body: "Dear {{lead.firstName}},\n\nAs requested, please find details of {{property.name}}:\n\nLocation: {{property.location}}\nConfiguration: {{property.bhk}}\nPrice: {{property.price}}\n\nView complete details: {{property.url}}\n\nI'd be happy to arrange a site visit at your convenience.\n\nBest regards,\n{{user.name}}",
  },
  {
    name: "Site visit confirmation",
    channel: "email",
    category: "visit_invite",
    subject: "Your site visit to {{property.name}} is confirmed",
    body: "Dear {{lead.firstName}},\n\nYour site visit is confirmed for {{date}} at {{time}}.\n\nProperty: {{property.name}}\nLocation: {{property.location}}\n\nI will meet you at the site. My contact: {{site.phone}}\n\nLooking forward to meeting you.\n\nBest regards,\n{{user.name}}",
  },

  {
    name: "Cold call opener",
    channel: "call",
    category: "welcome",
    body: "Hi, am I speaking to {{lead.firstName}}?\n\nThis is {{user.name}} calling from {{site.name}}. You had inquired about properties on our website. Is this a good time to talk?\n\nGreat. Could I understand a bit about what you're looking for?\n\n- What's your budget range?\n- Which configuration are you looking for - 2 BHK, 3 BHK?\n- Which area do you prefer?\n- What's your timeline for purchase?",
  },
  {
    name: "Followup call",
    channel: "call",
    category: "followup",
    body: "Hi {{lead.firstName}}, this is {{user.name}} from {{site.name}}.\n\nWe had spoken earlier about properties in {{property.location}}. Just following up to see if you had any questions or if you're ready to schedule a site visit.\n\nWe have a few options that match your requirements perfectly. Would you like me to share?",
  },
];

const SAMPLE_PROPERTIES = [
  {
    slug: "the-orchard-house-whitefield",
    name: "The Orchard House",
    tagline: "Low-rise community of 84 apartments around a central orchard",
    description: "A boutique residential project of 84 apartments across four low-rise blocks, built around a central forty-tree orchard. Each apartment has cross-ventilation, a service balcony, and a deep planter ledge for herbs.",
    type: "apartment",
    intent: "buy",
    config: "3 & 4 BHK Residences",
    status: "Now Selling",
    bedrooms: 3, bathrooms: 3, parking: 2, floors: 4, totalUnits: 84,
    area: "1,840 - 3,260 sq.ft",
    priceMin: 24000000n, priceMax: 41000000n, priceLabel: "Rs 2.4 - 4.1 Cr",
    city: "bengaluru", locality: "whitefield",
    location: "Whitefield, Bengaluru",
    address: "Plot 14, ITPL Main Road, Whitefield, Bengaluru 560066",
    builderName: "Brigade Group", builderEstd: "1986",
    rera: "PRM/KA/RERA/1251/446",
    coverImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=85",
    galleryJson: JSON.stringify([
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85",
    ]),
    amenitiesJson: JSON.stringify(["Swimming Pool", "Gym", "Children's Play Area", "Yoga Deck", "EV Charging", "Library", "24/7 Security", "Power Backup", "Rainwater Harvesting", "Landscaped Garden"]),
    configurationsJson: JSON.stringify([
      { bhk: "3 BHK", area: "1,840 sq.ft", price: "Rs 2.4 Cr onwards", units: 24 },
      { bhk: "3.5 BHK", area: "2,140 sq.ft", price: "Rs 2.9 Cr onwards", units: 36 },
      { bhk: "4 BHK", area: "3,260 sq.ft", price: "Rs 4.1 Cr onwards", units: 24 },
    ]),
    nearbyJson: JSON.stringify([
      { type: "Metro", name: "Whitefield Metro", distance: "1.2 km" },
      { type: "School", name: "Inventure Academy", distance: "2.4 km" },
      { type: "Hospital", name: "Manipal Hospital", distance: "3.1 km" },
      { type: "Mall", name: "Phoenix Marketcity", distance: "4.6 km" },
    ]),
    latitude: 12.9698, longitude: 77.7499,
    possessionDate: "Dec 2025",
    isFeatured: true,
  },
  {
    slug: "casa-amber-bandra",
    name: "Casa Amber",
    tagline: "Sea-facing penthouses on Carter Road",
    description: "Twelve sea-facing penthouses on the historic Carter Road stretch.",
    type: "penthouse",
    intent: "buy",
    config: "3 & 4 BHK Penthouses",
    status: "Few Left",
    bedrooms: 4, bathrooms: 4, parking: 3, floors: 18, totalUnits: 12,
    area: "2,100 - 4,800 sq.ft",
    priceMin: 68000000n, priceMax: 140000000n, priceLabel: "Rs 6.8 - 14 Cr",
    city: "mumbai", locality: "bandra-west",
    location: "Bandra West, Mumbai",
    builderName: "Lodha", builderEstd: "1980",
    rera: "P51800012345",
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
    galleryJson: JSON.stringify([
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85",
    ]),
    amenitiesJson: JSON.stringify(["Infinity Pool", "Sea-Facing Gym", "Concierge", "Spa"]),
    configurationsJson: JSON.stringify([
      { bhk: "3 BHK", area: "2,100 sq.ft", price: "Rs 6.8 Cr onwards", units: 6 },
      { bhk: "4 BHK", area: "4,800 sq.ft", price: "Rs 14 Cr onwards", units: 6 },
    ]),
    nearbyJson: JSON.stringify([
      { type: "Beach", name: "Bandra Bandstand", distance: "0.4 km" },
    ]),
    possessionDate: "Ready to move",
    isFeatured: true,
  },
  {
    slug: "stillwater-villas-gachibowli",
    name: "Stillwater Villas",
    tagline: "Walled gardens, central courtyards",
    description: "Twenty-eight independent villas with private gardens.",
    type: "villa",
    intent: "buy",
    config: "4 BHK Villas",
    status: "Pre-Launch",
    bedrooms: 4, bathrooms: 5, parking: 3, totalUnits: 28,
    area: "3,200 - 5,400 sq.ft",
    priceMin: 36000000n, priceMax: 62000000n, priceLabel: "Rs 3.6 - 6.2 Cr",
    city: "hyderabad", locality: "gachibowli",
    location: "Gachibowli, Hyderabad",
    builderName: "Aparna Constructions",
    rera: "P02400001234",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    galleryJson: JSON.stringify([
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    ]),
    amenitiesJson: JSON.stringify(["Private Garden", "Clubhouse", "Tennis Court", "Pool"]),
    possessionDate: "Jun 2026",
    isFeatured: true,
  },
  {
    slug: "linden-crest-koregaon",
    name: "Linden Crest",
    tagline: "Riverfront duplexes",
    description: "Forty-six riverfront duplex apartments overlooking the Mula-Mutha river.",
    type: "apartment",
    intent: "buy",
    config: "3 BHK Duplexes",
    status: "Now Selling",
    bedrooms: 3, bathrooms: 3, parking: 2, totalUnits: 46,
    area: "1,950 - 2,400 sq.ft",
    priceMin: 18000000n, priceMax: 24000000n, priceLabel: "Rs 1.8 - 2.4 Cr",
    city: "pune", locality: "koregaon-park",
    location: "Koregaon Park, Pune",
    builderName: "Kolte-Patil",
    rera: "P52100001234",
    coverImage: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=85",
    galleryJson: JSON.stringify([
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=85",
    ]),
    amenitiesJson: JSON.stringify(["Riverside Promenade", "Pool", "Gym", "Library"]),
    possessionDate: "Mar 2026",
    isFeatured: true,
  },
  {
    slug: "marigold-park-hsr",
    name: "Marigold Park",
    tagline: "Three towers, a lap pool, a quiet park",
    description: "240 apartments arranged around a central one-acre park.",
    type: "apartment",
    intent: "buy",
    config: "2 & 3 BHK",
    status: "Now Selling",
    bedrooms: 3, bathrooms: 2, parking: 1, totalUnits: 240,
    area: "1,140 - 1,820 sq.ft",
    priceMin: 9500000n, priceMax: 16500000n, priceLabel: "Rs 95 L - 1.65 Cr",
    city: "bengaluru", locality: "hsr-layout",
    location: "HSR Layout, Bengaluru",
    builderName: "Sobha",
    rera: "PRM/KA/RERA/1251/447",
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85",
    galleryJson: JSON.stringify([
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85",
    ]),
    amenitiesJson: JSON.stringify(["Lap Pool", "Gym", "Park", "Kids Zone"]),
    possessionDate: "Sep 2025",
    isFeatured: true,
  },
  {
    slug: "olive-grove-jubilee",
    name: "Olive Grove",
    tagline: "Boutique villas tucked behind old groves",
    description: "Eight independent villas on a 2-acre site.",
    type: "villa",
    intent: "buy",
    config: "4 BHK Villas",
    status: "Few Left",
    bedrooms: 4, bathrooms: 5, parking: 4, totalUnits: 8,
    area: "4,200 - 5,800 sq.ft",
    priceMin: 52000000n, priceMax: 72000000n, priceLabel: "Rs 5.2 - 7.2 Cr",
    city: "hyderabad", locality: "jubilee-hills",
    location: "Jubilee Hills, Hyderabad",
    builderName: "MyHome Constructions",
    coverImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
    galleryJson: JSON.stringify([
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
    ]),
    amenitiesJson: JSON.stringify(["Private Pool", "Home Automation", "Solar Power"]),
    possessionDate: "Ready to move",
    isFeatured: true,
  },
];

const SAMPLE_PROJECTS = [
  {
    slug: "the-orchard-house-whitefield-project",
    name: "The Orchard House Project",
    tagline: "Low-rise community of 84 apartments",
    description: "A boutique residential project of 84 apartments across four low-rise blocks.",
    type: "Residential", status: "Now Selling",
    city: "bengaluru", locality: "whitefield",
    location: "Whitefield, Bengaluru",
    coverImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=85",
    priceMin: 24000000n, priceMax: 41000000n, priceLabel: "Rs 2.4 - 4.1 Cr",
    totalUnits: 84, landArea: "4.2 acres", floors: "G + 4",
    possessionDate: "Dec 2025", launchDate: "Jan 2024",
    rera: "PRM/KA/RERA/1251/446",
    builderName: "Brigade Group", builderEstd: "1986", builderProjects: 240,
    isFeatured: true,
    galleryJson: JSON.stringify(["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=85"]),
    amenitiesJson: JSON.stringify(["Swimming Pool", "Gym", "Kids Play Area", "Yoga Deck", "EV Charging"]),
    configurationsJson: JSON.stringify([
      { bhk: "3 BHK", area: "1,840 sq.ft", price: "Rs 2.4 Cr+", units: 24 },
      { bhk: "4 BHK", area: "3,260 sq.ft", price: "Rs 4.1 Cr+", units: 24 },
    ]),
  },
  {
    slug: "casa-amber-bandra-project",
    name: "Casa Amber Project",
    tagline: "12 sea-facing penthouses",
    description: "Sea-facing penthouses with private terraces.",
    type: "Residential", status: "Few Left",
    city: "mumbai", locality: "bandra-west",
    location: "Bandra West, Mumbai",
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
    priceMin: 68000000n, priceMax: 140000000n, priceLabel: "Rs 6.8 - 14 Cr",
    totalUnits: 12, landArea: "0.6 acres", floors: "G + 18",
    possessionDate: "Ready", rera: "P51800012345",
    builderName: "Lodha", builderEstd: "1980", builderProjects: 180,
    isFeatured: true,
    galleryJson: JSON.stringify(["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85"]),
    amenitiesJson: JSON.stringify(["Infinity Pool", "Concierge", "Spa"]),
    configurationsJson: JSON.stringify([
      { bhk: "3 BHK", area: "2,100 sq.ft", price: "Rs 6.8 Cr+", units: 6 },
    ]),
  },
];

const SAMPLE_TESTIMONIALS = [
  {
    customerName: "Rohit Sharma",
    customerTitle: "Software Engineer, Bengaluru",
    rating: 5,
    type: "text",
    text: "Excellent service from start to finish. The team understood exactly what I was looking for and helped me find my dream home. Site visits were well organized and paperwork was hassle-free.",
    isFeatured: true,
    isActive: true,
    displayOrder: 1,
  },
  {
    customerName: "Priya Mehta",
    customerTitle: "Doctor, Mumbai",
    rating: 5,
    type: "text",
    text: "Highly professional team. They were patient through my many questions and never pushed me into a decision. Got the perfect apartment in my budget.",
    isFeatured: true,
    isActive: true,
    displayOrder: 2,
  },
  {
    customerName: "Suresh Kumar",
    customerTitle: "Business Owner, Hyderabad",
    rating: 5,
    type: "text",
    text: "Found a perfect villa for my family. The team's knowledge of Hyderabad real estate market is excellent. Highly recommend.",
    isFeatured: true,
    isActive: true,
    displayOrder: 3,
  },
];

async function main() {
  console.log("Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@jyothi.in";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMeBeforeProd";
  const adminName = process.env.ADMIN_NAME || "Admin";
  const adminHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: { passwordHash: adminHash, name: adminName, role: "admin", isActive: true },
    create: {
      email: adminEmail.toLowerCase(),
      passwordHash: adminHash,
      name: adminName,
      role: "admin",
      isActive: true,
    },
  });
  console.log("Admin user:", admin.email);

  const seedUsersJson = process.env.SEED_USERS_JSON;
  if (seedUsersJson) {
    try {
      const users = JSON.parse(seedUsersJson);
      for (const u of users) {
        if (!u.email || !u.password) continue;
        const hash = await bcrypt.hash(u.password, 10);
        await prisma.user.upsert({
          where: { email: u.email.toLowerCase() },
          update: {
            passwordHash: hash,
            name: u.name || u.email,
            role: u.role || "agent",
            phone: u.phone || null,
            team: u.team || null,
            isActive: true,
          },
          create: {
            email: u.email.toLowerCase(),
            passwordHash: hash,
            name: u.name || u.email,
            role: u.role || "agent",
            phone: u.phone || null,
            team: u.team || null,
            isActive: true,
          },
        });
        console.log("User:", u.email, "(" + (u.role || "agent") + ")");
      }
    } catch (e) {
      console.error("Failed to parse SEED_USERS_JSON:", e.message);
    }
  }

  for (const s of DEFAULT_SETTINGS) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log("Settings:", DEFAULT_SETTINGS.length);

  for (const t of DEFAULT_TEMPLATES) {
    const existing = await prisma.template.findFirst({
      where: { name: t.name, channel: t.channel },
    });
    if (!existing) {
      await prisma.template.create({ data: t });
    }
  }
  console.log("Templates:", DEFAULT_TEMPLATES.length);

  for (const p of SAMPLE_PROPERTIES) {
    await prisma.property.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log("Properties:", SAMPLE_PROPERTIES.length);

  for (const p of SAMPLE_PROJECTS) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log("Projects:", SAMPLE_PROJECTS.length);

  for (const t of SAMPLE_TESTIMONIALS) {
    const existing = await prisma.testimonial.findFirst({
      where: { customerName: t.customerName, customerTitle: t.customerTitle },
    });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log("Testimonials:", SAMPLE_TESTIMONIALS.length);

  await prisma.autoAssignRule.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", isActive: false, rotationAgentsJson: "[]", lastAssignedIndex: -1 },
  });
  console.log("Auto-assign rule: initialized (disabled)");

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
