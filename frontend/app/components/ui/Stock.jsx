"use client";

import Link from "next/link";
import { useState } from "react";
import { useInventory } from "../inventory/InventoryContext";

const emptyForm = {
  name: "",
  category: "L1",
  description: "",
  origin: "",
  quality: "A",
  quantity: "",
};

export default function Stock({ title = "Stock", onBack }) {
  const { state, addStock, updateStock, deleteStock } = useInventory();
  const materials = state.stock;

  const [activeTab, setActiveTab] = useState("list");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const isEditing = editingId !== null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quantity) return;
    const payload = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      origin: form.origin.trim(),
      quality: form.quality,
      quantity: form.quantity,
    };
    if (isEditing) updateStock(editingId, payload);
    else addStock(payload);
    setForm(emptyForm);
    setEditingId(null);
    setActiveTab("list");
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      category: item.category || "Raw",
      description: item.description || "",
      origin: item.origin || "",
      quality: item.quality || "A",
      quantity: item.quantity || "",
    });
    setActiveTab("add");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setActiveTab("list");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this stock item?")) return;
    deleteStock(id);
    if (editingId === id) handleCancelEdit();
  };

  return (
    <div className="min-h-screen bg-[#F5FFFA] px-6 py-10">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-7xl flex-col rounded-3xl bg-white p-10 shadow-sm">
        <BackLink onBack={onBack} />

        <div className="mt-6">
          <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
        </div>

        {/* Sliding-pill tabs */}

        <div className="mt-6 relative inline-grid grid-cols-2 gap-1 rounded-full border border-slate-200/70 bg-white/60 p-1.5 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(15,23,42,0.25),inset_0_1px_0_rgba(255,255,255,0.6)]">

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.6)] ring-1 ring-white/30 transition-transform duration-500 ease-[cubic-bezier(0.65,-0.2,0.25,1.4)]"
            style={{
              transform:
                activeTab === "add" ? "translateX(calc(100% + 0.25rem))" : "translateX(0)",
            }}
          />

          <button
            type="button"
            onClick={() => {
              if (isEditing) handleCancelEdit();
              setActiveTab("list");
            }}
            className={`relative z-10 flex items-center justify-center gap-2 rounded-full px-7 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-300 ${
              activeTab === "list" ? "text-white" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 transition-transform duration-300 ${activeTab === "list" ? "scale-110" : ""}`}
            >
              <rect x="3" y="4" width="18" height="4" rx="1" />
              <rect x="3" y="10" width="18" height="4" rx="1" />
              <rect x="3" y="16" width="18" height="4" rx="1" />
            </svg>
            Raw Materials
            {materials.length > 0 && (
              <span
                className={`ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold transition-colors duration-300 ${
                  activeTab === "list"
                    ? "bg-white/25 text-white ring-1 ring-white/40"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {materials.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("add")}
            className={`relative z-10 flex items-center justify-center gap-2 rounded-full px-7 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-300 ${
              activeTab === "add" ? "text-white" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 transition-transform duration-300 ${activeTab === "add" ? "rotate-90 scale-110" : ""}`}
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            {isEditing ? "Edit Item" : "Add Item"}
          </button>
        </div>

        {/* Add / Edit form */}
        {activeTab === "add" && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-4"
          >
            <div className="md:col-span-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">
                {isEditing ? "Edit material" : "Add new material"}
              </h2>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Cancel edit
                </button>
              )}
            </div>

            <Field label="Material name" className="md:col-span-2">
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Raw Cashew W320" className="form-input" required />
            </Field>

            <Field label="Category" className="md:col-span-2">
              <select name="category" value={form.category} onChange={handleChange} className="form-input">
                <option value="Raw">Raw</option>
                <option value="Processed">Processed</option>
                <option value="Packaging">Packaging</option>
                <option value="Spices">Spices</option>
                <option value="Other">Other</option>
              </select>
            </Field>

            <Field label="Origin" className="md:col-span-2">
              <input name="origin" value={form.origin} onChange={handleChange} placeholder="e.g. Kerala, India" className="form-input" />
            </Field>

            <Field label="Quality" className="md:col-span-2">
              <select name="quality" value={form.quality} onChange={handleChange} className="form-input">
                <option value="A">Grade A (Premium)</option>
                <option value="B">Grade B (Standard)</option>
                <option value="C">Grade C (Economy)</option>
              </select>
            </Field>

            <Field label="Quantity" className="md:col-span-2">
              <input name="quantity" value={form.quantity} onChange={handleChange} type="number" min="0" step="any" placeholder="0" className="form-input" required />
            </Field>

            <Field label="Unit" className="md:col-span-2">
              <select name="unit" value={form.unit} onChange={handleChange} className="form-input">
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
                <option value="pcs">pcs</option>
              </select>
            </Field>

            <Field label="Description" className="md:col-span-4">
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Notes about this material…" className="form-input" />
            </Field>

            <div className="md:col-span-4 flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                {isEditing ? "Update Material" : "Save Material"}
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
                border-color: rgb(16 185 129);
              }
            `}</style>
          </form>
        )}

        {/* Raw Materials table */}
        {activeTab === "list" && (
          <div className="mt-6 flex-1">
            <div className="h-full overflow-x-auto rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">Name</th>
                    <th scope="col" className="px-4 py-3 font-medium">Category</th>
                    <th scope="col" className="px-4 py-3 font-medium">Quality</th>
                    <th scope="col" className="px-4 py-3 font-medium">Quantity</th>
                    <th scope="col" className="px-4 py-3 font-medium">Origin</th>
                    <th scope="col" className="px-4 py-3 font-medium">Description</th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {materials.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center text-sm text-slate-500">
                        No raw materials available.
                      </td>
                    </tr>
                  ) : (
                    materials.map((m) => (
                      <tr
                        key={m.id}
                        className={`hover:bg-slate-50 ${editingId === m.id ? "bg-emerald-50/60" : ""}`}
                      >
                        <td className="px-4 py-3 font-medium text-slate-800">{m.name}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                            {m.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                            Grade {m.quality}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-700">
                          {m.quantity} {m.unit}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{m.origin || "—"}</td>
                        <td className="px-4 py-3 text-slate-500">
                          <span className="line-clamp-2 max-w-xs">{m.description || "—"}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(m)}
                              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(m.id)}
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
        )}
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
