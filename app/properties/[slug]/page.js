import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LuMapPin,
  LuBedDouble,
  LuBath,
  LuRuler,
  LuCar,
  LuCalendar,
  LuBuilding,
  LuShieldCheck,
  LuChevronRight,
} from "react-icons/lu";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PropertyGallery from "@/components/public/PropertyGallery";
import PropertyContactForm from "@/components/public/PropertyContactForm";
import PropertyCard from "@/components/public/PropertyCard";
import { getPropertyBySlug, getSimilarProperties } from "@/lib/data/properties";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property not found" };
  return {
    title: `${property.name} - ${property.location}`,
    description: property.tagline || property.description,
  };
}

export default async function PropertyDetailPage({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();
  const similar = await getSimilarProperties(slug, 3);

  const stats = [
    { icon: LuBedDouble, label: "Bedrooms", value: property.bedrooms || "-" },
    { icon: LuBath, label: "Bathrooms", value: property.bathrooms || "-" },
    { icon: LuRuler, label: "Carpet Area", value: property.area },
    { icon: LuCar, label: "Parking", value: property.parking || "-" },
    { icon: LuCalendar, label: "Possession", value: property.possessionDate },
    { icon: LuBuilding, label: "Total Units", value: property.totalUnits || "-" },
  ];

  return (
    <>
      <TopBar />
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <nav className="bg-[var(--color-bg-soft)] border-b border-[var(--color-ink-100)] py-3">
          <div className="container-x flex items-center gap-2 text-xs text-[var(--color-ink-500)]">
            <Link href="/" className="hover:text-[var(--color-brand-700)]">
              Home
            </Link>
            <LuChevronRight className="text-[var(--color-ink-400)]" />
            <Link href="/properties" className="hover:text-[var(--color-brand-700)]">
              Properties
            </Link>
            <LuChevronRight className="text-[var(--color-ink-400)]" />
            <span className="text-[var(--color-ink-700)] truncate">{property.name}</span>
          </div>
        </nav>

        {/* Header + gallery */}
        <section className="bg-white py-6 lg:py-8">
          <div className="container-x">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <span className="px-3 py-1 bg-[var(--color-brand-50)] text-[var(--color-brand-700)] text-[10px] tracking-[0.22em] uppercase font-medium rounded-full">
                    {property.status}
                  </span>
                  <span className="px-3 py-1 bg-[var(--color-bg-muted)] text-[var(--color-ink-700)] text-[10px] tracking-[0.22em] uppercase font-medium rounded-full">
                    {property.type}
                  </span>
                </div>
                <h1 className="text-2xl lg:text-4xl font-semibold tracking-tight text-[var(--color-ink-900)] mb-2">
                  {property.name}
                </h1>
                <div className="flex items-center gap-2 text-[var(--color-ink-600)] text-sm">
                  <LuMapPin className="text-[var(--color-brand-700)]" />
                  {property.location}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] font-medium mb-1">
                  Starting from
                </p>
                <p className="numeral text-2xl lg:text-3xl font-semibold text-[var(--color-brand-700)]">
                  {property.priceLabel}
                </p>
              </div>
            </div>

            <PropertyGallery
              images={property.gallery && property.gallery.length ? property.gallery : [property.image]}
              propertyName={property.name}
            />
          </div>
        </section>

        {/* Body grid */}
        <section className="bg-[var(--color-bg-soft)] py-12 lg:py-16">
          <div className="container-x">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-10">
              {/* Main content */}
              <div className="space-y-10 lg:space-y-12">
                {/* Quick stats */}
                <div className="bg-white rounded-2xl p-6 lg:p-8 border border-[var(--color-ink-100)]">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 lg:gap-4">
                    {stats.map((s) => {
                      const Icon = s.icon;
                      return (
                        <div key={s.label} className="text-center">
                          <Icon className="text-2xl text-[var(--color-brand-700)] mx-auto mb-2" />
                          <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] mb-1">
                            {s.label}
                          </p>
                          <p className="text-sm font-semibold text-[var(--color-ink-900)] numeral">
                            {s.value}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* About */}
                <Section title="About this property">
                  <p className="text-[var(--color-ink-700)] leading-relaxed text-pretty">
                    {property.description || property.tagline}
                  </p>
                </Section>

                {/* Configurations */}
                {property.configurations && property.configurations.length > 0 && (
                  <Section title="Available Configurations">
                    <div className="overflow-x-auto rounded-xl border border-[var(--color-ink-100)]">
                      <table className="w-full text-sm">
                        <thead className="bg-[var(--color-bg-soft)]">
                          <tr>
                            <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-600)] font-medium">
                              Configuration
                            </th>
                            <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-600)] font-medium">
                              Carpet Area
                            </th>
                            <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-600)] font-medium">
                              Price
                            </th>
                            <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-600)] font-medium">
                              Units
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {property.configurations.map((c, i) => (
                            <tr
                              key={i}
                              className="border-t border-[var(--color-ink-100)]"
                            >
                              <td className="p-4 font-medium text-[var(--color-ink-900)]">
                                {c.bhk}
                              </td>
                              <td className="p-4 text-[var(--color-ink-700)] numeral">
                                {c.area}
                              </td>
                              <td className="p-4 text-[var(--color-brand-700)] font-semibold numeral">
                                {c.price}
                              </td>
                              <td className="p-4 text-[var(--color-ink-700)] numeral">
                                {c.units}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Section>
                )}

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <Section title="Amenities">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {property.amenities.map((a) => (
                        <div
                          key={a}
                          className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-[var(--color-ink-100)] text-sm text-[var(--color-ink-800)]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-700)]" />
                          {a}
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Floor plan */}
                {property.floorPlanImage && (
                  <Section title="Floor Plan">
                    <div className="bg-white rounded-2xl overflow-hidden border border-[var(--color-ink-100)]">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={property.floorPlanImage}
                          alt="Floor plan"
                          fill
                          className="object-contain p-8"
                          sizes="(min-width: 1024px) 60vw, 100vw"
                        />
                      </div>
                    </div>
                  </Section>
                )}

                {/* Nearby */}
                {property.nearby && property.nearby.length > 0 && (
                  <Section title="What's nearby">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {property.nearby.map((n, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-white rounded-lg border border-[var(--color-ink-100)]"
                        >
                          <div>
                            <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] mb-0.5 font-medium">
                              {n.type}
                            </p>
                            <p className="text-sm font-medium text-[var(--color-ink-900)]">
                              {n.name}
                            </p>
                          </div>
                          <span className="text-xs text-[var(--color-brand-700)] font-medium numeral">
                            {n.distance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Builder + RERA */}
                <Section title="Builder & Compliance">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-[var(--color-ink-100)]">
                      <div className="flex items-center gap-2 mb-2">
                        <LuBuilding className="text-[var(--color-brand-700)]" />
                        <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] font-medium">
                          Built by
                        </p>
                      </div>
                      <p className="text-base font-semibold text-[var(--color-ink-900)]">
                        {property.builderName}
                      </p>
                      {property.builderEstd && (
                        <p className="text-xs text-[var(--color-ink-600)] mt-1">
                          Established {property.builderEstd}
                        </p>
                      )}
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-[var(--color-ink-100)]">
                      <div className="flex items-center gap-2 mb-2">
                        <LuShieldCheck className="text-[var(--color-brand-700)]" />
                        <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] font-medium">
                          RERA Number
                        </p>
                      </div>
                      <p className="text-sm font-medium text-[var(--color-ink-900)] numeral">
                        {property.rera}
                      </p>
                    </div>
                  </div>
                </Section>
              </div>

              {/* Sticky form */}
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <PropertyContactForm
                  propertyName={property.name}
                  propertySlug={property.slug}
                  priceLabel={property.priceLabel}
                />
              </aside>
            </div>
          </div>
        </section>

        {/* Similar */}
        {similar.length > 0 && (
          <section className="bg-white py-16 lg:py-20 border-t border-[var(--color-ink-100)]">
            <div className="container-x">
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-[var(--color-ink-900)] mb-8">
                Similar properties
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {similar.map((p) => (
                  <PropertyCard key={p.slug} property={p} size="grid" />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-xl lg:text-2xl font-semibold tracking-tight text-[var(--color-ink-900)] mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}
