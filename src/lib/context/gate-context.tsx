"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { GateVehicle, GateStage } from "@/lib/types/gate";
import { INITIAL_GATE_VEHICLES } from "@/lib/data/mock-gate-vehicles";

interface GateContextType {
  vehicles: GateVehicle[];
  updateStage: (vehicleId: string, newStage: GateStage) => void;
  addVehicle: (newVehicle: GateVehicle) => void;
  isEntryModalOpen: boolean;
  setIsEntryModalOpen: (open: boolean) => void;
  prefillEntryData: Partial<GateVehicle> | null;
  setPrefillEntryData: (data: Partial<GateVehicle> | null) => void;
  openEntryModal: (prefill?: Partial<GateVehicle>) => void;
  closeEntryModal: () => void;
}

const GateContext = createContext<GateContextType | undefined>(undefined);

export function GateProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<GateVehicle[]>(INITIAL_GATE_VEHICLES);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [prefillEntryData, setPrefillEntryData] = useState<Partial<GateVehicle> | null>(null);

  const updateStage = (vehicleId: string, newStage: GateStage) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, stage: newStage } : v))
    );
  };

  const addVehicle = (newVehicle: GateVehicle) => {
    setVehicles((prev) => [newVehicle, ...prev]);
  };

  const openEntryModal = (prefill?: Partial<GateVehicle>) => {
    setPrefillEntryData(prefill || null);
    setIsEntryModalOpen(true);
  };

  const closeEntryModal = () => {
    setIsEntryModalOpen(false);
    setPrefillEntryData(null);
  };

  return (
    <GateContext.Provider
      value={{
        vehicles,
        updateStage,
        addVehicle,
        isEntryModalOpen,
        setIsEntryModalOpen,
        prefillEntryData,
        setPrefillEntryData,
        openEntryModal,
        closeEntryModal,
      }}
    >
      {children}
    </GateContext.Provider>
  );
}

export function useGate(): GateContextType {
  const context = useContext(GateContext);
  if (!context) {
    throw new Error("useGate must be used within a GateProvider");
  }
  return context;
}
