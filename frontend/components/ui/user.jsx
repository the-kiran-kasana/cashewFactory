"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "users:items";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  role: "Staff",
};

const ROLE_OPTIONS = ["Admin", "Manager", "Staff", "Viewer"];

export default function Users({ title = "Users", onBack }) {
  const [users, setUsers] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const isEditing = editingId !== null;

  useEffect(() => {
    try {
      const s = window.localStorage.getItem(STORAGE_KEY);
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) setUsers(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch {}
  }, [users, hydrated]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role,
    };
    if (isEditing) {
      setUsers(users.map((u) => (u.id === editingId ? { ...u, ...payload } : u)));
    } else {
      setUsers([...users, { id: Date.now(), ...payload }]);
    }
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "Staff",
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    setUsers(users.filter((u) => u.id !== id));
    if (editingId === id) handleCancelEdit();
  };

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.phone || "").includes(q) ||
      (u.role || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#F5FFFA] px-6 py-10">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-7xl flex-col rounded-3xl bg-white p-10 shadow-sm">
        <BackLink onBack={onBack} />

        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage the people who can access this store management system.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-right">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Total Users</p>
            <p className="text-lg font-bold text-slate-800">{users.length}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users…"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 pl-9 text-sm focus:border-slate-500 focus:outline-none"
            />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => {
              if (showForm && isEditing) handleCancelEdit();
              else setShowForm((v) => !v);
            }}
            className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
          >
            {showForm ? "Cancel" : "+ Add User"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-4 grid gap-4 rounded-2xl border border-emerald-200 bg-slate-50/60 p-6 md:grid-cols-4"
          >
            <h3 className="text-sm font-semibold text-slate-800 md:col-span-4">
              {isEditing ? "Edit user" : "Add new user"}
            </h3>
            <Field label="Full name" className="md:col-span-2">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Asha Nair"
                className="form-input"
                required
              />
            </Field>
            <Field label="Email" className="md:col-span-2">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="asha@store.com"
                className="form-input"
                required
              />
            </Field>
            <Field label="Phone" className="md:col-span-2">
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="form-input"
              />
            </Field>
            <Field label="Role" className="md:col-span-2">
              <select name="role" value={form.role} onChange={handleChange} className="form-input">
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </Field>
            <div className="flex gap-3 md:col-span-4">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
              >
                {isEditing ? "Update User" : "Add User"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
              )}
            </div>

            <style jsx>{`
              .form-input {
                width: 100%;
                border-radius: 0.5rem;
                border: 1px solid rgb(203 213 225);
                background: white;
                padding: 0.5rem 0.75rem;
                font-size: 0.875rem;
                outline: none;
              }
              .form-input:focus {
                border-color: rgb(100 116 139);
              }
            `}</style>
          </form>
        )}

        <div className="mt-6 flex-1">
          <div className="h-full overflow-x-auto rounded-2xl border border-emerald-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-gradient-to-r from-emerald-50 to-emerald-100/60 text-xs uppercase tracking-wide text-emerald-800">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Name</th>
                  <th scope="col" className="px-4 py-3 font-medium">Email</th>
                  <th scope="col" className="px-4 py-3 font-medium">Phone</th>
                  <th scope="col" className="px-4 py-3 font-medium">Role</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center text-sm text-slate-500">
                      {search ? `No users match "${search}".` : "No users yet. Add your first user."}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-emerald-50/50">
                      <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                      <td className="px-4 py-3 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3 text-slate-600">{u.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(u)}
                            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(u.id)}
                            className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 transition hover:border-red-400 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, className = "", children }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      {children}
    </div>
  );
}

function BackLink({ onBack }) {
  const classes = "inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-slate-800";
  if (onBack) {
    return (
      <button type="button" onClick={onBack} className={classes}>
        ← Back to dashboard
      </button>
    );
  }
  return (
    <Link href="/dashboard" className={classes}>
      ← Back to dashboard
    </Link>
  );
}
