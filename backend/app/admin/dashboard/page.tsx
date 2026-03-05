"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Stats {
  overview: {
    totalUsers: number;
    proUsers: number;
    freeUsers: number;
    totalScans: number;
    scansToday: number;
    scansThisWeek: number;
    scansThisMonth: number;
    totalTokens: number;
    estimatedCost: number;
  };
  scansByType: Record<string, number>;
  dailyScans: { date: string; count: number; tokens: number }[];
  dailyUsers: { date: string; count: number }[];
  recentScans: {
    id: string;
    scanType: string;
    modelUsed: string | null;
    tokensUsed: number | null;
    createdAt: string;
    userId: string;
  }[];
  recentUsers: {
    id: string;
    deviceId: string;
    subscriptionTier: string;
    createdAt: string;
  }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStats(data);
      setError("");
    } catch {
      setError("Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const { overview, scansByType, dailyScans, dailyUsers, recentScans, recentUsers } = stats;

  const monthlyRevenue = overview.proUsers * 7.99;
  const annualRunRate = monthlyRevenue * 12;
  const profitMargin = monthlyRevenue > 0
    ? ((monthlyRevenue - overview.estimatedCost) / monthlyRevenue * 100).toFixed(1)
    : "0";

  const maxDailyScans = Math.max(...dailyScans.map((d) => d.count), 1);
  const maxDailyUsers = Math.max(...dailyUsers.map((d) => d.count), 1);

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-brand-dark border-b border-brand-border/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="min-w-[44px] min-h-[44px] flex items-center">
              <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                  <path d="M16 3c-6.5 3.5-11 10.5-11 17.5 0 3.8 1.7 7 4.8 9.1 1.8-5.2 4.4-9.4 6.2-11.6 1.8 2.2 4.4 6.4 6.2 11.6 3.1-2.1 4.8-5.3 4.8-9.1C27 13.5 22.5 6.5 16 3z" fill="#34C759" />
                  <circle cx="16" cy="27" r="2" fill="#FF9500" />
                </svg>
              </div>
            </Link>
            <h1 className="font-[family-name:var(--font-outfit)] text-lg font-bold">Admin Dashboard</h1>
            <span className="text-xs text-gray-600 ml-2 hidden md:inline">Auto-refreshes every 30s</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchStats} className="text-sm text-gray-400 hover:text-white transition-colors min-h-[44px] px-3 flex items-center gap-2">
              <RefreshIcon /> Refresh
            </button>
            <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-400 transition-colors min-h-[44px] px-3">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI Cards Row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={overview.totalUsers} color="text-white">
            <UsersIcon />
          </StatCard>
          <StatCard label="Pro Subscribers" value={overview.proUsers} color="text-brand-accent">
            <StarIcon />
          </StatCard>
          <StatCard label="Free Users" value={overview.freeUsers} color="text-white">
            <UserIcon />
          </StatCard>
          <StatCard label="Total Scans" value={overview.totalScans} color="text-brand-green">
            <CameraIcon />
          </StatCard>
        </div>

        {/* KPI Cards Row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Scans Today" value={overview.scansToday} color="text-brand-green">
            <ClockIcon />
          </StatCard>
          <StatCard label="This Week" value={overview.scansThisWeek} color="text-white">
            <CalendarIcon />
          </StatCard>
          <StatCard label="This Month" value={overview.scansThisMonth} color="text-white">
            <CalendarIcon />
          </StatCard>
          <StatCard label="Total Tokens" value={overview.totalTokens.toLocaleString()} color="text-white">
            <ActivityIcon />
          </StatCard>
        </div>

        {/* Revenue & Cost Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Est. Monthly Revenue" value={`$${monthlyRevenue.toFixed(2)}`} color="text-brand-green">
            <DollarIcon />
          </StatCard>
          <StatCard label="Est. Annual Run Rate" value={`$${annualRunRate.toFixed(0)}`} color="text-brand-green">
            <TrendIcon />
          </StatCard>
          <StatCard label="Est. AI Cost (Total)" value={`$${overview.estimatedCost.toFixed(2)}`} color="text-brand-accent">
            <DollarIcon />
          </StatCard>
          <StatCard label="Profit Margin" value={`${profitMargin}%`} color="text-brand-green">
            <CheckCircleIcon />
          </StatCard>
        </div>

        {/* Scan Breakdown + User Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-brand-card rounded-2xl p-6 border border-brand-border/20">
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-lg mb-4">Scans by Type</h2>
            <div className="space-y-3">
              {Object.entries(scansByType).length === 0 ? (
                <p className="text-gray-600 text-sm">No scans yet</p>
              ) : (
                Object.entries(scansByType).map(([type, count]) => (
                  <div key={type} className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-24 capitalize">{type}</span>
                    <div className="flex-1 bg-brand-dark rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(count / Math.max(overview.totalScans, 1)) * 100}%`,
                          backgroundColor: type === "photo" ? "#34C759" : type === "description" ? "#5AC8FA" : "#FF9500",
                        }}
                      />
                    </div>
                    <span className="text-sm font-mono text-white w-12 text-right">{count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-brand-card rounded-2xl p-6 border border-brand-border/20">
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-lg mb-4">User Breakdown</h2>
            <div className="flex items-center justify-center gap-12 py-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{overview.freeUsers}</div>
                <div className="text-sm text-gray-500 mt-1">Free</div>
              </div>
              <div className="w-px h-16 bg-brand-border/30" />
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-accent">{overview.proUsers}</div>
                <div className="text-sm text-gray-500 mt-1">Pro</div>
              </div>
            </div>
            {overview.totalUsers > 0 && (
              <div className="mt-2 bg-brand-dark rounded-full h-4 overflow-hidden">
                <div className="h-full bg-brand-accent rounded-full transition-all duration-500" style={{ width: `${(overview.proUsers / overview.totalUsers) * 100}%` }} />
              </div>
            )}
            <p className="text-xs text-gray-600 mt-2 text-center">
              {overview.totalUsers > 0 ? `${((overview.proUsers / overview.totalUsers) * 100).toFixed(1)}% conversion rate` : "No users yet"}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-brand-card rounded-2xl p-6 border border-brand-border/20">
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-lg mb-4">Daily Scans (30 days)</h2>
            {dailyScans.length === 0 ? (
              <p className="text-gray-600 text-sm py-8 text-center">No data yet</p>
            ) : (
              <div className="flex items-end gap-[2px] h-40">
                {dailyScans.map((d) => (
                  <div
                    key={d.date}
                    className="flex-1 bg-brand-green/80 rounded-t hover:bg-brand-green transition-colors group relative"
                    style={{ height: `${(d.count / maxDailyScans) * 100}%`, minHeight: d.count > 0 ? "4px" : "0" }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-brand-dark border border-brand-border/30 rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {d.date}: {d.count} scans
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-brand-card rounded-2xl p-6 border border-brand-border/20">
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-lg mb-4">New Users (30 days)</h2>
            {dailyUsers.length === 0 ? (
              <p className="text-gray-600 text-sm py-8 text-center">No data yet</p>
            ) : (
              <div className="flex items-end gap-[2px] h-40">
                {dailyUsers.map((d) => (
                  <div
                    key={d.date}
                    className="flex-1 bg-brand-accent/80 rounded-t hover:bg-brand-accent transition-colors group relative"
                    style={{ height: `${(d.count / maxDailyUsers) * 100}%`, minHeight: d.count > 0 ? "4px" : "0" }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-brand-dark border border-brand-border/30 rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {d.date}: {d.count} users
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-brand-card rounded-2xl p-6 border border-brand-border/20">
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-lg mb-4">Recent Scans</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-left border-b border-brand-border/20">
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Model</th>
                    <th className="pb-2 font-medium">Tokens</th>
                    <th className="pb-2 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentScans.length === 0 ? (
                    <tr><td colSpan={4} className="text-gray-600 py-4 text-center">No scans yet</td></tr>
                  ) : (
                    recentScans.slice(0, 15).map((scan) => (
                      <tr key={scan.id} className="border-b border-brand-border/10">
                        <td className="py-2">
                          <ScanTypeBadge type={scan.scanType} />
                        </td>
                        <td className="py-2 text-gray-400">{scan.modelUsed || "—"}</td>
                        <td className="py-2 text-gray-400 font-mono">{scan.tokensUsed || 0}</td>
                        <td className="py-2 text-gray-500">{timeAgo(scan.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-brand-card rounded-2xl p-6 border border-brand-border/20">
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-lg mb-4">Recent Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-left border-b border-brand-border/20">
                    <th className="pb-2 font-medium">Device</th>
                    <th className="pb-2 font-medium">Tier</th>
                    <th className="pb-2 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.length === 0 ? (
                    <tr><td colSpan={3} className="text-gray-600 py-4 text-center">No users yet</td></tr>
                  ) : (
                    recentUsers.map((user) => (
                      <tr key={user.id} className="border-b border-brand-border/10">
                        <td className="py-2 text-gray-400 font-mono text-xs">{user.deviceId.slice(0, 8)}...</td>
                        <td className="py-2">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${user.subscriptionTier === "pro" ? "bg-brand-accent/15 text-brand-accent" : "bg-gray-800 text-gray-400"}`}>
                            {user.subscriptionTier}
                          </span>
                        </td>
                        <td className="py-2 text-gray-500">{timeAgo(user.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SVG Icon Components (static, no dangerouslySetInnerHTML) ---

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function StatCard({ label, value, color = "text-white", children }: {
  label: string;
  value: string | number;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-brand-card rounded-2xl p-5 border border-brand-border/20">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-500">{children}</span>
        <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
    </div>
  );
}

function ScanTypeBadge({ type }: { type: string }) {
  const colors = {
    photo: { bg: "rgba(52,199,89,0.15)", text: "#34C759" },
    description: { bg: "rgba(90,200,250,0.15)", text: "#5AC8FA" },
    barcode: { bg: "rgba(255,149,0,0.15)", text: "#FF9500" },
  };
  const c = colors[type as keyof typeof colors] || colors.barcode;
  return (
    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: c.bg, color: c.text }}>
      {type}
    </span>
  );
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
