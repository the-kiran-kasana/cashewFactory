"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "inventory:state";

const INITIAL = {
  stock: [],
  productionStore: [],
  productionCutting: [],
  productionGrinding: [],
  productionPackaging: [],
  finishedGoods: [],
  outForDelivery: [],
};

export const PRODUCTION_STAGES = ["productionStore", "productionCutting", "productionGrinding", "productionPackaging"];
export const PRODUCTION_SOURCE_OF = {
  productionStore: "stock",
  productionCutting: "productionStore",
  productionGrinding: "productionCutting",
  productionPackaging: "productionGrinding",
};

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [state, setState] = useState(INITIAL);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const s = window.localStorage.getItem(STORAGE_KEY);
      if (s) {
        const parsed = JSON.parse(s);
        if (parsed && typeof parsed === "object") setState({ ...INITIAL, ...parsed });
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const qty = (v) => parseFloat(v) || 0;

  // Stock CRUD
  const addStock = (payload) => {
    setState((s) => ({ ...s, stock: [...s.stock, { id: Date.now(), ...payload }] }));
  };
  const updateStock = (id, payload) => {
    setState((s) => ({
      ...s,
      stock: s.stock.map((x) => (x.id === id ? { ...x, ...payload } : x)),
    }));
  };
  const deleteStock = (id) => {
    setState((s) => ({ ...s, stock: s.stock.filter((x) => x.id !== id) }));
  };

  // Move qty between two lists; remove source row when emptied
  const transfer = (fromKey, toKey, sourceId, transferQty, extras = {}) => {
    setState((s) => {
      const source = s[fromKey].find((x) => x.id === sourceId);
      if (!source) return s;
      const q = qty(transferQty);
      const available = qty(source.quantity);
      if (q <= 0 || q > available) return s;

      const remaining = available - q;
      const newSource = s[fromKey]
        .map((x) => (x.id === sourceId ? { ...x, quantity: String(remaining) } : x))
        .filter((x) => qty(x.quantity) > 0);

      const newItem = {
        id: Date.now() + Math.random(),
        sourceId,
        name: source.name,
        unit: source.unit,
        category: source.category,
        quality: source.quality,
        origin: source.origin,
        description: source.description,
        ...extras,
        quantity: String(q),
      };

      return {
        ...s,
        [fromKey]: newSource,
        [toKey]: [...s[toKey], newItem],
      };
    });
  };

  // Production row CRUD
  const editProductionItem = (stageKey, id, payload) => {
    setState((s) => ({
      ...s,
      [stageKey]: s[stageKey].map((x) => (x.id === id ? { ...x, ...payload } : x)),
    }));
  };
  const deleteProductionItem = (stageKey, id) => {
    setState((s) => ({ ...s, [stageKey]: s[stageKey].filter((x) => x.id !== id) }));
  };

  // Finished goods internal stage transitions + CRUD
  const setFinishedStage = (id, stage) => {
    setState((s) => ({
      ...s,
      finishedGoods: s.finishedGoods.map((x) =>
        x.id === id
          ? {
              ...x,
              stage,
              deliveredAt:
                stage === "dispatched" ? new Date().toISOString().slice(0, 10) : x.deliveredAt,
            }
          : x
      ),
    }));
  };
  const editFinished = (id, payload) => {
    setState((s) => ({
      ...s,
      finishedGoods: s.finishedGoods.map((x) => (x.id === id ? { ...x, ...payload } : x)),
    }));
  };
  const deleteFinished = (id) => {
    setState((s) => ({ ...s, finishedGoods: s.finishedGoods.filter((x) => x.id !== id) }));
  };

  // Out for Delivery — pulled from a Finished Goods row (Ready stage typically)
  const dispatchFromFinished = (finishedId, transferQty, customerData) => {
    setState((s) => {
      const source = s.finishedGoods.find((x) => x.id === finishedId);
      if (!source) return s;
      const q = qty(transferQty);
      const available = qty(source.quantity);
      if (q <= 0 || q > available) return s;

      const remaining = available - q;
      const newFinished = s.finishedGoods
        .map((x) => (x.id === finishedId ? { ...x, quantity: String(remaining) } : x))
        .filter((x) => qty(x.quantity) > 0);

      const newDelivery = {
        id: Date.now() + Math.random(),
        trackingNumber: `OD-${Date.now().toString().slice(-6)}`,
        sourceFinishedId: finishedId,
        product: source.name,
        quantity: String(q),
        unit: source.unit,
        sku: source.sku || "",
        batch: source.batch || "",
        productionDate: source.productionDate || "",
        stage: "ready",
        paymentMode: "Prepaid",
        deliveredAt: null,
        ...customerData,
      };

      return {
        ...s,
        finishedGoods: newFinished,
        outForDelivery: [...s.outForDelivery, newDelivery],
      };
    });
  };

  const setDeliveryStage = (id, stage) => {
    setState((s) => ({
      ...s,
      outForDelivery: s.outForDelivery.map((x) =>
        x.id === id
          ? {
              ...x,
              stage,
              deliveredAt:
                stage === "delivered" ? new Date().toISOString().slice(0, 10) : x.deliveredAt,
            }
          : x
      ),
    }));
  };
  const editDelivery = (id, payload) => {
    setState((s) => ({
      ...s,
      outForDelivery: s.outForDelivery.map((x) => (x.id === id ? { ...x, ...payload } : x)),
    }));
  };
  const deleteDelivery = (id) => {
    setState((s) => ({ ...s, outForDelivery: s.outForDelivery.filter((x) => x.id !== id) }));
  };

  const value = {
    state,
    hydrated,
    addStock,
    updateStock,
    deleteStock,
    transferToProductionStore: (stockId, q) => transfer("stock", "productionStore", stockId, q),
    transferToCutting: (id, q) => transfer("productionStore", "productionCutting", id, q),
    transferToGrinding: (id, q) => transfer("productionCutting", "productionGrinding", id, q),
    transferToPackaging: (id, q) => transfer("productionGrinding", "productionPackaging", id, q),
    transferToFinished: (id, q, extras) =>
      transfer("productionPackaging", "finishedGoods", id, q, { stage: "finished", ...extras }),
    editProductionItem,
    deleteProductionItem,
    setFinishedStage,
    editFinished,
    deleteFinished,
    dispatchFromFinished,
    setDeliveryStage,
    editDelivery,
    deleteDelivery,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used inside InventoryProvider");
  return ctx;
}
