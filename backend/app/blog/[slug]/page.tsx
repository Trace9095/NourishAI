import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import {
  getPostBySlug,
  getAllSlugs,
  getRelatedPosts,
  type BlogPost,
} from "@/lib/blog";

// ---------------------------------------------------------------------------
// Static generation
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function CategoryBadge({ category }: { category: string }) {
  const colorMap: Record<string, string> = {
    Nutrition: "bg-brand-green/10 text-brand-green border-brand-green/20",
    Technology: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Fitness: "bg-macro-protein/10 text-macro-protein border-macro-protein/20",
    Tips: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
        colorMap[category] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
      }`}
    >
      {category}
    </span>
  );
}

function RelatedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border border-brand-border/50 bg-brand-card p-5 transition-all duration-300 hover:bg-brand-card-hover hover:border-brand-green/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3),0_0_20px_rgba(52,199,89,0.06)]"
    >
      <div className="flex items-center gap-3 mb-3">
        <CategoryBadge category={post.category} />
        <span className="text-xs text-gray-500">{post.readTime} min read</span>
      </div>
      <h3 className="font-[family-name:var(--font-outfit)] text-base font-bold text-white group-hover:text-brand-green transition-colors leading-snug">
        {post.title}
      </h3>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Page
// Note: dangerouslySetInnerHTML is safe here — all blog content is hardcoded
// in lib/blog.ts (static TypeScript, no user input, no external data).
// ---------------------------------------------------------------------------

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);

  const shareUrl = `https://nourishhealthai.com/blog/${post.slug}`;
  const shareText = encodeURIComponent(post.title);

  return (
    <>
      <Header />
      <main id="main-content" className="pt-24 pb-16">
        {/* Back link */}
        <div className="mx-auto max-w-3xl px-6 mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-green transition-colors min-h-[44px]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Article header */}
        <article className="mx-auto max-w-3xl px-6">
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <CategoryBadge category={post.category} />
              <span className="text-sm text-gray-500">
                {formatDate(post.publishedAt)}
              </span>
              <span className="text-sm text-gray-600" aria-hidden="true">
                &middot;
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {post.readTime} min read
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-outfit)] text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
              {post.title}
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed mb-6">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M16 3c-6.5 3.5-11 10.5-11 17.5 0 3.8 1.7 7 4.8 9.1 1.8-5.2 4.4-9.4 6.2-11.6 1.8 2.2 4.4 6.4 6.2 11.6 3.1-2.1 4.8-5.3 4.8-9.1C27 13.5 22.5 6.5 16 3z"
                    fill="#34C759"
                  />
                  <circle cx="16" cy="27" r="2" fill="#FF9500" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{post.author}</p>
                <p className="text-xs text-gray-500">NourishAI</p>
              </div>
            </div>
          </header>

          {/* Divider */}
          <div className="h-px bg-brand-border/50 mb-10" />

          {/* Article content — static HTML from lib/blog.ts, no user input */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-brand-border/30">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500 mr-1">Tags:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-brand-border/50 bg-brand-card px-3 py-1 text-xs text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Share section */}
          <div className="mt-8 pt-8 border-t border-brand-border/30">
            <h2 className="font-[family-name:var(--font-outfit)] text-lg font-bold text-white mb-4">
              Share this article
            </h2>
            <div className="flex items-center gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-brand-border bg-brand-card px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:border-gray-500 transition-all min-h-[44px] min-w-[44px]"
                aria-label="Share on X (Twitter)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="ml-2 hidden sm:inline">Share on X</span>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-brand-border bg-brand-card px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:border-gray-500 transition-all min-h-[44px] min-w-[44px]"
                aria-label="Share on LinkedIn"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="ml-2 hidden sm:inline">LinkedIn</span>
              </a>

              <CopyLinkButton />
            </div>
          </div>
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mx-auto max-w-5xl px-6 mt-16">
            <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-white mb-6 text-center">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((relatedPost) => (
                <RelatedPostCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
