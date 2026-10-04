export type QcStatus = "PENDING" | "TESTING" | "APPROVED" | "HOLD" | "REJECTED";

export interface RmParameterTolerances {
  moistureMax: number;        // e.g. 10% target, 14% max
  ashMax: number;             // e.g. 8% target, 12% max
  gcvMin: number;             // e.g. 3800 kcal/kg min
  foreignMatterMax: number;   // e.g. 2% max
  bulkDensityMin: number;     // e.g. 160 kg/m3 min
}

export interface RmTestParameters {
  moisturePercent: number;
  ashPercent: number;
  gcvKcal: number;
  foreignMatterPercent: number;
  bulkDensityKgM3: number;
  visualGrade: "GRADE_A" | "GRADE_B" | "GRADE_C" | "OFF_SPEC";
}

export interface RmQcSample {
  id: string;                 // QC-YYMMDD-seq (e.g., QC-261004-001)
  gatePassNumber: string;     // RM-GATE-261004-001
  vehicleNumber: string;      // MH 12 RN 4821
  supplierName: string;
  materialName: string;
  grossWeightKg: number;
  unloadingLocation: string;  // e.g., Yard A - Groundnut Shell
  sampleTime: string;
  testedTime?: string;
  testedBy?: string;
  parameters?: RmTestParameters;
  status: QcStatus;
  remarks?: string;
  quarantineReason?: string;
}

export interface FgTestParameters {
  pelletDiameterMm: number;    // Standard: 8.0 mm
  moisturePercent: number;     // Standard: <= 8.0%
  ashPercent: number;          // Standard: <= 5.0%
  gcvKcal: number;             // Standard: >= 4200 kcal/kg
  bulkDensityKgM3: number;     // Standard: >= 650 kg/m3
  finesPercent: number;        // Standard: <= 1.5%
}

export interface FgQcSample {
  id: string;                  // FG-QC-YYMMDD-seq
  batchNumber: string;         // FG-BATCH-261004-001
  productionBatchNumber: string; // PB-261004-001
  productName: string;         // MAHAURJA Biomass Pellet - 8mm
  productionLine: string;      // Pellet Line 1
  quantityMT: number;          // e.g. 60 MT
  productionDate: string;
  testedTime?: string;
  testedBy?: string;
  parameters?: FgTestParameters;
  status: QcStatus;
  remarks?: string;
}

export interface CertificateOfAnalysis {
  certificateNumber: string;   // COA-261004-001
  fgQcId: string;
  batchNumber: string;
  customerName: string;
  salesOrderNumber: string;
  issueDate: string;
  testedBy: string;
  approvedBy: string;
  parameters: FgTestParameters;
  complianceVerdict: "FULLY_COMPLIANT" | "CONCESSIONAL_APPROVAL" | "REJECTED";
  remarks: string;
}
