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
  return {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    location: p.location,
    city: p.city,
    locality: p.locality,
    type: p.type,
    status: p.status,
    image: p.coverImage,
    coverImage: p.coverImage,
    gallery: safeParse(p.galleryJson, []),
    videos: safeParse(p.videosJson, []),
    pdfs: safeParse(p.pdfsJson, []),
    masterPlanImage: p.masterPlanImage,
    virtualTourUrl: p.virtualTourUrl,
    videoTourUrl: p.videoTourUrl,
    configurations: safeParse(p.configurationsJson, []),
    amenities: safeParse(p.amenitiesJson, []),
    phases: safeParse(p.phasesJson, []),
    progressPhotos: safeParse(p.progressPhotosJson, []),
    tags: safeParse(p.tagsJson, []),
    priceMin: toNum(p.priceMin),
    priceMax: toNum(p.priceMax),
    priceLabel: p.priceLabel,
    totalUnits: p.totalUnits,
    totalTowers: p.totalTowers,
    landArea: p.landArea,
    floors: p.floors,
    possessionDate: p.possessionDate,
    launchDate: p.launchDate,
    rera: p.rera,
    builderName: p.builderName,
    builderEstd: p.builderEstd,
    builderProjects: p.builderProjects,
    builderAwards: p.builderAwards,
    isFeatured: p.isFeatured,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    metaKeywords: p.metaKeywords,
    createdAt: p.createdAt,
  };
}

const isReady = () => !!prisma;

export async function getFeaturedProjects({ limit = 4 } = {}) {
  if (!isReady()) return [];
  try {
    const items = await prisma.project.findMany({
      where: { isFeatured: true, isActive: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return items.map(toPublic);
  } catch {
    return [];
  }
}

export async function getProjects(filters = {}) {
  if (!isReady()) return { total: 0, items: [] };
  try {
    const where = { isActive: true };
    if (filters.city) where.city = filters.city;
    if (filters.status) where.status = filters.status;
    if (filters.q) {
      const q = String(filters.q).trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
        { builderName: { contains: q, mode: "insensitive" } },
      ];
    }
    const limit = parseInt(filters.limit) || 20;
    const offset = parseInt(filters.offset) || 0;
    const [total, items] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({ where, orderBy: { createdAt: "desc" }, take: limit, skip: offset }),
    ]);
    return { total, items: items.map(toPublic) };
  } catch {
    return { total: 0, items: [] };
  }
}

export async function getProjectBySlug(slug) {
  if (!isReady()) return null;
  try {
    const item = await prisma.project.findUnique({ where: { slug } });
    if (!item || !item.isActive) return null;
    return toPublic(item);
  } catch {
    return null;
  }
}
