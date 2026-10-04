"use client";

import React, { createContext, useContext, useState } from "react";
import {
  StorageLocation,
  RmLot,
  FgStockItem,
  PackagingRecord,
} from "@/lib/types/inventory";

export const INITIAL_STORAGE_LOCATIONS: StorageLocation[] = [
  {
    id: "LOC-YARD-A",
    name: "Yard A — Covered Inset 01",
    code: "YRD-A",
    type: "YARD",
    primaryMaterial: "Groundnut Shell",
    capacityMT: 500,
    currentStockMT: 143.25,
    moistureAvgPercent: 9.8,
    temperatureCelsius: 28.5,
    lastInspectionDate: "04 Oct 08:00 AM",
    status: "NORMAL",
  },
  {
    id: "LOC-WH-1",
    name: "Warehouse 1 — Bulk Silo Bay",
    code: "WH-01",
    type: "WAREHOUSE",
    primaryMaterial: "Groundnut Shell",
    capacityMT: 300,
    currentStockMT: 85.0,
    moistureAvgPercent: 9.2,
    temperatureCelsius: 26.0,
    lastInspectionDate: "03 Oct 05:00 PM",
    status: "NORMAL",
  },
  {
    id: "LOC-SHED-2",
    name: "Shed 2 — Aeration Pad",
    code: "SHD-02",
    type: "SHED",
    primaryMaterial: "Groundnut Shell (Quarantine)",
    capacityMT: 200,
    currentStockMT: 22.1,
    moistureAvgPercent: 16.5,
    temperatureCelsius: 31.0,
    lastInspectionDate: "04 Oct 07:30 AM",
    status: "AERATION_REQUIRED",
  },
  {
    id: "LOC-YARD-B",
    name: "Yard B — Cashew Processing Bay",
    code: "YRD-B",
    type: "YARD",
    primaryMaterial: "Cashew Shell",
    capacityMT: 400,
    currentStockMT: 95.5,
    moistureAvgPercent: 10.4,
    temperatureCelsius: 29.0,
    lastInspectionDate: "04 Oct 08:15 AM",
    status: "NORMAL",
  },
  {
    id: "LOC-WH-2",
    name: "Warehouse 2 — High Density Enclosure",
    code: "WH-02",
    type: "WAREHOUSE",
    primaryMaterial: "Cashew Shell",
    capacityMT: 250,
    currentStockMT: 40.0,
    moistureAvgPercent: 9.9,
    temperatureCelsius: 27.0,
    lastInspectionDate: "03 Oct 04:00 PM",
    status: "NORMAL",
  },
  {
    id: "LOC-WOOD-C",
    name: "Wood Storage Yard C — Pine & Shavings",
    code: "YRD-C",
    type: "OPEN_AREA",
    primaryMaterial: "Sawdust / Wood Shavings",
    capacityMT: 600,
    currentStockMT: 210.0,
    moistureAvgPercent: 9.5,
    temperatureCelsius: 25.0,
    lastInspectionDate: "04 Oct 07:00 AM",
    status: "AVAILABLE",
  },
  {
    id: "LOC-YARD-D",
    name: "Yard D — Agro Residue Pad",
    code: "YRD-D",
    type: "YARD",
    primaryMaterial: "Soybean Straw / Agro Residue",
    capacityMT: 400,
    currentStockMT: 64.0,
    moistureAvgPercent: 12.0,
    temperatureCelsius: 28.0,
    lastInspectionDate: "04 Oct 09:00 AM",
    status: "NORMAL",
  },
];

export const INITIAL_RM_LOTS: RmLot[] = [
  {
    lotId: "RMLOT-GS-261004-001",
    materialCode: "GS",
    materialName: "Groundnut Shell",
    supplierId: "SUP-000145",
    supplierName: "Ramesh Agro Biomass Traders",
    vehicleNumber: "MH 12 RN 4821",
    gatePassNumber: "RM-GATE-261004-001",
    weighbridgeSlipNumber: "WB-261004-001",
    qcReportId: "QC-261004-001",
    receivedDate: "04 Oct 2026",
    initialQuantityMT: 18.25,
    availableQuantityMT: 18.25,
    consumedQuantityMT: 0,
    purchaseRatePerMT: 3850,
    storageLocationId: "LOC-YARD-A",
    storageLocationName: "Yard A — Covered Inset 01",
    qcParameters: {
      moisturePercent: 9.5,
      ashPercent: 5.8,
      gcvKcal: 4150,
    },
    status: "IN_STOCK",
  },
  {
    lotId: "RMLOT-CS-261004-002",
    materialCode: "CS",
    materialName: "Cashew Shell",
    supplierId: "SUP-000188",
    supplierName: "Sanjay Cashew Processors",
    vehicleNumber: "MH 04 AB 9021",
    gatePassNumber: "RM-GATE-261004-002",
    weighbridgeSlipNumber: "WB-261004-002",
    qcReportId: "QC-261004-002",
    receivedDate: "04 Oct 2026",
    initialQuantityMT: 20.8,
    availableQuantityMT: 20.8,
    consumedQuantityMT: 0,
    purchaseRatePerMT: 4400,
    storageLocationId: "LOC-YARD-B",
    storageLocationName: "Yard B — Cashew Processing Bay",
    qcParameters: {
      moisturePercent: 11.2,
      ashPercent: 6.4,
      gcvKcal: 4120,
    },
    status: "IN_STOCK",
  },
  {
    lotId: "RMLOT-WD-261003-018",
    materialCode: "WD",
    materialName: "Sawdust / Wood Shavings",
    supplierId: "SUP-000210",
    supplierName: "Kisan Biomass Supply Co.",
    vehicleNumber: "MH 15 BX 3390",
    gatePassNumber: "RM-GATE-261003-018",
    weighbridgeSlipNumber: "WB-261003-018",
    qcReportId: "QC-261003-018",
    receivedDate: "03 Oct 2026",
    initialQuantityMT: 16.6,
    availableQuantityMT: 6.6,
    consumedQuantityMT: 10.0,
    purchaseRatePerMT: 3600,
    storageLocationId: "LOC-WOOD-C",
    storageLocationName: "Wood Storage Yard C — Pine & Shavings",
    qcParameters: {
      moisturePercent: 9.4,
      ashPercent: 3.1,
      gcvKcal: 4280,
    },
    status: "PARTIALLY_CONSUMED",
  },
];

export const INITIAL_FG_STOCK: FgStockItem[] = [
  {
    batchNumber: "FG-BATCH-261003-009",
    productionBatchNumber: "PB-261003-009",
    productName: "MAHAURJA 8mm Biomass Pellet",
    diameterMm: 8.0,
    producedQuantityMT: 45.0,
    dispatchableQuantityMT: 45.0,
    allocatedQuantityMT: 15.0,
    dispatchedQuantityMT: 0,
    storageBay: "FG Shed Bay 01 — Bagged Zone",
    packagingMode: "BAGGED_50KG",
    qcStatus: "QC_APPROVED",
    productionDate: "03 Oct 2026",
    qcApprovalDate: "03 Oct 06:40 PM",
    gcvKcal: 4320,
  },
  {
    batchNumber: "FG-BATCH-261004-001",
    productionBatchNumber: "PB-261004-001",
    productName: "MAHAURJA 8mm Biomass Pellet",
    diameterMm: 8.0,
    producedQuantityMT: 60.0,
    dispatchableQuantityMT: 0,
    allocatedQuantityMT: 0,
    dispatchedQuantityMT: 0,
    storageBay: "Cooling Silo Outlet Deck",
    packagingMode: "BULK_LOOSE",
    qcStatus: "QC_PENDING",
    productionDate: "04 Oct 2026",
    gcvKcal: 4250,
  },
];

export const INITIAL_PACKAGING_RECORDS: PackagingRecord[] = [
  {
    id: "PKG-261003-001",
    batchNumber: "FG-BATCH-261003-009",
    packagingType: "BAGGED_50KG",
    numberOfBags: 900,
    bagWeightKg: 50,
    totalQuantityMT: 45.0,
    packagingMaterialUsed: "Woven HDPE Liner Bags with Mahaurja Branding",
    operatorName: "Santosh Ghadge",
    packagingDate: "03 Oct 2026, 07:15 PM",
    storageBay: "FG Shed Bay 01 — Bagged Zone",
    remarks: "Automatic stitch machine line 1. Stamped with Batch 261003-009.",
  },
];

interface InventoryContextType {
  locations: StorageLocation[];
  rmLots: RmLot[];
  fgStock: FgStockItem[];
  packagingRecords: PackagingRecord[];
  addPackagingRecord: (record: Omit<PackagingRecord, "id">) => void;
  metrics: {
    totalRmStockMT: number;
    totalFgStockMT: number;
    dispatchableFgMT: number;
    pendingQcFgMT: number;
    activeLotsCount: number;
  };
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [locations, setLocations] = useState<StorageLocation[]>(INITIAL_STORAGE_LOCATIONS);
  const [rmLots, setRmLots] = useState<RmLot[]>(INITIAL_RM_LOTS);
  const [fgStock, setFgStock] = useState<FgStockItem[]>(INITIAL_FG_STOCK);
  const [packagingRecords, setPackagingRecords] = useState<PackagingRecord[]>(INITIAL_PACKAGING_RECORDS);

  const addPackagingRecord = (record: Omit<PackagingRecord, "id">) => {
    const newRecord: PackagingRecord = {
      ...record,
      id: `PKG-261004-00${packagingRecords.length + 1}`,
    };
    setPackagingRecords((prev) => [newRecord, ...prev]);
  };

  // Metrics
  const totalRmStockMT = locations.reduce((sum, l) => sum + l.currentStockMT, 0);
  const totalFgStockMT = fgStock.reduce((sum, item) => sum + item.producedQuantityMT, 0);
  const dispatchableFgMT = fgStock
    .filter((i) => i.qcStatus === "QC_APPROVED")
    .reduce((sum, i) => sum + (i.dispatchableQuantityMT - i.allocatedQuantityMT), 0);
  const pendingQcFgMT = fgStock
    .filter((i) => i.qcStatus === "QC_PENDING")
    .reduce((sum, i) => sum + i.producedQuantityMT, 0);
  const activeLotsCount = rmLots.filter((l) => l.status === "IN_STOCK" || l.status === "PARTIALLY_CONSUMED").length;

  return (
    <InventoryContext.Provider
      value={{
        locations,
        rmLots,
        fgStock,
        packagingRecords,
        addPackagingRecord,
        metrics: {
          totalRmStockMT: Math.round(totalRmStockMT * 100) / 100,
          totalFgStockMT: Math.round(totalFgStockMT * 100) / 100,
          dispatchableFgMT: Math.round(dispatchableFgMT * 100) / 100,
          pendingQcFgMT: Math.round(pendingQcFgMT * 100) / 100,
          activeLotsCount,
        },
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
