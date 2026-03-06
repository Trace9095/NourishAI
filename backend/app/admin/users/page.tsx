"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "viewer";
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CurrentAdmin {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "viewer";
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<CurrentAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  // Add form state
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "viewer">("viewer");
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAdmins(data.admins);
      if (data.currentAdmin) {
        setCurrentAdmin(data.currentAdmin);
      }
      setError("");
    } catch {
      setError("Failed to load admin users");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          name: newName,
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error || "Failed to create admin");
        return;
      }

      setSuccess(`Admin "${data.admin.name}" created successfully`);
      setShowAddForm(false);
      setNewEmail("");
      setNewName("");
      setNewPassword("");
      setNewRole("viewer");
      await fetchAdmins();
      setTimeout(() => setSuccess(""), 4000);
    } catch {
      setAddError("Network error");
    } finally {
      setAddLoading(false);
    }
  }

  async function handleToggleActive(admin: AdminUser) {
    if (admin.id === currentAdmin?.id) return;
    setActionLoading(admin.id);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: admin.id, isActive: !admin.isActive }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update");
        setTimeout(() => setError(""), 4000);
        return;
      }

      setSuccess(`${admin.name} ${admin.isActive ? "deactivated" : "activated"}`);
      await fetchAdmins();
      setTimeout(() => setSuccess(""), 4000);
    } catch {
      setError("Network error");
      setTimeout(() => setError(""), 4000);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRoleChange(adminId: string, newRoleValue: string) {
    setActionLoading(adminId);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: adminId, role: newRoleValue }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update role");
        setTimeout(() => setError(""), 4000);
        return;
      }

      setSuccess("Role updated successfully");
      setEditingRole(null);
      await fetchAdmins();
      setTimeout(() => setSuccess(""), 4000);
    } catch {
      setError("Network error");
      setTimeout(() => setError(""), 4000);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(admin: AdminUser) {
    if (admin.id === currentAdmin?.id) return;
    if (!confirm(`Delete admin "${admin.name}" (${admin.email})? This cannot be undone.`)) return;
    setActionLoading(admin.id);

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: admin.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to delete");
        setTimeout(() => setError(""), 4000);
        return;
      }

      setSuccess(`${admin.name} deleted`);
      await fetchAdmins();
      setTimeout(() => setSuccess(""), 4000);
    } catch {
      setError("Network error");
      setTimeout(() => setError(""), 4000);
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isSuperAdmin = currentAdmin?.role === "super_admin";
  const canCreate = currentAdmin?.role === "super_admin" || currentAdmin?.role === "admin";

  return (
    <main id="main-content" className="min-h-screen">
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
            <h1 className="font-[family-name:var(--font-outfit)] text-lg font-bold">Admin Users</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="text-sm text-gray-400 hover:text-white transition-colors min-h-[44px] px-3 flex items-center gap-2"
            >
              <ArrowLeftIcon /> Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-red-400 transition-colors min-h-[44px] px-3"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Success / Error banners */}
        {success && (
          <div className="bg-brand-green/10 border border-brand-green/30 text-brand-green rounded-xl px-4 py-3 text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Header row with Add button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">{admins.length} admin account{admins.length !== 1 ? "s" : ""}</p>
          </div>
          {canCreate && (
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setAddError("");
              }}
              className="min-h-[44px] px-5 bg-brand-green text-black font-semibold text-sm rounded-xl hover:bg-brand-green/90 transition-colors flex items-center gap-2"
            >
              {showAddForm ? (
                <>
                  <CloseIcon /> Cancel
                </>
              ) : (
                <>
                  <PlusIcon /> Add Admin
                </>
              )}
            </button>
          )}
        </div>

        {/* Add Admin Form (inline) */}
        {showAddForm && canCreate && (
          <div className="bg-brand-card rounded-2xl p-6 border border-brand-border/20">
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-lg mb-4">Add New Admin</h2>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="add-email" className="block text-sm text-gray-400 mb-1">Email</label>
                  <input
                    id="add-email"
                    type="email"
                    required
                    maxLength={254}
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-border/30 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-green/50 transition-colors"
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="add-name" className="block text-sm text-gray-400 mb-1">Name</label>
                  <input
                    id="add-name"
                    type="text"
                    required
                    maxLength={100}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-border/30 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-green/50 transition-colors"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label htmlFor="add-password" className="block text-sm text-gray-400 mb-1">Password</label>
                  <input
                    id="add-password"
                    type="password"
                    required
                    minLength={8}
                    maxLength={128}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-border/30 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-green/50 transition-colors"
                    placeholder="Min 8 characters"
                  />
                </div>
                <div>
                  <label htmlFor="add-role" className="block text-sm text-gray-400 mb-1">Role</label>
                  <select
                    id="add-role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as "admin" | "viewer")}
                    className="w-full bg-brand-dark border border-brand-border/30 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-green/50 transition-colors"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="admin">Admin</option>
                    {isSuperAdmin && <option value="super_admin">Super Admin</option>}
                  </select>
                </div>
              </div>

              {addError && (
                <p className="text-red-400 text-sm">{addError}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={addLoading}
                  className="min-h-[44px] px-6 bg-brand-green text-black font-semibold text-sm rounded-xl hover:bg-brand-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {addLoading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <PlusIcon />
                  )}
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Admin Users Table */}
        <div className="bg-brand-card rounded-2xl p-6 border border-brand-border/20">
          <h2 className="font-[family-name:var(--font-outfit)] font-bold text-lg mb-4">All Admin Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-left border-b border-brand-border/20">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Last Login</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Created</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-gray-600 py-8 text-center">No admin users found</td>
                  </tr>
                ) : (
                  admins.map((admin) => {
                    const isMe = admin.id === currentAdmin?.id;
                    const isBeingEdited = editingRole === admin.id;

                    return (
                      <tr key={admin.id} className="border-b border-brand-border/10">
                        {/* User info */}
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green text-xs font-bold shrink-0">
                              {admin.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-white font-medium flex items-center gap-2">
                                {admin.name}
                                {isMe && (
                                  <span className="text-[10px] text-brand-accent bg-brand-accent/10 px-1.5 py-0.5 rounded font-medium">You</span>
                                )}
                              </div>
                              <div className="text-gray-500 text-xs">{admin.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-3">
                          {isBeingEdited && isSuperAdmin ? (
                            <select
                              defaultValue={admin.role}
                              onChange={(e) => handleRoleChange(admin.id, e.target.value)}
                              onBlur={() => setEditingRole(null)}
                              autoFocus
                              className="bg-brand-dark border border-brand-border/30 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-green/50"
                            >
                              <option value="viewer">Viewer</option>
                              <option value="admin">Admin</option>
                              <option value="super_admin">Super Admin</option>
                            </select>
                          ) : (
                            <RoleBadge role={admin.role} />
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3">
                          <StatusDot active={admin.isActive} />
                        </td>

                        {/* Last Login */}
                        <td className="py-3 text-gray-500 hidden md:table-cell">
                          {admin.lastLoginAt ? timeAgo(admin.lastLoginAt) : "Never"}
                        </td>

                        {/* Created */}
                        <td className="py-3 text-gray-500 hidden md:table-cell">
                          {formatDate(admin.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="py-3">
                          <div className="flex items-center justify-end gap-1">
                            {/* Edit role — super_admin only */}
                            {isSuperAdmin && !isMe && (
                              <button
                                onClick={() => setEditingRole(isBeingEdited ? null : admin.id)}
                                disabled={actionLoading === admin.id}
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-brand-accent transition-colors disabled:opacity-30"
                                title="Edit role"
                              >
                                <EditIcon />
                              </button>
                            )}

                            {/* Toggle active — super_admin only, not self */}
                            {isSuperAdmin && !isMe && (
                              <button
                                onClick={() => handleToggleActive(admin)}
                                disabled={actionLoading === admin.id}
                                className={`min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors disabled:opacity-30 ${
                                  admin.isActive
                                    ? "text-gray-500 hover:text-red-400"
                                    : "text-gray-500 hover:text-brand-green"
                                }`}
                                title={admin.isActive ? "Deactivate" : "Activate"}
                              >
                                {admin.isActive ? <DeactivateIcon /> : <ActivateIcon />}
                              </button>
                            )}

                            {/* Delete — super_admin only, not self */}
                            {isSuperAdmin && !isMe && (
                              <button
                                onClick={() => handleDelete(admin)}
                                disabled={actionLoading === admin.id}
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors disabled:opacity-30"
                                title="Delete"
                              >
                                <TrashIcon />
                              </button>
                            )}

                            {/* Loading spinner for row actions */}
                            {actionLoading === admin.id && (
                              <div className="w-4 h-4 border-2 border-brand-green border-t-transparent rounded-full animate-spin ml-1" />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permissions info */}
        <div className="bg-brand-card rounded-2xl p-6 border border-brand-border/20">
          <h2 className="font-[family-name:var(--font-outfit)] font-bold text-lg mb-4">Role Permissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <RoleBadge role="super_admin" />
              <ul className="text-xs text-gray-500 space-y-1 mt-2">
                <li>View dashboard and all data</li>
                <li>Create, edit, delete admin users</li>
                <li>Change user roles and status</li>
                <li>Full system access</li>
              </ul>
            </div>
            <div className="space-y-2">
              <RoleBadge role="admin" />
              <ul className="text-xs text-gray-500 space-y-1 mt-2">
                <li>View dashboard and all data</li>
                <li>Create admin and viewer accounts</li>
                <li>Cannot change roles or delete users</li>
              </ul>
            </div>
            <div className="space-y-2">
              <RoleBadge role="viewer" />
              <ul className="text-xs text-gray-500 space-y-1 mt-2">
                <li>View dashboard and all data</li>
                <li>Read-only access</li>
                <li>Cannot manage admin users</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Helper components ---

function RoleBadge({ role }: { role: string }) {
  const config = {
    super_admin: { bg: "bg-brand-green/15", text: "text-brand-green", label: "Super Admin" },
    admin: { bg: "bg-blue-500/15", text: "text-blue-400", label: "Admin" },
    viewer: { bg: "bg-gray-700/50", text: "text-gray-400", label: "Viewer" },
  };
  const c = config[role as keyof typeof config] || config.viewer;
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="flex items-center gap-2 text-xs">
      <span className={`w-2 h-2 rounded-full ${active ? "bg-brand-green" : "bg-red-500"}`} />
      <span className={active ? "text-brand-green" : "text-red-400"}>
        {active ? "Active" : "Inactive"}
      </span>
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// --- SVG Icon Components ---

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function DeactivateIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}

function ActivateIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
