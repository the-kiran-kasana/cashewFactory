"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "vendors:items";

const emptyForm = {
  companyName: "",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  gstNumber: "",
  category: "Raw Materials",
  paymentTerms: "Net 30",
  bankAccount: "",
  ifsc: "",
  joinedDate: "",
  notes: "",
};

const CATEGORY_OPTIONS = [
  "Raw Materials",
  "Packaging",
  "Spices",
  "Logistics",
  "Equipment",
  "Other",
];

const PAYMENT_TERMS_OPTIONS = ["Advance", "COD", "Net 15", "Net 30", "Net 60", "Net 90"];

const STATUSES = [
  {
    id: "active",
    label: "Active",
    activeClass:
      "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/40 ring-1 ring-emerald-300/40",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-200",
    tableHeader: "from-emerald-50 to-emerald-100/60 text-emerald-800",
    rowHover: "hover:bg-emerald-50/50",
    buttonGradient: "from-emerald-500 to-emerald-700",
    statusChip: "bg-emerald-100 text-emerald-700",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    id: "pending",
    label: "Pending",
    activeClass:
      "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/40 ring-1 ring-amber-300/40",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-amber-100 text-amber-700",
    border: "border-amber-200",
    tableHeader: "from-amber-50 to-amber-100/60 text-amber-800",
    rowHover: "hover:bg-amber-50/50",
    buttonGradient: "from-amber-500 to-amber-600",
    statusChip: "bg-amber-100 text-amber-700",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    id: "inactive",
    label: "Inactive",
    activeClass:
      "bg-gradient-to-br from-slate-500 to-slate-700 text-white shadow-lg shadow-slate-500/40 ring-1 ring-slate-400/30",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-slate-200 text-slate-700",
    border: "border-slate-200",
    tableHeader: "from-slate-50 to-slate-100 text-slate-700",
    rowHover: "hover:bg-slate-50/60",
    buttonGradient: "from-slate-500 to-slate-700",
    statusChip: "bg-slate-200 text-slate-700",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <rect x="6" y="5" width="4" height="14" />
        <rect x="14" y="5" width="4" height="14" />
      </svg>
    ),
  },
  {
    id: "blocked",
    label: "Blocked",
    activeClass:
      "bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-lg shadow-rose-500/40 ring-1 ring-rose-300/40",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-rose-100 text-rose-700",
    border: "border-rose-200",
    tableHeader: "from-rose-50 to-rose-100/60 text-rose-800",
    rowHover: "hover:bg-rose-50/50",
    buttonGradient: "from-rose-500 to-rose-700",
    statusChip: "bg-rose-100 text-rose-700",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <circle cx="12" cy="12" r="9" />
        <line x1="5" y1="5" x2="19" y2="19" />
      </svg>
    ),
  },
];

export default function Vendor({ title = "Vendors", onBack }) {
  const [vendors, setVendors] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const isEditing = editingId !== null;
  const activeStatus = STATUSES.find((s) => s.id === activeTab);

  useEffect(() => {
    try {
      const s = window.localStorage.getItem(STORAGE_KEY);
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) setVendors(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors));
    } catch {}
  }, [vendors, hydrated]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.companyName.trim() || !form.phone.trim()) return;
    const payload = {
      companyName: form.companyName.trim(),
      contactPerson: form.contactPerson.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      gstNumber: form.gstNumber.trim(),
      category: form.category,
      paymentTerms: form.paymentTerms,
      bankAccount: form.bankAccount.trim(),
      ifsc: form.ifsc.trim(),
      joinedDate: form.joinedDate || new Date().toISOString().slice(0, 10),
      notes: form.notes.trim(),
    };
    if (isEditing) {
      setVendors(vendors.map((v) => (v.id === editingId ? { ...v, ...payload } : v)));
    } else {
      setVendors([
        ...vendors,
        {
          id: Date.now(),
          status: activeTab,
          vendorCode: `V-${Date.now().toString().slice(-6)}`,
          ...payload,
        },
      ]);
    }
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (vendor) => {
    setEditingId(vendor.id);
    setForm({
      companyName: vendor.companyName || "",
      contactPerson: vendor.contactPerson || "",
      phone: vendor.phone || "",
      email: vendor.email || "",
      address: vendor.address || "",
      city: vendor.city || "",
      state: vendor.state || "",
      gstNumber: vendor.gstNumber || "",
      category: vendor.category || "Raw Materials",
      paymentTerms: vendor.paymentTerms || "Net 30",
      bankAccount: vendor.bankAccount || "",
      ifsc: vendor.ifsc || "",
      joinedDate: vendor.joinedDate || "",
      notes: vendor.notes || "",
    });
    setActiveTab(vendor.status);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this vendor permanently?")) return;
    setVendors(vendors.filter((v) => v.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
      setShowForm(false);
    }
  };

  const handleStatusChange = (id, status) => {
    setVendors(vendors.map((v) => (v.id === id ? { ...v, status } : v)));
  };

  const countByStatus = STATUSES.reduce((acc, s) => {
    acc[s.id] = vendors.filter((v) => v.status === s.id).length;
    return acc;
  }, {});

  const filteredVendors = vendors
    .filter((v) => v.status === activeTab)
    .filter((v) => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        v.companyName.toLowerCase().includes(q) ||
        (v.contactPerson || "").toLowerCase().includes(q) ||
        (v.phone || "").includes(q) ||
        (v.email || "").toLowerCase().includes(q) ||
        (v.city || "").toLowerCase().includes(q) ||
        (v.category || "").toLowerCase().includes(q)
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
              Onboard and manage vendors who supply raw materials, packaging, and services.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-right">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Total Vendors</p>
            <p className="text-lg font-bold text-slate-800">{vendors.length}</p>
          </div>
        </div>

        {/* Status summary */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {STATUSES.map((s) => (
            <div
              key={s.id}
              className={`rounded-2xl border ${s.border} bg-white p-4 shadow-sm`}
            >
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                {s.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-800">{countByStatus[s.id]}</p>
            </div>
          ))}
        </div>

        {/* Tabs + actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex flex-wrap items-center gap-1.5 rounded-full border border-slate-200/70 bg-gradient-to-b from-white/80 to-slate-50 p-1.5 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.6)]">
            {STATUSES.map((status) => {
              const isActive = activeTab === status.id;
              const count = countByStatus[status.id];
              return (
                <button
                  key={status.id}
                  type="button"
                  onClick={() => {
                    if (isEditing) handleCancelEdit();
                    setActiveTab(status.id);
                    setShowForm(false);
                  }}
                  className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 ${
                    isActive
                      ? status.activeClass
                      : "text-slate-500 hover:bg-white/80 hover:text-slate-900"
                  }`}
                >
                  <span className={`transition-transform duration-300 ${isActive ? "scale-110" : ""}`}>
                    {status.icon}
                  </span>
                  {status.label}
                  {count > 0 && (
                    <span
                      className={`ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold transition-colors duration-300 ${
                        isActive ? status.chipActive : status.chipIdle
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendors…"
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
              className={`rounded-xl bg-gradient-to-br ${activeStatus.buttonGradient} px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90`}
            >
              {showForm ? "Cancel" : "+ Create Vendor"}
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className={`mt-4 grid gap-4 rounded-2xl border ${activeStatus.border} bg-slate-50/60 p-6 md:grid-cols-4`}
          >
            <div className="flex items-center justify-between md:col-span-4">
              <h3 className="text-sm font-semibold text-slate-800">
                {isEditing ? "Edit vendor" : `Create new vendor — ${activeStatus.label}`}
              </h3>
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

            <div className="md:col-span-4 rounded-xl border border-slate-200 bg-white/70 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Business details
              </p>
              <div className="grid gap-4 md:grid-cols-4">
                <Field label="Company name" className="md:col-span-2">
                  <input
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Kerala Nut Traders Pvt Ltd"
                    className="form-input"
                    required
                  />
                </Field>
                <Field label="Contact person" className="md:col-span-2">
                  <input
                    name="contactPerson"
                    value={form.contactPerson}
                    onChange={handleChange}
                    placeholder="e.g. Suresh Menon"
                    className="form-input"
                  />
                </Field>
                <Field label="Phone" className="md:col-span-1">
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="form-input"
                    required
                  />
                </Field>
                <Field label="Email" className="md:col-span-2">
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="orders@vendor.com"
                    className="form-input"
                  />
                </Field>
                <Field label="GST / Tax ID" className="md:col-span-1">
                  <input
                    name="gstNumber"
                    value={form.gstNumber}
                    onChange={handleChange}
                    placeholder="e.g. 29ABCDE1234F1Z5"
                    className="form-input"
                  />
                </Field>
                <Field label="Category supplied" className="md:col-span-2">
                  <select name="category" value={form.category} onChange={handleChange} className="form-input">
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Payment terms" className="md:col-span-1">
                  <select
                    name="paymentTerms"
                    value={form.paymentTerms}
                    onChange={handleChange}
                    className="form-input"
                  >
                    {PAYMENT_TERMS_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Onboarded on" className="md:col-span-1">
                  <input
                    name="joinedDate"
                    value={form.joinedDate}
                    onChange={handleChange}
                    type="date"
                    className="form-input"
                  />
                </Field>
              </div>
            </div>

            <div className="md:col-span-4 rounded-xl border border-slate-200 bg-white/70 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Address
              </p>
              <div className="grid gap-4 md:grid-cols-4">
                <Field label="Street address" className="md:col-span-2">
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Building / street / area"
                    className="form-input"
                  />
                </Field>
                <Field label="City" className="md:col-span-1">
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g. Kollam"
                    className="form-input"
                  />
                </Field>
                <Field label="State" className="md:col-span-1">
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="e.g. Kerala"
                    className="form-input"
                  />
                </Field>
              </div>
            </div>

            <div className="md:col-span-4 rounded-xl border border-slate-200 bg-white/70 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Banking (optional)
              </p>
              <div className="grid gap-4 md:grid-cols-4">
                <Field label="Bank account #" className="md:col-span-2">
                  <input
                    name="bankAccount"
                    value={form.bankAccount}
                    onChange={handleChange}
                    placeholder="Account number"
                    className="form-input"
                  />
                </Field>
                <Field label="IFSC code" className="md:col-span-2">
                  <input
                    name="ifsc"
                    value={form.ifsc}
                    onChange={handleChange}
                    placeholder="e.g. HDFC0001234"
                    className="form-input"
                  />
                </Field>
                <Field label="Internal notes" className="md:col-span-4">
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Anything important about this vendor…"
                    className="form-input"
                  />
                </Field>
              </div>
            </div>

            <div className="flex gap-3 md:col-span-4">
              <button
                type="submit"
                className={`flex-1 rounded-lg bg-gradient-to-br ${activeStatus.buttonGradient} px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90`}
              >
                {isEditing ? "Update Vendor" : "Create Vendor"}
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

        {/* Table */}
        <div className="mt-6 flex-1">
          <div className={`h-full overflow-x-auto rounded-2xl border ${activeStatus.border}`}>
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className={`bg-gradient-to-r ${activeStatus.tableHeader} text-xs uppercase tracking-wide`}>
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Code</th>
                  <th scope="col" className="px-4 py-3 font-medium">Company</th>
                  <th scope="col" className="px-4 py-3 font-medium">Contact</th>
                  <th scope="col" className="px-4 py-3 font-medium">Location</th>
                  <th scope="col" className="px-4 py-3 font-medium">Supplies</th>
                  <th scope="col" className="px-4 py-3 font-medium">Payment</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center text-sm text-slate-500">
                      {search
                        ? `No vendors match "${search}".`
                        : `No ${activeStatus.label.toLowerCase()} vendors yet.`}
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((v) => (
                    <tr
                      key={v.id}
                      className={`${activeStatus.rowHover} ${editingId === v.id ? "bg-slate-100/70" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-slate-900/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-white">
                          {v.vendorCode}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{v.companyName}</p>
                        {v.gstNumber && (
                          <p className="font-mono text-[10px] text-slate-400">
                            GST: {v.gstNumber}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <p className="font-medium text-slate-700">{v.contactPerson || "—"}</p>
                        <p className="text-xs">{v.phone}</p>
                        {v.email && <p className="text-xs text-slate-400">{v.email}</p>}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {v.city || "—"}
                        {v.state && `, ${v.state}`}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700">
                          {v.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-600">
                        {v.paymentTerms}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={v.status}
                          onChange={(e) => handleStatusChange(v.id, e.target.value)}
                          className={`cursor-pointer rounded-full border-0 px-2 py-0.5 text-[10px] font-semibold ${
                            STATUSES.find((s) => s.id === v.status)?.statusChip ||
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(v)}
                            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(v.id)}
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
