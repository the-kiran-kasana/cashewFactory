"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "settings:state";

const DEFAULTS = {
  storeName: "Cashive Nut Store",
  contactEmail: "",
  contactPhone: "",
  address: "",
  currency: "INR",
  lowStockAlert: "10",
  notifications: true,
};

const CURRENCY_OPTIONS = ["INR", "USD", "EUR", "GBP", "AED"];

export default function Setting({ title = "Settings", onBack }) {
  const [form, setForm] = useState(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const s = window.localStorage.getItem(STORAGE_KEY);
      if (s) {
        const parsed = JSON.parse(s);
        if (parsed && typeof parsed === "object") setForm({ ...DEFAULTS, ...parsed });
      }
    } catch {}
    setHydrated(true);
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      setSaved(true);
    } catch {}
  };

  const handleReset = () => {
    setForm(DEFAULTS);
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-[#F5FFFA] px-6 py-10">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-4xl flex-col rounded-3xl bg-white p-10 shadow-sm">
        <BackLink onBack={onBack} />

        <div className="mt-6">
          <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Configure store details and preferences. Saved locally in this browser.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Store details
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Store name">
                <input name="storeName" value={form.storeName} onChange={handleChange} className="form-input" />
              </Field>
              <Field label="Currency">
                <select name="currency" value={form.currency} onChange={handleChange} className="form-input">
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Contact email">
                <input
                  name="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={handleChange}
                  placeholder="store@example.com"
                  className="form-input"
                />
              </Field>
              <Field label="Contact phone">
                <input
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="form-input"
                />
              </Field>
              <Field label="Address" className="md:col-span-2">
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Store address"
                  className="form-input"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Preferences
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Low stock alert threshold">
                <input
                  name="lowStockAlert"
                  type="number"
                  min="0"
                  value={form.lowStockAlert}
                  onChange={handleChange}
                  className="form-input"
                />
              </Field>
              <label className="flex items-center gap-3 self-end pb-2 text-sm text-slate-700">
                <input
                  name="notifications"
                  type="checkbox"
                  checked={form.notifications}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Enable notifications
              </label>
            </div>
          </section>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
            >
              Save Settings
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Reset to defaults
            </button>
            {saved && hydrated && (
              <span className="text-sm font-medium text-emerald-600">✓ Settings saved</span>
            )}
          </div>
        </form>

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
