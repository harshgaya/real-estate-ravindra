import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { HOME_CATEGORIES } from "@/lib/constants";

export default function Categories() {
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 sm:py-20 lg:py-28 border-y border-[var(--color-ink-100)]">
      <div className="container-x">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10 lg:mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-[var(--color-accent-500)]" />
              <span className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-[var(--color-ink-600)] font-medium">
                Browse by character
              </span>
            </div>
            <h2 className="text-[clamp(24px,4vw,44px)] leading-[1.1] tracking-tight font-semibold text-[var(--color-ink-900)] max-w-2xl text-balance">
              What sort of place are you imagining?
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {HOME_CATEGORIES.map((c) => (
            <Link key={c.label} href={c.href} className="group hover-lift">
              <div className="img-zoom relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-[var(--color-ink-200)]">
                <Image
                  src={c.image}
                  alt={c.label}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink-900)]/90 via-[var(--color-ink-900)]/20 to-transparent" />

                <div className="hidden sm:grid absolute top-4 right-4 lg:top-5 lg:right-5 w-9 h-9 place-items-center rounded-full bg-white/0 group-hover:bg-white text-white group-hover:text-[var(--color-ink-900)] transition-all duration-300">
                  <FiArrowUpRight className="opacity-0 group-hover:opacity-100" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-7 text-white">
                  <p className="text-[var(--color-accent-500)] text-xs sm:text-sm mb-1.5 sm:mb-2 line-clamp-1">
                    {c.accent}
                  </p>
                  <h3 className="text-base sm:text-2xl lg:text-3xl font-semibold tracking-tight mb-1 leading-tight">
                    {c.label}
                  </h3>
                  <p className="text-[9px] sm:text-[11px] tracking-[0.18em] uppercase text-white/70 numeral">
                    {c.count}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
