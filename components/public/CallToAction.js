import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import { CONTACT } from "@/lib/constants";

export default function CallToAction() {
  return (
    <section className="relative bg-[var(--color-ink-900)] text-white overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=85"
          alt=""
          fill
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-ink-900)]/70 via-[var(--color-ink-900)]/85 to-[var(--color-ink-900)]" />
      </div>

      <div className="relative container-x py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-[var(--color-accent-500)]" />
              <span className="text-[11px] tracking-[0.28em] uppercase text-[var(--color-accent-500)] font-medium">
                A simple invitation
              </span>
            </div>
            <h2 className="text-[clamp(34px,5vw,68px)] leading-[1.05] tracking-tight font-semibold text-white mb-6 text-balance">
              Tell us what you're looking for. We'll do the rest.
            </h2>
            <p className="text-base lg:text-lg text-white/70 max-w-2xl leading-relaxed mb-8 text-pretty">
              Spend twenty minutes with one of our advisors. No obligation.
              We'll send a curated shortlist within forty-eight hours.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-white text-[var(--color-ink-900)] hover:bg-[var(--color-accent-500)] transition-colors text-sm font-medium"
              >
                Book a Consultation
                <FiArrowUpRight />
              </Link>
              <Link
                href={CONTACT.phoneHref}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md border border-white/25 text-white hover:bg-white/10 transition-colors text-sm"
              >
                Or call · {CONTACT.phone}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-7">
              <p className="text-lg lg:text-xl text-white leading-snug mb-6 text-pretty">
                "Twenty-eight days from first call to keys in hand. They handled
                the loan, the registration, even the move-in checklist."
              </p>
              <div className="flex items-center gap-3 pt-5 border-t border-white/15">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent-500)]/20 grid place-items-center">
                  <span className="text-[var(--color-accent-500)] text-sm font-semibold">
                    SK
                  </span>
                </div>
                <div>
                  <p className="text-sm text-white">Shruti Kapur</p>
                  <p className="text-[10px] tracking-[0.22em] uppercase text-white/60 mt-0.5">
                    Bengaluru · Mar 2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
