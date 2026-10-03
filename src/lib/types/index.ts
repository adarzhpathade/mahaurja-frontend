export type UserRole =
  | "admin"
  | "gate"
  | "weighbridge"
  | "quality"
  | "production"
  | "inventory"
  | "sales"
  | "management";

export type RawMaterialStatus =
  | "EXPECTED"
  | "ARRIVED"
  | "GROSS_WEIGHED"
  | "UNLOADED"
  | "QC_PENDING"
  | "APPROVED"
  | "HOLD"
  | "REJECTED"
  | "TARE_WEIGHED"
  | "RECEIVED"
  | "STORED"
  | "ISSUED"
  | "CONSUMED";

export type ProductionStatus =
  | "PLANNED"
  | "MATERIAL_ISSUED"
  | "PROCESSING"
  | "PELLETISATION"
  | "COOLING"
  | "SCREENING"
  | "PRODUCED"
  | "QC_PENDING"
  | "APPROVED"
  | "HOLD"
  | "REJECTED"
  | "STORED";

export type FinishedGoodsStatus =
  | "PRODUCED"
  | "QC_PENDING"
  | "APPROVED"
  | "AVAILABLE"
  | "RESERVED"
  | "LOADING"
  | "DISPATCHED"
  | "DELIVERED";

export type SalesOrderStatus =
  | "ENQUIRY"
  | "QUOTATION"
  | "ORDER_RECEIVED"
  | "CONFIRMED"
  | "PARTIALLY_DISPATCHED"
  | "FULLY_DISPATCHED"
  | "CLOSED";

export type DispatchStatus =
  | "DISPATCHED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "POD_RECEIVED";

export type PaymentStatus =
  | "INVOICE_GENERATED"
  | "OUTSTANDING"
  | "PART_PAYMENT"
  | "FULLY_PAID"
  | "CLOSED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface SupplierMaster {
  id: string; // SUP-{seq}
  name: string;
  type: "Farmer" | "Trader" | "Aggregator" | "Company";
  villageOrCity: string;
  contactNumber: string;
  materialSupplied: string[];
  bankAccountNumber?: string;
  bankIfsc?: string;
  gstin?: string;
  isActive: boolean;
}

export interface StorageLocation {
  id: string;
  name: string; // e.g. Yard A, Warehouse 1, Shed 2
  type: "Raw Material" | "Finished Goods" | "Rejects / Quarantine";
  capacityMt: number;
  currentStockMt: number;
}
