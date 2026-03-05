"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getAllPosts, BLOG_CATEGORIES, type BlogPost } from "@/lib/blog";

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

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border border-brand-border/50 bg-brand-card p-6 transition-all duration-300 hover:bg-brand-card-hover hover:border-brand-green/40 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_30px_rgba(52,199,89,0.08)]"
    >
      <div className="flex items-center gap-3 mb-4">
        <CategoryBadge category={post.category} />
        <span className="text-xs text-gray-500">
          {formatDate(post.publishedAt)}
        </span>
      </div>

      <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white mb-3 group-hover:text-brand-green transition-colors leading-tight">
        {post.title}
      </h2>

      <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
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
          <span>{post.readTime} min read</span>
        </div>

        <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-green opacity-0 group-hover:opacity-100 transition-opacity">
          Read more
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
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const allPosts = getAllPosts();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredPosts =
    activeCategory === "All"
      ? allPosts
      : allPosts.filter((post) => post.category === activeCategory);

  return (
    <>
      <Header />
      <main id="main-content" className="pt-24 pb-16">
        {/* Hero section */}
        <section className="mx-auto max-w-7xl px-6 mb-12">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-[family-name:var(--font-outfit)] text-4xl md:text-5xl font-extrabold text-white mb-4">
              The Nourish<span className="text-brand-green">AI</span> Blog
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Science-backed nutrition advice, AI technology deep dives, and
              practical tips to make macro tracking effortless.
            </p>
          </div>
        </section>

        {/* Category filters */}
        <section className="mx-auto max-w-7xl px-6 mb-10">
          <div
            className="flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Filter blog posts by category"
          >
            {BLOG_CATEGORIES.map((category) => (
              <button
                key={category}
                role="tab"
                aria-selected={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-all min-h-[44px] ${
                  activeCategory === category
                    ? "bg-brand-green text-brand-dark"
                    : "border border-brand-border text-gray-400 hover:text-white hover:border-gray-500"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Blog grid */}
        <section className="mx-auto max-w-7xl px-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No posts in this category yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
