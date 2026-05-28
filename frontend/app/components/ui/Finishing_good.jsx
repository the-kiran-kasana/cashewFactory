"use client";

import Link from "next/link";
import { useState } from "react";
import { useInventory } from "../inventory/InventoryContext";

const STAGES = [
  {
    id: "finished",
    label: "Finished",
    activeClass:
      "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/40 ring-1 ring-emerald-300/40",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-200",
    tableHeader: "from-emerald-50 to-emerald-100/60 text-emerald-800",
    rowHover: "hover:bg-emerald-50/50",
    buttonGradient: "from-emerald-500 to-emerald-700",
    moveLabel: "Send to QC →",
    nextStage: "qc",
  },
  {
    id: "qc",
    label: "Quality Check",
    activeClass:
      "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/40 ring-1 ring-amber-300/40",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-amber-100 text-amber-700",
    border: "border-amber-200",
    tableHeader: "from-amber-50 to-amber-100/60 text-amber-800",
    rowHover: "hover:bg-amber-50/50",
    buttonGradient: "from-amber-500 to-amber-600",
    moveLabel: "Approve →",
    nextStage: "ready",
  },
  {
    id: "ready",
    label: "Ready to Dispatch",
    activeClass:
      "bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-lg shadow-sky-500/40 ring-1 ring-sky-300/40",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-sky-100 text-sky-700",
    border: "border-sky-200",
    tableHeader: "from-sky-50 to-sky-100/60 text-sky-800",
    rowHover: "hover:bg-sky-50/50",
    buttonGradient: "from-sky-500 to-sky-700",
    moveLabel: "Dispatch →",
    nextStage: null,
  },
];

export default function FinishingGood({ title = "Finished Goods", onBack }) {
  const inv = useInventory();
  const [activeTab, setActiveTab] = useState("finished");
  const [showPullForm, setShowPullForm] = useState(false);
  const [pullSourceId, setPullSourceId] = useState("");
  const [pullQty, setPullQty] = useState("");
  const [sku, setSku] = useState("");
  const [batch, setBatch] = useState("");
  const [productionDate, setProductionDate] = useState("");
  const [dispatchingItem, setDispatchingItem] = useState(null);
  const [dispatchForm, setDispatchForm] = useState({
    customerName: "",
    customerPhone: "",
    address: "",
    city: "",
    paymentMode: "Prepaid",
    quantity: "",
  });

  const activeStage = STAGES.find((s) => s.id === activeTab);
  const items = inv.state.finishedGoods;
  const itemsAtStage = items.filter((i) => i.stage === activeTab);

  const countByStage = STAGES.reduce((acc, s) => {
    acc[s.id] = items.filter((i) => i.stage === s.id).length;
    return acc;
  }, {});

  const packagingItems = inv.state.productionPackaging;
  const selectedSource = packagingItems.find((x) => x.id === Number(pullSourceId));

  const handlePull = (e) => {
    e.preventDefault();
    if (!pullSourceId || !pullQty) return;
    inv.transferToFinished(Number(pullSourceId), pullQty, {
      sku: sku.trim(),
      batch: batch.trim() || `B-${Date.now().toString().slice(-6)}`,
      productionDate: productionDate || new Date().toISOString().slice(0, 10),
      customer: "",
      notes: "",
    });
    setPullSourceId("");
    setPullQty("");
    setSku("");
    setBatch("");
    setProductionDate("");
    setShowPullForm(false);
  };

  const handleAdvance = (id, nextStage) => {
    if (!nextStage) return;
    inv.setFinishedStage(id, nextStage);
  };

  const openDispatch = (item) => {
    setDispatchingItem(item);
    setDispatchForm({
      customerName: "",
      customerPhone: "",
      address: "",
      city: "",
      paymentMode: "Prepaid",
      quantity: item.quantity,
    });
  };

  const cancelDispatch = () => {
    setDispatchingItem(null);
  };

  const submitDispatch = (e) => {
    e.preventDefault();
    if (!dispatchingItem) return;
    if (!dispatchForm.customerName.trim() || !dispatchForm.address.trim() || !dispatchForm.quantity)
      return;
    inv.dispatchFromFinished(dispatchingItem.id, dispatchForm.quantity, {
      customerName: dispatchForm.customerName.trim(),
      customerPhone: dispatchForm.customerPhone.trim(),
      address: dispatchForm.address.trim(),
      city: dispatchForm.city.trim(),
      paymentMode: dispatchForm.paymentMode,
    });
    setDispatchingItem(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Remove this finished item?")) return;
    inv.deleteFinished(id);
  };

  const updateField = (id, field, value) => {
    inv.editFinished(id, { [field]: value });
  };

  return (
    <div className="min-h-screen bg-[#F5FFFA] px-6 py-10">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-7xl flex-col rounded-3xl bg-white p-10 shadow-sm">
        <BackLink onBack={onBack} />

        <div className="mt-6">
          <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Items arrive from Production Packaging and flow through QC, warehouse, and dispatch.
          </p>
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
                  setActiveTab(stage.id);
                  setShowPullForm(false);
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

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-700">
            {activeStage.label} ({itemsAtStage.length})
          </h2>
          {activeTab === "finished" && (
            <button
              type="button"
              onClick={() => setShowPullForm((v) => !v)}
              disabled={packagingItems.length === 0}
              className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition ${
                packagingItems.length === 0
                  ? "cursor-not-allowed bg-slate-300"
                  : `bg-gradient-to-br ${activeStage.buttonGradient} hover:opacity-90`
              }`}
            >
              {showPullForm
                ? "Cancel"
                : packagingItems.length === 0
                ? "No items in Packaging"
                : "📥 Pull from Packaging"}
            </button>
          )}
        </div>

        {showPullForm && activeTab === "finished" && packagingItems.length > 0 && (
          <form onSubmit={handlePull} className={`mt-4 grid gap-4 rounded-2xl border ${activeStage.border} bg-slate-50/60 p-6 md:grid-cols-4`}>
            <div className="md:col-span-4">
              <h3 className="text-sm font-semibold text-slate-800">Pull from Packaging → Finished</h3>
              <p className="mt-1 text-xs text-slate-500">
                Pulled quantity is deducted from Packaging.
              </p>
            </div>

            <Field label="Source (Packaging item)" className="md:col-span-2">
              <select
                value={pullSourceId}
                onChange={(e) => {
                  setPullSourceId(e.target.value);
                  setPullQty("");
                }}
                className="form-input"
                required
              >
                <option value="">— Select a packaged item —</option>
                {packagingItems.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — available: {p.quantity} {p.unit}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={`Quantity${selectedSource ? ` (max ${selectedSource.quantity} ${selectedSource.unit})` : ""}`} className="md:col-span-1">
              <input
                value={pullQty}
                onChange={(e) => setPullQty(e.target.value)}
                type="number"
                min="0"
                step="any"
                max={selectedSource ? selectedSource.quantity : undefined}
                placeholder="0"
                className="form-input"
                required
              />
            </Field>

            <Field label="Production date" className="md:col-span-1">
              <input
                value={productionDate}
                onChange={(e) => setProductionDate(e.target.value)}
                type="date"
                className="form-input"
              />
            </Field>

            <Field label="SKU" className="md:col-span-2">
              <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. CSH-500" className="form-input" />
            </Field>

            <Field label="Batch number" className="md:col-span-2">
              <input value={batch} onChange={(e) => setBatch(e.target.value)} placeholder="auto-generated if blank" className="form-input" />
            </Field>

            <div className="md:col-span-4">
              <button type="submit" className={`w-full rounded-lg bg-gradient-to-br ${activeStage.buttonGradient} px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90`}>
                Move to Finished
              </button>
            </div>
          </form>
        )}

        {dispatchingItem && (
          <form
            onSubmit={submitDispatch}
            className="mt-4 grid gap-4 rounded-2xl border border-sky-300 bg-sky-50/60 p-6 md:grid-cols-4"
          >
            <div className="md:col-span-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">
                Dispatch: {dispatchingItem.name} (available {dispatchingItem.quantity} {dispatchingItem.unit})
              </h3>
              <button
                type="button"
                onClick={cancelDispatch}
                className="text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>

            <Field label="Customer name" className="md:col-span-2">
              <input
                value={dispatchForm.customerName}
                onChange={(e) => setDispatchForm({ ...dispatchForm, customerName: e.target.value })}
                placeholder="e.g. Ravi Kumar"
                className="form-input"
                required
              />
            </Field>
            <Field label="Phone" className="md:col-span-1">
              <input
                value={dispatchForm.customerPhone}
                onChange={(e) => setDispatchForm({ ...dispatchForm, customerPhone: e.target.value })}
                placeholder="+91 98765 43210"
                className="form-input"
              />
            </Field>
            <Field label="City" className="md:col-span-1">
              <input
                value={dispatchForm.city}
                onChange={(e) => setDispatchForm({ ...dispatchForm, city: e.target.value })}
                placeholder="e.g. Bengaluru"
                className="form-input"
              />
            </Field>
            <Field label="Delivery address" className="md:col-span-4">
              <textarea
                value={dispatchForm.address}
                onChange={(e) => setDispatchForm({ ...dispatchForm, address: e.target.value })}
                rows={2}
                placeholder="Full address with PIN code"
                className="form-input"
                required
              />
            </Field>
            <Field
              label={`Quantity (max ${dispatchingItem.quantity} ${dispatchingItem.unit})`}
              className="md:col-span-2"
            >
              <input
                type="number"
                min="0"
                step="any"
                max={dispatchingItem.quantity}
                value={dispatchForm.quantity}
                onChange={(e) => setDispatchForm({ ...dispatchForm, quantity: e.target.value })}
                className="form-input"
                required
              />
            </Field>
            <Field label="Payment mode" className="md:col-span-2">
              <select
                value={dispatchForm.paymentMode}
                onChange={(e) => setDispatchForm({ ...dispatchForm, paymentMode: e.target.value })}
                className="form-input"
              >
                <option value="Prepaid">Prepaid</option>
                <option value="COD">Cash on Delivery</option>
              </select>
            </Field>

            <div className="md:col-span-4">
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-br from-sky-500 to-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
              >
                Dispatch → Out for Delivery
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 flex-1">
          <div className={`h-full overflow-x-auto rounded-2xl border ${activeStage.border}`}>
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className={`bg-gradient-to-r ${activeStage.tableHeader} text-xs uppercase tracking-wide`}>
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium">Batch</th>
                  <th className="px-4 py-3 font-medium">Quantity</th>
                  <th className="px-4 py-3 font-medium">Production</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {itemsAtStage.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-sm text-slate-500">
                      {activeTab === "finished"
                        ? "No items finished yet. Pull from Packaging to begin."
                        : `No items in ${activeStage.label.toLowerCase()}.`}
                    </td>
                  </tr>
                ) : (
                  itemsAtStage.map((m) => (
                    <tr key={m.id} className={activeStage.rowHover}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{m.name}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{m.sku || "—"}</td>
                      <td className="px-4 py-3">
                        {m.batch ? (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                            {m.batch}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">{m.quantity} {m.unit}</td>
                      <td className="px-4 py-3 text-slate-600">{m.productionDate || "—"}</td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={m.customer || ""}
                          onChange={(e) => updateField(m.id, "customer", e.target.value)}
                          placeholder="Add customer…"
                          className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs focus:border-slate-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {activeTab === "ready" ? (
                            <button
                              type="button"
                              onClick={() => openDispatch(m)}
                              className={`rounded-md bg-gradient-to-br ${activeStage.buttonGradient} px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition hover:opacity-90`}
                            >
                              Dispatch →
                            </button>
                          ) : (
                            activeStage.nextStage && (
                              <button
                                type="button"
                                onClick={() => handleAdvance(m.id, activeStage.nextStage)}
                                className={`rounded-md bg-gradient-to-br ${activeStage.buttonGradient} px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition hover:opacity-90`}
                              >
                                {activeStage.moveLabel}
                              </button>
                            )
                          )}
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
    <Link href="/admin-dashboard" className={classes}>
      ← Back to dashboard
    </Link>
  );
}
