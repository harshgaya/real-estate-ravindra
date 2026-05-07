import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { LuMapPin, LuBedDouble, LuRuler, LuBath } from "react-icons/lu";

export default function PropertyCard({ property, size = "grid" }) {
  if (!property) return null;

  const aspectClass =
    size === "large"
      ? "aspect-[4/3] lg:aspect-[5/4]"
      : size === "small"
        ? "aspect-[5/4]"
        : "aspect-[4/3]";

  const titleClass =
    size === "large"
      ? "text-2xl lg:text-4xl"
      : size === "small"
        ? "text-xl lg:text-2xl"
        : "text-lg lg:text-xl";

  const padding = size === "large" ? "p-6 lg:p-8" : "p-5";

  return (
    <Link href={`/properties/${property.slug}`} className="group block hover-lift">
      <article
        className={`img-zoom relative ${aspectClass} rounded-2xl overflow-hidden bg-[var(--color-ink-200)]`}
      >
        <Image
          src={property.image}
          alt={property.name}
          fill
          className="object-cover"
          sizes={
            size === "large"
              ? "(min-width: 1024px) 60vw, 100vw"
              : size === "small"
                ? "(min-width: 1024px) 40vw, 100vw"
                : "(min-width: 1024px) 33vw, 50vw"
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink-900)]/85 via-[var(--color-ink-900)]/15 to-transparent" />

        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-900)] font-medium rounded-full">
            {property.status}
          </span>
        </div>

        <div className="absolute top-4 right-4 w-9 h-9 grid place-items-center rounded-full bg-white/95 text-[var(--color-ink-900)] group-hover:bg-[var(--color-brand-700)] group-hover:text-white transition-colors duration-300">
          <FiArrowUpRight />
        </div>

        <div className={`absolute bottom-0 left-0 right-0 ${padding} text-white`}>
          <div className="flex items-center gap-2 text-white/80 text-xs mb-2">
            <LuMapPin className="text-[var(--color-accent-500)] flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
          <h3 className={`${titleClass} font-semibold tracking-tight mb-1.5 leading-tight line-clamp-1`}>
            {property.name}
          </h3>
          {size !== "grid" && property.tagline && (
            <p className="text-sm text-white/75 mb-4 line-clamp-1">
              {property.tagline}
            </p>
          )}
          <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/75 ${size === "grid" ? "mt-3" : ""}`}>
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1.5">
                <LuBedDouble />
                {property.bedrooms} BHK
              </span>
            )}
            {property.area && (
              <span className="flex items-center gap-1.5">
                <LuRuler />
                {property.area}
              </span>
            )}
            <span className="numeral text-[var(--color-accent-500)] font-semibold text-sm ml-auto">
              {property.priceLabel}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
