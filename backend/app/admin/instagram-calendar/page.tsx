"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { allPosts, type InstagramPost } from "@/lib/instagram-data";

type Post = InstagramPost;

const TYPE_COLORS: Record<string, string> = {
  feed: "#34C759",
  story: "#5AC8FA",
  reel: "#FF9500",
};

const TYPE_LABELS: Record<string, string> = {
  feed: "Feed",
  story: "Story",
  reel: "Reel",
};

function getImagePath(post: Post): string | null {
  if (post.type === "feed")
    return `/images/instagram/feed/${post.id}.png`;
  if (post.type === "story")
    return `/images/instagram/story/${post.id}.png`;
  if (post.type === "reel")
    return `/images/instagram/reels/${post.id}.mp4`;
  return null;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getHeadline(post: Post): string {
  return (
    post.data.HEADLINE ||
    post.data.HEADLINE_1 ||
    post.data.CATEGORY ||
    post.data.BADGE ||
    post.template
  );
}

export default function InstagramCalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [postedIds, setPostedIds] = useState<Set<string>>(new Set());
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nai-ig-posted");
      if (stored) setPostedIds(new Set(JSON.parse(stored)));
    } catch {}
  }, []);

  const savePosted = useCallback((ids: Set<string>) => {
    setPostedIds(ids);
    try {
      localStorage.setItem("nai-ig-posted", JSON.stringify([...ids]));
    } catch {}
  }, []);

  const togglePosted = useCallback(
    (id: string) => {
      const next = new Set(postedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      savePosted(next);
    },
    [postedIds, savePosted]
  );

  const copyCaption = useCallback(
    async (post: Post) => {
      const text = post.caption || getHeadline(post);
      await navigator.clipboard.writeText(text);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2000);
    },
    []
  );

  const filtered = useMemo(() => {
    let result = allPosts;
    if (selectedMonth !== null) {
      result = result.filter((p) => {
        if (!p.date) return false;
        return new Date(p.date + "T12:00:00").getMonth() + 1 === selectedMonth;
      });
    }
    if (selectedType) {
      result = result.filter((p) => p.type === selectedType);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          getHeadline(p).toLowerCase().includes(q) ||
          (p.caption && p.caption.toLowerCase().includes(q)) ||
          p.template.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedMonth, selectedType, search]);

  const monthCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const p of allPosts) {
      if (!p.date) continue;
      const m = new Date(p.date + "T12:00:00").getMonth() + 1;
      counts[m] = (counts[m] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="min-h-dvh bg-brand-dark text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-brand-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-green/20 flex items-center justify-center text-brand-green font-bold text-sm">
              N
            </div>
            <div>
              <h1 className="text-lg font-bold font-[family-name:var(--font-outfit)]">
                Instagram Calendar
              </h1>
              <p className="text-xs text-white/40">
                NourishAI &middot; {allPosts.length} posts &middot;{" "}
                {postedIds.size} posted
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompact(false)}
              className={`p-2 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${
                !compact
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
              title="Grid view"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setCompact(true)}
              className={`p-2 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${
                compact
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
              title="List view"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <Link
              href="/admin/dashboard"
              className="text-xs text-white/40 hover:text-white/70 px-3 py-2 min-h-[44px] flex items-center"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Month pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedMonth(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
              selectedMonth === null
                ? "bg-brand-green text-brand-dark"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            All ({allPosts.length})
          </button>
          {[
            { month: 3, label: "March" },
            { month: 4, label: "April" },
            { month: 5, label: "May" },
            { month: 6, label: "June" },
          ].filter(({ month }) => monthCounts[month]).map(({ month, label }) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                selectedMonth === month
                  ? "bg-brand-green text-brand-dark"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {label} ({monthCounts[month]})
            </button>
          ))}
        </div>

        {/* Type filter + search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {["feed", "story", "reel"].map((t) => (
              <button
                key={t}
                onClick={() =>
                  setSelectedType(selectedType === t ? null : t)
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[44px] flex items-center gap-1.5 ${
                  selectedType === t
                    ? "text-brand-dark"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
                style={
                  selectedType === t
                    ? { backgroundColor: TYPE_COLORS[t] }
                    : {}
                }
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: TYPE_COLORS[t] }}
                />
                {TYPE_LABELS[t]} (
                {allPosts.filter((p) => p.type === t).length})
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-green/50 placeholder:text-white/30 min-h-[44px]"
            />
          </div>

          <div className="text-xs text-white/30">
            {filtered.length} of {allPosts.length} posts
          </div>
        </div>

        {/* Posts grid or list */}
        {compact ? (
          <div className="space-y-2">
            {filtered.map((post) => {
              const imgPath = getImagePath(post);
              const isPosted = postedIds.has(post.id);
              return (
                <div
                  key={post.id}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${
                    isPosted
                      ? "bg-white/[0.02] border-white/5 opacity-50"
                      : "bg-brand-card border-white/10"
                  }`}
                >
                  {/* Thumbnail */}
                  {imgPath && post.type !== "reel" ? (
                    <button
                      onClick={() => setLightbox(imgPath)}
                      className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                    >
                      <Image
                        src={imgPath}
                        alt={getHeadline(post)}
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      {post.type === "reel" ? (
                        <svg className="w-5 h-5 text-brand-orange" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      ) : (
                        <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"/></svg>
                      )}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            TYPE_COLORS[post.type] || "#666",
                        }}
                      />
                      <span className="text-sm font-medium text-white/90 truncate">
                        {getHeadline(post)}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">
                      {formatDate(post.date)} &middot;{" "}
                      {TYPE_LABELS[post.type] || post.type}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => copyCaption(post)}
                      className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Copy caption"
                    >
                      {copiedId === post.id ? (
                        <svg
                          className="w-4 h-4 text-brand-green"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => togglePosted(post.id)}
                      className={`p-2 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${
                        isPosted
                          ? "text-brand-green bg-brand-green/10"
                          : "text-white/30 hover:text-white/70 hover:bg-white/5"
                      }`}
                      title={isPosted ? "Mark unposted" : "Mark posted"}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((post) => {
              const imgPath = getImagePath(post);
              const isPosted = postedIds.has(post.id);
              return (
                <div
                  key={post.id}
                  className={`rounded-2xl border overflow-hidden transition-all ${
                    isPosted
                      ? "bg-white/[0.02] border-white/5 opacity-50"
                      : "bg-brand-card border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Image */}
                  {imgPath && post.type !== "reel" ? (
                    <button
                      onClick={() => setLightbox(imgPath)}
                      className="relative w-full aspect-square"
                    >
                      <Image
                        src={imgPath}
                        alt={getHeadline(post)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover"
                        unoptimized
                      />
                      {post.type === "story" && (
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                          Story
                        </div>
                      )}
                    </button>
                  ) : post.type === "reel" && imgPath ? (
                    <button
                      onClick={() => setLightbox(imgPath)}
                      className="relative w-full aspect-video bg-white/5 overflow-hidden"
                    >
                      <video
                        src={imgPath}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        Reel
                      </div>
                    </button>
                  ) : (
                    <div className="relative w-full aspect-square bg-white/5 flex items-center justify-center">
                      <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"/></svg>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                          style={{
                            backgroundColor:
                              (TYPE_COLORS[post.type] || "#666") + "20",
                            color: TYPE_COLORS[post.type] || "#666",
                          }}
                        >
                          {TYPE_LABELS[post.type] || post.type}
                        </span>
                        <span className="text-xs text-white/40">
                          {formatDate(post.date)}
                        </span>
                      </div>
                      {isPosted && (
                        <span className="text-[10px] text-brand-green font-medium">
                          POSTED
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-semibold text-white/90 line-clamp-2">
                      {getHeadline(post)}
                    </h3>

                    {post.caption && (
                      <p className="text-xs text-white/50 line-clamp-3">
                        {post.caption}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => copyCaption(post)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors min-h-[44px]"
                      >
                        {copiedId === post.id ? (
                          <>
                            <svg
                              className="w-3.5 h-3.5 text-brand-green"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Copy Caption
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => togglePosted(post.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors min-h-[44px] flex items-center gap-1.5 ${
                          isPosted
                            ? "bg-brand-green/10 text-brand-green"
                            : "bg-white/5 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {isPosted ? "Posted" : "Done"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <p className="text-lg">No posts match your filters</p>
            <button
              onClick={() => {
                setSelectedMonth(null);
                setSelectedType(null);
                setSearch("");
              }}
              className="mt-3 text-sm underline hover:text-white/60"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <dialog
          open
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 w-full h-full m-0 p-0 border-0"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div
            className="relative max-w-lg max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.endsWith(".mp4") ? (
              <video
                src={lightbox}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="w-full max-h-[90vh] object-contain"
              />
            ) : (
              <div className="relative w-full aspect-square">
                <Image
                  src={lightbox}
                  alt="Post preview"
                  fill
                  sizes="100vw"
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
          </div>
        </dialog>
      )}
    </div>
  );
}
