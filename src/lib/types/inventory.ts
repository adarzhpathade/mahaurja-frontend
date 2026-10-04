export type StorageLocationType = "YARD" | "WAREHOUSE" | "SHED" | "OPEN_AREA";

export interface StorageLocation {
  id: string;
  name: string;
  code: string;
  type: StorageLocationType;
  primaryMaterial: string;
  capacityMT: number;
  currentStockMT: number;
  moistureAvgPercent: number;
  temperatureCelsius: number;
  lastInspectionDate: string;
  status: "NORMAL" | "AERATION_REQUIRED" | "FULL" | "AVAILABLE";
}

export interface RmLot {
  lotId: string;               // RMLOT-GS-261004-001
  materialCode: string;        // GS, CS, WD, AR
  materialName: string;
  supplierId: string;
  supplierName: string;
  vehicleNumber: string;
  gatePassNumber: string;
  weighbridgeSlipNumber: string;
  qcReportId: string;
  receivedDate: string;
  initialQuantityMT: number;
  availableQuantityMT: number;
  consumedQuantityMT: number;
  purchaseRatePerMT: number;
  storageLocationId: string;
  storageLocationName: string;
  qcParameters: {
    moisturePercent: number;
    ashPercent: number;
    gcvKcal: number;
  };
  status: "IN_STOCK" | "PARTIALLY_CONSUMED" | "CONSUMED" | "QUARANTINED";
}

export interface FgStockItem {
  batchNumber: string;         // FG-BATCH-261004-001
  productionBatchNumber: string;
  productName: string;
  diameterMm: number;
  producedQuantityMT: number;
  dispatchableQuantityMT: number;
  allocatedQuantityMT: number;
  dispatchedQuantityMT: number;
  storageBay: string;
  packagingMode: "BULK_LOOSE" | "BAGGED_50KG" | "BAGGED_40KG" | "BAGGED_25KG";
  qcStatus: "QC_PENDING" | "QC_APPROVED" | "QC_HOLD" | "QC_REJECTED";
  productionDate: string;
  qcApprovalDate?: string;
  gcvKcal: number;
}

export interface PackagingRecord {
  id: string;                  // PKG-261004-001
  batchNumber: string;
  packagingType: "BAGGED_50KG" | "BAGGED_40KG" | "BAGGED_25KG" | "BULK_LOOSE";
  numberOfBags?: number;
  bagWeightKg?: number;
  totalQuantityMT: number;
  packagingMaterialUsed: string;
  operatorName: string;
  packagingDate: string;
  storageBay: string;
  remarks?: string;
}
