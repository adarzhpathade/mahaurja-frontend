"use client";

import React, { createContext, useContext, useState } from "react";
import {
  ProductionPlan,
  MaterialIssueRecord,
  ProcessingStageLog,
  ProductionBatch,
} from "@/lib/types/production";

export const INITIAL_PLANS: ProductionPlan[] = [
  {
    id: "PRD-261004-001",
    date: "04 Oct 2026",
    shift: "MORNING",
    targetQuantityMT: 60.0,
    productName: "MAHAURJA Biomass Pellet",
    pelletDiameterMm: 8.0,
    formulaId: "FORM-STD-01",
    formulaName: "Standard High-Caloric Blend (50% GS + 25% CS + 25% WD)",
    ingredients: [
      { materialCode: "GS", materialName: "Groundnut Shell", plannedQuantityMT: 30.0, lotId: "RMLOT-GS-261004-001", actualIssuedMT: 30.0 },
      { materialCode: "CS", materialName: "Cashew Shell", plannedQuantityMT: 15.0, lotId: "RMLOT-CS-261004-002", actualIssuedMT: 15.0 },
      { materialCode: "WD", materialName: "Wood / Sawdust", plannedQuantityMT: 15.0, lotId: "RMLOT-WD-261003-018", actualIssuedMT: 15.0 },
    ],
    status: "PROCESSING",
    supervisorName: "Mahesh Kadam",
    productionLine: "Line 1 — CPM 7932 Mill",
    remarks: "Morning shift production run targeting high durability boiler fuel.",
  },
  {
    id: "PRD-261004-002",
    date: "04 Oct 2026",
    shift: "AFTERNOON",
    targetQuantityMT: 50.0,
    productName: "MAHAURJA Biomass Pellet",
    pelletDiameterMm: 8.0,
    formulaId: "FORM-AGRO-02",
    formulaName: "Agro Mix Blend (60% GS + 40% Agro Residue)",
    ingredients: [
      { materialCode: "GS", materialName: "Groundnut Shell", plannedQuantityMT: 30.0 },
      { materialCode: "AR", materialName: "Soybean Straw / Agro Residue", plannedQuantityMT: 20.0 },
    ],
    status: "PLANNED",
    supervisorName: "Mahesh Kadam",
    productionLine: "Line 2 — Buhler DPAB Mill",
    remarks: "Scheduled for 02:00 PM startup.",
  },
];

export const INITIAL_ISSUES: MaterialIssueRecord[] = [
  {
    id: "ISS-261004-001",
    planId: "PRD-261004-001",
    issueDate: "04 Oct 2026, 08:30 AM",
    shift: "MORNING",
    supervisorName: "Mahesh Kadam",
    allocatedLots: [
      { lotId: "RMLOT-GS-261004-001", materialName: "Groundnut Shell", issuedQuantityMT: 30.0, yardLocation: "Yard A" },
      { lotId: "RMLOT-CS-261004-002", materialName: "Cashew Shell", issuedQuantityMT: 15.0, yardLocation: "Yard B" },
      { lotId: "RMLOT-WD-261003-018", materialName: "Wood Shavings", issuedQuantityMT: 15.0, yardLocation: "Wood Yard C" },
    ],
    totalIssuedMT: 60.0,
    status: "CONFIRMED",
  },
];

export const INITIAL_STAGES: ProcessingStageLog[] = [
  {
    stageId: 1,
    stageName: "Cleaning & Pre-Processing",
    sectionRef: "Sec 14",
    machineName: "Vibratory Screener & Magnetic Separator",
    operatorName: "Sunil Shinde",
    startTime: "08:45 AM",
    endTime: "09:30 AM",
    inputQuantityMT: 60.0,
    outputQuantityMT: 58.8,
    lossQuantityMT: 1.2,
    specialMetrics: { "Stones / Sand Removed": "0.8 MT", "Foreign Tramp Metal": "0.4 MT" },
    status: "COMPLETED",
  },
  {
    stageId: 2,
    stageName: "Size Reduction / Grinding",
    sectionRef: "Sec 15",
    machineName: "Heavy Duty Hammer Mill HM-01 (160 kW)",
    operatorName: "Ganesh Patil",
    startTime: "09:35 AM",
    endTime: "10:20 AM",
    inputQuantityMT: 58.8,
    outputQuantityMT: 58.2,
    lossQuantityMT: 0.6,
    specialMetrics: { "Screen Size": "5 mm", "Particle Size D90": "< 3 mm", "Downtime": "0 min" },
    status: "COMPLETED",
  },
  {
    stageId: 3,
    stageName: "Drying & Moisture Control",
    sectionRef: "Sec 16",
    machineName: "Triple Pass Rotary Drum Dryer RD-02",
    operatorName: "Kishore More",
    startTime: "10:25 AM",
    endTime: "11:15 AM",
    inputQuantityMT: 58.2,
    outputQuantityMT: 56.4,
    lossQuantityMT: 1.8,
    specialMetrics: { "Moisture Before": "14.2%", "Moisture After": "9.1%", "Furnace Temp": "240°C" },
    status: "COMPLETED",
  },
  {
    stageId: 4,
    stageName: "Blending & Homogenizing",
    sectionRef: "Sec 17",
    machineName: "Twin Shaft Continuous Ribbon Mixer BL-01",
    operatorName: "Mahesh Kadam",
    startTime: "11:20 AM",
    endTime: "11:55 AM",
    inputQuantityMT: 56.4,
    outputQuantityMT: 56.4,
    lossQuantityMT: 0.0,
    specialMetrics: { "Mix Homogeneity": "98.5%", "Recipe Variance": "±0.5%" },
    status: "COMPLETED",
  },
  {
    stageId: 5,
    stageName: "Pelletisation (Die Extrusion)",
    sectionRef: "Sec 18",
    machineName: "Ring Die Pellet Mill PM-01 (250 kW)",
    operatorName: "Vikram Rathod",
    startTime: "12:00 PM",
    inputQuantityMT: 56.4,
    outputQuantityMT: 38.5,
    lossQuantityMT: 0.5,
    specialMetrics: { "Die Diameter": "8.0 mm", "Current Amps": "320 A", "Die Temp": "92°C" },
    status: "IN_PROGRESS",
  },
  {
    stageId: 6,
    stageName: "Cooling & Hardening",
    sectionRef: "Sec 19",
    machineName: "Counterflow Air Cooler CC-01",
    operatorName: "Mahesh Kadam",
    startTime: "12:30 PM",
    inputQuantityMT: 38.5,
    outputQuantityMT: 37.8,
    lossQuantityMT: 0.7,
    specialMetrics: { "Inlet Temp": "88°C", "Outlet Temp": "32°C", "Cooling Loss": "1.8%" },
    status: "IN_PROGRESS",
  },
  {
    stageId: 7,
    stageName: "Screening & Fines Separation",
    sectionRef: "Sec 20",
    machineName: "Double Deck Vibratory Classifier SC-01",
    operatorName: "Mahesh Kadam",
    startTime: "—",
    inputQuantityMT: 0.0,
    outputQuantityMT: 0.0,
    lossQuantityMT: 0.0,
    specialMetrics: { "Good Pellets": "Pending", "Fines Recycle": "Pending" },
    status: "WAITING",
  },
];

export const INITIAL_BATCHES: ProductionBatch[] = [
  {
    batchNumber: "PB-261003-009",
    fgBatchNumber: "FG-BATCH-261003-009",
    planId: "PRD-261003-001",
    productionDate: "03 Oct 2026",
    shift: "MORNING",
    productName: "MAHAURJA Biomass Pellet - 8mm",
    pelletDiameterMm: 8.0,
    formulaUsed: "Standard High-Caloric Blend (50% GS + 25% CS + 25% WD)",
    consumedRmLots: ["RMLOT-GS-261003-001", "RMLOT-CS-261003-002", "RMLOT-WD-261003-018"],
    totalInputMT: 48.0,
    goodProductionMT: 45.0,
    finesQuantityMT: 1.8,
    rejectedRecycleMT: 1.2,
    netYieldPercent: 93.75,
    downtimeMinutes: 15,
    downtimeReason: "Belt cleaner adjustment on Hammer Mill",
    operatorName: "Vikram Rathod",
    lineName: "Pelletiser Line 1",
    qcStatus: "QC_APPROVED",
  },
];

interface ProductionContextType {
  plans: ProductionPlan[];
  issues: MaterialIssueRecord[];
  stages: ProcessingStageLog[];
  batches: ProductionBatch[];
  createPlan: (plan: Omit<ProductionPlan, "id">) => void;
  createMaterialIssue: (issue: Omit<MaterialIssueRecord, "id">) => void;
  advanceStage: (stageId: number) => void;
  metrics: {
    todayTargetMT: number;
    todayProducedMT: number;
    activeShift: string;
    plantEfficiencyPercent: number;
  };
}

const ProductionContext = createContext<ProductionContextType | undefined>(undefined);

export function ProductionProvider({ children }: { children: React.ReactNode }) {
  const [plans, setPlans] = useState<ProductionPlan[]>(INITIAL_PLANS);
  const [issues, setIssues] = useState<MaterialIssueRecord[]>(INITIAL_ISSUES);
  const [stages, setStages] = useState<ProcessingStageLog[]>(INITIAL_STAGES);
  const [batches, setBatches] = useState<ProductionBatch[]>(INITIAL_BATCHES);

  const createPlan = (planData: Omit<ProductionPlan, "id">) => {
    const newPlan: ProductionPlan = {
      ...planData,
      id: `PRD-261004-00${plans.length + 1}`,
    };
    setPlans((prev) => [newPlan, ...prev]);
  };

  const createMaterialIssue = (issueData: Omit<MaterialIssueRecord, "id">) => {
    const newIssue: MaterialIssueRecord = {
      ...issueData,
      id: `ISS-261004-00${issues.length + 1}`,
    };
    setIssues((prev) => [newIssue, ...prev]);

    // Update plan status to MATERIAL_ISSUED
    setPlans((prev) =>
      prev.map((p) => (p.id === issueData.planId ? { ...p, status: "MATERIAL_ISSUED" } : p))
    );
  };

  const advanceStage = (stageId: number) => {
    setStages((prev) =>
      prev.map((s) => {
        if (s.stageId === stageId) {
          return {
            ...s,
            status: "COMPLETED",
            endTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
        }
        if (s.stageId === stageId + 1) {
          return {
            ...s,
            status: "IN_PROGRESS",
            startTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
        }
        return s;
      })
    );
  };

  // Metrics
  const todayTargetMT = plans.reduce((sum, p) => sum + p.targetQuantityMT, 0);
  const todayProducedMT = 38.5; // active run in mill
  const plantEfficiencyPercent = 94.2;

  return (
    <ProductionContext.Provider
      value={{
        plans,
        issues,
        stages,
        batches,
        createPlan,
        createMaterialIssue,
        advanceStage,
        metrics: {
          todayTargetMT,
          todayProducedMT,
          activeShift: "Shift 01 (Morning)",
          plantEfficiencyPercent,
        },
      }}
    >
      {children}
    </ProductionContext.Provider>
  );
}

export function useProduction() {
  const context = useContext(ProductionContext);
  if (!context) {
    throw new Error("useProduction must be used within a ProductionProvider");
  }
  return context;
}
