export type VehicleDirection = "INBOUND_RM" | "OUTBOUND_DISPATCH";

export type GateStage =
  | "ARRIVED_AT_GATE"
  | "WAITING_WEIGHMENT"
  | "GROSS_WEIGHED"
  | "UNLOADING"
  | "QC_PENDING"
  | "TARE_WEIGHED"
  | "CLEARED_EXIT"
  | "EXIT_COMPLETED";

export interface GateVehicle {
  id: string;
  gateEntryNo: string;
  vehicleNo: string;
  vehicleType: "6-Wheeler" | "10-Wheeler Tipper" | "12-Wheeler" | "Trailer 40ft";
  direction: VehicleDirection;
  materialName: string;
  materialCode: string;
  supplierOrCustomer: string;
  transporter: string;
  challanOrLrNo: string;
  driverName: string;
  driverMobile: string;
  declaredWeightMT: number;
  assignedLocation: string;
  stage: GateStage;
  arrivalTime: string;
  elapsedMinutes: number;
  securityOfficer: string;
  ewayBillNo?: string;
  notes?: string;
}

export interface GateStats {
  totalInside: number;
  inboundRM: number;
  outboundFG: number;
  awaitingWeighbridge: number;
  activeUnloading: number;
  clearedForExit: number;
}
