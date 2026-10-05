"use client";

import React, { useState } from "react";
import {
  Warehouse,
  Plus,
  Layers,
  Settings as SettingsIcon,
  X,
  Edit2,
  PowerOff,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/lib/context/admin-context";
import { MaterialItem, StorageLocationItem } from "@/lib/types/admin";
import { settingsApi, PlantSettingsData } from "@/lib/api/settings";
import { describeApiError } from "@/lib/api/client";
import { Can } from "@/lib/context/auth-context";

export function MaterialsStorageView() {
  const {
    materials,
    materialsLoading,
    materialsError,
    reloadMaterials,
    addMaterial,
    updateMaterial,
    deactivateMaterial,
    storageLocations,
    storageLocationsLoading,
    storageLocationsError,
    reloadStorageLocations,
    addStorageLocation,
    updateStorageLocation,
  } = useAdmin();

  // Active view tab: "directory" (Materials & Storage) | "settings" (Plant Settings)
  const [activeTab, setActiveTab] = useState<"directory" | "settings">("directory");

  // Material Modal state
  const [isMatModalOpen, setIsMatModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialItem | null>(null);
  const [matCode, setMatCode] = useState("");
  const [matName, setMatName] = useState("");
  const [matCategory, setMatCategory] = useState<"RAW_BIOMASS" | "FINISHED_PELLET">("RAW_BIOMASS");
  const [matMoisture, setMatMoisture] = useState("12");
  const [matAsh, setMatAsh] = useState("6");
  const [matGcv, setMatGcv] = useState("4000");
  const [matForeignMatter, setMatForeignMatter] = useState("2.0");
  const [matBulkDensity, setMatBulkDensity] = useState("150");
  const [matRate, setMatRate] = useState("3500");
  const [matModalError, setMatModalError] = useState<string | null>(null);
  const [isSavingMat, setIsSavingMat] = useState(false);

  // Storage Location Modal state
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<StorageLocationItem | null>(null);
  const [locCode, setLocCode] = useState("");
  const [locName, setLocName] = useState("");
  const [locType, setLocType] = useState("Raw Material Yard");
  const [locCapacity, setLocCapacity] = useState("500");
  const [locSupervisor, setLocSupervisor] = useState("Nitin Joshi");
  const [locModalError, setLocModalError] = useState<string | null>(null);
  const [isSavingLoc, setIsSavingLoc] = useState(false);

  // Global action error banner
  const [actionError, setActionError] = useState<string | null>(null);

  // Plant Settings query
  const {
    data: settingsData,
    isLoading: settingsLoading,
    error: settingsQueryError,
  } = useQuery<PlantSettingsData>({
    queryKey: ["settings"],
    queryFn: () => settingsApi.get(),
    enabled: activeTab === "settings",
  });

  // Open modal for Create Material
  const handleOpenCreateMaterial = () => {
    setEditingMaterial(null);
    setMatCode("");
    setMatName("");
    setMatCategory("RAW_BIOMASS");
    setMatMoisture("12.0");
    setMatAsh("6.0");
    setMatGcv("4000");
    setMatForeignMatter("2.0");
    setMatBulkDensity("150");
    setMatRate("3500");
    setMatModalError(null);
    setIsMatModalOpen(true);
  };

  // Open modal for Edit Material
  const handleOpenEditMaterial = (mat: MaterialItem) => {
    setEditingMaterial(mat);
    setMatCode(mat.code || mat.id);
    setMatName(mat.name);
    setMatCategory(mat.category);
    setMatMoisture(String(mat.targetMoistureMax));
    setMatAsh(String(mat.targetAshMax));
    setMatGcv(String(mat.targetGcvMin));
    setMatForeignMatter(mat.foreignMatterMax !== null && mat.foreignMatterMax !== undefined ? String(mat.foreignMatterMax) : "2.0");
    setMatBulkDensity(mat.bulkDensityMin !== null && mat.bulkDensityMin !== undefined ? String(mat.bulkDensityMin) : "150");
    setMatRate(String(mat.baseRatePerMt));
    setMatModalError(null);
    setIsMatModalOpen(true);
  };

  // Submit Material
  const handleMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matName) return;

    setMatModalError(null);
    setIsSavingMat(true);

    try {
      if (editingMaterial) {
        await updateMaterial(
          editingMaterial.id,
          {
            name: matName,
            category: matCategory,
            unit: "MT",
            baseRatePerMt: parseFloat(matRate) || 0,
            targetMoistureMax: parseFloat(matMoisture) || 12,
            targetAshMax: parseFloat(matAsh) || 6,
            targetGcvMin: parseFloat(matGcv) || 4000,
            foreignMatterMax: matForeignMatter ? parseFloat(matForeignMatter) : null,
            bulkDensityMin: matBulkDensity ? parseFloat(matBulkDensity) : null,
          },
          editingMaterial.version,
        );
      } else {
        const cleanCode = matCode.trim().toUpperCase() || matName.slice(0, 3).toUpperCase();
        await addMaterial({
          code: cleanCode,
          name: matName,
          category: matCategory,
          unit: "MT",
          baseRatePerMt: parseFloat(matRate) || 0,
          targetMoistureMax: parseFloat(matMoisture) || 12,
          targetAshMax: parseFloat(matAsh) || 6,
          targetGcvMin: parseFloat(matGcv) || 4000,
          foreignMatterMax: matForeignMatter ? parseFloat(matForeignMatter) : null,
          bulkDensityMin: matBulkDensity ? parseFloat(matBulkDensity) : null,
          isActive: true,
        });
      }

      setIsMatModalOpen(false);
      setEditingMaterial(null);
    } catch (err: unknown) {
      setMatModalError(
        describeApiError(err, "Could not save material. Please check details and try again."),
      );
    } finally {
      setIsSavingMat(false);
    }
  };

  // Deactivate Material
  const handleDeactivateMaterial = async (mat: MaterialItem) => {
    if (!confirm(`Are you sure you want to deactivate ${mat.name}?`)) return;
    setActionError(null);
    try {
      await deactivateMaterial(mat.id, mat.version);
    } catch (err: unknown) {
      setActionError(
        describeApiError(err, "Could not deactivate material. Reload and try again."),
      );
    }
  };

  // Open modal for Create Location
  const handleOpenCreateLocation = () => {
    setEditingLocation(null);
    setLocCode("");
    setLocName("");
    setLocType("Raw Material Yard");
    setLocCapacity("500");
    setLocSupervisor("Nitin Joshi");
    setLocModalError(null);
    setIsLocModalOpen(true);
  };

  // Open modal for Edit Location
  const handleOpenEditLocation = (loc: StorageLocationItem) => {
    setEditingLocation(loc);
    setLocCode(loc.code || loc.id);
    setLocName(loc.name);
    setLocType(loc.type);
    setLocCapacity(String(loc.capacityMt));
    setLocSupervisor(loc.supervisorName);
    setLocModalError(null);
    setIsLocModalOpen(true);
  };

  // Submit Location
  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locName) return;

    setLocModalError(null);
    setIsSavingLoc(true);

    try {
      if (editingLocation) {
        await updateStorageLocation(
          editingLocation.id,
          {
            name: locName,
            type: locType,
            capacityMt: parseFloat(locCapacity) || 500,
            supervisorName: locSupervisor,
          },
          editingLocation.version,
        );
      } else {
        await addStorageLocation({
          code: locCode.trim().toUpperCase() || undefined,
          name: locName,
          type: locType,
          capacityMt: parseFloat(locCapacity) || 500,
          supervisorName: locSupervisor,
          isActive: true,
        });
      }

      setIsLocModalOpen(false);
      setEditingLocation(null);
    } catch (err: unknown) {
      setLocModalError(
        describeApiError(err, "Could not save storage location. Check input and try again."),
      );
    } finally {
      setIsSavingLoc(false);
    }
  };


  return (
    <div className="space-y-6 select-none">
      {/* Top Executive Header */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            Materials &amp; Storage Locations
          </h1>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => setActiveTab("directory")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                activeTab === "directory"
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              Materials &amp; Bays
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border ${
                activeTab === "settings"
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Plant Settings</span>
            </button>
          </div>
        </div>

        {/* Action Buttons: Visible when activeTab === 'directory' */}
        {activeTab === "directory" && (
          <div className="hidden sm:flex items-center gap-3">
            <Can perm="masters:manage">
              <button
                type="button"
                onClick={handleOpenCreateMaterial}
                className="h-10 px-4 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#059669]" />
                <span>Add Material</span>
              </button>
              <button
                type="button"
                onClick={handleOpenCreateLocation}
                className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                <span>Add Storage Location</span>
              </button>
            </Can>
          </div>
        )}
      </div>

      {/* Action Error Banner */}
      {actionError && (
        <div className="p-3.5 bg-red-50 border border-red-300 text-red-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-red-500 hover:text-red-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: DIRECTORY */}
      {activeTab === "directory" && (
        <>
          {/* Mobile Action Stack */}
          <div className="sm:hidden flex flex-col items-stretch gap-2.5 w-full">
            <Can perm="masters:manage">
              <button
                type="button"
                onClick={handleOpenCreateMaterial}
                className="h-11 px-4 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer w-full"
              >
                <Plus className="w-4 h-4 text-[#059669]" />
                <span>Add Material</span>
              </button>

              <button
                type="button"
                onClick={handleOpenCreateLocation}
                className="h-11 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs w-full"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                <span>Add Storage Location</span>
              </button>
            </Can>
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
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-500 font-mono">
                  {materials.length} Materials Configured
                </span>
                <button
                  type="button"
                  onClick={() => reloadMaterials()}
                  title="Reload materials"
                  className="p-1 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Error State */}
            {materialsError && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{materialsError}</span>
              </div>
            )}

            {/* Loading State */}
            {materialsLoading ? (
              <div className="p-8 text-center text-xs text-neutral-500 border border-neutral-300 animate-pulse">
                Loading materials directory...
              </div>
            ) : materials.length === 0 ? (
              /* Empty State */
              <div className="p-8 text-center border border-dashed border-neutral-300 space-y-2">
                <Layers className="w-8 h-8 text-neutral-400 mx-auto" />
                <p className="text-xs font-semibold text-neutral-700">No materials registered yet.</p>
                <p className="text-[11px] text-neutral-500">
                  Click &apos;Add Material&apos; above to configure your plant&apos;s biomass inventory.
                </p>
              </div>
            ) : (
              <>
                {/* Mobile responsive cards */}
                <div className="grid grid-cols-1 sm:hidden gap-3">
                  {materials.map((mat) => (
                    <div
                      key={mat.id}
                      className="bg-white/40 border border-neutral-300 p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono font-bold text-xs text-neutral-500">
                            {mat.code || mat.id}
                          </span>
                          <h3 className="font-bold text-sm text-neutral-900">{mat.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${
                              mat.category === "FINISHED_PELLET"
                                ? "bg-[#18181B] text-white border-[#18181B]"
                                : "bg-emerald-50 text-[#047857] border-emerald-300"
                            }`}
                          >
                            {mat.category === "FINISHED_PELLET" ? "Finished Goods" : "Raw Biomass"}
                          </span>
                          <Can perm="masters:manage">
                            <button
                              type="button"
                              onClick={() => handleOpenEditMaterial(mat)}
                              className="p-1 text-neutral-600 hover:text-neutral-900 border border-neutral-300 bg-white"
                              title="Edit material"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {mat.isActive && (
                              <button
                                type="button"
                                onClick={() => handleDeactivateMaterial(mat)}
                                className="p-1 text-red-600 hover:text-red-900 border border-red-300 bg-white"
                                title="Deactivate material"
                              >
                                <PowerOff className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </Can>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs border-y border-neutral-200 py-2 font-mono">
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Moisture</span>
                          <span className="font-bold text-neutral-900">
                            &le; {mat.targetMoistureMax.toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Ash</span>
                          <span className="font-bold text-neutral-900">
                            &le; {mat.targetAshMax.toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Min GCV</span>
                          <span className="font-bold text-neutral-900">&ge; {mat.targetGcvMin}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Base Rate</span>
                          <span className="font-mono font-bold text-[#059669]">
                            ₹{mat.baseRatePerMt.toLocaleString("en-IN")} / MT
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-neutral-500 block">Status</span>
                          <span
                            className={`font-mono text-[10px] font-bold uppercase ${
                              mat.isActive ? "text-[#059669]" : "text-neutral-400"
                            }`}
                          >
                            {mat.isActive ? "Active" : "Inactive"}
                          </span>
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
                        <th className="py-3 px-4">Code</th>
                        <th className="py-3 px-4">Material Name</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4 text-center">Max Moisture %</th>
                        <th className="py-3 px-4 text-center">Max Ash %</th>
                        <th className="py-3 px-4 text-center">Min GCV (kcal/kg)</th>
                        <th className="py-3 px-4 text-right">Base Rate / MT</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-300 bg-transparent">
                      {materials.map((mat) => (
                        <tr key={mat.id} className="hover:bg-neutral-200/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-xs text-neutral-900">
                            {mat.code || mat.id}
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
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase border ${
                                mat.isActive
                                  ? "bg-emerald-50 text-[#047857] border-emerald-200"
                                  : "bg-neutral-100 text-neutral-500 border-neutral-300"
                              }`}
                            >
                              {mat.isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Can perm="masters:manage">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditMaterial(mat)}
                                  className="px-2 py-1 text-[11px] font-medium border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 transition-colors cursor-pointer"
                                  title="Edit material"
                                >
                                  Edit
                                </button>
                                {mat.isActive && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeactivateMaterial(mat)}
                                    className="px-2 py-1 text-[11px] font-medium border border-red-300 bg-white hover:bg-red-50 text-red-700 transition-colors cursor-pointer"
                                    title="Deactivate material"
                                  >
                                    Deactivate
                                  </button>
                                )}
                              </div>
                            </Can>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
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
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-500 font-mono">
                  {storageLocations.length} Physical Bays
                </span>
                <button
                  type="button"
                  onClick={() => reloadStorageLocations()}
                  title="Reload locations"
                  className="p-1 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Error State */}
            {storageLocationsError && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{storageLocationsError}</span>
              </div>
            )}

            {/* Loading State */}
            {storageLocationsLoading ? (
              <div className="p-8 text-center text-xs text-neutral-500 border border-neutral-300 animate-pulse">
                Loading physical storage bays...
              </div>
            ) : storageLocations.length === 0 ? (
              /* Empty State */
              <div className="p-8 text-center border border-dashed border-neutral-300 space-y-2">
                <Warehouse className="w-8 h-8 text-neutral-400 mx-auto" />
                <p className="text-xs font-semibold text-neutral-700">No storage locations configured yet.</p>
                <p className="text-[11px] text-neutral-500">
                  Click &apos;Add Storage Location&apos; above to configure yards, warehouses, and quarantine bays.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {storageLocations.map((loc) => {
                  const utilization = loc.capacityMt > 0 ? (loc.currentStockMt / loc.capacityMt) * 100 : 0;
                  return (
                    <div
                      key={loc.id}
                      className="bg-white/40 border border-neutral-300 hover:border-neutral-900 transition-all p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono font-bold text-[11px] text-neutral-500">
                            {loc.code || loc.id}
                          </span>
                          <h3 className="font-bold text-sm text-neutral-900 leading-tight">
                            {loc.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 border border-neutral-300 bg-neutral-100 text-neutral-700">
                            {loc.displayType || loc.type}
                          </span>
                          <Can perm="masters:manage">
                            <button
                              type="button"
                              onClick={() => handleOpenEditLocation(loc)}
                              className="p-1 text-neutral-600 hover:text-neutral-900 border border-neutral-300 bg-white"
                              title="Edit location"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </Can>
                        </div>
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
            )}
          </section>
        </>
      )}

      {/* TAB 2: PLANT SETTINGS */}
      {activeTab === "settings" && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4 text-[#059669]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Plant Operating Thresholds &amp; Default Tolerances
              </h2>
            </div>
            <span className="text-[11px] text-neutral-500">
              Per-plant typed settings registry
            </span>
          </div>

          {settingsLoading ? (
            <div className="p-8 text-center text-xs text-neutral-500 border border-neutral-300 animate-pulse">
              Loading plant settings...
            </div>
          ) : settingsQueryError ? (
            <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs">
              {describeApiError(settingsQueryError, "Could not load settings.")}
            </div>
          ) : (
            <PlantSettingsSection
              key={JSON.stringify(settingsData)}
              settingsData={settingsData}
            />
          )}
        </section>
      )}

      {/* Add / Edit Material Modal */}
      {isMatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                {editingMaterial ? "Edit Biomass Material Spec" : "Register Biomass Material Spec"}
              </h3>
              <button
                type="button"
                onClick={() => setIsMatModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {matModalError && (
              <div role="alert" className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{matModalError}</span>
              </div>
            )}

            <form onSubmit={handleMaterialSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingMaterial}
                    placeholder="e.g. GS, CS"
                    value={matCode}
                    onChange={(e) => setMatCode(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669] disabled:bg-neutral-100 font-mono uppercase"
                  />
                </div>
                <div className="col-span-2">
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
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Category *
                </label>
                <select
                  value={matCategory}
                  onChange={(e) => setMatCategory(e.target.value as "RAW_BIOMASS" | "FINISHED_PELLET")}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Foreign Matter Max %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={matForeignMatter}
                    onChange={(e) => setMatForeignMatter(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Bulk Density Min (kg/m³)
                  </label>
                  <input
                    type="number"
                    value={matBulkDensity}
                    onChange={(e) => setMatBulkDensity(e.target.value)}
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
                  className="h-9 px-4 border border-neutral-300 bg-white text-neutral-700 font-semibold hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingMat}
                  className="h-9 px-4 bg-[#18181B] hover:bg-[#059669] text-white font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSavingMat ? "Saving..." : editingMaterial ? "Update Material" : "Save Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Location Modal */}
      {isLocModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                {editingLocation ? "Edit Storage Location" : "Register Storage Location"}
              </h3>
              <button
                type="button"
                onClick={() => setIsLocModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {locModalError && (
              <div role="alert" className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{locModalError}</span>
              </div>
            )}

            <form onSubmit={handleLocationSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    disabled={!!editingLocation}
                    placeholder="e.g. LOC-01"
                    value={locCode}
                    onChange={(e) => setLocCode(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669] disabled:bg-neutral-100 font-mono uppercase"
                  />
                </div>
                <div className="col-span-2">
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Storage Type *
                  </label>
                  <select
                    value={locType}
                    onChange={(e) => setLocType(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="Raw Material Yard">Raw Material Yard</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Shed">Shed</option>
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
                    min="1"
                    value={locCapacity}
                    onChange={(e) => setLocCapacity(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
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

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLocModalOpen(false)}
                  className="h-9 px-4 border border-neutral-300 bg-white text-neutral-700 font-semibold hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingLoc}
                  className="h-9 px-4 bg-[#18181B] hover:bg-[#059669] text-white font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSavingLoc ? "Saving..." : editingLocation ? "Update Location" : "Save Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PlantSettingsSection({
  settingsData,
}: {
  settingsData: PlantSettingsData | undefined;
}) {
  const queryClient = useQueryClient();
  const [purchasePrice, setPurchasePrice] = useState<string>(() =>
    settingsData?.approval_thresholds?.purchasePricePaiseMax != null
      ? String(Math.round(settingsData.approval_thresholds.purchasePricePaiseMax / 100))
      : "5000",
  );
  const [expense, setExpense] = useState<string>(() =>
    settingsData?.approval_thresholds?.expensePaiseMax != null
      ? String(Math.round(settingsData.approval_thresholds.expensePaiseMax / 100))
      : "50000",
  );
  const [creditLimit, setCreditLimit] = useState<string>(() =>
    settingsData?.approval_thresholds?.creditLimitInrMax != null
      ? String(settingsData.approval_thresholds.creditLimitInrMax)
      : "2000000",
  );
  const [weightAdj, setWeightAdj] = useState<string>(() =>
    settingsData?.approval_thresholds?.weightAdjustmentKgMax != null
      ? String(settingsData.approval_thresholds.weightAdjustmentKgMax)
      : "500",
  );
  const [moisture, setMoisture] = useState<string>(() =>
    settingsData?.default_qc_tolerances?.moistureMax != null
      ? String(settingsData.default_qc_tolerances.moistureMax)
      : "12.0",
  );
  const [ash, setAsh] = useState<string>(() =>
    settingsData?.default_qc_tolerances?.ashMax != null
      ? String(settingsData.default_qc_tolerances.ashMax)
      : "6.0",
  );
  const [gcv, setGcv] = useState<string>(() =>
    settingsData?.default_qc_tolerances?.gcvMin != null
      ? String(settingsData.default_qc_tolerances.gcvMin)
      : "4000",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setIsSuccess(false);
    setIsSaving(true);

    try {
      const purchasePricePaise = Math.round((parseFloat(purchasePrice) || 0) * 100);
      const expensePaise = Math.round((parseFloat(expense) || 0) * 100);
      const creditLimitInr = parseFloat(creditLimit) || 0;
      const weightAdjustmentKg = parseFloat(weightAdj) || 0;

      await settingsApi.update({
        approval_thresholds: {
          purchasePricePaiseMax: purchasePricePaise,
          expensePaiseMax: expensePaise,
          creditLimitInrMax: creditLimitInr,
          weightAdjustmentKgMax: weightAdjustmentKg,
        },
        default_qc_tolerances: {
          moistureMax: parseFloat(moisture) || 12.0,
          ashMax: parseFloat(ash) || 6.0,
          gcvMin: parseFloat(gcv) || 4000,
        },
      });

      await queryClient.invalidateQueries({ queryKey: ["settings"] });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 4000);
    } catch (err: unknown) {
      setSaveError(
        describeApiError(err, "Could not update plant settings. Try again."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {isSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-[#047857] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          <span>Plant settings successfully saved.</span>
        </div>
      )}

      {saveError && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Approval Thresholds */}
      <div className="border border-neutral-300 p-5 bg-white space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-2">
          Managerial Approval Thresholds
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Max Purchase Price (₹ / MT)
            </label>
            <input
              type="number"
              required
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
            />
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Purchases exceeding this rate trigger price escalation approval.
            </span>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Max Operational Expense (₹)
            </label>
            <input
              type="number"
              required
              value={expense}
              onChange={(e) => setExpense(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
            />
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Direct voucher expenses above this value require manager approval.
            </span>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Max Credit Sale Limit (₹)
            </label>
            <input
              type="number"
              required
              value={creditLimit}
              onChange={(e) => setCreditLimit(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
            />
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Customer credit sales exceeding this balance trigger review.
            </span>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Max Weight Adjustment (kg)
            </label>
            <input
              type="number"
              required
              value={weightAdj}
              onChange={(e) => setWeightAdj(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
            />
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Tare/Gross scale adjustments greater than this require authorization.
            </span>
          </div>
        </div>
      </div>

      {/* Default Quality Control Tolerances */}
      <div className="border border-neutral-300 p-5 bg-white space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-2">
          Default Quality Control Tolerances
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Default Max Moisture %
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={moisture}
              onChange={(e) => setMoisture(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Default Max Ash %
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={ash}
              onChange={(e) => setAsh(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Default Min GCV (kcal/kg)
            </label>
            <input
              type="number"
              required
              value={gcv}
              onChange={(e) => setGcv(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
            />
          </div>
        </div>
      </div>

      <Can perm="settings:manage">
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="submit"
            disabled={isSaving}
            className="h-10 px-6 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSaving ? "Saving Settings..." : "Save Plant Settings"}
          </button>
        </div>
      </Can>
    </form>
  );
}

