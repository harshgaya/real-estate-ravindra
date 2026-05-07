import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { HOME_LOCALITIES } from "@/lib/constants";

export default function Localities() {
  return (
    <section className="relative bg-[var(--color-ink-900)] text-white py-16 sm:py-20 lg:py-28 overflow-hidden">
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none" />

      <div className="relative container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-10 lg:mb-12 items-end">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-[var(--color-accent-500)]" />
              <span className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-[var(--color-accent-500)] font-medium">
                Cities, deeply
              </span>
            </div>
            <h2 className="text-[clamp(24px,4vw,52px)] leading-[1.1] tracking-tight font-semibold text-white text-balance">
              We know eight neighbourhoods the way locals do.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-sm sm:text-base text-white/65 leading-relaxed">
              We'd rather know four streets perfectly than forty cities loosely.
              Our advisors live where they work.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {HOME_LOCALITIES.map((l) => (
            <Link
              key={l.slug}
              href={`/locations/${l.slug}`}
              className="group hover-lift"
            >
              <div className="img-zoom relative aspect-[5/6] rounded-xl sm:rounded-2xl overflow-hidden bg-[var(--color-ink-800)] mb-3 sm:mb-4">
                <Image
                  src={l.image}
                  alt={l.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink-900)]/60 via-transparent to-transparent" />
                <div className="hidden sm:grid absolute top-4 right-4 w-9 h-9 place-items-center rounded-full bg-white/0 group-hover:bg-white text-white group-hover:text-[var(--color-ink-900)] transition-all duration-300">
                  <FiArrowUpRight className="opacity-0 group-hover:opacity-100" />
                </div>
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-[var(--color-accent-500)] mb-1 sm:mb-1.5 font-medium">
                  {l.city}
                </p>
                <h3 className="text-lg sm:text-2xl font-semibold tracking-tight text-white mb-1 sm:mb-1.5 leading-tight">
                  {l.name}
                </h3>
                <p className="text-xs sm:text-sm text-white/60 mb-2 sm:mb-3 line-clamp-1">{l.note}</p>
                <div className="hidden sm:flex items-center justify-between text-[11px] text-white/60 numeral pt-3 border-t border-white/10">
                  <span>{l.properties} listings</span>
                  <span className="text-[var(--color-accent-500)]">
                    avg {l.avgPrice}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
