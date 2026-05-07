// Locality landing pages - programmatic SEO content per locality.

const LOCALITIES = [
  {
    slug: "whitefield",
    name: "Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    image:
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=85",
    tagline: "Tech corridor of the East, with neighbourhoods worth waking up in",
    description:
      "Whitefield has shed its outpost reputation. With the metro now operational and ITPL anchoring the daily commute for 280,000 professionals, the neighbourhood has matured into one of Bengaluru's most balanced residential markets.",
    avgPrice: "₹2.6 Cr",
    pricePerSqft: "₹9,800 - ₹12,400",
    propertyCount: 38,
    keyFeatures: [
      "Metro connectivity",
      "ITPL & EPIP zones",
      "International schools",
      "Phoenix Marketcity",
      "Sai Baba Temple",
      "VR Bengaluru Mall",
    ],
    nearbyAreas: ["Marathahalli", "Brookefield", "Varthur", "KR Puram"],
    isActive: true,
  },
  {
    slug: "bandra-west",
    name: "Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=85",
    tagline: "The promenade, the Hill, and the lanes that hold them together",
    description:
      "Bandra West remains Mumbai's most evolved neighbourhood. Old bungalows, new high-rises, and a sea face that draws everyone from filmmakers to first-home buyers.",
    avgPrice: "₹6.4 Cr",
    pricePerSqft: "₹38,000 - ₹62,000",
    propertyCount: 24,
    keyFeatures: [
      "Carter Road Promenade",
      "Bandstand",
      "Pali Hill",
      "Bandra-Worli Sea Link",
      "Linking Road",
      "Mehboob Studios",
    ],
    nearbyAreas: ["Khar West", "Santacruz West", "Mahim"],
    isActive: true,
  },
  {
    slug: "jubilee-hills",
    name: "Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=85",
    tagline: "Quiet villas on the rise, just off Road No. 36",
    description:
      "Jubilee Hills is Hyderabad's quietest premium neighbourhood. Independent villas on tree-lined roads, with the rocky outcrops of the Deccan still visible.",
    avgPrice: "₹4.2 Cr",
    pricePerSqft: "₹14,000 - ₹22,000",
    propertyCount: 31,
    keyFeatures: [
      "Cafe Niloufer",
      "Apollo Hospital",
      "KBR National Park",
      "Hyderabad Marriott",
      "Care Hospital",
    ],
    nearbyAreas: ["Banjara Hills", "Madhapur", "Film Nagar"],
    isActive: true,
  },
  {
    slug: "koregaon-park",
    name: "Koregaon Park",
    city: "Pune",
    state: "Maharashtra",
    image:
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1600&q=85",
    tagline: "River-side, walk-able, with cafes that have outlived three trends",
    description:
      "Koregaon Park is Pune's most cosmopolitan neighbourhood. The Mula-Mutha river runs along its eastern edge, and the lanes are wide enough to walk.",
    avgPrice: "₹1.8 Cr",
    pricePerSqft: "₹11,000 - ₹15,000",
    propertyCount: 19,
    keyFeatures: [
      "German Bakery",
      "Osho International",
      "River front",
      "Phoenix Marketcity",
      "Symbiosis Campus",
    ],
    nearbyAreas: ["Kalyani Nagar", "Mundhwa", "Yerwada"],
    isActive: true,
  },
  {
    slug: "indiranagar",
    name: "Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    image:
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=85",
    tagline: "Old trees, new cafés, and the Purple Line metro running through",
    description:
      "Indiranagar has been the most-debated neighbourhood in Bengaluru for the last decade. The new metro line has eased through-traffic and the neighbourhood is settling into a new rhythm.",
    avgPrice: "₹3.1 Cr",
    pricePerSqft: "₹13,000 - ₹17,000",
    propertyCount: 22,
    keyFeatures: [
      "100 Feet Road",
      "Purple Line Metro",
      "12th Main",
      "Defence Colony",
      "CMH Road",
    ],
    nearbyAreas: ["Jeevan Bhima Nagar", "HAL", "Domlur"],
    isActive: true,
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    image:
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=85",
    tagline: "India's most-built city, with neighbourhoods worth choosing",
    description:
      "Bengaluru's residential market spans every price point. From ₹50 lakh apartments in Electronic City to ₹15 crore villas in Sadashivnagar, the city has options.",
    avgPrice: "₹1.9 Cr",
    pricePerSqft: "₹6,000 - ₹17,000",
    propertyCount: 84,
    keyFeatures: [
      "Tech parks across the city",
      "8 metro lines (planned)",
      "Top schools",
      "World-class hospitals",
    ],
    nearbyAreas: ["Whitefield", "Indiranagar", "HSR", "Sarjapur"],
    isActive: true,
  },
];

function toPublicShape(l) {
  if (!l) return null;
  const { isActive, ...rest } = l;
  return rest;
}

export async function getLocalities() {
  await new Promise((r) => setTimeout(r, 0));
  return LOCALITIES.filter((l) => l.isActive).map(toPublicShape);
}

export async function getLocalityBySlug(slug) {
  await new Promise((r) => setTimeout(r, 0));
  const locality = LOCALITIES.find((l) => l.slug === slug && l.isActive);
  return locality ? toPublicShape(locality) : null;
}
