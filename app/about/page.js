import Image from "next/image";
import Link from "next/link";
import { LuShieldCheck, LuLeaf, LuCompass, LuHandshake } from "react-icons/lu";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHeader from "@/components/public/PageHeader";
import { SITE, STATS, HOME_PRINCIPLES, TEAM } from "@/lib/constants";

export const metadata = {
  title: `About - ${SITE.name}`,
  description: "How we work, what we believe, and why we say no often.",
};

const ICONS = {
  shield: LuShieldCheck,
  compass: LuCompass,
  leaf: LuLeaf,
  handshake: LuHandshake,
};

export default function AboutPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main>
        <PageHeader
          eyebrow="About us"
          title="We've spent eleven years quietly removing the ambushes."
          subtitle="Verdant Estates was started in 2014 by a small group of people who'd bought too many bad apartments and decided to build the company we wished had existed."
        />

        {/* Story */}
        <section className="bg-white py-14 sm:py-16 lg:py-24">
          <div className="container-x">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--color-ink-200)]">
                  <Image
                    src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                </div>
              </div>
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-px w-10 bg-[var(--color-accent-500)]" />
                  <span className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-[var(--color-ink-600)] font-medium">
                    Our story
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[var(--color-ink-900)] mb-5 sm:mb-6">
                  Started in 2014, after one too many bad apartments.
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-[var(--color-ink-700)] leading-relaxed">
                  <p>
                    Our founder, Ankit, spent his late twenties buying his first
                    apartment in Bengaluru. Three brokers, twelve site visits,
                    one botched booking, and eleven months of paperwork later, he
                    realised the system was broken, not for the rich, who could
                    afford lawyers, but for the rest of us.
                  </p>
                  <p>
                    Verdant started as a small advisory practice in 2014.
                    Eleven years on, we've helped 12,400 families across eight
                    cities buy homes they're still happy with.
                  </p>
                  <p>
                    We remain small by choice. We list less than we could, say no
                    more than we say yes, and have no plans to franchise.
                  </p>
                </div>

                <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-5 sm:gap-6">
                  {STATS.map((s) => (
                    <div key={s.label} className="border-l-2 border-[var(--color-accent-500)] pl-3 sm:pl-4">
                      <p className="numeral text-2xl sm:text-3xl font-semibold text-[var(--color-ink-900)]">
                        {s.num}
                      </p>
                      <p className="text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] mt-1">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section id="process" className="bg-[var(--color-bg-soft)] py-14 sm:py-16 lg:py-24">
          <div className="container-x">
            <div className="text-center mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="h-px w-8 sm:w-10 bg-[var(--color-accent-500)]" />
                <span className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-[var(--color-ink-600)] font-medium">
                  How we work
                </span>
                <span className="h-px w-8 sm:w-10 bg-[var(--color-accent-500)]" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[var(--color-ink-900)] max-w-2xl mx-auto text-balance">
                Four principles, applied stubbornly.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {HOME_PRINCIPLES.map((p) => {
                const Icon = ICONS[p.iconName] || LuShieldCheck;
                return (
                  <div
                    key={p.title}
                    className="bg-white p-6 sm:p-7 rounded-2xl border border-[var(--color-ink-100)]"
                  >
                    <span className="w-11 h-11 sm:w-12 sm:h-12 grid place-items-center rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-700)] mb-4">
                      <Icon className="text-lg sm:text-xl" />
                    </span>
                    <h3 className="text-base font-semibold text-[var(--color-ink-900)]">
                      {p.title}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="bg-white py-14 sm:py-16 lg:py-24">
          <div className="container-x">
            <div className="text-center mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="h-px w-8 sm:w-10 bg-[var(--color-accent-500)]" />
                <span className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-[var(--color-ink-600)] font-medium">
                  The team
                </span>
                <span className="h-px w-8 sm:w-10 bg-[var(--color-accent-500)]" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[var(--color-ink-900)]">
                Small by choice.
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-8">
              {TEAM.map((m) => (
                <div key={m.name} className="text-center">
                  <div className="relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4">
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 25vw, 50vw"
                    />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-[var(--color-ink-900)]">
                    {m.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs tracking-wide text-[var(--color-ink-500)] mt-1">
                    {m.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="careers" className="bg-[var(--color-ink-900)] text-white py-14 sm:py-16 lg:py-20">
          <div className="container-x text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-semibold tracking-tight mb-4 sm:mb-5 text-balance">
              Want to work with us, or for us?
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-6 sm:mb-8">
              We hire two advisors a year. We accept a few new clients each
              month. Both are by application.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/contact"
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-md bg-white text-[var(--color-ink-900)] hover:bg-[var(--color-accent-500)] transition-colors text-sm font-medium"
              >
                Become a client
              </Link>
              <a
                href="mailto:careers@verdant.in"
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-md border border-white/25 hover:bg-white/10 transition-colors text-sm"
              >
                Join the team
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
