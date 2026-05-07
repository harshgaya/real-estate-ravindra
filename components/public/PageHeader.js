export default function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <section className="bg-[var(--color-ink-900)] text-white py-16 lg:py-20 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-white/5 pointer-events-none" />

      <div className="relative container-x">
        {eyebrow && (
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-[var(--color-accent-500)]" />
            <span className="text-[11px] tracking-[0.28em] uppercase text-[var(--color-accent-500)] font-medium">
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className="text-[clamp(28px,4.5vw,52px)] leading-[1.05] tracking-tight font-semibold text-balance max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-base lg:text-lg text-white/70 max-w-2xl leading-relaxed text-pretty">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
