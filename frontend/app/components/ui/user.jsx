"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { authAPI } from "../../../services/api";

const ROLE_STYLES = {
  admin: "bg-rose-100 text-rose-700",
  manager: "bg-sky-100 text-sky-700",
  staff: "bg-emerald-100 text-emerald-700",
};

const STATUS_STYLES = {
  true: "bg-emerald-100 text-emerald-700",
  false: "bg-slate-200 text-slate-600",
};

export default function User({ title = "User Management", onBack }) {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "staff", isActive: true });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await authAPI.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchUsers();
    else setLoading(false);
  }, [isAdmin]);

  const handleChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: val }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", email: "", password: "", role: "staff", isActive: true });
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (u) => {
    setEditingId(u._id);
    setForm({ name: u.name, email: u.email, password: "", role: u.role, isActive: u.isActive });
    setFormError("");
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      if (editingId) {
        // Update existing user (name, role, isActive only — no password change here)
        await authAPI.updateUser(editingId, {
          name: form.name,
          role: form.role,
          isActive: form.isActive,
        });
      } else {
        // Register new user via auth endpoint
        const { authAPI: api } = await import("../../../services/api");
        await api.register({ name: form.name, email: form.email, password: form.password, role: form.role });
      }
      await fetchUsers();
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setFormError(err.response?.data?.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await authAPI.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  // Initials helper
  const initials = (name) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-[#F5FFFA] px-6 py-10">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-7xl flex-col rounded-3xl bg-white p-10 shadow-sm">
        <BackLink onBack={onBack} />

        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {isAdmin
                ? "Manage staff accounts, roles and access levels."
                : "You need admin privileges to manage users."}
            </p>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-right">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Total Users</p>
                <p className="text-lg font-bold text-slate-800">{users.length}</p>
              </div>
              <button
                type="button"
                onClick={showForm ? handleCancel : openCreate}
                className="rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
              >
                {showForm ? "Cancel" : "+ Add User"}
              </button>
            </div>
          )}
        </div>

        {/* Current user info card */}
        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50/60 px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-white shadow">
            {initials(currentUser?.name)}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Logged in as: {currentUser?.name}
            </p>
            <p className="text-xs text-slate-500">
              {currentUser?.email} ·{" "}
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${ROLE_STYLES[currentUser?.role]}`}>
                {currentUser?.role}
              </span>
            </p>
          </div>
        </div>

        {/* Create / Edit form */}
        {isAdmin && showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-5 grid gap-4 rounded-2xl border border-rose-200 bg-slate-50/60 p-6 md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold text-slate-800">
                {editingId ? "Edit user" : "Create new user"}
              </h3>
            </div>

            {formError && (
              <div className="md:col-span-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">
                {formError}
              </div>
            )}

            <Field label="Full name">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Suresh Menon"
                className="form-input"
                required
              />
            </Field>

            {!editingId && (
              <Field label="Email address">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="user@cashive.com"
                  className="form-input"
                  required
                />
              </Field>
            )}

            {!editingId && (
              <Field label="Password">
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="form-input"
                  required
                  minLength={6}
                />
              </Field>
            )}

            <Field label="Role">
              <select name="role" value={form.role} onChange={handleChange} className="form-input">
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </Field>

            {editingId && (
              <Field label="Status">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    name="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                  />
                  <span className="text-sm text-slate-700">Active account</span>
                </label>
              </Field>
            )}

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Saving…" : editingId ? "Update User" : "Create User"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Users table */}
        {isAdmin ? (
          <div className="mt-6 flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-sm text-slate-500">
                Loading users…
              </div>
            ) : error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-6 text-center text-sm text-rose-700">
                {error}
                <button onClick={fetchUsers} className="ml-3 underline">
                  Retry
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-rose-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-gradient-to-r from-rose-50 to-rose-100/60 text-xs uppercase tracking-wide text-rose-800">
                    <tr>
                      <th className="px-4 py-3 font-medium">User</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Joined</th>
                      <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-16 text-center text-sm text-slate-500">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr
                          key={u._id}
                          className={`hover:bg-rose-50/40 ${u._id === currentUser?._id ? "bg-amber-50/40" : ""}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-xs font-bold text-white">
                                {initials(u.name)}
                              </span>
                              <span className="font-medium text-slate-800">
                                {u.name}
                                {u._id === currentUser?._id && (
                                  <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
                                    YOU
                                  </span>
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${ROLE_STYLES[u.role] ?? "bg-slate-100 text-slate-700"}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[String(u.isActive)]}`}>
                              {u.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">
                            {new Date(u.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEdit(u)}
                                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-400"
                              >
                                Edit
                              </button>
                              {u._id !== currentUser?._id && (
                                <button
                                  type="button"
                                  onClick={() => handleDelete(u._id, u.name)}
                                  className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 transition hover:border-red-400 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <p className="text-slate-500">
              Only admins can view and manage user accounts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      {children}
    </div>
  );
}

function BackLink({ onBack }) {
  const classes =
    "inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-slate-800";
  if (onBack) {
    return (
      <button type="button" onClick={onBack} className={classes}>
        ← Back to dashboard
      </button>
    );
  }
  return (
    <Link href="/admin-dashboard" className={classes}>
      ← Back to dashboard
    </Link>
  );
}
