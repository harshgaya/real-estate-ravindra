import Image from "next/image";
import { LuShieldCheck, LuLeaf, LuCompass, LuHandshake } from "react-icons/lu";
import { HOME_PRINCIPLES } from "@/lib/constants";

const ICONS = {
  shield: LuShieldCheck,
  compass: LuCompass,
  leaf: LuLeaf,
  handshake: LuHandshake,
};

export default function Principles() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-28">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Image */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative">
              <div className="img-zoom relative aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--color-ink-200)]">
                <Image
                  src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85"
                  alt="Architectural detail"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
              <div className="hidden lg:block absolute -bottom-10 -right-8 w-52 h-64 rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white">
                <Image
                  src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=85"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="208px"
                />
              </div>
              <div className="absolute top-4 left-4 sm:top-5 sm:left-5 bg-white/95 backdrop-blur-md rounded-lg px-3.5 py-2.5 sm:px-4 sm:py-3 max-w-[180px] shadow-sm">
                <p className="numeral text-xl sm:text-2xl text-[var(--color-brand-700)] font-semibold">
                  4.9 / 5
                </p>
                <p className="text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-600)] mt-0.5">
                  Across 2,140 reviews
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-[var(--color-accent-500)]" />
              <span className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-[var(--color-ink-600)] font-medium">
                How we work
              </span>
            </div>
            <h2 className="text-[clamp(24px,4vw,48px)] leading-[1.1] tracking-tight font-semibold text-[var(--color-ink-900)] mb-5 sm:mb-6 text-balance">
              The boring things we obsess over, so you don't have to.
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-ink-600)] leading-relaxed max-w-xl mb-8 sm:mb-10">
              Buying property in India can feel like a series of small ambushes.
              We've spent eleven years removing each one.
            </p>

            <ul className="space-y-6 sm:space-y-8">
              {HOME_PRINCIPLES.map((p, i) => {
                const Icon = ICONS[p.iconName] || LuShieldCheck;
                return (
                  <li
                    key={p.title}
                    className="grid grid-cols-[auto_1fr] gap-4 sm:gap-5 lg:gap-6 pb-6 sm:pb-8 border-b border-[var(--color-ink-100)] last:border-b-0 last:pb-0"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="numeral text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-[var(--color-accent-600)] font-medium">
                        0{i + 1}
                      </span>
                      <span className="w-10 h-10 sm:w-11 sm:h-11 grid place-items-center rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
                        <Icon className="text-base sm:text-lg" />
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight text-[var(--color-ink-900)] mb-2">
                        {p.title}
                      </h3>
                      <p className="text-sm sm:text-base text-[var(--color-ink-600)] leading-relaxed text-pretty">
                        {p.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
