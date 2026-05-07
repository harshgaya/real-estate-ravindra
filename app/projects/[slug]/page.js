import { notFound } from "next/navigation";
import Link from "next/link";
import {
  LuMapPin,
  LuBuilding,
  LuShieldCheck,
  LuChevronRight,
  LuCalendar,
  LuLayoutGrid,
} from "react-icons/lu";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PropertyGallery from "@/components/public/PropertyGallery";
import PropertyContactForm from "@/components/public/PropertyContactForm";
import { getProjectBySlug } from "@/lib/data/projects";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.name} - ${project.location}`,
    description: project.tagline || project.description,
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const stats = [
    { icon: LuLayoutGrid, label: "Total Units", value: project.totalUnits },
    { icon: LuBuilding, label: "Floors", value: project.floors },
    { icon: LuMapPin, label: "Land Area", value: project.landArea },
    { icon: LuCalendar, label: "Possession", value: project.possessionDate },
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
            <Link
              href="/projects"
              className="hover:text-[var(--color-brand-700)]"
            >
              Projects
            </Link>
            <LuChevronRight className="text-[var(--color-ink-400)]" />
            <span className="text-[var(--color-ink-700)] truncate">
              {project.name}
            </span>
          </div>
        </nav>

        {/* Header */}
        <section className="bg-white py-6 lg:py-8">
          <div className="container-x">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <span className="px-3 py-1 bg-[var(--color-brand-50)] text-[var(--color-brand-700)] text-[10px] tracking-[0.22em] uppercase font-medium rounded-full">
                    {project.status}
                  </span>
                  <span className="px-3 py-1 bg-[var(--color-bg-muted)] text-[var(--color-ink-700)] text-[10px] tracking-[0.22em] uppercase font-medium rounded-full">
                    {project.type}
                  </span>
                </div>
                <h1 className="text-2xl lg:text-4xl font-semibold tracking-tight text-[var(--color-ink-900)] mb-2">
                  {project.name}
                </h1>
                <p className="text-[var(--color-ink-600)] mb-2">
                  {project.tagline}
                </p>
                <div className="flex items-center gap-2 text-[var(--color-ink-600)] text-sm">
                  <LuMapPin className="text-[var(--color-brand-700)]" />
                  {project.location}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] font-medium mb-1">
                  Price range
                </p>
                <p className="numeral text-2xl lg:text-3xl font-semibold text-[var(--color-brand-700)]">
                  {project.priceLabel}
                </p>
              </div>
            </div>

            <PropertyGallery
              images={
                project.gallery && project.gallery.length
                  ? project.gallery
                  : [project.image].filter(Boolean)
              }
              videos={project.videos || []}
              pdfs={project.pdfs || []}
              videoTourUrl={project.videoTourUrl}
              virtualTourUrl={project.virtualTourUrl}
              propertyName={project.name}
            />
          </div>
        </section>

        {/* Body */}
        <section className="bg-[var(--color-bg-soft)] py-12 lg:py-16">
          <div className="container-x">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-10">
              <div className="space-y-10">
                {/* Stats */}
                <div className="bg-white rounded-2xl p-6 lg:p-8 border border-[var(--color-ink-100)]">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4">
                    {stats.map((s) => {
                      const Icon = s.icon;
                      return (
                        <div key={s.label} className="text-center">
                          <Icon className="text-2xl text-[var(--color-brand-700)] mx-auto mb-2" />
                          <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] mb-1">
                            {s.label}
                          </p>
                          <p className="text-sm font-semibold text-[var(--color-ink-900)] numeral">
                            {s.value || "-"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Section title="About the project">
                  <p className="text-[var(--color-ink-700)] leading-relaxed text-pretty">
                    {project.description}
                  </p>
                </Section>

                {/* Configurations */}
                {project.configurations &&
                  project.configurations.length > 0 && (
                    <Section title="Configurations">
                      <div className="overflow-x-auto rounded-xl border border-[var(--color-ink-100)]">
                        <table className="w-full text-sm">
                          <thead className="bg-[var(--color-bg-soft)]">
                            <tr>
                              <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-600)] font-medium">
                                Type
                              </th>
                              <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-600)] font-medium">
                                Area
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
                            {project.configurations.map((c, i) => (
                              <tr
                                key={i}
                                className="border-t border-[var(--color-ink-100)]"
                              >
                                <td className="p-4 font-medium text-[var(--color-ink-900)]">
                                  {c.type || c.bhk || "-"}
                                </td>
                                <td className="p-4 text-[var(--color-ink-700)] numeral">
                                  {c.size || c.area || "-"}
                                </td>
                                <td className="p-4 text-[var(--color-brand-700)] font-semibold numeral">
                                  {c.price || "-"}
                                </td>
                                <td className="p-4 text-[var(--color-ink-700)] numeral">
                                  {c.available ?? c.units ?? "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Section>
                  )}

                {/* Project Phases */}
                {project.phases && project.phases.length > 0 && (
                  <Section title="Project Phases">
                    <div className="space-y-3">
                      {project.phases.map((p, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-white rounded-xl border border-[var(--color-ink-100)]"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-[var(--color-ink-900)]">
                                {p.name}
                              </p>
                              {p.soldOut && (
                                <span className="px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] font-medium rounded bg-red-50 text-red-700">
                                  Sold Out
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[var(--color-ink-600)] mt-1 numeral">
                              {p.units ? `${p.units} units` : ""}
                              {p.units && p.possessionDate ? " · " : ""}
                              {p.possessionDate
                                ? `Possession ${p.possessionDate}`
                                : ""}
                            </p>
                          </div>
                          <span
                            className={`flex-shrink-0 px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-medium rounded-full ${
                              p.status === "Completed"
                                ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
                                : p.status === "Now Selling"
                                  ? "bg-green-50 text-green-700"
                                  : p.status === "Pre-Launch"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-[var(--color-bg-soft)] text-[var(--color-ink-700)]"
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Amenities */}
                {project.amenities && project.amenities.length > 0 && (
                  <Section title="Amenities">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {project.amenities.map((a) => (
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
                        {project.builderName}
                      </p>
                      <p className="text-xs text-[var(--color-ink-600)] mt-1">
                        Est. {project.builderEstd} · {project.builderProjects}+
                        projects
                      </p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-[var(--color-ink-100)]">
                      <div className="flex items-center gap-2 mb-2">
                        <LuShieldCheck className="text-[var(--color-brand-700)]" />
                        <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] font-medium">
                          RERA
                        </p>
                      </div>
                      <p className="text-sm font-medium text-[var(--color-ink-900)] numeral">
                        {project.rera}
                      </p>
                    </div>
                  </div>
                </Section>
              </div>

              <aside className="lg:sticky lg:top-24 lg:self-start">
                <PropertyContactForm
                  propertyName={project.name}
                  propertySlug={project.slug}
                  priceLabel={project.priceLabel}
                />
              </aside>
            </div>
          </div>
        </section>
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
