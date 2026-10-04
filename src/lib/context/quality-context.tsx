"use client";

import React, { createContext, useContext, useState } from "react";
import {
  RmQcSample,
  FgQcSample,
  CertificateOfAnalysis,
  RmTestParameters,
  FgTestParameters,
  QcStatus,
} from "@/lib/types/quality";

export const INITIAL_RM_SAMPLES: RmQcSample[] = [
  {
    id: "QC-261004-001",
    gatePassNumber: "RM-GATE-261004-001",
    vehicleNumber: "MH 12 RN 4821",
    supplierName: "Ramesh Agro Biomass Traders",
    materialName: "Groundnut Shell",
    grossWeightKg: 28450,
    unloadingLocation: "Yard A - Bay 02",
    sampleTime: "08:45 AM",
    status: "PENDING",
  },
  {
    id: "QC-261004-002",
    gatePassNumber: "RM-GATE-261004-002",
    vehicleNumber: "MH 04 AB 9021",
    supplierName: "Sanjay Cashew Processors",
    materialName: "Cashew Shell",
    grossWeightKg: 31200,
    unloadingLocation: "Yard B - Shed 01",
    sampleTime: "09:15 AM",
    status: "TESTING",
    parameters: {
      moisturePercent: 11.2,
      ashPercent: 6.4,
      gcvKcal: 4120,
      foreignMatterPercent: 1.2,
      bulkDensityKgM3: 185,
      visualGrade: "GRADE_A",
    },
  },
  {
    id: "QC-261004-003",
    gatePassNumber: "RM-GATE-261004-003",
    vehicleNumber: "MH 14 TC 1102",
    supplierName: "Vidarbha Farm Aggregators",
    materialName: "Soybean Straw / Agro Residue",
    grossWeightKg: 24600,
    unloadingLocation: "Yard D - Heap 04",
    sampleTime: "09:40 AM",
    status: "PENDING",
  },
  {
    id: "QC-261003-018",
    gatePassNumber: "RM-GATE-261003-018",
    vehicleNumber: "MH 15 BX 3390",
    supplierName: "Kisan Biomass Supply Co.",
    materialName: "Sawdust / Wood Shavings",
    grossWeightKg: 26800,
    unloadingLocation: "Wood Storage Yard C",
    sampleTime: "Yesterday 04:30 PM",
    testedTime: "Yesterday 05:10 PM",
    testedBy: "Dr. Ananya Deshmukh",
    status: "APPROVED",
    parameters: {
      moisturePercent: 9.4,
      ashPercent: 3.1,
      gcvKcal: 4280,
      foreignMatterPercent: 0.8,
      bulkDensityKgM3: 210,
      visualGrade: "GRADE_A",
    },
    remarks: "Clean white pine shavings, ideal for blending.",
  },
  {
    id: "QC-261003-019",
    gatePassNumber: "RM-GATE-261003-019",
    vehicleNumber: "MH 09 Q 7712",
    supplierName: "Deccan Bio Fuels",
    materialName: "Groundnut Shell",
    grossWeightKg: 22100,
    unloadingLocation: "Yard A - Quarantine Inset",
    sampleTime: "Yesterday 05:20 PM",
    testedTime: "Yesterday 06:00 PM",
    testedBy: "Dr. Ananya Deshmukh",
    status: "HOLD",
    parameters: {
      moisturePercent: 16.8,
      ashPercent: 9.8,
      gcvKcal: 3620,
      foreignMatterPercent: 3.4,
      bulkDensityKgM3: 155,
      visualGrade: "GRADE_C",
    },
    quarantineReason: "Excess moisture (16.8% > 14% max threshold) due to rain during transit. Awaiting plant director aeration decision.",
  },
];

export const INITIAL_FG_SAMPLES: FgQcSample[] = [
  {
    id: "FG-QC-261004-001",
    batchNumber: "FG-BATCH-261004-001",
    productionBatchNumber: "PB-261004-001",
    productName: "MAHAURJA Biomass Pellet - 8mm",
    productionLine: "Pelletiser Line 1",
    quantityMT: 60,
    productionDate: "04 Oct 2026",
    status: "PENDING",
  },
  {
    id: "FG-QC-261003-009",
    batchNumber: "FG-BATCH-261003-009",
    productionBatchNumber: "PB-261003-009",
    productName: "MAHAURJA Biomass Pellet - 8mm",
    productionLine: "Pelletiser Line 2",
    quantityMT: 45,
    productionDate: "03 Oct 2026",
    testedTime: "03 Oct 06:40 PM",
    testedBy: "Dr. Ananya Deshmukh",
    status: "APPROVED",
    parameters: {
      pelletDiameterMm: 8.05,
      moisturePercent: 6.8,
      ashPercent: 4.2,
      gcvKcal: 4320,
      bulkDensityKgM3: 685,
      finesPercent: 0.9,
    },
    remarks: "High mechanical durability, GCV exceeds guarantee. Approved for dispatch.",
  },
];

export const INITIAL_COAS: CertificateOfAnalysis[] = [
  {
    certificateNumber: "COA-261003-001",
    fgQcId: "FG-QC-261003-009",
    batchNumber: "FG-BATCH-261003-009",
    customerName: "ABC Industries Pvt. Ltd.",
    salesOrderNumber: "SO-261002-015",
    issueDate: "03 Oct 2026",
    testedBy: "Dr. Ananya Deshmukh (Lead Chemist)",
    approvedBy: "Pravin Singhania (Plant Director)",
    complianceVerdict: "FULLY_COMPLIANT",
    parameters: {
      pelletDiameterMm: 8.05,
      moisturePercent: 6.8,
      ashPercent: 4.2,
      gcvKcal: 4320,
      bulkDensityKgM3: 685,
      finesPercent: 0.9,
    },
    remarks: "Certified compliant with industrial boiler grade A specifications.",
  },
];

interface QualityContextType {
  rmSamples: RmQcSample[];
  fgSamples: FgQcSample[];
  coas: CertificateOfAnalysis[];
  activeRmSampleId: string | null;
  setActiveRmSampleId: (id: string | null) => void;
  activeFgSampleId: string | null;
  setActiveFgSampleId: (id: string | null) => void;
  selectedCoa: CertificateOfAnalysis | null;
  setSelectedCoa: (coa: CertificateOfAnalysis | null) => void;
  submitRmTest: (
    sampleId: string,
    params: RmTestParameters,
    status: QcStatus,
    remarks?: string,
    quarantineReason?: string
  ) => void;
  submitFgTest: (
    sampleId: string,
    params: FgTestParameters,
    status: QcStatus,
    remarks?: string
  ) => void;
  generateCoaDocument: (
    fgQcId: string,
    customerName: string,
    salesOrderNumber: string,
    remarks?: string
  ) => CertificateOfAnalysis;
  metrics: {
    rmAwaitingQc: number;
    fgAwaitingQc: number;
    testedTodayCount: number;
    passRatePercent: number;
  };
}

const QualityContext = createContext<QualityContextType | undefined>(undefined);

export function QualityProvider({ children }: { children: React.ReactNode }) {
  const [rmSamples, setRmSamples] = useState<RmQcSample[]>(INITIAL_RM_SAMPLES);
  const [fgSamples, setFgSamples] = useState<FgQcSample[]>(INITIAL_FG_SAMPLES);
  const [coas, setCoas] = useState<CertificateOfAnalysis[]>(INITIAL_COAS);
  const [activeRmSampleId, setActiveRmSampleId] = useState<string | null>("QC-261004-001");
  const [activeFgSampleId, setActiveFgSampleId] = useState<string | null>("FG-QC-261004-001");
  const [selectedCoa, setSelectedCoa] = useState<CertificateOfAnalysis | null>(null);

  const submitRmTest = (
    sampleId: string,
    params: RmTestParameters,
    status: QcStatus,
    remarks?: string,
    quarantineReason?: string
  ) => {
    setRmSamples((prev) =>
      prev.map((s) => {
        if (s.id === sampleId) {
          return {
            ...s,
            parameters: params,
            status,
            testedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            testedBy: "Dr. Ananya Deshmukh",
            remarks,
            quarantineReason: status === "HOLD" ? quarantineReason : undefined,
          };
        }
        return s;
      })
    );
  };

  const submitFgTest = (
    sampleId: string,
    params: FgTestParameters,
    status: QcStatus,
    remarks?: string
  ) => {
    setFgSamples((prev) =>
      prev.map((s) => {
        if (s.id === sampleId) {
          return {
            ...s,
            parameters: params,
            status,
            testedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            testedBy: "Dr. Ananya Deshmukh",
            remarks,
          };
        }
        return s;
      })
    );
  };

  const generateCoaDocument = (
    fgQcId: string,
    customerName: string,
    salesOrderNumber: string,
    remarks?: string
  ) => {
    const fgSample = fgSamples.find((s) => s.id === fgQcId);
    const params: FgTestParameters = fgSample?.parameters || {
      pelletDiameterMm: 8.0,
      moisturePercent: 7.0,
      ashPercent: 4.5,
      gcvKcal: 4250,
      bulkDensityKgM3: 670,
      finesPercent: 1.1,
    };

    const newCoa: CertificateOfAnalysis = {
      certificateNumber: `COA-261004-00${coas.length + 1}`,
      fgQcId,
      batchNumber: fgSample?.batchNumber || "FG-BATCH-261004-001",
      customerName,
      salesOrderNumber,
      issueDate: "04 Oct 2026",
      testedBy: "Dr. Ananya Deshmukh (Lead Chemist)",
      approvedBy: "Pravin Singhania (Plant Director)",
      complianceVerdict: "FULLY_COMPLIANT",
      parameters: params,
      remarks: remarks || "Certified compliant with industrial boiler grade A specifications.",
    };

    setCoas((prev) => [newCoa, ...prev]);
    return newCoa;
  };

  // Metrics calculation
  const rmAwaitingQc = rmSamples.filter((s) => s.status === "PENDING" || s.status === "TESTING").length;
  const fgAwaitingQc = fgSamples.filter((s) => s.status === "PENDING" || s.status === "TESTING").length;
  const completedSamples = [...rmSamples, ...fgSamples].filter(
    (s) => s.status === "APPROVED" || s.status === "HOLD" || s.status === "REJECTED"
  );
  const approvedSamples = completedSamples.filter((s) => s.status === "APPROVED");
  const passRatePercent = completedSamples.length > 0
    ? Math.round((approvedSamples.length / completedSamples.length) * 100)
    : 100;

  return (
    <QualityContext.Provider
      value={{
        rmSamples,
        fgSamples,
        coas,
        activeRmSampleId,
        setActiveRmSampleId,
        activeFgSampleId,
        setActiveFgSampleId,
        selectedCoa,
        setSelectedCoa,
        submitRmTest,
        submitFgTest,
        generateCoaDocument,
        metrics: {
          rmAwaitingQc,
          fgAwaitingQc,
          testedTodayCount: completedSamples.length,
          passRatePercent,
        },
      }}
    >
      {children}
    </QualityContext.Provider>
  );
}

export function useQuality() {
  const context = useContext(QualityContext);
  if (!context) {
    throw new Error("useQuality must be used within a QualityProvider");
  }
  return context;
}
