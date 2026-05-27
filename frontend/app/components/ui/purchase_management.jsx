"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useInventory } from "../inventory/InventoryContext";

const STORAGE_KEY = "purchase-orders:items";

const emptyForm = {
  poNumber: "",
  vendorName: "",
  vendorPhone: "",
  vendorEmail: "",
  item: "",
  quantity: "",
  unit: "kg",
  unitPrice: "",
  orderDate: "",
  expectedDate: "",
  paymentStatus: "Unpaid",
  notes: "",
};

const PAYMENT_STATUS_STYLES = {
  Unpaid: "bg-rose-100 text-rose-700",
  Partial: "bg-amber-100 text-amber-700",
  Paid: "bg-emerald-100 text-emerald-700",
};

const STAGES = [
  {
    id: "draft",
    label: "Draft",
    activeClass:
      "bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-lg shadow-slate-700/40 ring-1 ring-slate-400/30",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-slate-200 text-slate-700",
    border: "border-slate-200",
    tableHeader: "from-slate-50 to-slate-100 text-slate-700",
    rowHover: "hover:bg-slate-50/60",
    buttonGradient: "from-slate-600 to-slate-800",
    moveLabel: "Send to Vendor →",
    nextStage: "pending",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="14" x2="15" y2="14" />
        <line x1="9" y1="18" x2="13" y2="18" />
      </svg>
    ),
  },
  {
    id: "pending",
    label: "Pending Approval",
    activeClass:
      "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/40 ring-1 ring-amber-300/40",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-amber-100 text-amber-700",
    border: "border-amber-200",
    tableHeader: "from-amber-50 to-amber-100/60 text-amber-800",
    rowHover: "hover:bg-amber-50/50",
    buttonGradient: "from-amber-500 to-amber-600",
    moveLabel: "Approve →",
    nextStage: "approved",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    id: "approved",
    label: "Approved",
    activeClass:
      "bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-lg shadow-sky-500/40 ring-1 ring-sky-300/40",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-sky-100 text-sky-700",
    border: "border-sky-200",
    tableHeader: "from-sky-50 to-sky-100/60 text-sky-800",
    rowHover: "hover:bg-sky-50/50",
    buttonGradient: "from-sky-500 to-sky-700",
    moveLabel: "Mark Received →",
    nextStage: "received",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    id: "received",
    label: "Received",
    activeClass:
      "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/40 ring-1 ring-emerald-300/40",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-200",
    tableHeader: "from-emerald-50 to-emerald-100/60 text-emerald-800",
    rowHover: "hover:bg-emerald-50/50",
    buttonGradient: "from-emerald-500 to-emerald-700",
    moveLabel: null,
    nextStage: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
];

export default function PurchaseManagement({ onBack }) {
  const inv = useInventory();
  const [orders, setOrders] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState("draft");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const isEditing = editingId !== null;
  const activeStage = STAGES.find((s) => s.id === activeTab);

  useEffect(() => {
    try {
      const s = window.localStorage.getItem(STORAGE_KEY);
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) setOrders(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {}
  }, [orders, hydrated]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const total = (qty, price) => {
    const q = parseFloat(qty) || 0;
    const p = parseFloat(price) || 0;
    return q * p;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vendorName.trim() || !form.item.trim() || !form.quantity) return;
    const payload = {
      poNumber: form.poNumber.trim() || `PO-${Date.now().toString().slice(-6)}`,
      vendorName: form.vendorName.trim(),
      vendorPhone: form.vendorPhone.trim(),
      vendorEmail: form.vendorEmail.trim(),
      item: form.item.trim(),
      quantity: form.quantity,
      unit: form.unit,
      unitPrice: form.unitPrice,
      orderDate: form.orderDate,
      expectedDate: form.expectedDate,
      paymentStatus: form.paymentStatus,
      notes: form.notes.trim(),
    };
    if (isEditing) {
      setOrders(orders.map((o) => (o.id === editingId ? { ...o, ...payload } : o)));
    } else {
      setOrders([...orders, { id: Date.now(), stage: activeTab, ...payload }]);
    }
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (order) => {
    setEditingId(order.id);
    setForm({
      poNumber: order.poNumber || "",
      vendorName: order.vendorName || "",
      vendorPhone: order.vendorPhone || "",
      vendorEmail: order.vendorEmail || "",
      item: order.item || "",
      quantity: order.quantity || "",
      unit: order.unit || "kg",
      unitPrice: order.unitPrice || "",
      orderDate: order.orderDate || "",
      expectedDate: order.expectedDate || "",
      paymentStatus: order.paymentStatus || "Unpaid",
      notes: order.notes || "",
    });
    setActiveTab(order.stage);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this purchase order?")) return;
    setOrders(orders.filter((o) => o.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
      setShowForm(false);
    }
  };

  const handleAdvance = (id, nextStage) => {
    if (!nextStage) return;
    const order = orders.find((o) => o.id === id);
    if (order && nextStage === "received") {
      inv.addStock({
        name: order.item,
        category: "Raw",
        quality: "A",
        origin: order.vendorName,
        quantity: order.quantity,
        unit: order.unit,
        description: `Received from PO ${order.poNumber} (vendor: ${order.vendorName})`,
      });
    }
    setOrders(orders.map((o) => (o.id === id ? { ...o, stage: nextStage } : o)));
  };

  const handleUpdatePayment = (id, status) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, paymentStatus: status } : o)));
  };

  const ordersAtStage = orders.filter((o) => o.stage === activeTab);
  const countByStage = STAGES.reduce((acc, s) => {
    acc[s.id] = orders.filter((o) => o.stage === s.id).length;
    return acc;
  }, {});
  const valueByStage = STAGES.reduce((acc, s) => {
    acc[s.id] = orders
      .filter((o) => o.stage === s.id)
      .reduce((sum, o) => sum + total(o.quantity, o.unitPrice), 0);
    return acc;
  }, {});

  const fmtCurrency = (n) => `₹${(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen bg-[#F5FFFA] px-6 py-10">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-7xl flex-col rounded-3xl bg-white p-10 shadow-sm">
        <BackLink onBack={onBack} />

        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Purchase Management</h1>
            <p className="mt-1 text-sm text-slate-500">
              Create purchase orders, track vendor approvals, and confirm receipt.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-right">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Pipeline Value</p>
            <p className="text-lg font-bold text-slate-800">
              {fmtCurrency(Object.values(valueByStage).reduce((a, b) => a + b, 0))}
            </p>
          </div>
        </div>

        {/* Pipeline summary */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {STAGES.map((s) => (
            <div
              key={s.id}
              className={`rounded-2xl border ${s.border} bg-white p-4 shadow-sm`}
            >
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                {s.label}
              </p>
              <div className="mt-1 flex items-baseline justify-between">
                <p className="text-2xl font-bold text-slate-800">{countByStage[s.id]}</p>
                <p className="text-xs font-medium text-slate-500">
                  {fmtCurrency(valueByStage[s.id])}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-6 inline-flex flex-wrap items-center gap-1.5 self-start rounded-full border border-slate-200/70 bg-gradient-to-b from-white/80 to-slate-50 p-1.5 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.6)]">
          {STAGES.map((stage) => {
            const isActive = activeTab === stage.id;
            const count = countByStage[stage.id];
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => {
                  if (isEditing) handleCancelEdit();
                  setActiveTab(stage.id);
                  setShowForm(false);
                }}
                className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 ${
                  isActive ? stage.activeClass : "text-slate-500 hover:bg-white/80 hover:text-slate-900"
                }`}
              >
                <span className={`transition-transform duration-300 ${isActive ? "scale-110" : ""}`}>
                  {stage.icon}
                </span>
                {stage.label}
                {count > 0 && (
                  <span
                    className={`ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold transition-colors duration-300 ${
                      isActive ? stage.chipActive : stage.chipIdle
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Add/Edit toggle */}
        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-700">
            {activeStage.label} ({ordersAtStage.length})
          </h2>
          <button
            type="button"
            onClick={() => {
              if (showForm && isEditing) handleCancelEdit();
              else setShowForm((v) => !v);
            }}
            className={`rounded-xl bg-gradient-to-br ${activeStage.buttonGradient} px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90`}
          >
            {showForm ? "Cancel" : `+ Create PO in ${activeStage.label}`}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className={`mt-4 grid gap-4 rounded-2xl border ${activeStage.border} bg-slate-50/60 p-6 md:grid-cols-4`}
          >
            <div className="flex items-center justify-between md:col-span-4">
              <h3 className="text-sm font-semibold text-slate-800">
                {isEditing ? `Edit purchase order` : `New purchase order — ${activeStage.label}`}
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
                Vendor details
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Vendor name">
                  <input
                    name="vendorName"
                    value={form.vendorName}
                    onChange={handleChange}
                    placeholder="e.g. Kerala Nut Traders"
                    className="form-input"
                    required
                  />
                </Field>
                <Field label="Phone">
                  <input
                    name="vendorPhone"
                    value={form.vendorPhone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="form-input"
                  />
                </Field>
                <Field label="Email">
                  <input
                    name="vendorEmail"
                    value={form.vendorEmail}
                    onChange={handleChange}
                    type="email"
                    placeholder="orders@vendor.com"
                    className="form-input"
                  />
                </Field>
              </div>
            </div>

            <Field label="PO number" className="md:col-span-1">
              <input
                name="poNumber"
                value={form.poNumber}
                onChange={handleChange}
                placeholder="auto-generated"
                className="form-input"
              />
            </Field>

            <Field label="Item" className="md:col-span-3">
              <input
                name="item"
                value={form.item}
                onChange={handleChange}
                placeholder="e.g. Raw Cashew W320"
                className="form-input"
                required
              />
            </Field>

            <Field label="Quantity" className="md:col-span-1">
              <input
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                type="number"
                min="0"
                step="any"
                placeholder="0"
                className="form-input"
                required
              />
            </Field>

            <Field label="Unit" className="md:col-span-1">
              <select name="unit" value={form.unit} onChange={handleChange} className="form-input">
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
                <option value="pcs">pcs</option>
                <option value="cartons">cartons</option>
              </select>
            </Field>

            <Field label="Unit price (₹)" className="md:col-span-1">
              <input
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                className="form-input"
              />
            </Field>

            <Field label="Total (₹)" className="md:col-span-1">
              <div className="form-input flex items-center bg-slate-100 font-semibold text-slate-700">
                {fmtCurrency(total(form.quantity, form.unitPrice))}
              </div>
            </Field>

            <Field label="Order date" className="md:col-span-1">
              <input
                name="orderDate"
                value={form.orderDate}
                onChange={handleChange}
                type="date"
                className="form-input"
              />
            </Field>

            <Field label="Expected delivery" className="md:col-span-1">
              <input
                name="expectedDate"
                value={form.expectedDate}
                onChange={handleChange}
                type="date"
                className="form-input"
              />
            </Field>

            <Field label="Payment status" className="md:col-span-2">
              <select
                name="paymentStatus"
                value={form.paymentStatus}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
              </select>
            </Field>

            <Field label="Notes" className="md:col-span-4">
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Special instructions for this PO…"
                className="form-input"
              />
            </Field>

            <div className="flex gap-3 md:col-span-4">
              <button
                type="submit"
                className={`flex-1 rounded-lg bg-gradient-to-br ${activeStage.buttonGradient} px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90`}
              >
                {isEditing ? "Update PO" : "Create PO"}
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
          <div className={`h-full overflow-x-auto rounded-2xl border ${activeStage.border}`}>
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className={`bg-gradient-to-r ${activeStage.tableHeader} text-xs uppercase tracking-wide`}>
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">PO #</th>
                  <th scope="col" className="px-4 py-3 font-medium">Vendor</th>
                  <th scope="col" className="px-4 py-3 font-medium">Item</th>
                  <th scope="col" className="px-4 py-3 font-medium">Quantity</th>
                  <th scope="col" className="px-4 py-3 font-medium">Total</th>
                  <th scope="col" className="px-4 py-3 font-medium">Dates</th>
                  <th scope="col" className="px-4 py-3 font-medium">Payment</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {ordersAtStage.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center text-sm text-slate-500">
                      No purchase orders in {activeStage.label.toLowerCase()}.
                    </td>
                  </tr>
                ) : (
                  ordersAtStage.map((o) => (
                    <tr
                      key={o.id}
                      className={`${activeStage.rowHover} ${editingId === o.id ? "bg-slate-100/70" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-slate-900/90 px-2 py-0.5 text-[10px] font-mono font-semibold text-white">
                          {o.poNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{o.vendorName}</p>
                        <p className="text-xs text-slate-400">
                          {o.vendorPhone || o.vendorEmail || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        <p className="font-medium">{o.item}</p>
                        {o.notes && (
                          <p className="line-clamp-1 max-w-xs text-xs text-slate-400">
                            {o.notes}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {o.quantity} {o.unit}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {fmtCurrency(total(o.quantity, o.unitPrice))}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        <p>Ordered: {o.orderDate || "—"}</p>
                        <p>Expected: {o.expectedDate || "—"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={o.paymentStatus}
                          onChange={(e) => handleUpdatePayment(o.id, e.target.value)}
                          className={`cursor-pointer rounded-full border-0 px-2 py-0.5 text-[10px] font-semibold ${
                            PAYMENT_STATUS_STYLES[o.paymentStatus]
                          }`}
                        >
                          <option value="Unpaid">Unpaid</option>
                          <option value="Partial">Partial</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {activeStage.nextStage && (
                            <button
                              type="button"
                              onClick={() => handleAdvance(o.id, activeStage.nextStage)}
                              className={`rounded-md bg-gradient-to-br ${activeStage.buttonGradient} px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition hover:opacity-90`}
                            >
                              {activeStage.moveLabel}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleEdit(o)}
                            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(o.id)}
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
