import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LuMapPin, LuChevronRight, LuArrowRight } from "react-icons/lu";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PropertyCard from "@/components/public/PropertyCard";
import { getLocalityBySlug } from "@/lib/data/localities";
import { getProperties } from "@/lib/data/properties";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const locality = await getLocalityBySlug(slug);
  if (!locality) return { title: "Locality not found" };
  return {
    title: `Properties in ${locality.name}, ${locality.city} - Verdant Estates`,
    description: locality.description,
  };
}

export default async function LocalityPage({ params }) {
  const { slug } = await params;
  const locality = await getLocalityBySlug(slug);
  if (!locality) notFound();

  // Try filtering by locality slug first, then by city slug
  let result = await getProperties({ locality: slug, limit: 12 });
  if (result.items.length === 0) {
    result = await getProperties({
      city: locality.city.toLowerCase(),
      limit: 12,
    });
  }

  return (
    <>
      <TopBar />
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <nav className="bg-[var(--color-bg-soft)] border-b border-[var(--color-ink-100)] py-3">
          <div className="container-x flex items-center gap-2 text-xs text-[var(--color-ink-500)]">
            <Link href="/" className="hover:text-[var(--color-brand-700)]">Home</Link>
            <LuChevronRight className="text-[var(--color-ink-400)]" />
            <span className="text-[var(--color-ink-700)]">
              {locality.name}, {locality.city}
            </span>
          </div>
        </nav>

        {/* Hero with locality image */}
        <section className="relative bg-[var(--color-ink-900)] text-white overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={locality.image}
              alt={locality.name}
              fill
              className="object-cover opacity-40"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink-900)] via-[var(--color-ink-900)]/70 to-[var(--color-ink-900)]/30" />
          </div>

          <div className="relative container-x py-20 lg:py-28">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-10 bg-[var(--color-accent-500)]" />
                <span className="text-[11px] tracking-[0.28em] uppercase text-[var(--color-accent-500)] font-medium">
                  {locality.city}, {locality.state}
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight mb-5 text-balance leading-[1.05]">
                {locality.name}
              </h1>
              <p className="text-lg text-white/85 leading-relaxed mb-6">
                {locality.tagline}
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                {locality.description}
              </p>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase text-white/60 mb-1">
                    Avg Price
                  </p>
                  <p className="numeral text-2xl font-semibold text-[var(--color-accent-500)]">
                    {locality.avgPrice}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase text-white/60 mb-1">
                    Per sq.ft
                  </p>
                  <p className="numeral text-base font-semibold text-white">
                    {locality.pricePerSqft}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase text-white/60 mb-1">
                    Listings
                  </p>
                  <p className="numeral text-2xl font-semibold text-white">
                    {locality.propertyCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key features */}
        <section className="bg-white py-12 lg:py-16">
          <div className="container-x">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-[var(--color-ink-900)] mb-6">
                  Why people choose {locality.name}
                </h2>
                <ul className="grid grid-cols-2 gap-3">
                  {locality.keyFeatures.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 p-3 bg-[var(--color-bg-soft)] rounded-lg text-sm text-[var(--color-ink-800)]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-700)]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-[var(--color-ink-900)] mb-6">
                  Nearby areas
                </h2>
                <div className="flex flex-wrap gap-2">
                  {locality.nearbyAreas.map((area) => (
                    <span
                      key={area}
                      className="px-4 py-2 bg-[var(--color-bg-muted)] border border-[var(--color-ink-100)] rounded-full text-sm text-[var(--color-ink-700)]"
                    >
                      <LuMapPin className="inline mr-1.5 text-[var(--color-brand-700)]" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Properties in this locality */}
        <section className="bg-[var(--color-bg-soft)] py-16 lg:py-20">
          <div className="container-x">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
              <div>
                <h2 className="text-2xl lg:text-4xl font-semibold tracking-tight text-[var(--color-ink-900)] mb-2">
                  Properties in {locality.name}
                </h2>
                <p className="text-[var(--color-ink-600)]">
                  {result.total} {result.total === 1 ? "listing" : "listings"} currently available
                </p>
              </div>
              <Link
                href={`/properties?locality=${slug}`}
                className="inline-flex items-center gap-2 text-sm text-[var(--color-brand-700)] hover:text-[var(--color-brand-800)] font-medium"
              >
                View all
                <LuArrowRight />
              </Link>
            </div>

            {result.items.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center">
                <p className="text-[var(--color-ink-600)] mb-4">
                  No listings here right now.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm text-[var(--color-brand-700)] hover:text-[var(--color-brand-800)] font-medium"
                >
                  Tell us what you're looking for
                  <LuArrowRight />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {result.items.map((p) => (
                  <PropertyCard key={p.slug} property={p} size="grid" />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
