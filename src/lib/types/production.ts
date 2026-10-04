export type ProductionShift = "MORNING" | "AFTERNOON" | "NIGHT";
export type ProductionPlanStatus = "PLANNED" | "MATERIAL_ISSUED" | "PROCESSING" | "COMPLETED" | "CANCELLED";

export interface BlendIngredient {
  materialCode: string;
  materialName: string;
  plannedQuantityMT: number;
  lotId?: string;
  actualIssuedMT?: number;
}

export interface ProductionPlan {
  id: string;                  // PRD-261004-001
  date: string;
  shift: ProductionShift;
  targetQuantityMT: number;
  productName: string;
  pelletDiameterMm: number;    // Standard: 8.0 mm
  formulaId: string;
  formulaName: string;
  ingredients: BlendIngredient[];
  status: ProductionPlanStatus;
  supervisorName: string;
  productionLine: string;
  remarks?: string;
}

export interface MaterialIssueRecord {
  id: string;                  // ISS-261004-001
  planId: string;
  issueDate: string;
  shift: ProductionShift;
  supervisorName: string;
  allocatedLots: {
    lotId: string;
    materialName: string;
    issuedQuantityMT: number;
    yardLocation: string;
  }[];
  totalIssuedMT: number;
  status: "ISSUED" | "CONFIRMED";
}

export interface ProcessingStageLog {
  stageId: number;             // 1 to 7
  stageName: string;
  sectionRef: string;
  machineName: string;
  operatorName: string;
  startTime: string;
  endTime?: string;
  inputQuantityMT: number;
  outputQuantityMT: number;
  lossQuantityMT: number;
  specialMetrics: Record<string, string | number>;
  status: "COMPLETED" | "IN_PROGRESS" | "WAITING";
}

export interface ProductionBatch {
  batchNumber: string;         // PB-261004-001
  fgBatchNumber: string;       // FG-BATCH-261004-001
  planId: string;
  productionDate: string;
  shift: ProductionShift;
  productName: string;
  pelletDiameterMm: number;
  formulaUsed: string;
  consumedRmLots: string[];
  totalInputMT: number;
  goodProductionMT: number;
  finesQuantityMT: number;
  rejectedRecycleMT: number;
  netYieldPercent: number;
  downtimeMinutes: number;
  downtimeReason?: string;
  operatorName: string;
  lineName: string;
  qcStatus: "QC_PENDING" | "QC_APPROVED" | "QC_HOLD" | "QC_REJECTED";
}
