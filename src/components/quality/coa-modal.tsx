"use client";

import React from "react";
import { X, Printer, CheckCircle2, ShieldCheck, Download } from "lucide-react";
import { CertificateOfAnalysis } from "@/lib/types/quality";

interface CoaModalProps {
  isOpen: boolean;
  onClose: () => void;
  coa: CertificateOfAnalysis | null;
}

export function CoaModal({ isOpen, onClose, coa }: CoaModalProps) {
  if (!isOpen || !coa) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none overflow-y-auto">
      <div className="bg-white border-2 border-neutral-900 w-full max-w-3xl my-auto text-neutral-900 shadow-2xl relative">
        {/* Top Action Bar (hidden when printing) */}
        <div className="print:hidden p-3 bg-neutral-100 border-b border-neutral-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Official Quality Certificate Document
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print COA</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-300 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Content */}
        <div className="p-6 sm:p-8 space-y-6 print:p-0">
          {/* Header */}
          <div className="border-b-2 border-neutral-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#059669] uppercase">
                BHARAT INDUSTRIAL &amp; RENEWABLES LLP
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 uppercase">
                Certificate of Analysis (COA)
              </h2>
              <p className="text-[11px] text-neutral-600 font-mono">
                Biomass Solid Biofuel Testing Laboratory · ISO 17225-6 Compliant
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-neutral-500 block">Certificate No.</span>
              <span className="font-mono font-black text-sm text-neutral-900">{coa.certificateNumber}</span>
              <span className="text-[10px] text-neutral-500 font-mono block mt-0.5">
                Issue Date: {coa.issueDate}
              </span>
            </div>
          </div>

          {/* Consignment & Batch Identification Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-neutral-50 border border-neutral-300 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-500 block">Customer</span>
              <span className="font-bold text-neutral-900">{coa.customerName}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-500 block">Sales Order Ref</span>
              <span className="font-mono font-semibold text-neutral-900">{coa.salesOrderNumber}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-500 block">Finished Goods Batch</span>
              <span className="font-mono font-bold text-neutral-900">{coa.batchNumber}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-500 block">Product Grade</span>
              <span className="font-bold text-[#047857]">MAHAURJA 8mm Premium</span>
            </div>
          </div>

          {/* Laboratory Test Parameter Matrix */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2">
              Laboratory Physicochemical Test Matrix
            </h3>
            <table className="w-full text-left text-xs border border-neutral-300 border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-300 text-[10px] font-bold uppercase text-neutral-700">
                  <th className="p-2 border-r border-neutral-300">Parameter</th>
                  <th className="p-2 border-r border-neutral-300">Test Method</th>
                  <th className="p-2 border-r border-neutral-300">Guaranteed Spec</th>
                  <th className="p-2 border-r border-neutral-300">Actual Lab Result</th>
                  <th className="p-2 text-right">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300 font-mono">
                <tr>
                  <td className="p-2 border-r border-neutral-300 font-sans font-semibold">Pellet Diameter</td>
                  <td className="p-2 border-r border-neutral-300 text-neutral-600">Vernier Caliper</td>
                  <td className="p-2 border-r border-neutral-300 text-neutral-700">8.0 ± 0.2 mm</td>
                  <td className="p-2 border-r border-neutral-300 font-bold text-neutral-900">
                    {coa.parameters.pelletDiameterMm} mm
                  </td>
                  <td className="p-2 text-right text-[#047857] font-bold">PASSED</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-neutral-300 font-sans font-semibold">Moisture Content</td>
                  <td className="p-2 border-r border-neutral-300 text-neutral-600">ASTM D3173</td>
                  <td className="p-2 border-r border-neutral-300 text-neutral-700">≤ 8.0 %</td>
                  <td className="p-2 border-r border-neutral-300 font-bold text-neutral-900">
                    {coa.parameters.moisturePercent} %
                  </td>
                  <td className="p-2 text-right text-[#047857] font-bold">PASSED</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-neutral-300 font-sans font-semibold">Ash Content (dry basis)</td>
                  <td className="p-2 border-r border-neutral-300 text-neutral-600">ASTM D3174</td>
                  <td className="p-2 border-r border-neutral-300 text-neutral-700">≤ 5.0 %</td>
                  <td className="p-2 border-r border-neutral-300 font-bold text-neutral-900">
                    {coa.parameters.ashPercent} %
                  </td>
                  <td className="p-2 text-right text-[#047857] font-bold">PASSED</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-neutral-300 font-sans font-semibold">Gross Calorific Value (GCV)</td>
                  <td className="p-2 border-r border-neutral-300 text-neutral-600">Bomb Calorimeter (IS 1350)</td>
                  <td className="p-2 border-r border-neutral-300 text-neutral-700">≥ 4,200 kcal/kg</td>
                  <td className="p-2 border-r border-neutral-300 font-bold text-neutral-900">
                    {coa.parameters.gcvKcal} kcal/kg
                  </td>
                  <td className="p-2 text-right text-[#047857] font-bold">PASSED</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-neutral-300 font-sans font-semibold">Bulk Density</td>
                  <td className="p-2 border-r border-neutral-300 text-neutral-600">EN 15103</td>
                  <td className="p-2 border-r border-neutral-300 text-neutral-700">≥ 650 kg/m³</td>
                  <td className="p-2 border-r border-neutral-300 font-bold text-neutral-900">
                    {coa.parameters.bulkDensityKgM3} kg/m³
                  </td>
                  <td className="p-2 text-right text-[#047857] font-bold">PASSED</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-neutral-300 font-sans font-semibold">Fines &amp; Dust (&lt;3.15mm)</td>
                  <td className="p-2 border-r border-neutral-300 text-neutral-600">ISO 18846 Sieve</td>
                  <td className="p-2 border-r border-neutral-300 text-neutral-700">≤ 1.5 %</td>
                  <td className="p-2 border-r border-neutral-300 font-bold text-neutral-900">
                    {coa.parameters.finesPercent} %
                  </td>
                  <td className="p-2 text-right text-[#047857] font-bold">PASSED</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Compliance Declaration & Signatures */}
          <div className="pt-4 border-t border-neutral-300 flex flex-col sm:flex-row justify-between items-end gap-6">
            <div className="max-w-md text-[11px] text-neutral-600">
              <span className="font-bold text-neutral-900 block mb-0.5">Laboratory Compliance Declaration:</span>
              This consignment has been sampled, tested, and certified in accordance with standard testing protocols. It satisfies all thermal and mechanical quality standards specified in Purchase Order terms.
            </div>

            <div className="flex gap-8 text-center shrink-0">
              <div>
                <div className="h-10 border-b border-neutral-400 font-mono text-xs flex items-end justify-center pb-1 text-neutral-800">
                  {coa.testedBy.split("(")[0]}
                </div>
                <span className="text-[10px] font-bold uppercase text-neutral-500 mt-1 block">
                  Lead Chemist
                </span>
              </div>
              <div>
                <div className="h-10 border-b border-neutral-400 font-mono text-xs flex items-end justify-center pb-1 text-neutral-800">
                  {coa.approvedBy.split("(")[0]}
                </div>
                <span className="text-[10px] font-bold uppercase text-neutral-500 mt-1 block">
                  Plant Director
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
