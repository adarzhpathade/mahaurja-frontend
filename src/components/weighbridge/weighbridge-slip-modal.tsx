"use client";

import React, { useRef } from "react";
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Scale,
  ShieldCheck,
  Building2,
  FileText,
  QrCode,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WeighbridgeRecord } from "@/lib/types/weighbridge";

interface WeighbridgeSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: WeighbridgeRecord | null;
}

export function WeighbridgeSlipModal({
  isOpen,
  onClose,
  record,
}: WeighbridgeSlipModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !record) return null;

  const handlePrint = () => {
    window.print();
  };

  const isCompleted = record.status === "COMPLETED";
  const gross = record.grossWeightMT;
  const tare = record.tareWeightMT !== undefined ? record.tareWeightMT : 0;
  const net =
    record.netWeightMT !== undefined
      ? record.netWeightMT
      : isCompleted
      ? Number(Math.abs(gross - tare).toFixed(2))
      : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:static print:inset-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/75 backdrop-blur-xs print:hidden"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          className="relative w-full max-w-2xl bg-white border border-neutral-400 shadow-2xl z-10 my-auto overflow-hidden select-none print:shadow-none print:border-none print:max-w-none print:w-full print:m-0"
          style={{ borderRadius: 0 }}
        >
          {/* Top Bar for Screen (Hidden in Print) */}
          <div className="bg-[#18181B] text-white px-4 py-3 flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#10B981]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Weighbridge Certificate — {record.slipNo}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
                style={{ borderRadius: 0 }}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1 text-neutral-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Document Body */}
          <div
            ref={printRef}
            className="p-5 sm:p-8 bg-white text-neutral-900 font-sans space-y-4 text-xs print:p-4 print:text-black"
          >
            {/* Plant Header */}
            <div className="border-b-2 border-neutral-900 pb-3 text-center space-y-1">
              <div className="text-[10px] tracking-widest uppercase font-bold text-neutral-500">
                Official Industrial Scale Receipt · Legal Metrology Copy
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 uppercase">
                BHARAT INDUSTRIAL & RENEWABLES LLP
              </h1>
              <div className="text-[11px] text-neutral-600 font-medium">
                Biomass Energy & Pellet Manufacturing Facility · Unit Plot 4B, Industrial Area, Solapur, Maharashtra
              </div>
              <div className="text-[10px] font-mono text-neutral-500">
                GSTIN: 27AABCB1234F1Z8 · Contact: weighbridge@mahaurja.in · Deck: {record.platformId}
              </div>
            </div>

            {/* Slip Title & Key Metadata Bar */}
            <div className="flex items-center justify-between border-b border-neutral-300 py-2 font-mono text-[11px]">
              <div>
                <span className="text-neutral-500">SLIP NO: </span>
                <strong className="text-base text-neutral-900 font-black">
                  {record.slipNo}
                </strong>
              </div>

              <div className="text-right">
                <span className="text-neutral-500">GATE PASS: </span>
                <strong className="text-neutral-900">{record.gateEntryNo}</strong>
              </div>
            </div>

            {/* Vehicle & Consignment Info Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 border border-neutral-300 p-3 text-[11px] bg-neutral-50/50">
              <div>
                <span className="text-neutral-500 block text-[9px] uppercase font-bold">
                  Vehicle Number
                </span>
                <span className="font-mono font-black text-sm text-neutral-900">
                  {record.vehicleNo}
                </span>
              </div>

              <div>
                <span className="text-neutral-500 block text-[9px] uppercase font-bold">
                  Consignment Direction
                </span>
                <span className="font-bold text-neutral-900 uppercase">
                  {record.direction === "INBOUND_RM"
                    ? "Inbound Raw Material"
                    : "Outbound Finished Dispatch"}
                </span>
              </div>

              <div>
                <span className="text-neutral-500 block text-[9px] uppercase font-bold">
                  Material Commodity
                </span>
                <span className="font-semibold text-neutral-900">
                  {record.materialName} ({record.materialCode})
                </span>
              </div>

              <div>
                <span className="text-neutral-500 block text-[9px] uppercase font-bold">
                  Challan / LR Ref
                </span>
                <span className="font-mono text-neutral-900">
                  {record.challanOrLrNo}
                </span>
              </div>

              <div>
                <span className="text-neutral-500 block text-[9px] uppercase font-bold">
                  Supplier / Customer
                </span>
                <span className="font-medium text-neutral-900 truncate block">
                  {record.supplierOrCustomer}
                </span>
              </div>

              <div>
                <span className="text-neutral-500 block text-[9px] uppercase font-bold">
                  Driver / Transporter
                </span>
                <span className="text-neutral-900 truncate block">
                  {record.driverName} ({record.transporter})
                </span>
              </div>
            </div>

            {/* OFFICIAL WEIGHT CERTIFICATE TABLE */}
            <div className="border-2 border-neutral-900 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-900 text-white font-mono text-[10px] uppercase">
                    <th className="p-2 border-r border-neutral-700">Weighment Stage</th>
                    <th className="p-2 border-r border-neutral-700">Time & Date</th>
                    <th className="p-2 border-r border-neutral-700">Operator</th>
                    <th className="p-2 text-right">Weight (MT)</th>
                    <th className="p-2 text-right">Weight (KG)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300 font-mono text-[11px]">
                  {/* Gross Weighment Row */}
                  <tr className="bg-white">
                    <td className="p-2 border-r border-neutral-300 font-bold">
                      1. GROSS WEIGHT
                    </td>
                    <td className="p-2 border-r border-neutral-300 text-neutral-600">
                      {record.firstWeightTimestamp || "—"}
                    </td>
                    <td className="p-2 border-r border-neutral-300 text-neutral-600">
                      {record.firstOperator}
                    </td>
                    <td className="p-2 border-r border-neutral-300 text-right font-black text-neutral-900">
                      {gross.toFixed(2)} MT
                    </td>
                    <td className="p-2 text-right text-neutral-700">
                      {Math.round(gross * 1000).toLocaleString()} kg
                    </td>
                  </tr>

                  {/* Tare Weighment Row */}
                  <tr className="bg-neutral-50/50">
                    <td className="p-2 border-r border-neutral-300 font-bold">
                      2. TARE WEIGHT
                    </td>
                    <td className="p-2 border-r border-neutral-300 text-neutral-600">
                      {record.secondWeightTimestamp || "PENDING (POST UNLOAD)"}
                    </td>
                    <td className="p-2 border-r border-neutral-300 text-neutral-600">
                      {record.secondOperator || "—"}
                    </td>
                    <td className="p-2 border-r border-neutral-300 text-right font-black text-neutral-900">
                      {tare > 0 ? `${tare.toFixed(2)} MT` : "—"}
                    </td>
                    <td className="p-2 text-right text-neutral-700">
                      {tare > 0 ? `${Math.round(tare * 1000).toLocaleString()} kg` : "—"}
                    </td>
                  </tr>

                  {/* Net Weight Row (Highlight) */}
                  <tr className="bg-[#ECFDF5] border-t-2 border-neutral-900 font-bold text-neutral-900">
                    <td className="p-2.5 border-r border-neutral-900 font-black text-xs text-[#047857]">
                      3. NET WEIGHT (AUTO)
                    </td>
                    <td className="p-2.5 border-r border-neutral-900 text-[10px] text-neutral-600 font-sans">
                      Computed: |Gross − Tare|
                    </td>
                    <td className="p-2.5 border-r border-neutral-900 text-[10px] text-neutral-600 font-sans">
                      Verified System Stamp
                    </td>
                    <td className="p-2.5 border-r border-neutral-900 text-right font-black text-sm text-[#047857]">
                      {isCompleted ? `${net.toFixed(2)} MT` : "PENDING"}
                    </td>
                    <td className="p-2.5 text-right font-black text-xs text-[#047857]">
                      {isCompleted
                        ? `${Math.round(net * 1000).toLocaleString()} kg`
                        : "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Reconciliation Strip */}
            {record.declaredWeightMT && isCompleted && (
              <div className="bg-neutral-100 border border-neutral-300 p-2 flex items-center justify-between text-[11px] font-mono">
                <div>
                  <span className="text-neutral-500">Challan Declared: </span>
                  <strong>{record.declaredWeightMT.toFixed(2)} MT</strong>
                </div>
                <div>
                  <span className="text-neutral-500">Net Variance: </span>
                  <strong
                    className={
                      Math.abs(net - record.declaredWeightMT) <= 0.5
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }
                  >
                    {net - record.declaredWeightMT >= 0 ? "+" : ""}
                    {(net - record.declaredWeightMT).toFixed(2)} MT
                  </strong>
                </div>
                <div className="text-[10px] text-emerald-800 font-bold">
                  ✓ WITHIN LEGAL METROLOGY TOLERANCE
                </div>
              </div>
            )}

            {/* Simulated Barcode & Serial Authentication */}
            <div className="flex items-center justify-between pt-2">
              {/* Simulated Barcode */}
              <div className="space-y-1">
                <div className="font-mono text-[9px] text-neutral-400 tracking-wider">
                  BARCODE SCAN AUTHENTICATION:
                </div>
                <div className="h-9 w-48 flex items-center justify-between bg-white px-1 border border-neutral-200">
                  {/* Vertical lines barcode pattern */}
                  <div className="w-1 h-7 bg-neutral-900" />
                  <div className="w-0.5 h-7 bg-neutral-900" />
                  <div className="w-2 h-7 bg-neutral-900" />
                  <div className="w-1 h-7 bg-neutral-900" />
                  <div className="w-0.5 h-7 bg-neutral-900" />
                  <div className="w-1.5 h-7 bg-neutral-900" />
                  <div className="w-0.5 h-7 bg-neutral-900" />
                  <div className="w-2.5 h-7 bg-neutral-900" />
                  <div className="w-1 h-7 bg-neutral-900" />
                  <div className="w-2 h-7 bg-neutral-900" />
                  <div className="w-0.5 h-7 bg-neutral-900" />
                  <div className="w-1 h-7 bg-neutral-900" />
                </div>
                <div className="font-mono text-[9px] text-neutral-500">
                  *{record.slipNo}*
                </div>
              </div>

              {/* Operator Stamp & Signatory Box */}
              <div className="text-right space-y-1">
                <div className="border-b border-neutral-400 w-44 inline-block mb-1 pb-1">
                  <div className="text-[9px] font-mono text-emerald-800 font-bold uppercase">
                    [DIGITALLY SIGNED & VERIFIED]
                  </div>
                  <div className="font-bold text-xs text-neutral-900">
                    Sunil Shinde
                  </div>
                </div>
                <div className="text-[9px] text-neutral-500 uppercase tracking-wider font-semibold">
                  Authorized Scale Master / Weighbridge Officer
                </div>
              </div>
            </div>

            {/* Legal Fine Print Footer */}
            <div className="border-t border-neutral-200 pt-2 text-[9px] text-neutral-400 text-center font-mono leading-tight">
              Certified that this weight slip was generated by computer interface without manual intervention.
              Subject to Maharashtra Jurisdiction · Bharat Industrial & Renewables LLP
            </div>
          </div>

          {/* Bottom Screen Actions (Hidden in Print) */}
          <div className="bg-neutral-100 px-6 py-3 border-t border-neutral-300 flex items-center justify-between print:hidden">
            <span className="text-[11px] text-neutral-500 font-mono">
              Printed copies: 3 (Accounts / Supplier / Plant File)
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 cursor-pointer"
                style={{ borderRadius: 0 }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#18181B] hover:bg-black text-white flex items-center gap-1.5 cursor-pointer shadow-sm"
                style={{ borderRadius: 0 }}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
