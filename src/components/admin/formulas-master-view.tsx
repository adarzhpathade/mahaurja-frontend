"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Flame,
  CheckCircle2,
  X,
  Sliders,
  Sparkles,
} from "lucide-react";
import { useAdmin } from "@/lib/context/admin-context";

export function FormulasMasterView() {
  const { blendFormulas, addBlendFormula, toggleFormulaStatus } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [targetProduct, setTargetProduct] = useState("8mm High-Density Bio-Pellet");
  const [targetGcvMin, setTargetGcvMin] = useState("4100");
  const [targetAshMax, setTargetAshMax] = useState("6.0");
  const [notes, setNotes] = useState("");

  // Ingredients State
  const [ing1Name, setIng1Name] = useState("Cotton Stalk");
  const [ing1Pct, setIng1Pct] = useState("60");
  const [ing2Name, setIng2Name] = useState("Sawdust");
  const [ing2Pct, setIng2Pct] = useState("40");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addBlendFormula({
      name,
      targetProduct,
      targetGcvMin: parseFloat(targetGcvMin) || 4100,
      targetAshMax: parseFloat(targetAshMax) || 6.0,
      ingredients: [
        { materialName: ing1Name, percentage: parseFloat(ing1Pct) || 50 },
        { materialName: ing2Name, percentage: parseFloat(ing2Pct) || 50 },
      ],
      notes: notes || "Standard plant production recipe.",
      isActive: true,
    });

    setIsModalOpen(false);
    setName("");
    setNotes("");
  };

  return (
    <div className="space-y-6 select-none">
      {/* Executive Command Header */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
          Biomass Pellet Blend Formulas
        </h1>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="h-10 px-4 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Create New Formula</span>
        </button>
      </div>

      {/* Formulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {blendFormulas.map((formula) => (
          <div
            key={formula.id}
            className="bg-white border border-neutral-300 p-5 space-y-4 hover:border-neutral-900 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono font-bold text-xs text-neutral-500">
                  {formula.id}
                </span>
                <h3 className="font-bold text-base text-neutral-900 leading-tight mt-0.5">
                  {formula.name}
                </h3>
                <span className="text-xs text-neutral-600 font-medium">
                  Output: {formula.targetProduct}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                  formula.isActive
                    ? "bg-emerald-50 text-[#047857] border border-emerald-200"
                    : "bg-neutral-100 text-neutral-600 border border-neutral-300"
                }`}
              >
                {formula.isActive ? "ACTIVE RECIPE" : "DEPRECATED"}
              </span>
            </div>

            {/* Target Spec Telemetry */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 border border-neutral-200 text-xs">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-semibold block">
                  Target GCV (Min)
                </span>
                <span className="font-mono font-bold text-sm text-neutral-900">
                  {formula.targetGcvMin} kcal/kg
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-semibold block">
                  Target Ash (Max)
                </span>
                <span className="font-mono font-bold text-sm text-neutral-900">
                  &le; {formula.targetAshMax}%
                </span>
              </div>
            </div>

            {/* Ingredients Percentage Breakdown */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block">
                Biomass Recipe Composition
              </span>

              <div className="space-y-1.5">
                {formula.ingredients.map((ing, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-800">{ing.materialName}</span>
                      <span className="font-mono font-bold text-neutral-900">{ing.percentage}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 h-2 overflow-hidden">
                      <div
                        className={`h-full ${
                          idx === 0 ? "bg-[#059669]" : "bg-neutral-800"
                        }`}
                        style={{ width: `${ing.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {formula.notes && (
              <p className="text-xs text-neutral-600 italic bg-neutral-50 p-2.5 border-l-2 border-[#059669]">
                &ldquo;{formula.notes}&rdquo;
              </p>
            )}

            <div className="pt-2 border-t border-neutral-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => toggleFormulaStatus(formula.id)}
                className="px-3 py-1 text-xs font-semibold border border-neutral-300 hover:bg-neutral-100 text-neutral-700 cursor-pointer"
              >
                {formula.isActive ? "Deactivate Recipe" : "Set As Active"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Formula Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                Create Biomass Blend Formula
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Formula / Recipe Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High Thermal Boiler Blend (8mm)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Target Product
                </label>
                <input
                  type="text"
                  value={targetProduct}
                  onChange={(e) => setTargetProduct(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Target Min GCV (kcal/kg)
                  </label>
                  <input
                    type="number"
                    value={targetGcvMin}
                    onChange={(e) => setTargetGcvMin(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Target Max Ash %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetAshMax}
                    onChange={(e) => setTargetAshMax(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Composition */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 block">
                  Ingredient Ratio Composition (Must sum to 100%)
                </span>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={ing1Name}
                      onChange={(e) => setIng1Name(e.target.value)}
                      className="w-full h-9 px-2 bg-white border border-neutral-300 text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={ing1Pct}
                      onChange={(e) => setIng1Pct(e.target.value)}
                      placeholder="%"
                      className="w-full h-9 px-2 bg-white border border-neutral-300 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={ing2Name}
                      onChange={(e) => setIng2Name(e.target.value)}
                      className="w-full h-9 px-2 bg-white border border-neutral-300 text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={ing2Pct}
                      onChange={(e) => setIng2Pct(e.target.value)}
                      placeholder="%"
                      className="w-full h-9 px-2 bg-white border border-neutral-300 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Operator Recipe Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes on hammer mill screen size, drying temperature, or moisture adjustments..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669] resize-none"
                />
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-4 border border-neutral-300 bg-white text-neutral-700 font-semibold hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 bg-[#18181B] hover:bg-[#059669] text-white font-bold transition-colors"
                >
                  Save Formula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
