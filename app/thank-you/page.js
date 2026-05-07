import Link from "next/link";
import { HiCheck } from "react-icons/hi2";
import { FiArrowUpRight } from "react-icons/fi";
import { LuPhone, LuClock, LuCalendar } from "react-icons/lu";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { SITE, CONTACT } from "@/lib/constants";

export const metadata = {
  title: `Thank you - ${SITE.name}`,
  description: "We've received your message.",
};

export default function ThankYouPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main>
        <section className="bg-[var(--color-bg-soft)] py-20 lg:py-28 min-h-[60vh]">
          <div className="container-x max-w-2xl">
            <div className="bg-white rounded-2xl border border-[var(--color-ink-100)] p-8 lg:p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-brand-50)] grid place-items-center mb-6">
                <HiCheck className="text-3xl text-[var(--color-brand-700)]" />
              </div>

              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-10 bg-[var(--color-accent-500)]" />
                <span className="text-[11px] tracking-[0.28em] uppercase text-[var(--color-ink-600)] font-medium">
                  Message received
                </span>
                <span className="h-px w-10 bg-[var(--color-accent-500)]" />
              </div>

              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-[var(--color-ink-900)] mb-4 text-balance">
                Thank you. We'll be in touch shortly.
              </h1>
              <p className="text-[var(--color-ink-600)] leading-relaxed mb-10 max-w-md mx-auto text-pretty">
                One of our advisors has been notified and will respond within
                one business day. For urgent matters, you can reach us directly
                using the options below.
              </p>

              {/* What happens next */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
                <div className="p-5 bg-[var(--color-bg-soft)] rounded-xl">
                  <LuClock className="text-[var(--color-brand-700)] text-xl mb-3" />
                  <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] font-medium mb-1">
                    Within 4 hours
                  </p>
                  <p className="text-sm text-[var(--color-ink-800)]">
                    Initial review of your inquiry
                  </p>
                </div>
                <div className="p-5 bg-[var(--color-bg-soft)] rounded-xl">
                  <LuPhone className="text-[var(--color-brand-700)] text-xl mb-3" />
                  <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] font-medium mb-1">
                    Within 24 hours
                  </p>
                  <p className="text-sm text-[var(--color-ink-800)]">
                    Personal call from your advisor
                  </p>
                </div>
                <div className="p-5 bg-[var(--color-bg-soft)] rounded-xl">
                  <LuCalendar className="text-[var(--color-brand-700)] text-xl mb-3" />
                  <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] font-medium mb-1">
                    Within 48 hours
                  </p>
                  <p className="text-sm text-[var(--color-ink-800)]">
                    Curated shortlist sent to you
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[var(--color-brand-700)] hover:bg-[var(--color-brand-800)] text-white text-sm font-medium transition-colors"
                >
                  Browse properties
                  <FiArrowUpRight />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-[var(--color-ink-200)] hover:bg-[var(--color-bg-muted)] text-[var(--color-ink-800)] text-sm transition-colors"
                >
                  Back to home
                </Link>
              </div>

              <p className="text-xs text-[var(--color-ink-500)] mt-8 pt-6 border-t border-[var(--color-ink-100)]">
                Need to reach us right away? Call{" "}
                <a
                  href={CONTACT.phoneHref}
                  className="text-[var(--color-brand-700)] font-medium numeral"
                >
                  {CONTACT.phone}
                </a>{" "}
                or email{" "}
                <a
                  href={CONTACT.emailHref}
                  className="text-[var(--color-brand-700)] font-medium"
                >
                  {CONTACT.email}
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
