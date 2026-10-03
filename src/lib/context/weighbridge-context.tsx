"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  PlatformId,
  ScalePlatform,
  StabilityStatus,
  WeighbridgeRecord,
  WeighbridgeStats,
  WeighmentType,
} from "@/lib/types/weighbridge";
import {
  INITIAL_SCALE_PLATFORMS,
  INITIAL_WEIGHBRIDGE_RECORDS,
  INITIAL_WEIGHBRIDGE_STATS,
} from "@/lib/data/mock-weighbridge";
import { GateVehicle } from "@/lib/types/gate";

interface WeighbridgeContextType {
  platforms: ScalePlatform[];
  activePlatformId: PlatformId;
  setActivePlatformId: (id: PlatformId) => void;
  activePlatform: ScalePlatform;
  records: WeighbridgeRecord[];
  stats: WeighbridgeStats;

  // Telemetry & Platform Controls
  setPlatformWeight: (platformId: PlatformId, weightMT: number) => void;
  setPlatformStability: (platformId: PlatformId, status: StabilityStatus) => void;
  zeroScale: (platformId: PlatformId) => void;
  loadVehicleOnScale: (
    platformId: PlatformId,
    vehicle: Partial<GateVehicle>,
    weightMT?: number
  ) => void;
  clearPlatform: (platformId: PlatformId) => void;

  // Weighment Execution
  captureWeighment: (params: {
    vehicle: Partial<GateVehicle>;
    weightMT: number;
    weighmentType: WeighmentType;
    platformId: PlatformId;
    notes?: string;
    operatorName?: string;
  }) => WeighbridgeRecord;

  // Modals & Inspection UI State
  isCaptureModalOpen: boolean;
  captureModalParams: {
    vehicle?: Partial<GateVehicle>;
    weighmentType?: WeighmentType;
    platformId?: PlatformId;
    existingRecord?: WeighbridgeRecord;
  } | null;
  openCaptureModal: (params: {
    vehicle?: Partial<GateVehicle>;
    weighmentType: WeighmentType;
    platformId?: PlatformId;
    existingRecord?: WeighbridgeRecord;
  }) => void;
  closeCaptureModal: () => void;

  isSlipModalOpen: boolean;
  selectedSlipRecord: WeighbridgeRecord | null;
  openSlipModal: (record: WeighbridgeRecord) => void;
  closeSlipModal: () => void;
}

const WeighbridgeContext = createContext<WeighbridgeContextType | undefined>(undefined);

export function WeighbridgeProvider({ children }: { children: ReactNode }) {
  const [platforms, setPlatforms] = useState<ScalePlatform[]>(INITIAL_SCALE_PLATFORMS);
  const [activePlatformId, setActivePlatformId] = useState<PlatformId>("WB-01");
  const [records, setRecords] = useState<WeighbridgeRecord[]>(INITIAL_WEIGHBRIDGE_RECORDS);
  const [stats, setStats] = useState<WeighbridgeStats>(INITIAL_WEIGHBRIDGE_STATS);

  // Modal states
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [captureModalParams, setCaptureModalParams] = useState<{
    vehicle?: Partial<GateVehicle>;
    weighmentType?: WeighmentType;
    platformId?: PlatformId;
    existingRecord?: WeighbridgeRecord;
  } | null>(null);

  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);
  const [selectedSlipRecord, setSelectedSlipRecord] = useState<WeighbridgeRecord | null>(null);

  const activePlatform =
    platforms.find((p) => p.id === activePlatformId) || platforms[0];

  // Telemetry controls
  const setPlatformWeight = (platformId: PlatformId, weightMT: number) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === platformId ? { ...p, currentWeightMT: weightMT } : p))
    );
  };

  const setPlatformStability = (platformId: PlatformId, stability: StabilityStatus) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === platformId ? { ...p, stability } : p))
    );
  };

  const zeroScale = (platformId: PlatformId) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platformId
          ? {
              ...p,
              currentWeightMT: 0.0,
              status: "EMPTY",
              stability: "STABLE",
              occupiedVehicle: undefined,
            }
          : p
      )
    );
  };

  const loadVehicleOnScale = (
    platformId: PlatformId,
    vehicle: Partial<GateVehicle>,
    weightMT?: number
  ) => {
    const defaultWeight =
      weightMT !== undefined
        ? weightMT
        : vehicle.declaredWeightMT
        ? Number((vehicle.declaredWeightMT + 13.5).toFixed(2))
        : 38.4;

    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platformId
          ? {
              ...p,
              currentWeightMT: defaultWeight,
              status: "OCCUPIED",
              stability: "STABLE",
              occupiedVehicle: {
                vehicleNo: vehicle.vehicleNo || "MH 12 XX 0000",
                gateEntryNo: vehicle.gateEntryNo || "RM-GATE-261003-999",
                materialName: vehicle.materialName || "Biomass Raw Material",
                direction: vehicle.direction || "INBOUND_RM",
                driverName: vehicle.driverName || "Driver",
              },
            }
          : p
      )
    );
  };

  const clearPlatform = (platformId: PlatformId) => {
    zeroScale(platformId);
  };

  // Helper to format slip number: WB-261003-XXX
  const generateSlipNumber = () => {
    const today = new Date();
    const yy = String(today.getFullYear()).slice(-2);
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const count = records.length + 1;
    return `WB-${yy}${mm}${dd}-${String(count).padStart(3, "0")}`;
  };

  const captureWeighment = ({
    vehicle,
    weightMT,
    weighmentType,
    platformId,
    notes = "",
    operatorName = "Sunil Shinde (Scale Officer)",
  }: {
    vehicle: Partial<GateVehicle>;
    weightMT: number;
    weighmentType: WeighmentType;
    platformId: PlatformId;
    notes?: string;
    operatorName?: string;
  }): WeighbridgeRecord => {
    const nowTime = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Check if there is an existing pending record for this vehicle (e.g. 2nd weighment)
    const existingIndex = records.findIndex(
      (r) =>
        r.vehicleNo === vehicle.vehicleNo &&
        r.status === "PENDING_SECOND_WEIGHMENT"
    );

    if (existingIndex !== -1) {
      const existing = records[existingIndex];
      let gross = existing.grossWeightMT;
      let tare = existing.tareWeightMT || 0;

      if (weighmentType === "INBOUND_TARE") {
        tare = weightMT;
      } else if (weighmentType === "OUTBOUND_GROSS") {
        gross = weightMT;
      }

      // STRICT SYSTEM COMPUTATION: Net = |Gross - Tare|
      const net = Number(Math.abs(gross - tare).toFixed(2));
      const declared = existing.declaredWeightMT || vehicle.declaredWeightMT || 0;
      const variance = Number((net - declared).toFixed(2));

      const updatedRecord: WeighbridgeRecord = {
        ...existing,
        secondWeightMT: weightMT,
        secondWeightType: weighmentType === "INBOUND_TARE" ? "TARE" : "GROSS",
        secondWeightTimestamp: nowTime,
        secondOperator: operatorName,
        grossWeightMT: gross,
        tareWeightMT: tare,
        netWeightMT: net,
        varianceMT: variance,
        status: "COMPLETED",
        notes: notes ? `${existing.notes || ""} | ${notes}` : existing.notes,
      };

      const updatedList = [...records];
      updatedList[existingIndex] = updatedRecord;
      setRecords(updatedList);

      // Update stats
      setStats((prev) => ({
        ...prev,
        todayTotalSlips: prev.todayTotalSlips + 1,
        todayNetTonnageMT: Number((prev.todayNetTonnageMT + net).toFixed(2)),
        inboundTareCompleted:
          weighmentType === "INBOUND_TARE"
            ? prev.inboundTareCompleted + 1
            : prev.inboundTareCompleted,
        outboundGrossCompleted:
          weighmentType === "OUTBOUND_GROSS"
            ? prev.outboundGrossCompleted + 1
            : prev.outboundGrossCompleted,
        pendingSecondWeighment: Math.max(0, prev.pendingSecondWeighment - 1),
      }));

      // Clear vehicle from platform
      clearPlatform(platformId);
      return updatedRecord;
    } else {
      // 1st Weighment creation
      const slipNo = generateSlipNumber();
      const isGross = weighmentType === "INBOUND_GROSS";

      const newRecord: WeighbridgeRecord = {
        id: `rec-wb-${Date.now()}`,
        slipNo,
        gateEntryNo: vehicle.gateEntryNo || `GATE-${Date.now()}`,
        vehicleNo: vehicle.vehicleNo || "MH 00 XX 0000",
        direction: vehicle.direction || "INBOUND_RM",
        materialName: vehicle.materialName || "Biomass Raw Material",
        materialCode: vehicle.materialCode || "RM-GEN-01",
        supplierOrCustomer: vehicle.supplierOrCustomer || "General Partner",
        transporter: vehicle.transporter || "Standard Fleet",
        driverName: vehicle.driverName || "Driver",
        driverMobile: vehicle.driverMobile || "+91 98000 00000",
        challanOrLrNo: vehicle.challanOrLrNo || "CH-00000",
        platformId,
        firstWeightMT: weightMT,
        firstWeightType: isGross ? "GROSS" : "TARE",
        firstWeightTimestamp: nowTime,
        firstOperator: operatorName,
        grossWeightMT: isGross ? weightMT : 0,
        tareWeightMT: !isGross ? weightMT : undefined,
        declaredWeightMT: vehicle.declaredWeightMT,
        status: "PENDING_SECOND_WEIGHMENT",
        notes,
        createdAt: new Date().toISOString(),
      };

      setRecords((prev) => [newRecord, ...prev]);

      // Update stats
      setStats((prev) => ({
        ...prev,
        inboundGrossWeighed:
          weighmentType === "INBOUND_GROSS"
            ? prev.inboundGrossWeighed + 1
            : prev.inboundGrossWeighed,
        outboundTareWeighed:
          weighmentType === "OUTBOUND_TARE"
            ? prev.outboundTareWeighed + 1
            : prev.outboundTareWeighed,
        pendingSecondWeighment: prev.pendingSecondWeighment + 1,
      }));

      // Platform occupied by this vehicle
      loadVehicleOnScale(platformId, vehicle, weightMT);
      return newRecord;
    }
  };

  const openCaptureModal = (params: {
    vehicle?: Partial<GateVehicle>;
    weighmentType: WeighmentType;
    platformId?: PlatformId;
    existingRecord?: WeighbridgeRecord;
  }) => {
    setCaptureModalParams(params);
    setIsCaptureModalOpen(true);
  };

  const closeCaptureModal = () => {
    setIsCaptureModalOpen(false);
    setCaptureModalParams(null);
  };

  const openSlipModal = (record: WeighbridgeRecord) => {
    setSelectedSlipRecord(record);
    setIsSlipModalOpen(true);
  };

  const closeSlipModal = () => {
    setIsSlipModalOpen(false);
    setSelectedSlipRecord(null);
  };

  return (
    <WeighbridgeContext.Provider
      value={{
        platforms,
        activePlatformId,
        setActivePlatformId,
        activePlatform,
        records,
        stats,
        setPlatformWeight,
        setPlatformStability,
        zeroScale,
        loadVehicleOnScale,
        clearPlatform,
        captureWeighment,
        isCaptureModalOpen,
        captureModalParams,
        openCaptureModal,
        closeCaptureModal,
        isSlipModalOpen,
        selectedSlipRecord,
        openSlipModal,
        closeSlipModal,
      }}
    >
      {children}
    </WeighbridgeContext.Provider>
  );
}

export function useWeighbridge(): WeighbridgeContextType {
  const context = useContext(WeighbridgeContext);
  if (!context) {
    throw new Error("useWeighbridge must be used within a WeighbridgeProvider");
  }
  return context;
}
