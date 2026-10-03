import { GateVehicle, VehicleDirection } from "./gate";

export type PlatformId = "WB-01" | "WB-02";

export type ScaleStatus = "EMPTY" | "OCCUPIED" | "CALIBRATING" | "OFFLINE";
export type StabilityStatus = "STABLE" | "IN_MOTION" | "OVERLOAD" | "UNDERLOAD";

export interface ScalePlatform {
  id: PlatformId;
  name: string;
  location: string;
  type: "Pitless Modular Heavy Duty" | "Pit Type Concrete Deck";
  maxCapacityMT: number; // e.g. 60.00 MT
  divisionKg: number; // e.g. 10 kg (0.01 MT)
  currentWeightMT: number;
  status: ScaleStatus;
  stability: StabilityStatus;
  occupiedVehicle?: {
    vehicleNo: string;
    gateEntryNo: string;
    materialName: string;
    direction: VehicleDirection;
    driverName: string;
    driverMobile?: string;
    challanOrLrNo?: string;
    declaredWeightMT?: number;
    supplierOrCustomer?: string;
  };
  lastCalibratedDate: string;
  activeOperator: string;
}

export type WeighmentType =
  | "INBOUND_GROSS" // 1st weighment for incoming RM
  | "INBOUND_TARE" // 2nd weighment for empty RM truck on exit
  | "OUTBOUND_TARE" // 1st weighment for empty FG truck on arrival
  | "OUTBOUND_GROSS"; // 2nd weighment for loaded FG truck on exit

export interface WeighbridgeRecord {
  id: string;
  slipNo: string; // e.g. WB-261003-001
  gateEntryNo: string;
  vehicleNo: string;
  direction: VehicleDirection;
  materialName: string;
  materialCode: string;
  supplierOrCustomer: string;
  transporter: string;
  driverName: string;
  driverMobile: string;
  challanOrLrNo: string;
  platformId: PlatformId;

  // 1st Weighment
  firstWeightMT: number;
  firstWeightType: "GROSS" | "TARE";
  firstWeightTimestamp: string;
  firstOperator: string;

  // 2nd Weighment (optional if still pending)
  secondWeightMT?: number;
  secondWeightType?: "GROSS" | "TARE";
  secondWeightTimestamp?: string;
  secondOperator?: string;

  // Net Calculation (System Computed: strictly |Gross - Tare|)
  grossWeightMT: number;
  tareWeightMT?: number;
  netWeightMT?: number;
  declaredWeightMT?: number;
  varianceMT?: number; // Net - Declared

  status: "PENDING_SECOND_WEIGHMENT" | "COMPLETED" | "CANCELLED";
  notes?: string;
  createdAt: string;
}

export interface WeighbridgeStats {
  todayTotalSlips: number;
  todayNetTonnageMT: number;
  inboundGrossWeighed: number;
  inboundTareCompleted: number;
  outboundTareWeighed: number;
  outboundGrossCompleted: number;
  pendingSecondWeighment: number;
  activeOnScales: number;
}
