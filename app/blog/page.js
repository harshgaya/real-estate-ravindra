import Link from "next/link";
import Image from "next/image";
import { LuClock, LuArrowRight } from "react-icons/lu";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHeader from "@/components/public/PageHeader";
import { getPosts } from "@/lib/data/blog";
import { SITE } from "@/lib/constants";

export const metadata = {
  title: `Journal - ${SITE.name}`,
  description: "Buyer guides, neighbourhood essays, and market notes.",
};

export default async function BlogPage() {
  const { items: posts } = await getPosts({ limit: 20 });

  if (!posts.length) {
    return (
      <>
        <TopBar />
        <Navbar />
        <main>
          <PageHeader eyebrow="Journal" title="Coming soon." />
        </main>
        <Footer />
      </>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <>
      <TopBar />
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Journal"
          title="Notes from eleven years of advising."
          subtitle="Buyer guides, neighbourhood essays, and unfiltered market notes. Published when we have something worth saying."
        />

        <section className="bg-white py-16 lg:py-20">
          <div className="container-x">
            {/* Featured */}
            <Link
              href={`/blog/${featured.slug}`}
              className="group block hover-lift mb-12 lg:mb-16"
            >
              <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[var(--color-bg-soft)] rounded-2xl overflow-hidden">
                <div className="img-zoom relative aspect-[5/4] lg:aspect-auto lg:h-full">
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
                <div className="p-8 lg:p-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-[var(--color-brand-700)] text-white text-[10px] tracking-[0.22em] uppercase font-medium rounded-full">
                      Featured
                    </span>
                    <span className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)]">
                      {featured.category}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-4xl font-semibold tracking-tight text-[var(--color-ink-900)] mb-4 leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-[var(--color-ink-600)] leading-relaxed mb-6">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[var(--color-ink-500)]">
                    <span>{featured.author}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <LuClock />
                      {featured.readTime}
                    </span>
                    <span>·</span>
                    <span>{formatDate(featured.publishedAt)}</span>
                  </div>
                </div>
              </article>
            </Link>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block hover-lift"
                >
                  <article>
                    <div className="img-zoom relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-[var(--color-ink-200)]">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 33vw, 100vw"
                      />
                    </div>
                    <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-brand-700)] font-medium mb-2">
                      {post.category}
                    </p>
                    <h3 className="text-xl font-semibold text-[var(--color-ink-900)] mb-2 leading-snug group-hover:text-[var(--color-brand-700)] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[var(--color-ink-600)] leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[var(--color-ink-500)]">
                      <span>{post.author}</span>
                      <span className="flex items-center gap-1.5">
                        <LuClock />
                        {post.readTime}
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
