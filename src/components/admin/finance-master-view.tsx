"use client";

import React, { useState, useId } from "react";
import {
  Percent,
  Wallet,
  Building,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  X,
  AlertTriangle,
  Lock,
  Unlock,
  Edit2,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  taxRatesApi,
  expenseHeadsApi,
  ExpenseHeadItem,
  bankAccountsApi,
  BankAccountItem,
} from "@/lib/api/finance";
import { usePlantEvents } from "@/lib/api/realtime";
import { describeApiError } from "@/lib/api/client";
import { Can } from "@/lib/context/auth-context";

type ActiveTab = "tax-rates" | "expense-heads" | "bank-accounts";

export function FinanceMasterView() {
  const queryClient = useQueryClient();
  const taxHsnId = useId();
  const taxRateId = useId();
  const taxDescId = useId();
  const taxFromId = useId();
  const taxToId = useId();
  const expNameId = useId();
  const expCatId = useId();
  const expLimitId = useId();
  const expDescId = useId();
  const bankAccNameId = useId();
  const bankInstNameId = useId();
  const bankAccNumId = useId();
  const bankIfscId = useId();
  const bankBalanceId = useId();
  const [activeTab, setActiveTab] = useState<ActiveTab>("tax-rates");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Invalidate queries on live events
  usePlantEvents(["tax_rate.*", "expense_head.*", "bank_account.*"], () => {
    void queryClient.invalidateQueries({ queryKey: ["finance"] });
  });

  // Queries
  const { data: taxRates = [], isLoading: isLoadingTax } = useQuery({
    queryKey: ["finance", "tax-rates"],
    queryFn: () => taxRatesApi.list(),
  });

  const { data: expenseHeads = [], isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["finance", "expense-heads"],
    queryFn: () => expenseHeadsApi.list(),
  });

  const { data: bankAccounts = [], isLoading: isLoadingBanks } = useQuery({
    queryKey: ["finance", "bank-accounts"],
    queryFn: () => bankAccountsApi.list(),
  });

  // Modals state
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [taxHsn, setTaxHsn] = useState("");
  const [taxDescription, setTaxDescription] = useState("");
  const [taxRate, setTaxRate] = useState("5.0");
  const [taxEffectiveFrom, setTaxEffectiveFrom] = useState(new Date().toISOString().slice(0, 10));
  const [taxEffectiveTo, setTaxEffectiveTo] = useState("");
  const [taxError, setTaxError] = useState<string | null>(null);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseHeadItem | null>(null);
  const [expenseName, setExpenseName] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("OPERATIONAL");
  const [expenseLimitInr, setExpenseLimitInr] = useState("25000");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseError, setExpenseError] = useState<string | null>(null);

  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccountItem | null>(null);
  const [bankName, setBankName] = useState("");
  const [bankInstitution, setBankInstitution] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [bankOpeningBalanceInr, setBankOpeningBalanceInr] = useState("0");
  const [bankError, setBankError] = useState<string | null>(null);

  // Lookup helper state
  const [lookupHsn, setLookupHsn] = useState("4401");
  const [lookupDate, setLookupDate] = useState(new Date().toISOString().slice(0, 10));
  const { data: lookupResult } = useQuery({
    queryKey: ["finance", "tax-lookup", lookupHsn, lookupDate],
    queryFn: () => taxRatesApi.lookup(lookupHsn, lookupDate),
    enabled: !!lookupHsn,
  });

  // Handlers
  const handleOpenTaxModal = () => {
    setTaxHsn("");
    setTaxDescription("");
    setTaxRate("5.0");
    setTaxEffectiveFrom(new Date().toISOString().slice(0, 10));
    setTaxEffectiveTo("");
    setTaxError(null);
    setIsTaxModalOpen(true);
  };

  const handleSaveTax = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taxHsn.trim() || !taxDescription.trim()) {
      setTaxError("HSN/SAC code and description are required.");
      return;
    }
    try {
      setTaxError(null);
      await taxRatesApi.create({
        hsn: taxHsn.trim(),
        description: taxDescription.trim(),
        rate: parseFloat(taxRate) || 0,
        effectiveFrom: taxEffectiveFrom,
        effectiveTo: taxEffectiveTo ? taxEffectiveTo : null,
      });
      await queryClient.invalidateQueries({ queryKey: ["finance", "tax-rates"] });
      setIsTaxModalOpen(false);
    } catch (err) {
      const msg = describeApiError(err, "Failed to save tax rate");
      setTaxError(msg);
    }
  };

  const handleOpenExpenseModal = (exp?: ExpenseHeadItem) => {
    if (exp) {
      setEditingExpense(exp);
      setExpenseName(exp.name);
      setExpenseCategory(exp.category);
      setExpenseLimitInr(String(exp.approvalLimitInr));
      setExpenseDescription(exp.description || "");
    } else {
      setEditingExpense(null);
      setExpenseName("");
      setExpenseCategory("OPERATIONAL");
      setExpenseLimitInr("25000");
      setExpenseDescription("");
    }
    setExpenseError(null);
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseName.trim()) {
      setExpenseError("Expense head name is required.");
      return;
    }
    try {
      setExpenseError(null);
      const limitInr = parseFloat(expenseLimitInr) || 0;
      if (editingExpense) {
        await expenseHeadsApi.update(
          editingExpense.id,
          {
            name: expenseName.trim(),
            category: expenseCategory,
            approvalLimitInr: limitInr,
            description: expenseDescription.trim() || null,
            version: editingExpense.version,
          },
          editingExpense.version,
        );
      } else {
        await expenseHeadsApi.create({
          name: expenseName.trim(),
          category: expenseCategory,
          approvalLimitInr: limitInr,
          description: expenseDescription.trim() || null,
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["finance", "expense-heads"] });
      setIsExpenseModalOpen(false);
    } catch (err) {
      const msg = describeApiError(err, "Failed to save expense head");
      setExpenseError(msg);
    }
  };

  const handleOpenBankModal = (bank?: BankAccountItem) => {
    if (bank) {
      setEditingBank(bank);
      setBankName(bank.name || bank.accountName || "");
      setBankInstitution(bank.bankName);
      setBankAccountNumber(bank.accountNumber);
      setBankIfsc(bank.ifsc || bank.ifscCode || "");
      setBankOpeningBalanceInr(String(bank.openingBalanceInr));
    } else {
      setEditingBank(null);
      setBankName("");
      setBankInstitution("");
      setBankAccountNumber("");
      setBankIfsc("");
      setBankOpeningBalanceInr("0");
    }
    setBankError(null);
    setIsBankModalOpen(true);
  };

  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName.trim() || !bankInstitution.trim() || !bankAccountNumber.trim() || !bankIfsc.trim()) {
      setBankError("All account fields are required.");
      return;
    }
    try {
      setBankError(null);
      const balInr = parseFloat(bankOpeningBalanceInr) || 0;
      if (editingBank) {
        await bankAccountsApi.update(
          editingBank.id,
          {
            name: bankName.trim(),
            bankName: bankInstitution.trim(),
            accountNumber: bankAccountNumber.trim(),
            ifsc: bankIfsc.trim().toUpperCase(),
            openingBalanceInr: balInr,
            version: editingBank.version,
          },
          editingBank.version,
        );
      } else {
        await bankAccountsApi.create({
          name: bankName.trim(),
          bankName: bankInstitution.trim(),
          accountNumber: bankAccountNumber.trim(),
          ifsc: bankIfsc.trim().toUpperCase(),
          openingBalanceInr: balInr,
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["finance", "bank-accounts"] });
      setIsBankModalOpen(false);
    } catch (err) {
      const msg = describeApiError(err, "Failed to save bank account");
      setBankError(msg);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* 1. COMPACT COMMAND HEADER */}
      <div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
              Tax & Accounts Masters
            </h1>
            <span className="text-xs font-bold font-mono px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
              FINANCE
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            HSN statutory GST rates, plant expense classification & approval limits, and treasury bank accounts.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
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

          {activeTab === "tax-rates" && (
            <Can perm="tax:manage">
              <button
                type="button"
                onClick={handleOpenTaxModal}
                className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                <span>Add Tax Rate</span>
              </button>
            </Can>
          )}

          {activeTab === "expense-heads" && (
            <Can perm="expenses:manage">
              <button
                type="button"
                onClick={() => handleOpenExpenseModal()}
                className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                <span>Add Expense Head</span>
              </button>
            </Can>
          )}

          {activeTab === "bank-accounts" && (
            <Can perm="accounts:manage">
              <button
                type="button"
                onClick={() => handleOpenBankModal()}
                className="h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                <span>Add Bank Account</span>
              </button>
            </Can>
          )}
        </div>
      </div>

      {/* 2. SECTION TABS */}
      <div className="flex border-b border-neutral-300 gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("tax-rates")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === "tax-rates"
              ? "border-[#059669] text-neutral-900 bg-white/60 font-black"
              : "border-transparent text-neutral-600 hover:text-neutral-900"
          }`}
        >
          <Percent className="w-4 h-4 text-[#059669]" />
          <span>GST / Tax Rates ({taxRates.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("expense-heads")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === "expense-heads"
              ? "border-[#059669] text-neutral-900 bg-white/60 font-black"
              : "border-transparent text-neutral-600 hover:text-neutral-900"
          }`}
        >
          <Wallet className="w-4 h-4 text-[#059669]" />
          <span>Expense Heads ({expenseHeads.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bank-accounts")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === "bank-accounts"
              ? "border-[#059669] text-neutral-900 bg-white/60 font-black"
              : "border-transparent text-neutral-600 hover:text-neutral-900"
          }`}
        >
          <Building className="w-4 h-4 text-[#059669]" />
          <span>Bank Accounts ({bankAccounts.length})</span>
        </button>
      </div>

      {/* 3. TAB 1: TAX RATES */}
      {activeTab === "tax-rates" && (
        <div className="space-y-4">
          {/* Quick HSN Tax Lookup Drawer / Bar */}
          <div className="p-3 bg-neutral-100/70 border border-neutral-300 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
                HSN Tax Rate Lookup Test:
              </span>
              <input
                type="text"
                value={lookupHsn}
                onChange={(e) => setLookupHsn(e.target.value)}
                placeholder="HSN code"
                className="w-24 h-8 px-2 bg-white border border-neutral-300 font-mono text-xs"
              />
              <input
                type="date"
                value={lookupDate}
                onChange={(e) => setLookupDate(e.target.value)}
                className="h-8 px-2 bg-white border border-neutral-300 text-xs font-mono"
              />
            </div>

            <div className="font-mono text-xs font-bold text-neutral-900">
              {lookupResult ? (
                <span className="text-[#059669]">
                  Applicable Rate: {lookupResult.rate}% ({lookupResult.effectiveFrom} to {lookupResult.effectiveTo || "Present"})
                </span>
              ) : (
                <span className="text-neutral-500">No applicable tax rate found for this date.</span>
              )}
            </div>
          </div>

          {isLoadingTax ? (
            <div className="p-8 text-center text-xs text-neutral-500">Loading tax rates...</div>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {taxRates.map((tax) => (
                <div
                  key={tax.id}
                  className="bg-white/40 border border-neutral-300 p-4 space-y-3 hover:border-neutral-900 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="font-mono font-bold text-sm px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-900">
                        HSN {tax.hsnSac || tax.hsn}
                      </span>
                      <span className="font-mono font-black text-lg text-[#059669]">
                        {tax.rate}%
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-neutral-900">{tax.description}</h4>

                    <div className="text-xs text-neutral-600 space-y-1 pt-2 border-t border-neutral-200">
                      <div>
                        Effective From: <strong>{tax.effectiveFrom}</strong>
                      </div>
                      <div>
                        Effective To: <strong>{tax.effectiveTo || "Open Ended"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>v{tax.version}</span>
                    <span className="text-emerald-700 font-semibold">Active Period</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-neutral-300 overflow-x-auto bg-transparent">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">HSN / SAC</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Tax Rate</th>
                    <th className="py-2.5 px-3">Effective From</th>
                    <th className="py-2.5 px-3">Effective To</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300">
                  {taxRates.map((tax) => (
                    <tr key={tax.id} className="hover:bg-neutral-200/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{tax.hsnSac || tax.hsn}</td>
                      <td className="py-2.5 px-3 font-medium text-neutral-900">{tax.description}</td>
                      <td className="py-2.5 px-3 font-mono tabular-nums text-right font-black text-sm text-[#059669]">
                        {tax.rate}%
                      </td>
                      <td className="py-2.5 px-3 font-mono">{tax.effectiveFrom}</td>
                      <td className="py-2.5 px-3 font-mono">{tax.effectiveTo || "Open Ended"}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-[#047857] border border-emerald-300 uppercase">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 2: EXPENSE HEADS */}
      {activeTab === "expense-heads" && (
        <div className="space-y-4">
          {isLoadingExpenses ? (
            <div className="p-8 text-center text-xs text-neutral-500">Loading expense heads...</div>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {expenseHeads.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white/40 border border-neutral-300 p-4 space-y-3 hover:border-neutral-900 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-600">
                        {exp.code}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-neutral-200 text-neutral-800">
                        {exp.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-neutral-900">{exp.name}</h4>

                    <div className="p-2.5 bg-neutral-50 border border-neutral-200 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-neutral-500 block">
                        Approval Threshold
                      </span>
                      <div className="font-mono font-black text-sm text-neutral-900">
                        ₹{exp.approvalLimitInr.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-neutral-500 block">
                        Expenses exceeding this amount trigger director approval.
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-500">v{exp.version}</span>
                    <Can perm="expenses:manage">
                      <button
                        type="button"
                        onClick={() => handleOpenExpenseModal(exp)}
                        className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Limit</span>
                      </button>
                    </Can>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-neutral-300 overflow-x-auto bg-transparent">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Expense Head</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Approval Limit</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300">
                  {expenseHeads.map((exp) => (
                    <tr key={exp.id} className="hover:bg-neutral-200/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{exp.code}</td>
                      <td className="py-2.5 px-3 font-semibold text-neutral-900">{exp.name}</td>
                      <td className="py-2.5 px-3 text-neutral-600">{exp.category}</td>
                      <td className="py-2.5 px-3 font-mono tabular-nums text-right font-black text-neutral-900">
                        ₹{exp.approvalLimitInr.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Can perm="expenses:manage">
                          <button
                            type="button"
                            onClick={() => handleOpenExpenseModal(exp)}
                            className="px-2.5 py-1 text-xs border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700"
                          >
                            Edit
                          </button>
                        </Can>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 3: BANK ACCOUNTS */}
      {activeTab === "bank-accounts" && (
        <div className="space-y-4">
          {isLoadingBanks ? (
            <div className="p-8 text-center text-xs text-neutral-500">Loading bank accounts...</div>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {bankAccounts.map((bank) => (
                <div
                  key={bank.id}
                  className="bg-white/40 border border-neutral-300 p-5 space-y-4 hover:border-neutral-900 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-neutral-500 block">
                          Bank & Branch
                        </span>
                        <h4 className="font-bold text-base text-neutral-900">{bank.bankName}</h4>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-[#047857] border border-emerald-300 uppercase">
                        Active
                      </span>
                    </div>

                    <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-2">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-semibold block">
                          Account Title
                        </span>
                        <span className="text-xs font-bold text-neutral-900">{bank.name || bank.accountName}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-semibold block">
                          Account Number
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-sm text-neutral-900">
                            {bank.accountNumber}
                          </span>
                          {bank.accountNumber.includes("•") ? (
                            <span title="Masked for security (requires accounts:read)" className="text-neutral-400">
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span title="Visible in clear text" className="text-emerald-600">
                              <Unlock className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-semibold block">
                          IFSC Code
                        </span>
                        <span className="font-mono text-xs font-bold text-neutral-800">{bank.ifsc || bank.ifscCode}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-neutral-600">Opening Balance:</span>
                      <span className="font-mono font-bold text-neutral-900">
                        ₹{bank.openingBalanceInr.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-200 flex items-center justify-end">
                    <Can perm="accounts:manage">
                      <button
                        type="button"
                        onClick={() => handleOpenBankModal(bank)}
                        className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Details</span>
                      </button>
                    </Can>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-neutral-300 overflow-x-auto bg-transparent">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Account Title</th>
                    <th className="py-2.5 px-3">Bank Name</th>
                    <th className="py-2.5 px-3">Account Number</th>
                    <th className="py-2.5 px-3">IFSC</th>
                    <th className="py-2.5 px-3 text-right">Opening Balance</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300">
                  {bankAccounts.map((bank) => (
                    <tr key={bank.id} className="hover:bg-neutral-200/40">
                      <td className="py-2.5 px-3 font-semibold text-neutral-900">{bank.name || bank.accountName}</td>
                      <td className="py-2.5 px-3 text-neutral-700">{bank.bankName}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">
                        <span className="inline-flex items-center gap-1.5">
                          {bank.accountNumber}
                          {bank.accountNumber.includes("•") ? (
                            <Lock className="w-3 h-3 text-neutral-400" />
                          ) : (
                            <Unlock className="w-3 h-3 text-emerald-600" />
                          )}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-neutral-700">{bank.ifsc || bank.ifscCode}</td>
                      <td className="py-2.5 px-3 font-mono tabular-nums text-right font-black text-neutral-900">
                        ₹{bank.openingBalanceInr.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Can perm="accounts:manage">
                          <button
                            type="button"
                            onClick={() => handleOpenBankModal(bank)}
                            className="px-2.5 py-1 text-xs border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700"
                          >
                            Edit
                          </button>
                        </Can>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 6. MODAL: ADD TAX RATE */}
      {isTaxModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-300">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-[#059669]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Add HSN Tax Rate
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTaxModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {taxError && (
              <div className="p-3 bg-rose-50 border border-rose-300 text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{taxError}</span>
              </div>
            )}

            <form onSubmit={handleSaveTax} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={taxHsnId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    HSN / SAC Code *
                  </label>
                  <input
                    id={taxHsnId}
                    type="text"
                    required
                    value={taxHsn}
                    onChange={(e) => setTaxHsn(e.target.value)}
                    placeholder="e.g. 4401"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 font-mono text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label htmlFor={taxRateId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    GST Rate (%) *
                  </label>
                  <input
                    id={taxRateId}
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 font-mono text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={taxDescId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Description / Commodity Name *
                </label>
                <input
                  id={taxDescId}
                  type="text"
                  required
                  value={taxDescription}
                  onChange={(e) => setTaxDescription(e.target.value)}
                  placeholder="e.g. Biomass Briquettes & Pellets"
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={taxFromId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Effective From *
                  </label>
                  <input
                    id={taxFromId}
                    type="date"
                    required
                    value={taxEffectiveFrom}
                    onChange={(e) => setTaxEffectiveFrom(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label htmlFor={taxToId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Effective To (Optional)
                  </label>
                  <input
                    id={taxToId}
                    type="date"
                    value={taxEffectiveTo}
                    onChange={(e) => setTaxEffectiveTo(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-300 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsTaxModalOpen(false)}
                  className="h-10 px-5 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Save Tax Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: ADD / EDIT EXPENSE HEAD */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-300">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#059669]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  {editingExpense ? `Edit Expense: ${editingExpense.name}` : "Add Expense Head"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {expenseError && (
              <div className="p-3 bg-rose-50 border border-rose-300 text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{expenseError}</span>
              </div>
            )}

            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label htmlFor={expNameId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Expense Head Name *
                </label>
                <input
                  id={expNameId}
                  type="text"
                  required
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  placeholder="e.g. Diesel for Yard Loaders"
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={expCatId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Category *
                  </label>
                  <select
                    id={expCatId}
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="OPERATIONAL">OPERATIONAL</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="LOGISTICS">LOGISTICS</option>
                    <option value="ADMINISTRATIVE">ADMINISTRATIVE</option>
                    <option value="CAPITAL">CAPITAL</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={expLimitId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Approval Limit (₹) *
                  </label>
                  <input
                    id={expLimitId}
                    type="number"
                    min="0"
                    step="1000"
                    required
                    value={expenseLimitInr}
                    onChange={(e) => setExpenseLimitInr(e.target.value)}
                    placeholder="25000"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 font-mono text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={expDescId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Description / Budget Notes
                </label>
                <textarea
                  id={expDescId}
                  rows={2}
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  placeholder="Optional cost center explanation or ledger mapping..."
                  className="w-full min-h-[56px] p-3 text-xs leading-relaxed resize-none bg-white border border-neutral-300 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="pt-4 border-t border-neutral-300 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="h-10 px-5 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Save Expense Head
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL: ADD / EDIT BANK ACCOUNT */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-300">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#059669]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  {editingBank ? `Edit Bank Account: ${editingBank.name}` : "Add Bank Account"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBankModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bankError && (
              <div className="p-3 bg-rose-50 border border-rose-300 text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{bankError}</span>
              </div>
            )}

            <form onSubmit={handleSaveBank} className="space-y-4">
              <div>
                <label htmlFor={bankAccNameId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Account Name / Title *
                </label>
                <input
                  id={bankAccNameId}
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. Bharat Industrial Operational Account"
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={bankInstNameId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Bank Name *
                  </label>
                  <input
                    id={bankInstNameId}
                    type="text"
                    required
                    value={bankInstitution}
                    onChange={(e) => setBankInstitution(e.target.value)}
                    placeholder="e.g. State Bank of India"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label htmlFor={bankAccNumId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Account Number *
                  </label>
                  <input
                    id={bankAccNumId}
                    type="text"
                    required
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    placeholder="e.g. 39485729103"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 font-mono text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={bankIfscId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    IFSC Code *
                  </label>
                  <input
                    id={bankIfscId}
                    type="text"
                    required
                    value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                    placeholder="e.g. SBIN0001234"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 font-mono text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label htmlFor={bankBalanceId} className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Opening Balance (₹)
                  </label>
                  <input
                    id={bankBalanceId}
                    type="number"
                    step="any"
                    value={bankOpeningBalanceInr}
                    onChange={(e) => setBankOpeningBalanceInr(e.target.value)}
                    placeholder="0"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 font-mono text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-300 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="h-10 px-5 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Save Bank Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
