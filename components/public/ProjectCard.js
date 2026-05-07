import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { LuMapPin } from "react-icons/lu";

export default function ProjectCard({ project }) {
  if (!project) return null;
  return (
    <Link href={`/projects/${project.slug}`} className="group block hover-lift">
      <article className="img-zoom relative aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--color-ink-200)]">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink-900)]/85 via-[var(--color-ink-900)]/15 to-transparent" />

        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-900)] font-medium rounded-full">
            {project.status}
          </span>
        </div>

        <div className="absolute top-4 right-4 w-9 h-9 grid place-items-center rounded-full bg-white/95 text-[var(--color-ink-900)] group-hover:bg-[var(--color-brand-700)] group-hover:text-white transition-colors duration-300">
          <FiArrowUpRight />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7 text-white">
          <div className="flex items-center gap-2 text-white/80 text-xs mb-2">
            <LuMapPin className="text-[var(--color-accent-500)]" />
            {project.location}
          </div>
          <h3 className="text-xl lg:text-2xl font-semibold tracking-tight mb-1 leading-tight">
            {project.name}
          </h3>
          {project.tagline && (
            <p className="text-sm text-white/75 mb-4 line-clamp-1">{project.tagline}</p>
          )}
          <div className="flex items-center justify-between text-xs text-white/75 pt-3 border-t border-white/15">
            <span>{project.config || project.builderName}</span>
            <span className="numeral text-[var(--color-accent-500)] font-semibold text-sm">
              {project.priceLabel}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
