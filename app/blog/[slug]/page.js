import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LuClock, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { getPostBySlug, getRelatedPosts } from "@/lib/data/blog";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} - Verdant Estates`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const related = await getRelatedPosts(slug, 3);

  return (
    <>
      <TopBar />
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <nav className="bg-[var(--color-bg-soft)] border-b border-[var(--color-ink-100)] py-3">
          <div className="container-x flex items-center gap-2 text-xs text-[var(--color-ink-500)]">
            <Link href="/" className="hover:text-[var(--color-brand-700)]">Home</Link>
            <LuChevronRight className="text-[var(--color-ink-400)]" />
            <Link href="/blog" className="hover:text-[var(--color-brand-700)]">Journal</Link>
            <LuChevronRight className="text-[var(--color-ink-400)]" />
            <span className="text-[var(--color-ink-700)] truncate">{post.title}</span>
          </div>
        </nav>

        {/* Article header */}
        <article className="bg-white py-12 lg:py-16">
          <div className="container-x max-w-4xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-600)] hover:text-[var(--color-brand-700)] mb-8"
            >
              <LuChevronLeft />
              Back to Journal
            </Link>

            <div className="mb-6">
              <span className="px-3 py-1 bg-[var(--color-brand-50)] text-[var(--color-brand-700)] text-[10px] tracking-[0.22em] uppercase font-medium rounded-full">
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-semibold tracking-tight text-[var(--color-ink-900)] mb-6 leading-[1.1] text-balance">
              {post.title}
            </h1>

            <p className="text-lg text-[var(--color-ink-600)] leading-relaxed mb-8 text-pretty">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-4 pb-8 border-b border-[var(--color-ink-100)]">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-ink-900)]">
                  {post.author}
                </p>
                <div className="flex items-center gap-3 text-xs text-[var(--color-ink-500)] mt-0.5">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <LuClock />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Cover image */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden my-10 bg-[var(--color-ink-200)]">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 900px, 100vw"
              />
            </div>

            {/* Body */}
            <div className="prose-content">
              {renderContent(post.content)}
            </div>
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="bg-[var(--color-bg-soft)] py-16 lg:py-20 border-t border-[var(--color-ink-100)]">
            <div className="container-x">
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-[var(--color-ink-900)] mb-8">
                Continue reading
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {related.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block hover-lift"
                  >
                    <article>
                      <div className="img-zoom relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-[var(--color-ink-200)]">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 768px) 33vw, 100vw"
                        />
                      </div>
                      <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-brand-700)] font-medium mb-2">
                        {post.category}
                      </p>
                      <h3 className="text-lg font-semibold text-[var(--color-ink-900)] mb-2 leading-snug group-hover:text-[var(--color-brand-700)] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[var(--color-ink-600)] line-clamp-2">
                        {post.excerpt}
                      </p>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function renderContent(content) {
  if (!content) return null;
  // Simple markdown-like rendering
  const blocks = content.trim().split(/\n\n+/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="text-2xl lg:text-3xl font-semibold tracking-tight text-[var(--color-ink-900)] mt-10 mb-4"
        >
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (trimmed.startsWith("### ")) {
      return (
        <h3
          key={i}
          className="text-xl font-semibold text-[var(--color-ink-900)] mt-8 mb-3"
        >
          {trimmed.replace(/^###\s+/, "")}
        </h3>
      );
    }
    if (/^\d+\.\s+/.test(trimmed)) {
      const items = trimmed.split("\n").map((l) => l.replace(/^\d+\.\s+/, ""));
      return (
        <ol
          key={i}
          className="list-decimal list-inside space-y-2 text-[var(--color-ink-700)] leading-relaxed mb-5 pl-2"
        >
          {items.map((it, j) => (
            <li key={j}>{it}</li>
          ))}
        </ol>
      );
    }
    return (
      <p
        key={i}
        className="text-[var(--color-ink-700)] leading-[1.75] mb-5 text-pretty"
      >
        {trimmed}
      </p>
    );
  });
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
