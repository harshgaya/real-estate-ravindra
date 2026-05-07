import { Suspense } from "react";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHeader from "@/components/public/PageHeader";
import PropertyFilters from "@/components/public/PropertyFilters";
import PropertyList from "@/components/public/PropertyList";

export const metadata = {
  title: "All Properties - Jyoti Properties",
  description:
    "Browse hand-picked properties across Bengaluru, Mumbai, Hyderabad, Pune. Apartments, villas, plots, and commercial spaces.",
};

export default function PropertiesPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Find your next home"
          title="Hand-picked properties across India."
          subtitle="Each property below has passed our 14-point due-diligence checklist. Browse with confidence."
        />

        <section className="bg-[var(--color-bg-soft)] py-10 lg:py-14">
          <div className="container-x">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
              <Suspense
                fallback={
                  <div className="h-96 bg-white rounded-2xl animate-pulse" />
                }
              >
                <PropertyFilters />
              </Suspense>
              <Suspense
                fallback={
                  <div className="h-96 bg-white rounded-2xl animate-pulse" />
                }
              >
                <PropertyList />
              </Suspense>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
