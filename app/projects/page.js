import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHeader from "@/components/public/PageHeader";
import ProjectCard from "@/components/public/ProjectCard";
import { getProjects } from "@/lib/data/projects";

export const metadata = {
  title: "New Projects - Jyoti Properties",
  description: "Browse new launch projects from trusted builders across India.",
};

export default async function ProjectsPage() {
  const { items: projects, total } = await getProjects({ limit: 24 });

  return (
    <>
      <TopBar />
      <Navbar />
      <main>
        <PageHeader
          eyebrow="New launches"
          title="Projects worth waiting for."
          subtitle="From pre-launch villas to ready-to-move towers, here are the projects we're recommending today."
        />

        <section className="bg-[var(--color-bg-soft)] py-12 lg:py-16">
          <div className="container-x">
            <p className="text-sm text-[var(--color-ink-700)] mb-6 numeral">
              <strong className="text-[var(--color-ink-900)]">{total}</strong>{" "}
              {total === 1 ? "project" : "projects"} currently in the catalog
            </p>

            {projects.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center">
                <p className="text-[var(--color-ink-600)]">
                  No projects available right now. Check back soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                {projects.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
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
