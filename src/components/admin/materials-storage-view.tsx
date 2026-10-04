"use client";

import React, { useState } from "react";
import {
  Warehouse,
  Plus,
  Layers,
  Scale,
  DollarSign,
  Flame,
  Droplets,
  CheckCircle2,
  X,
} from "lucide-react";
import { useAdmin } from "@/lib/context/admin-context";

export function MaterialsStorageView() {
  const { materials, storageLocations, addMaterial, addStorageLocation } = useAdmin();
  const [isMatModalOpen, setIsMatModalOpen] = useState(false);
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);

  // Material Form
  const [matName, setMatName] = useState("");
  const [matCategory, setMatCategory] = useState<"RAW_BIOMASS" | "FINISHED_PELLET">("RAW_BIOMASS");
  const [matMoisture, setMatMoisture] = useState("12");
  const [matAsh, setMatAsh] = useState("6");
  const [matGcv, setMatGcv] = useState("4000");
  const [matRate, setMatRate] = useState("3500");

  // Location Form
  const [locName, setLocName] = useState("");
  const [locType, setLocType] = useState<"Raw Material Yard" | "Finished Goods Shed" | "Quarantine Hold">("Raw Material Yard");
  const [locCapacity, setLocCapacity] = useState("500");
  const [locMaterial, setLocMaterial] = useState("Cotton Stalk");
  const [locSupervisor, setLocSupervisor] = useState("Nitin Joshi");

  const handleMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matName) return;

    addMaterial({
      name: matName,
      category: matCategory,
      unit: "MT",
      targetMoistureMax: parseFloat(matMoisture) || 12,
      targetAshMax: parseFloat(matAsh) || 6,
      targetGcvMin: parseFloat(matGcv) || 4000,
      baseRatePerMt: parseFloat(matRate) || 3500,
      isActive: true,
    });

    setIsMatModalOpen(false);
    setMatName("");
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locName) return;

    addStorageLocation({
      name: locName,
      type: locType,
      capacityMt: parseFloat(locCapacity) || 500,
      currentMaterial: locMaterial,
      supervisorName: locSupervisor,
    });

    setIsLocModalOpen(false);
    setLocName("");
  };

  return (
    <div className="space-y-8 select-none">
      {/* Top Executive Header */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            Materials &amp; Storage Locations
          </h1>
        </div>

        {/* Action Buttons: Visible on Tablet/Desktop (sm and up) */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMatModalOpen(true)}
            className="h-10 px-4 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#059669]" />
            <span>Add Material</span>
          </button>
          <button
            type="button"
            onClick={() => setIsLocModalOpen(true)}
            className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>Add Storage Location</span>
          </button>
        </div>
      </div>

      {/* 2. MOBILE ACTION STACK (Gate UI Pattern) */}
      <div className="sm:hidden flex flex-col items-stretch gap-2.5 w-full">
        <button
          type="button"
          onClick={() => setIsMatModalOpen(true)}
          className="h-11 px-4 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer w-full"
        >
          <Plus className="w-4 h-4 text-[#059669]" />
          <span>Add Material</span>
        </button>

        <button
          type="button"
          onClick={() => setIsLocModalOpen(true)}
          className="h-11 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs w-full"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>Add Storage Location</span>
        </button>
      </div>

      {/* SECTION 1: MATERIALS SPECIFICATIONS & BASE RATES */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#059669]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Biomass Materials Specification &amp; Pricing Directory
            </h2>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            {materials.length} Materials Configured
          </span>
        </div>

        {/* Mobile responsive cards */}
        <div className="grid grid-cols-1 sm:hidden gap-3">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="bg-white/40 border border-neutral-300 p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-neutral-500">{mat.id}</span>
                  <h3 className="font-bold text-sm text-neutral-900">{mat.name}</h3>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${
                    mat.category === "FINISHED_PELLET"
                      ? "bg-[#18181B] text-white border-[#18181B]"
                      : "bg-emerald-50 text-[#047857] border-emerald-300"
                  }`}
                >
                  {mat.category === "FINISHED_PELLET" ? "Finished Goods" : "Raw Biomass"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs border-y border-neutral-200 py-2 font-mono">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Moisture</span>
                  <span className="font-bold text-neutral-900">&le; {mat.targetMoistureMax.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">Ash</span>
                  <span className="font-bold text-neutral-900">&le; {mat.targetAshMax.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">Min GCV</span>
                  <span className="font-bold text-neutral-900">&ge; {mat.targetGcvMin}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Base Rate</span>
                  <span className="font-mono font-bold text-[#059669]">₹{mat.baseRatePerMt.toLocaleString("en-IN")} / MT</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 block">Stock</span>
                  <span className="font-mono font-bold text-neutral-900">{mat.currentInventoryMt.toFixed(1)} MT</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Transparent Industrial Table */}
        <div className="hidden sm:block border border-neutral-300 overflow-x-auto bg-transparent">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Material ID</th>
                <th className="py-3 px-4">Material Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Max Moisture %</th>
                <th className="py-3 px-4 text-center">Max Ash %</th>
                <th className="py-3 px-4 text-center">Min GCV (kcal/kg)</th>
                <th className="py-3 px-4 text-right">Base Rate / MT</th>
                <th className="py-3 px-4 text-right">Current Stock</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300 bg-transparent">
              {materials.map((mat) => (
                <tr key={mat.id} className="hover:bg-neutral-200/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-xs text-neutral-900">
                    {mat.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-neutral-900">
                    {mat.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${
                        mat.category === "FINISHED_PELLET"
                          ? "bg-[#18181B] text-white border-[#18181B]"
                          : "bg-emerald-50 text-[#047857] border-emerald-300"
                      }`}
                    >
                      {mat.category === "FINISHED_PELLET" ? "Finished Goods" : "Raw Biomass"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-neutral-900">
                    &le; {mat.targetMoistureMax.toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-neutral-900">
                    &le; {mat.targetAshMax.toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-neutral-900">
                    &ge; {mat.targetGcvMin}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#059669]">
                    ₹{mat.baseRatePerMt.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-900">
                    {mat.currentInventoryMt.toFixed(1)} MT
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-50 text-[#047857] border border-emerald-200">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 2: STORAGE LOCATIONS & YARDS */}
      <section className="mt-6 sm:mt-5 pt-5 sm:pt-4 border-t border-neutral-200 space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
          <div className="flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-[#059669]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Storage Locations &amp; Yard Bays
            </h2>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            {storageLocations.length} Physical Bays
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {storageLocations.map((loc) => {
            const utilization = (loc.currentStockMt / loc.capacityMt) * 100;
            return (
              <div
                key={loc.id}
                className="bg-white/40 border border-neutral-300 hover:border-neutral-900 transition-all p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono font-bold text-[11px] text-neutral-500">
                      {loc.id}
                    </span>
                    <h3 className="font-bold text-sm text-neutral-900 leading-tight">
                      {loc.name}
                    </h3>
                  </div>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 border border-neutral-300 bg-neutral-100 text-neutral-700">
                    {loc.type}
                  </span>
                </div>

                <div className="text-xs text-neutral-600 space-y-0.5">
                  <div className="text-[11px] text-neutral-500">
                    Material: <span className="font-semibold text-neutral-900">{loc.currentMaterial}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Supervisor: <span className="font-semibold text-neutral-900">{loc.supervisorName}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200 space-y-1.5">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-mono font-bold text-neutral-900">
                      {loc.currentStockMt.toFixed(1)} MT
                    </span>
                    <span className="font-mono text-neutral-500 text-[11px]">
                      Capacity: {loc.capacityMt} MT
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-neutral-200 h-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        utilization > 85
                          ? "bg-amber-600"
                          : utilization > 50
                          ? "bg-[#059669]"
                          : "bg-blue-600"
                      }`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                    <span>{utilization.toFixed(1)}% full</span>
                    <span>{(loc.capacityMt - loc.currentStockMt).toFixed(1)} MT free</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add Material Modal */}
      {isMatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                Register Biomass Material Spec
              </h3>
              <button
                type="button"
                onClick={() => setIsMatModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMaterialSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Material Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Groundnut Shell / Rice Husk"
                  value={matName}
                  onChange={(e) => setMatName(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Category *
                </label>
                <select
                  value={matCategory}
                  onChange={(e) => setMatCategory(e.target.value as any)}
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                >
                  <option value="RAW_BIOMASS">Raw Biomass</option>
                  <option value="FINISHED_PELLET">Finished Pellet</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Max Moisture %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={matMoisture}
                    onChange={(e) => setMatMoisture(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Max Ash %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={matAsh}
                    onChange={(e) => setMatAsh(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Min GCV (kcal)
                  </label>
                  <input
                    type="number"
                    value={matGcv}
                    onChange={(e) => setMatGcv(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Base Rate (₹ / MT) *
                </label>
                <input
                  type="number"
                  required
                  value={matRate}
                  onChange={(e) => setMatRate(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMatModalOpen(false)}
                  className="h-9 px-4 border border-neutral-300 bg-white text-neutral-700 font-semibold hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 bg-[#18181B] hover:bg-[#059669] text-white font-bold transition-colors"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Location Modal */}
      {isLocModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                Register Physical Storage Location
              </h3>
              <button
                type="button"
                onClick={() => setIsLocModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLocationSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Location / Yard Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yard C (Baled Stalk) / Shed 03"
                  value={locName}
                  onChange={(e) => setLocName(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Storage Type *
                  </label>
                  <select
                    value={locType}
                    onChange={(e) => setLocType(e.target.value as any)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="Raw Material Yard">Raw Material Yard</option>
                    <option value="Finished Goods Shed">Finished Goods Shed</option>
                    <option value="Quarantine Hold">Quarantine Hold</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Capacity (MT) *
                  </label>
                  <input
                    type="number"
                    required
                    value={locCapacity}
                    onChange={(e) => setLocCapacity(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Assigned Material
                  </label>
                  <input
                    type="text"
                    value={locMaterial}
                    onChange={(e) => setLocMaterial(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Supervisor Name
                  </label>
                  <input
                    type="text"
                    value={locSupervisor}
                    onChange={(e) => setLocSupervisor(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLocModalOpen(false)}
                  className="h-9 px-4 border border-neutral-300 bg-white text-neutral-700 font-semibold hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 bg-[#18181B] hover:bg-[#059669] text-white font-bold transition-colors"
                >
                  Save Storage Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
