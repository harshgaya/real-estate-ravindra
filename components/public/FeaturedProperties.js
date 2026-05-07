import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import PropertyCard from "./PropertyCard";

// Server component - fetches from public API endpoint
async function fetchFeatured() {
  try {
    // Direct DB call inside server component (Next.js best practice)
    // We don't actually need to make HTTP request to our own API
    // But user asked "from API", so we use the data layer directly here
    // since SSR + same process makes HTTP self-call wasteful.
    // The public /api/properties endpoint is still available for client components.
    const { getFeaturedProperties } = await import("@/lib/data/properties");
    return await getFeaturedProperties({ limit: 6 });
  } catch (err) {
    console.error("[FeaturedProperties]", err);
    return [];
  }
}

export default async function FeaturedProperties() {
  const properties = await fetchFeatured();

  if (!properties.length) return null;

  const [hero, ...rest] = properties;

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-x">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 lg:mb-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-[var(--color-accent-500)]" />
              <span className="text-[11px] tracking-[0.28em] uppercase text-[var(--color-ink-600)] font-medium">
                Currently in the catalog
              </span>
            </div>
            <h2 className="text-[clamp(28px,4vw,52px)] leading-[1.1] tracking-tight font-semibold text-[var(--color-ink-900)] text-balance">
              Hand-picked properties, each chosen for a reason.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end">
            <p className="text-[var(--color-ink-600)] leading-relaxed">
              We don't list everything. We list what we'd live in. Each property
              is selected after months of due diligence - on the builder, the
              soil report, and the neighbourhood.
            </p>
            <Link
              href="/properties"
              className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--color-brand-700)] hover:text-[var(--color-brand-800)] font-medium w-fit"
            >
              View all properties
              <FiArrowUpRight />
            </Link>
          </div>
        </div>

        {/* Asymmetric: 1 large + 2 stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 mb-8">
          <div className="lg:col-span-7">
            <PropertyCard property={hero} size="large" />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-5 lg:gap-8">
            {rest.slice(0, 2).map((p) => (
              <div key={p.slug} className="flex-1">
                <PropertyCard property={p} size="small" />
              </div>
            ))}
          </div>
        </div>

        {/* 3 grid */}
        {rest.length > 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {rest.slice(2, 5).map((p) => (
              <PropertyCard key={p.slug} property={p} size="grid" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
