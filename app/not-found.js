import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default function NotFound() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main>
        <section className="bg-[var(--color-bg-soft)] py-20 lg:py-32 min-h-[70vh] grid place-items-center">
          <div className="container-x max-w-2xl text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="h-px w-10 bg-[var(--color-accent-500)]" />
              <span className="text-[11px] tracking-[0.28em] uppercase text-[var(--color-ink-600)] font-medium">
                Page not found
              </span>
              <span className="h-px w-10 bg-[var(--color-accent-500)]" />
            </div>

            <p className="numeral text-7xl lg:text-9xl font-semibold text-[var(--color-ink-200)] mb-4 tracking-tight">
              404
            </p>

            <h1 className="text-3xl lg:text-5xl font-semibold tracking-tight text-[var(--color-ink-900)] mb-5 text-balance">
              We can't find that page.
            </h1>
            <p className="text-[var(--color-ink-600)] leading-relaxed mb-10 max-w-md mx-auto">
              The page you're looking for doesn't exist, or has been moved. The
              property may have been sold or delisted.
            </p>

            <div className="flex flex-wrap gap-3 justify-center mb-12">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[var(--color-brand-700)] hover:bg-[var(--color-brand-800)] text-white text-sm font-medium transition-colors"
              >
                Back to home
                <FiArrowUpRight />
              </Link>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-[var(--color-ink-200)] hover:bg-white text-[var(--color-ink-800)] text-sm transition-colors"
              >
                Browse properties
              </Link>
            </div>

            <div className="pt-10 border-t border-[var(--color-ink-100)]">
              <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] mb-4 font-medium">
                You might be looking for
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { label: "Properties", href: "/properties" },
                  { label: "New Projects", href: "/projects" },
                  { label: "Bengaluru", href: "/locations/bengaluru" },
                  { label: "Journal", href: "/blog" },
                  { label: "About Us", href: "/about" },
                  { label: "Contact", href: "/contact" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="px-4 py-2 bg-white border border-[var(--color-ink-100)] rounded-full text-sm text-[var(--color-ink-700)] hover:border-[var(--color-brand-600)] hover:text-[var(--color-brand-700)] transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
