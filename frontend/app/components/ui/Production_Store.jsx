"use client";

import Link from "next/link";
import { useState } from "react";
import { useInventory } from "../inventory/InventoryContext";

const STAGES = [
  {
    id: "store",
    stateKey: "productionStore",
    sourceKey: "stock",
    sourceLabel: "Stock",
    label: "Store",
    activeClass:
      "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/40 ring-1 ring-amber-300/40",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-amber-100 text-amber-700",
    border: "border-amber-200",
    tableHeader: "from-amber-50 to-amber-100/60 text-amber-800",
    rowHover: "hover:bg-amber-50/50",
    buttonGradient: "from-amber-500 to-amber-600",
  },
  {
    id: "cutting",
    stateKey: "productionCutting",
    sourceKey: "productionStore",
    sourceLabel: "Production Store",
    label: "Cutting",
    activeClass:
      "bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-lg shadow-rose-500/40 ring-1 ring-rose-300/40",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-rose-100 text-rose-700",
    border: "border-rose-200",
    tableHeader: "from-rose-50 to-rose-100/60 text-rose-800",
    rowHover: "hover:bg-rose-50/50",
    buttonGradient: "from-rose-500 to-rose-600",
  },
  {
    id: "grinding",
    stateKey: "productionGrinding",
    sourceKey: "productionCutting",
    sourceLabel: "Cutting",
    label: "Grinding",
    activeClass:
      "bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-lg shadow-violet-500/40 ring-1 ring-violet-300/40",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-violet-100 text-violet-700",
    border: "border-violet-200",
    tableHeader: "from-violet-50 to-violet-100/60 text-violet-800",
    rowHover: "hover:bg-violet-50/50",
    buttonGradient: "from-violet-500 to-violet-700",
  },
  {
    id: "packaging",
    stateKey: "productionPackaging",
    sourceKey: "productionGrinding",
    sourceLabel: "Grinding",
    label: "Packaging",
    activeClass:
      "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/40 ring-1 ring-emerald-300/40",
    chipActive: "bg-white/25 text-white ring-1 ring-white/30",
    chipIdle: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-200",
    tableHeader: "from-emerald-50 to-emerald-100/60 text-emerald-800",
    rowHover: "hover:bg-emerald-50/50",
    buttonGradient: "from-emerald-500 to-emerald-700",
  },
];

export default function ProductionStore({ onBack }) {
  const inv = useInventory();
  const [activeTab, setActiveTab] = useState("store");
  const [showPullForm, setShowPullForm] = useState(false);
  const [pullSourceId, setPullSourceId] = useState("");
  const [pullQty, setPullQty] = useState("");

  const activeStage = STAGES.find((s) => s.id === activeTab);
  const itemsAtStage = inv.state[activeStage.stateKey];
  const sourceList = inv.state[activeStage.sourceKey];

  const countByStage = STAGES.reduce((acc, s) => {
    acc[s.id] = inv.state[s.stateKey].length;
    return acc;
  }, {});

  const transferForStage = {
    store: inv.transferToProductionStore,
    cutting: inv.transferToCutting,
    grinding: inv.transferToGrinding,
    packaging: inv.transferToPackaging,
  };

  const handlePull = (e) => {
    e.preventDefault();
    if (!pullSourceId || !pullQty) return;
    transferForStage[activeTab](Number(pullSourceId), pullQty);
    setPullSourceId("");
    setPullQty("");
    setShowPullForm(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Discard this item? Quantity will not be returned to the source.")) return;
    inv.deleteProductionItem(activeStage.stateKey, id);
  };

  const selectedSource = sourceList.find((x) => x.id === Number(pullSourceId));

  return (
    <div className="min-h-screen bg-[#F5FFFA] px-6 py-10">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-7xl flex-col rounded-3xl bg-white p-10 shadow-sm">
        <BackLink onBack={onBack} />

        <div className="mt-6">
          <h1 className="text-2xl font-semibold text-slate-800">Production Store</h1>
          <p className="mt-1 text-sm text-slate-500">
            Items flow Stock → Store → Cutting → Grinding → Packaging → Finished Goods. Each pull deducts from its source.
          </p>
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
                  setPullSourceId("");
                  setPullQty("");
                }}
                className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 ${
                  isActive ? stage.activeClass : "text-slate-500 hover:bg-white/80 hover:text-slate-900"
                }`}
              >
                {stage.label}
                {count > 0 && (
                  <span
                    className={`ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
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

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-700">
            {activeStage.label} items ({itemsAtStage.length})
          </h2>
          <button
            type="button"
            onClick={() => setShowPullForm((v) => !v)}
            disabled={sourceList.length === 0}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition ${
              sourceList.length === 0
                ? "cursor-not-allowed bg-slate-300"
                : `bg-gradient-to-br ${activeStage.buttonGradient} hover:opacity-90`
            }`}
          >
            {showPullForm
              ? "Cancel"
              : sourceList.length === 0
              ? `No items in ${activeStage.sourceLabel}`
              : `📥 Pull from ${activeStage.sourceLabel}`}
          </button>
        </div>

        {showPullForm && sourceList.length > 0 && (
          <form
            onSubmit={handlePull}
            className={`mt-4 grid gap-4 rounded-2xl border ${activeStage.border} bg-slate-50/60 p-6 md:grid-cols-3`}
          >
            <div className="md:col-span-3">
              <h3 className="text-sm font-semibold text-slate-800">
                Pull from {activeStage.sourceLabel} → {activeStage.label}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Choose a source item and how much to transfer. The source quantity will be reduced.
              </p>
            </div>

            <Field label="Source item" className="md:col-span-2">
              <select
                value={pullSourceId}
                onChange={(e) => {
                  setPullSourceId(e.target.value);
                  setPullQty("");
                }}
                className="form-input"
                required
              >
                <option value="">— Select an item from {activeStage.sourceLabel} —</option>
                {sourceList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — available: {s.quantity} {s.unit}
                    {s.quality ? ` · Grade ${s.quality}` : ""}
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

            <div className="md:col-span-3">
              <button
                type="submit"
                className={`w-full rounded-lg bg-gradient-to-br ${activeStage.buttonGradient} px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90`}
              >
                Transfer to {activeStage.label}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 flex-1">
          <div className={`h-full overflow-x-auto rounded-2xl border ${activeStage.border}`}>
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className={`bg-gradient-to-r ${activeStage.tableHeader} text-xs uppercase tracking-wide`}>
                <tr>
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Quality</th>
                  <th className="px-4 py-3 font-medium">Quantity</th>
                  <th className="px-4 py-3 font-medium">Origin</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {itemsAtStage.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-sm text-slate-500">
                      No items in {activeStage.label.toLowerCase()}. Pull from {activeStage.sourceLabel} to fill this stage.
                    </td>
                  </tr>
                ) : (
                  itemsAtStage.map((m) => (
                    <tr key={m.id} className={activeStage.rowHover}>
                      <td className="px-4 py-3 font-medium text-slate-800">{m.name}</td>
                      <td className="px-4 py-3">
                        {m.category && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                            {m.category}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {m.quality && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                            Grade {m.quality}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{m.quantity} {m.unit}</td>
                      <td className="px-4 py-3 text-slate-600">{m.origin || "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(m.id)}
                          className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 transition hover:border-red-400 hover:bg-red-50"
                        >
                          Delete
                        </button>
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
