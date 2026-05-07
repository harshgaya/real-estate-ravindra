import { prisma } from "@/lib/prisma";

const safeParse = (json, fallback) => {
  try {
    return json ? JSON.parse(json) : fallback;
  } catch {
    return fallback;
  }
};

const toNum = (v) => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "bigint") return Number(v);
  return Number(v) || 0;
};

function toPublic(p) {
  if (!p) return null;
  const gallery = safeParse(p.galleryJson, []);
  const videos = safeParse(p.videosJson, []);
  const pdfs = safeParse(p.pdfsJson, []);
  return {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    location: p.location,
    address: p.address,
    city: p.city,
    locality: p.locality,
    type: p.type,
    intent: p.intent,
    config: p.config,
    area: p.area,
    carpetArea: p.carpetArea,
    builtUpArea: p.builtUpArea,
    superBuiltUpArea: p.superBuiltUpArea,
    priceMin: toNum(p.priceMin),
    priceMax: toNum(p.priceMax),
    priceLabel: p.priceLabel,
    pricePerSqft: p.pricePerSqft,
    image: p.coverImage,
    coverImage: p.coverImage,
    gallery,
    videos,
    pdfs,
    floorPlanImage: p.floorPlanImage,
    masterPlanImage: p.masterPlanImage,
    virtualTourUrl: p.virtualTourUrl,
    videoTourUrl: p.videoTourUrl,
    status: p.status,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    parking: p.parking,
    floors: p.floors,
    totalUnits: p.totalUnits,
    facing: p.facing,
    view: p.view,
    furnishing: p.furnishing,
    possessionDate: p.possessionDate,
    rera: p.rera,
    builderName: p.builderName,
    builderEstd: p.builderEstd,
    amenities: safeParse(p.amenitiesJson, []),
    configurations: safeParse(p.configurationsJson, []),
    nearby: safeParse(p.nearbyJson, []),
    specifications: safeParse(p.specificationsJson, []),
    tags: safeParse(p.tagsJson, []),
    coordinates: p.latitude && p.longitude ? { lat: p.latitude, lng: p.longitude } : null,
    isFeatured: p.isFeatured,
    isHotDeal: p.isHotDeal,
    discountText: p.discountText,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    metaKeywords: p.metaKeywords,
    createdAt: p.createdAt,
  };
}

const isReady = () => !!prisma;

function parseBudget(s) {
  if (!s) return [null, null];
  if (s.endsWith("+")) return [parseInt(s) * 100000, null];
  const [a, b] = s.split("-").map((x) => parseInt(x) * 100000);
  return [a, b];
}

export async function getFeaturedProperties({ limit = 6 } = {}) {
  if (!isReady()) return [];
  try {
    const items = await prisma.property.findMany({
      where: { isFeatured: true, isActive: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return items.map(toPublic);
  } catch (err) {
    console.error("[getFeaturedProperties]", err.message);
    return [];
  }
}

export async function getProperties(filters = {}) {
  if (!isReady()) return { total: 0, items: [] };
  try {
    const where = { isActive: true };
    if (filters.city) where.city = filters.city;
    if (filters.locality) where.locality = filters.locality;
    if (filters.intent) where.intent = filters.intent;
    if (filters.type && filters.type !== "buy" && filters.type !== "rent") where.type = filters.type;
    if (filters.bedrooms) {
      const beds = parseInt(filters.bedrooms);
      if (!isNaN(beds)) where.bedrooms = { gte: beds };
    }
    if (filters.budget) {
      const [min, max] = parseBudget(filters.budget);
      if (min !== null) where.priceMax = { gte: BigInt(min) };
      if (max !== null) where.priceMin = { lte: BigInt(max) };
    }
    if (filters.q) {
      const q = String(filters.q).trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
        { locality: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { builderName: { contains: q, mode: "insensitive" } },
      ];
    }

    let orderBy = { createdAt: "desc" };
    if (filters.sort === "price-asc") orderBy = { priceMin: "asc" };
    if (filters.sort === "price-desc") orderBy = { priceMin: "desc" };

    const limit = parseInt(filters.limit) || 20;
    const offset = parseInt(filters.offset) || 0;

    const [total, items] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({ where, orderBy, take: limit, skip: offset }),
    ]);

    return { total, items: items.map(toPublic) };
  } catch (err) {
    console.error("[getProperties]", err.message);
    return { total: 0, items: [] };
  }
}

export async function getPropertyBySlug(slug) {
  if (!isReady()) return null;
  try {
    const item = await prisma.property.findUnique({ where: { slug } });
    if (!item || !item.isActive) return null;
    return toPublic(item);
  } catch (err) {
    console.error("[getPropertyBySlug]", err.message);
    return null;
  }
}

export async function getSimilarProperties(slug, limit = 3) {
  if (!isReady()) return [];
  try {
    const current = await prisma.property.findUnique({ where: { slug } });
    if (!current) return [];
    const items = await prisma.property.findMany({
      where: {
        slug: { not: slug },
        isActive: true,
        OR: [{ city: current.city }, { type: current.type }],
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return items.map(toPublic);
  } catch {
    return [];
  }
}
