import { LuQuote } from "react-icons/lu";
import { prisma } from "@/lib/prisma";
import { HOME_TESTIMONIALS } from "@/lib/constants";

async function getTestimonials() {
  if (!prisma) return [];
  try {
    const items = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: [
        { isFeatured: "desc" },
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
      take: 6,
    });
    return items;
  } catch {
    return [];
  }
}

export default async function Testimonials() {
  const dbItems = await getTestimonials();

  const items =
    dbItems.length > 0
      ? dbItems.map((t) => ({
          author: t.customerName,
          quote: t.text || "",
          image:
            t.customerPhoto ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
          home: t.customerTitle || "",
          type: t.type,
          videoUrl: t.videoUrl,
          videoThumbnail: t.videoThumbnail,
        }))
      : HOME_TESTIMONIALS;

  if (items.length === 0) return null;

  return (
    <section className="bg-[var(--color-bg-soft)] py-16 sm:py-20 lg:py-28 border-y border-[var(--color-ink-100)]">
      <div className="container-x">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="h-px w-8 sm:w-10 bg-[var(--color-accent-500)]" />
            <span className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-[var(--color-ink-600)] font-medium">
              From the families we've helped
            </span>
            <span className="h-px w-8 sm:w-10 bg-[var(--color-accent-500)]" />
          </div>
          <h2 className="text-[clamp(24px,4vw,48px)] leading-[1.1] tracking-tight font-semibold text-[var(--color-ink-900)] max-w-3xl mx-auto text-balance">
            What people remember, afterwards.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
          {items.map((t, i) => (
            <article
              key={i}
              className="bg-white rounded-2xl p-6 sm:p-7 lg:p-8 relative hover-lift shadow-sm border border-[var(--color-ink-100)]"
            >
              {t.type === "video" && t.videoUrl ? (
                <a
                  href={t.videoUrl}
                  target="_blank"
                  rel="noopener"
                  className="block aspect-video bg-[var(--color-bg-soft)] rounded-lg mb-5 overflow-hidden relative"
                >
                  {t.videoThumbnail ? (
                    <img
                      src={t.videoThumbnail}
                      alt={t.author}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-[var(--color-ink-500)] text-sm">
                      Video
                    </div>
                  )}
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 grid place-items-center">
                      <svg
                        className="w-6 h-6 text-[var(--color-ink-900)] ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </a>
              ) : (
                <>
                  <LuQuote className="absolute -top-3 -left-3 text-3xl sm:text-4xl text-[var(--color-accent-500)] bg-[var(--color-bg-soft)] rounded-full p-1.5 sm:p-2 border-4 border-[var(--color-bg-soft)]" />
                  <blockquote className="text-sm sm:text-base lg:text-lg leading-[1.55] text-[var(--color-ink-800)] mb-5 sm:mb-6 text-pretty">
                    "{t.quote}"
                  </blockquote>
                </>
              )}
              <footer className="flex items-center gap-3 pt-4 sm:pt-5 border-t border-[var(--color-ink-100)]">
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden flex-shrink-0">
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.author}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--color-bg-soft)] grid place-items-center text-sm font-medium">
                      {t.author?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-ink-900)] truncate">
                    {t.author}
                  </p>
                  <p className="text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] mt-0.5 truncate">
                    {t.home}
                  </p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
