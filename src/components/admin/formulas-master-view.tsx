"use client";

import React, { useState, useId } from "react";
import {
  Layers,
  Plus,
  Flame,
  CheckCircle2,
  X,
  History,
  Calculator,
  LayoutGrid,
  Table as TableIcon,
  Search,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  formulasApi,
  FormulaItem,
  CreateFormulaInput,
  FormulaRequirementResult,
} from "@/lib/api/formulas";
import { materialsApi } from "@/lib/api/materials";
import { productsApi } from "@/lib/api/products";
import { usePlantEvents } from "@/lib/api/realtime";
import { describeApiError } from "@/lib/api/client";
import { Can } from "@/lib/context/auth-context";

interface FormIngredientRow {
  materialId: string;
  percentage: string;
}

export function FormulasMasterView() {
  const queryClient = useQueryClient();
  const searchInputId = useId();
  const calcTargetMtId = useId();
  const formNameId = useId();
  const formProductIdId = useId();
  const formGcvMinId = useId();
  const formAshMaxId = useId();
  const formNotesId = useId();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "ARCHIVED" | "ALL">("ACTIVE");

  // Create / Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFormula, setEditingFormula] = useState<FormulaItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formProductId, setFormProductId] = useState("");
  const [formGcvMin, setFormGcvMin] = useState("4100");
  const [formAshMax, setFormAshMax] = useState("6.0");
  const [formNotes, setFormNotes] = useState("");
  const [ingredientRows, setIngredientRows] = useState<FormIngredientRow[]>([
    { materialId: "", percentage: "50" },
    { materialId: "", percentage: "50" },
  ]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Version History Drawer
  const [historyFormula, setHistoryFormula] = useState<FormulaItem | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Requirement Calculator Drawer
  const [calcFormula, setCalcFormula] = useState<FormulaItem | null>(null);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [calcTargetMt, setCalcTargetMt] = useState("100");

  // Invalidate queries on live events
  usePlantEvents(["formula.*", "formulas.*"], () => {
    void queryClient.invalidateQueries({ queryKey: ["formulas"] });
  });

  // Queries
  const { data: formulas = [], isLoading: isLoadingFormulas } = useQuery({
    queryKey: ["formulas", { status: statusFilter }],
    queryFn: () => formulasApi.list({ status: statusFilter }),
  });

  const { data: materials = [] } = useQuery({
    queryKey: ["materials"],
    queryFn: () => materialsApi.list(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.list({ isActive: true }),
  });

  // Versions query
  const { data: formulaVersions = [], isLoading: isLoadingVersions } = useQuery({
    queryKey: ["formulas", historyFormula?.id, "versions"],
    queryFn: () => (historyFormula ? formulasApi.getVersions(historyFormula.id) : Promise.resolve([])),
    enabled: !!historyFormula && isHistoryOpen,
  });

  // Requirement query
  const targetMtNum = Math.max(0.1, parseFloat(calcTargetMt) || 100);
  const { data: calcResult, isLoading: isLoadingCalc } = useQuery<FormulaRequirementResult>({
    queryKey: ["formulas", calcFormula?.id, "requirement", targetMtNum],
    queryFn: () => (calcFormula ? formulasApi.getRequirement(calcFormula.id, targetMtNum) : Promise.reject()),
    enabled: !!calcFormula && isCalcOpen && targetMtNum > 0,
  });

  // Calculate live ingredient sum for validation
  const ingredientSum = ingredientRows.reduce((acc, row) => {
    const p = parseFloat(row.percentage);
    return acc + (isNaN(p) ? 0 : p);
  }, 0);

  const roundedSum = Math.round(ingredientSum * 1000) / 1000;
  const isExact100 = Math.abs(roundedSum - 100) <= 0.01;
  const differenceFrom100 = Math.round((100 - roundedSum) * 1000) / 1000;

  // Filter formulas by search
  const filteredFormulas = formulas.filter((f) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      f.code.toLowerCase().includes(q) ||
      f.name.toLowerCase().includes(q) ||
      f.targetProductName.toLowerCase().includes(q) ||
      (f.notes && f.notes.toLowerCase().includes(q))
    );
  });

  // Open modal for new formula
  const handleOpenCreate = () => {
    setEditingFormula(null);
    setFormName("");
    setFormProductId(products[0]?.id || "");
    setFormGcvMin("4100");
    setFormAshMax("6.0");
    setFormNotes("");
    if (materials.length >= 2) {
      setIngredientRows([
        { materialId: materials[0].id, percentage: "60" },
        { materialId: materials[1].id, percentage: "40" },
      ]);
    } else {
      setIngredientRows([
        { materialId: "", percentage: "50" },
        { materialId: "", percentage: "50" },
      ]);
    }
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for editing formula
  const handleOpenEdit = (formula: FormulaItem) => {
    setEditingFormula(formula);
    setFormName(formula.name);
    setFormProductId(formula.targetProductId);
    setFormGcvMin(String(formula.targetGcvMin));
    setFormAshMax(String(formula.targetAshMax));
    setFormNotes(formula.notes || "");
    setIngredientRows(
      formula.ingredients.map((ing) => ({
        materialId: ing.materialId,
        percentage: String(ing.percentage),
      })),
    );
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Version History Drawer
  const handleOpenHistory = (formula: FormulaItem) => {
    setHistoryFormula(formula);
    setIsHistoryOpen(true);
  };

  // Open Requirement Calculator
  const handleOpenCalc = (formula: FormulaItem) => {
    setCalcFormula(formula);
    setCalcTargetMt("100");
    setIsCalcOpen(true);
  };

  // Add ingredient row
  const handleAddIngredient = () => {
    const unusedMat = materials.find((m) => !ingredientRows.some((r) => r.materialId === m.id));
    setIngredientRows([
      ...ingredientRows,
      { materialId: unusedMat?.id || materials[0]?.id || "", percentage: "0" },
    ]);
  };

  // Remove ingredient row
  const handleRemoveIngredient = (index: number) => {
    if (ingredientRows.length <= 1) return;
    setIngredientRows(ingredientRows.filter((_, i) => i !== index));
  };

  // Update ingredient row
  const handleUpdateIngredient = (index: number, field: "materialId" | "percentage", value: string) => {
    const updated = [...ingredientRows];
    updated[index] = { ...updated[index], [field]: value };
    setIngredientRows(updated);
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formProductId) {
      setFormError("Formula name and target product are required.");
      return;
    }

    if (!isExact100) {
      setFormError(`Ingredient percentages must sum to exactly 100% (currently ${roundedSum}%).`);
      return;
    }

    const payloadIngredients = ingredientRows.map((r) => ({
      materialId: r.materialId,
      percentage: parseFloat(r.percentage) || 0,
    }));

    if (payloadIngredients.some((i) => !i.materialId || i.percentage <= 0)) {
      setFormError("All ingredient rows must have a valid material and a percentage greater than 0.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      if (editingFormula) {
        await formulasApi.update(
          editingFormula.id,
          {
            name: formName.trim(),
            targetProductId: formProductId,
            targetGcvMin: parseFloat(formGcvMin) || 0,
            targetAshMax: parseFloat(formAshMax) || 0,
            notes: formNotes.trim() || null,
            ingredients: payloadIngredients,
            version: editingFormula.version,
          },
          editingFormula.version,
        );
      } else {
        const input: CreateFormulaInput = {
          name: formName.trim(),
          targetProductId: formProductId,
          targetGcvMin: parseFloat(formGcvMin) || 0,
          targetAshMax: parseFloat(formAshMax) || 0,
          notes: formNotes.trim() || null,
          ingredients: payloadIngredients,
        };
        await formulasApi.create(input);
      }

      await queryClient.invalidateQueries({ queryKey: ["formulas"] });
      setIsModalOpen(false);
    } catch (err) {
      const msg = describeApiError(err, "Failed to save formula");
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* 1. COMPACT COMMAND HEADER */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
              Biomass Blend Formulas
            </h1>
            <span className="text-xs font-bold font-mono px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
              {filteredFormulas.length}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Production recipes with 100% balanced biomass compositions, target calorific ratings, and version history.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Dual View Switcher (Desktop) */}
          <div className="hidden sm:inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`px-3 py-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "cards"
                  ? "bg-[#18181B] text-white font-semibold"
                  : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#18181B] text-white font-semibold"
                  : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <Can perm="masters:manage">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span>Create New Formula</span>
            </button>
          </Can>
        </div>
      </div>

      {/* 2. FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-100/60 p-3 border border-neutral-300">
        <div className="relative flex-1 max-w-md">
          <label htmlFor={searchInputId} className="sr-only">Search formulas</label>
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            id={searchInputId}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code, formula name, product..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-neutral-300 focus:outline-none focus:border-[#059669]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase text-neutral-600">Status:</span>
          {(["ACTIVE", "ARCHIVED", "ALL"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-xs font-semibold cursor-pointer border transition-colors ${
                statusFilter === st
                  ? "bg-[#18181B] text-white border-[#18181B]"
                  : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CONTENT DISPLAY */}
      {isLoadingFormulas ? (
        <div className="p-12 text-center text-xs text-neutral-500 border border-neutral-300 bg-neutral-50">
          Loading blend formulas...
        </div>
      ) : filteredFormulas.length === 0 ? (
        <div className="p-12 text-center space-y-3 border border-neutral-300 bg-white/40">
          <Layers className="w-8 h-8 mx-auto text-neutral-400" />
          <div className="text-sm font-bold text-neutral-800">No blend formulas found</div>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {searchQuery
              ? "No formulas matched your search criteria."
              : "Create your first production recipe to configure material blends."}
          </p>
          <Can perm="masters:manage">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="mt-2 h-9 px-4 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Formula</span>
            </button>
          </Can>
        </div>
      ) : viewMode === "cards" ? (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredFormulas.map((formula) => (
            <div
              key={formula.id}
              className="bg-white/40 border border-neutral-300 p-5 space-y-4 hover:border-neutral-900 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
                        {formula.code}
                      </span>
                      <span className="font-mono text-xs font-bold text-neutral-500">
                        v{formula.versionNo}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-neutral-900 leading-tight mt-1.5">
                      {formula.name}
                    </h3>
                    <span className="text-xs text-neutral-600 font-medium block mt-0.5">
                      Target Product: <strong className="text-neutral-800">{formula.targetProductName}</strong>
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 shrink-0 ${
                      formula.status === "ACTIVE"
                        ? "bg-emerald-50 text-[#047857] border border-emerald-300"
                        : "bg-neutral-200 text-neutral-600 border border-neutral-300"
                    }`}
                  >
                    {formula.status === "ACTIVE" ? "ACTIVE RECIPE" : "ARCHIVED"}
                  </span>
                </div>

                {/* Target Specs */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 border border-neutral-200 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-semibold block">
                      Target GCV (Min)
                    </span>
                    <span className="font-mono font-bold text-sm text-neutral-900 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
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

                {/* Composition */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                    <span>Recipe Composition</span>
                    <span className="text-[#059669]">Total: 100%</span>
                  </div>

                  <div className="space-y-2">
                    {formula.ingredients.map((ing, idx) => (
                      <div key={ing.materialId || idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-neutral-800">
                            {ing.materialName || ing.materialCode}
                          </span>
                          <span className="font-mono font-bold text-neutral-900">
                            {ing.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 h-2 overflow-hidden">
                          <div
                            className={`h-full ${
                              idx === 0
                                ? "bg-[#059669]"
                                : idx === 1
                                ? "bg-neutral-800"
                                : idx === 2
                                ? "bg-amber-600"
                                : "bg-neutral-500"
                            }`}
                            style={{ width: `${Math.min(100, ing.percentage)}%` }}
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
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenCalc(formula)}
                    className="px-2.5 py-1 text-xs font-semibold border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Calculate required biomass quantities for target MT"
                  >
                    <Calculator className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Calculator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenHistory(formula)}
                    className="px-2.5 py-1 text-xs font-semibold border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <History className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Versions</span>
                  </button>
                </div>

                <Can perm="masters:manage">
                  {formula.status === "ACTIVE" && (
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(formula)}
                      className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-neutral-900 hover:bg-neutral-800 text-white cursor-pointer"
                    >
                      Edit Formula
                    </button>
                  )}
                </Can>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW (Transparent Industrial Table) */
        <div className="border border-neutral-300 overflow-x-auto bg-transparent">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Code / Ver</th>
                <th className="py-2.5 px-3">Formula Name</th>
                <th className="py-2.5 px-3">Target Product</th>
                <th className="py-2.5 px-3 text-right">GCV Min</th>
                <th className="py-2.5 px-3 text-right">Ash Max</th>
                <th className="py-2.5 px-3">Composition</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300">
              {filteredFormulas.map((formula) => (
                <tr
                  key={formula.id}
                  className="hover:bg-neutral-200/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-neutral-900">
                      {formula.code}
                    </span>
                    <span className="ml-1.5 text-[11px] font-mono font-semibold text-neutral-500">
                      v{formula.versionNo}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-neutral-900">
                    {formula.name}
                  </td>
                  <td className="py-3 px-3 text-neutral-700">
                    {formula.targetProductName}
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums text-right text-neutral-900 font-medium">
                    {formula.targetGcvMin} kcal
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums text-right text-neutral-900 font-medium">
                    {formula.targetAshMax}%
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {formula.ingredients.map((ing, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-100 border border-neutral-300 text-neutral-800"
                        >
                          {ing.materialCode || ing.materialName}: {ing.percentage}%
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                        formula.status === "ACTIVE"
                          ? "bg-emerald-50 text-[#047857] border border-emerald-300"
                          : "bg-neutral-200 text-neutral-600 border border-neutral-300"
                      }`}
                    >
                      {formula.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenCalc(formula)}
                        className="px-2 py-1 text-xs border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700"
                        title="Requirement Calculator"
                      >
                        <Calculator className="w-3.5 h-3.5 text-[#059669]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenHistory(formula)}
                        className="px-2 py-1 text-xs border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700"
                        title="Version History"
                      >
                        <History className="w-3.5 h-3.5 text-neutral-500" />
                      </button>
                      <Can perm="masters:manage">
                        {formula.status === "ACTIVE" && (
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(formula)}
                            className="px-2.5 py-1 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white"
                          >
                            Edit
                          </button>
                        )}
                      </Can>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. CREATE / EDIT FORMULA MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-neutral-300 w-full max-w-2xl p-6 space-y-5 my-8 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-300">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#059669]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  {editingFormula
                    ? `Update Blend Formula (${editingFormula.code} v${editingFormula.versionNo})`
                    : "Create Biomass Blend Formula"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editingFormula && (
              <div className="p-3 bg-amber-50 border border-amber-300 text-xs text-amber-900 leading-relaxed">
                <strong>Versioning Notice:</strong> Editing an active formula preserves the current version (v{editingFormula.versionNo}) in the historical recipe archive and creates a <strong>new version (v{editingFormula.versionNo + 1})</strong> so past production batches maintain traceability.
              </div>
            )}

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-300 text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={formNameId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Formula Name *
                  </label>
                  <input
                    id={formNameId}
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Standard 8mm Industrial Pellet Blend"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label htmlFor={formProductIdId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Target Output Product *
                  </label>
                  <select
                    id={formProductIdId}
                    required
                    value={formProductId}
                    onChange={(e) => setFormProductId(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="">Select Target Product...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code} - {p.name} ({p.diameterMm}mm)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={formGcvMinId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Target GCV Min (kcal/kg) *
                  </label>
                  <input
                    id={formGcvMinId}
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formGcvMin}
                    onChange={(e) => setFormGcvMin(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label htmlFor={formAshMaxId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Target Ash Max (%) *
                  </label>
                  <input
                    id={formAshMaxId}
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    value={formAshMax}
                    onChange={(e) => setFormAshMax(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* INGREDIENTS COMPOSITION */}
              <div className="pt-3 border-t border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                    Material Ingredients (Must sum to exactly 100%)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="px-2.5 py-1 text-xs font-semibold border border-neutral-300 hover:bg-neutral-100 text-neutral-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Add Ingredient</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {ingredientRows.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-neutral-50 p-2.5 border border-neutral-200">
                      <div className="flex-1">
                        <select
                          value={row.materialId}
                          onChange={(e) => handleUpdateIngredient(idx, "materialId", e.target.value)}
                          className="w-full h-9 px-2.5 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                        >
                          <option value="">Select Biomass Material...</option>
                          {materials.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.code} - {m.name} ({m.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-32 flex items-center gap-1">
                        <input
                          type="number"
                          step="0.001"
                          min="0"
                          max="100"
                          value={row.percentage}
                          onChange={(e) => handleUpdateIngredient(idx, "percentage", e.target.value)}
                          placeholder="0.000"
                          className="w-full h-9 px-2.5 text-right font-mono text-xs font-bold bg-white border border-neutral-300 focus:outline-none focus:border-[#059669]"
                        />
                        <span className="text-xs font-bold text-neutral-500">%</span>
                      </div>

                      <button
                        type="button"
                        disabled={ingredientRows.length <= 1}
                        onClick={() => handleRemoveIngredient(idx)}
                        className="p-2 text-neutral-400 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Remove Ingredient"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* LIVE 100% TOTAL INDICATOR */}
                <div
                  className={`p-3 border flex items-center justify-between transition-colors ${
                    isExact100
                      ? "bg-emerald-50 border-emerald-300 text-[#047857]"
                      : roundedSum > 100
                      ? "bg-rose-50 border-rose-300 text-rose-800"
                      : "bg-amber-50 border-amber-300 text-amber-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isExact100 ? (
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                    )}
                    <span className="text-xs font-bold">
                      {isExact100
                        ? "Recipe Composition is balanced (100.000%)"
                        : roundedSum > 100
                        ? `Composition is ${differenceFrom100.toFixed(3).replace("-", "")}% over 100%`
                        : `Composition needs ${differenceFrom100.toFixed(3)}% more to reach 100%`}
                    </span>
                  </div>

                  <div className="font-mono font-black text-sm">
                    Total: {roundedSum.toFixed(3)}%
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor={formNotesId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Notes / Recipe Instructions
                </label>
                <textarea
                  id={formNotesId}
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Optional recipe notes, drying temperature suggestions, moisture guidelines..."
                  className="w-full min-h-[56px] p-3 text-xs leading-relaxed resize-none bg-white border border-neutral-300 focus:outline-none focus:border-[#059669]"
                />
              </div>

              {/* Form Action Footer */}
              <div className="mt-6 pt-4 border-t border-neutral-300 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-5 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!isExact100 || isSubmitting}
                  className={`h-10 px-6 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs ${
                    isExact100 && !isSubmitting
                      ? "bg-[#059669] hover:bg-[#047857]"
                      : "bg-neutral-400 cursor-not-allowed"
                  }`}
                  title={!isExact100 ? "Ingredient percentages must sum to exactly 100%" : ""}
                >
                  {isSubmitting ? (
                    <span>Saving...</span>
                  ) : (
                    <span>{editingFormula ? "Save New Version" : "Create Formula"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. VERSION HISTORY DRAWER */}
      {isHistoryOpen && historyFormula && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white border-l border-neutral-300 w-full max-w-lg h-full overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-300">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#059669]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Version History: {historyFormula.code}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-neutral-600">
              Complete recipe lineage for <strong>{historyFormula.name}</strong>. Older versions are archived to maintain past production batch integrity.
            </div>

            {isLoadingVersions ? (
              <div className="p-8 text-center text-xs text-neutral-500">Loading version records...</div>
            ) : (
              <div className="space-y-4">
                {formulaVersions.map((ver) => (
                  <div
                    key={ver.id}
                    className={`p-4 border space-y-3 ${
                      ver.status === "ACTIVE"
                        ? "bg-emerald-50/40 border-emerald-300"
                        : "bg-neutral-50 border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-900">
                          v{ver.versionNo}
                        </span>
                        <span className="font-bold text-xs text-neutral-900">{ver.name}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                          ver.status === "ACTIVE"
                            ? "bg-[#059669] text-white"
                            : "bg-neutral-200 text-neutral-600 border border-neutral-300"
                        }`}
                      >
                        {ver.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 border border-neutral-200">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block">GCV Min</span>
                        <span className="font-mono font-bold text-neutral-900">{ver.targetGcvMin} kcal</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block">Ash Max</span>
                        <span className="font-mono font-bold text-neutral-900">&le; {ver.targetAshMax}%</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block">
                        Composition
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {ver.ingredients.map((ing, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs font-mono bg-white border border-neutral-300 text-neutral-800"
                          >
                            {ing.materialCode || ing.materialName}: <strong>{ing.percentage}%</strong>
                          </span>
                        ))}
                      </div>
                    </div>

                    {ver.notes && (
                      <p className="text-xs text-neutral-600 italic bg-white p-2 border border-neutral-200">
                        &ldquo;{ver.notes}&rdquo;
                      </p>
                    )}

                    <div className="text-[10px] text-neutral-500 flex items-center justify-between pt-2 border-t border-neutral-200">
                      <span>Updated: {new Date(ver.updatedAt).toLocaleString()}</span>
                      <span className="font-mono text-neutral-400">ID: {ver.id.slice(0, 8)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. REQUIREMENT CALCULATOR DRAWER */}
      {isCalcOpen && calcFormula && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white border-l border-neutral-300 w-full max-w-lg h-full overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-300">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#059669]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Theoretical Requirement Calculator
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCalcOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-neutral-50 p-3.5 border border-neutral-200 space-y-1">
              <div className="font-bold text-xs text-neutral-900">
                Formula: {calcFormula.name} ({calcFormula.code} v{calcFormula.versionNo})
              </div>
              <div className="text-xs text-neutral-600">
                Target Output: {calcFormula.targetProductName}
              </div>
            </div>

            {/* Target MT Input */}
            <div className="space-y-1.5">
              <label htmlFor={calcTargetMtId} className="text-xs font-bold uppercase tracking-wider text-neutral-800 block">
                Target Production Quantity (Metric Tons)
              </label>
              <div className="flex items-center gap-3">
                <input
                  id={calcTargetMtId}
                  type="number"
                  min="0.1"
                  step="any"
                  value={calcTargetMt}
                  onChange={(e) => setCalcTargetMt(e.target.value)}
                  className="flex-1 h-10 px-3 font-mono font-bold text-sm bg-white border border-neutral-300 focus:outline-none focus:border-[#059669]"
                />
                <span className="font-mono font-bold text-xs text-neutral-600 px-3 py-2.5 bg-neutral-100 border border-neutral-300">
                  MT
                </span>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {[10, 50, 100, 250, 500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCalcTargetMt(String(preset))}
                    className="px-2 py-0.5 text-xs font-mono bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-700 cursor-pointer"
                  >
                    {preset} MT
                  </button>
                ))}
              </div>
            </div>

            {/* Results Table */}
            {isLoadingCalc ? (
              <div className="p-8 text-center text-xs text-neutral-500">Calculating material requirements...</div>
            ) : calcResult ? (
              <div className="space-y-4">
                <div className="border border-neutral-300 overflow-x-auto bg-transparent">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2 px-2.5">Material</th>
                        <th className="py-2 px-2.5 text-right">%</th>
                        <th className="py-2 px-2.5 text-right">Required (kg)</th>
                        <th className="py-2 px-2.5 text-right">Required (MT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-300">
                      {calcResult.requirements.map((req) => (
                        <tr key={req.materialId} className="hover:bg-neutral-100/50">
                          <td className="py-2 px-2.5 font-medium text-neutral-900">
                            <div>{req.materialName}</div>
                            <span className="text-[10px] font-mono text-neutral-500">
                              {req.materialCode}
                            </span>
                          </td>
                          <td className="py-2 px-2.5 font-mono tabular-nums text-right text-neutral-700">
                            {req.percentage}%
                          </td>
                          <td className="py-2 px-2.5 font-mono tabular-nums font-bold text-right text-neutral-900">
                            {req.theoreticalKg.toLocaleString()} kg
                          </td>
                          <td className="py-2 px-2.5 font-mono tabular-nums text-right text-neutral-700">
                            {req.theoreticalMt.toFixed(3)} MT
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-neutral-300 bg-neutral-100 font-bold text-neutral-900">
                        <td className="py-2 px-2.5 uppercase text-[10px]">Total</td>
                        <td className="py-2 px-2.5 font-mono text-right">100.000%</td>
                        <td className="py-2 px-2.5 font-mono text-right text-[#059669]">
                          {calcResult.targetKg.toLocaleString()} kg
                        </td>
                        <td className="py-2 px-2.5 font-mono text-right text-[#059669]">
                          {calcResult.targetMt} MT
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-300 text-xs text-[#047857] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Largest-remainder integer distribution ensures parts sum exactly to <strong>{calcResult.targetKg.toLocaleString()} kg</strong> ({calcResult.targetMt} MT) with 0 rounding leakage.
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
