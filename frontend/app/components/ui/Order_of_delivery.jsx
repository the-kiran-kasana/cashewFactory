"use client";

import Link from "next/link";
import { useState } from "react";
import { useInventory } from "../inventory/InventoryContext";

const PAYMENT_STYLES = {
  Prepaid: "bg-emerald-100 text-emerald-700",
  COD: "bg-amber-100 text-amber-700",
};

const COURIERS = ["Delhivery", "BlueDart", "DTDC", "FedEx", "India Post", "Local Courier", "Other"];

const STAGES = [
  {
    id: "ready",
    label: "Ready to Ship",
    activeClass:
      "bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-lg shadow-sky-500/40 ring-1 ring-sky-300/40",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-sky-100 text-sky-700",
    border: "border-sky-200",
    tableHeader: "from-sky-50 to-sky-100/60 text-sky-800",
    rowHover: "hover:bg-sky-50/50",
    buttonGradient: "from-sky-500 to-sky-700",
    moveLabel: "Mark In Transit →",
    nextStage: "transit",
  },
  {
    id: "transit",
    label: "In Transit",
    activeClass:
      "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/40 ring-1 ring-amber-300/40",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-amber-100 text-amber-700",
    border: "border-amber-200",
    tableHeader: "from-amber-50 to-amber-100/60 text-amber-800",
    rowHover: "hover:bg-amber-50/50",
    buttonGradient: "from-amber-500 to-amber-600",
    moveLabel: "Out for Delivery →",
    nextStage: "out",
  },
  {
    id: "out",
    label: "Out for Delivery",
    activeClass:
      "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-500/40 ring-1 ring-indigo-300/40",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-indigo-100 text-indigo-700",
    border: "border-indigo-200",
    tableHeader: "from-indigo-50 to-indigo-100/60 text-indigo-800",
    rowHover: "hover:bg-indigo-50/50",
    buttonGradient: "from-indigo-500 to-indigo-700",
    moveLabel: "Mark Delivered →",
    nextStage: "delivered",
  },
  {
    id: "delivered",
    label: "Delivered",
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
  },
];

export default function OrderOfDelivery({ title = "Out for Delivery", onBack }) {
  const inv = useInventory();
  const [activeTab, setActiveTab] = useState("ready");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const activeStage = STAGES.find((s) => s.id === activeTab);
  const orders = inv.state.outForDelivery;
  const ordersAtStage = orders.filter((o) => o.stage === activeTab);

  const countByStage = STAGES.reduce((acc, s) => {
    acc[s.id] = orders.filter((o) => o.stage === s.id).length;
    return acc;
  }, {});

  const isDelayed = (o) => {
    if (!o.expectedDate || o.stage === "delivered") return false;
    return new Date(o.expectedDate) < new Date(new Date().toISOString().slice(0, 10));
  };
  const delayedCount = orders.filter(isDelayed).length;

  const handleAdvance = (id, nextStage) => {
    if (!nextStage) return;
    inv.setDeliveryStage(id, nextStage);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this shipment?")) return;
    inv.deleteDelivery(id);
    if (editingId === id) setEditingId(null);
  };

  const openEdit = (o) => {
    setEditingId(o.id);
    setEditForm({
      customerName: o.customerName || "",
      customerPhone: o.customerPhone || "",
      address: o.address || "",
      city: o.city || "",
      courier: o.courier || "",
      awb: o.awb || "",
      dispatchDate: o.dispatchDate || "",
      expectedDate: o.expectedDate || "",
      deliveryAgent: o.deliveryAgent || "",
      paymentMode: o.paymentMode || "Prepaid",
      notes: o.notes || "",
    });
  };

  const closeEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (!editingId) return;
    inv.editDelivery(editingId, {
      customerName: editForm.customerName.trim(),
      customerPhone: editForm.customerPhone.trim(),
      address: editForm.address.trim(),
      city: editForm.city.trim(),
      courier: editForm.courier,
      awb: editForm.awb.trim(),
      dispatchDate: editForm.dispatchDate,
      expectedDate: editForm.expectedDate,
      deliveryAgent: editForm.deliveryAgent.trim(),
      paymentMode: editForm.paymentMode,
      notes: editForm.notes.trim(),
    });
    closeEdit();
  };

  return (
    <div className="min-h-screen bg-[#F5FFFA] px-6 py-10">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-7xl flex-col rounded-3xl bg-white p-10 shadow-sm">
        <BackLink onBack={onBack} />

        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">
              Shipments dispatched from Finished Goods. Track them through to last-mile delivery.
            </p>
          </div>
          {delayedCount > 0 && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-right">
              <p className="text-[11px] uppercase tracking-wide text-rose-600">Delayed</p>
              <p className="text-lg font-bold text-rose-700">{delayedCount} shipment(s)</p>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {STAGES.map((s) => (
            <div key={s.id} className={`rounded-2xl border ${s.border} bg-white p-4 shadow-sm`}>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">{countByStage[s.id]}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 inline-flex flex-wrap items-center gap-1.5 self-start rounded-full border border-slate-200/70 bg-gradient-to-b from-white/80 to-slate-50 p-1.5 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.6)]">
          {STAGES.map((stage) => {
            const isActive = activeTab === stage.id;
            const count = countByStage[stage.id];
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => {
                  if (editingId) closeEdit();
                  setActiveTab(stage.id);
                }}
                className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 ${
                  isActive ? stage.activeClass : "text-slate-500 hover:bg-white/80 hover:text-slate-900"
                }`}
              >
                {stage.label}
                {count > 0 && (
                  <span className={`ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${isActive ? stage.chipActive : stage.chipIdle}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {editingId && (
          <form
            onSubmit={saveEdit}
            className={`mt-4 grid gap-4 rounded-2xl border ${activeStage.border} bg-slate-50/60 p-6 md:grid-cols-4`}
          >
            <div className="md:col-span-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Edit shipment</h3>
              <button type="button" onClick={closeEdit} className="text-xs font-medium text-slate-500 hover:text-slate-800">Cancel</button>
            </div>

            <Field label="Customer name" className="md:col-span-2">
              <input value={editForm.customerName} onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })} className="form-input" />
            </Field>
            <Field label="Phone" className="md:col-span-1">
              <input value={editForm.customerPhone} onChange={(e) => setEditForm({ ...editForm, customerPhone: e.target.value })} className="form-input" />
            </Field>
            <Field label="City" className="md:col-span-1">
              <input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} className="form-input" />
            </Field>
            <Field label="Address" className="md:col-span-4">
              <textarea rows={2} value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="form-input" />
            </Field>
            <Field label="Courier" className="md:col-span-1">
              <select value={editForm.courier} onChange={(e) => setEditForm({ ...editForm, courier: e.target.value })} className="form-input">
                <option value="">— select —</option>
                {COURIERS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="AWB / Tracking ID" className="md:col-span-1">
              <input value={editForm.awb} onChange={(e) => setEditForm({ ...editForm, awb: e.target.value })} className="form-input" />
            </Field>
            <Field label="Dispatch date" className="md:col-span-1">
              <input type="date" value={editForm.dispatchDate} onChange={(e) => setEditForm({ ...editForm, dispatchDate: e.target.value })} className="form-input" />
            </Field>
            <Field label="Expected delivery" className="md:col-span-1">
              <input type="date" value={editForm.expectedDate} onChange={(e) => setEditForm({ ...editForm, expectedDate: e.target.value })} className="form-input" />
            </Field>
            <Field label="Delivery agent" className="md:col-span-2">
              <input value={editForm.deliveryAgent} onChange={(e) => setEditForm({ ...editForm, deliveryAgent: e.target.value })} className="form-input" />
            </Field>
            <Field label="Payment mode" className="md:col-span-2">
              <select value={editForm.paymentMode} onChange={(e) => setEditForm({ ...editForm, paymentMode: e.target.value })} className="form-input">
                <option value="Prepaid">Prepaid</option>
                <option value="COD">Cash on Delivery</option>
              </select>
            </Field>
            <Field label="Notes" className="md:col-span-4">
              <textarea rows={2} value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} className="form-input" />
            </Field>

            <div className="md:col-span-4">
              <button type="submit" className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-slate-900">
                Save shipment details
              </button>
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
          <div className={`h-full overflow-x-auto rounded-2xl border ${activeStage.border}`}>
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className={`bg-gradient-to-r ${activeStage.tableHeader} text-xs uppercase tracking-wide`}>
                <tr>
                  <th className="px-4 py-3 font-medium">Tracking</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Address</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Courier / AWB</th>
                  <th className="px-4 py-3 font-medium">Dates</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {ordersAtStage.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center text-sm text-slate-500">
                      No shipments in {activeStage.label.toLowerCase()}. Dispatch a product from Finished Goods to create one.
                    </td>
                  </tr>
                ) : (
                  ordersAtStage.map((o) => {
                    const delayed = isDelayed(o);
                    return (
                      <tr key={o.id} className={activeStage.rowHover}>
                        <td className="px-4 py-3">
                          <span className="rounded-md bg-slate-900/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-white">
                            {o.trackingNumber}
                          </span>
                          {delayed && (
                            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                              ⚠ Delayed
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800">{o.customerName || "—"}</p>
                          <p className="text-xs text-slate-400">{o.customerPhone || "—"}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          <p className="line-clamp-2 max-w-xs text-xs">{o.address || "—"}</p>
                          <p className="text-xs font-medium text-slate-500">{o.city || ""}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          <p className="font-medium">{o.product}</p>
                          {o.quantity && (
                            <p className="text-xs text-slate-400">{o.quantity} {o.unit}</p>
                          )}
                          {o.batch && (
                            <p className="font-mono text-[10px] text-slate-400">Batch: {o.batch}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {o.courier ? (
                            <p className="text-xs font-semibold text-slate-700">{o.courier}</p>
                          ) : (
                            <p className="text-xs text-slate-400">—</p>
                          )}
                          {o.awb && <p className="font-mono text-[10px] text-slate-500">{o.awb}</p>}
                          {activeTab === "out" && o.deliveryAgent && (
                            <p className="mt-1 text-[10px] font-medium text-indigo-700">Agent: {o.deliveryAgent}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          <p>Disp: {o.dispatchDate || "—"}</p>
                          <p>Exp: {o.expectedDate || "—"}</p>
                          {o.deliveredAt && (
                            <p className="font-semibold text-emerald-700">✓ {o.deliveredAt}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${PAYMENT_STYLES[o.paymentMode] || "bg-slate-100 text-slate-700"}`}>
                            {o.paymentMode}
                          </span>
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
                              onClick={() => openEdit(o)}
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
                    );
                  })
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
