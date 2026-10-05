export interface SupplierItem {
  id: string; // SUP-YYMM-seq
  name: string;
  type: "Farmer" | "Trader" | "Aggregator" | "Company";
  villageOrCity: string;
  district: string;
  contactPerson: string;
  contactNumber: string;
  materialsSupplied: string[];
  gstin?: string;
  pan?: string;
  bankAccount?: string;
  bankIfsc?: string;
  totalSuppliedMt: number;
  totalPayoutInr: number;
  isActive: boolean;
  createdAt: string;
}

export interface CustomerItem {
  id: string; // CUST-YYMM-seq
  companyName: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  gstin: string;
  deliveryAddress: string;
  destinationState: string;
  paymentTerms: string; // e.g. "30 Days Credit"
  creditLimitInr: number;
  outstandingBalanceInr: number;
  preferredProduct: string; // e.g. "8mm Premium Biomass Pellet"
  totalOrdersMt: number;
  isActive: boolean;
  createdAt: string;
}

export interface MaterialItem {
  id: string; // MAT-seq or uuid
  code?: string;
  name: string;
  category: "RAW_BIOMASS" | "FINISHED_PELLET";
  unit: "MT" | string;
  targetMoistureMax: number; // %
  targetAshMax: number; // %
  targetGcvMin: number; // kcal/kg
  foreignMatterMax?: number | null;
  bulkDensityMin?: number | null;
  baseRatePerMt: number; // INR
  currentInventoryMt: number;
  isActive: boolean;
  version?: number;
}

export interface StorageLocationItem {
  id: string; // LOC-seq or uuid
  code?: string;
  name: string;
  type: "Raw Material Yard" | "Finished Goods Shed" | "Quarantine Hold" | string;
  displayType?: string;
  capacityMt: number;
  currentStockMt: number;
  currentMaterial: string;
  supervisorName: string;
  isActive?: boolean;
  version?: number;
}

export interface BlendFormulaItem {
  id: string; // FRM-seq
  name: string;
  targetProduct: string; // e.g. "8mm Biomass Pellet"
  targetGcvMin: number; // kcal/kg
  targetAshMax: number; // %
  ingredients: {
    materialName: string;
    percentage: number;
  }[];
  notes?: string;
  isActive: boolean;
}

export interface AdminUserItem {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  department: string;
  roleId:
    | "gate-security"
    | "weighbridge"
    | "sales-dispatch"
    | "qc-lab"
    | "production"
    | "warehouse"
    | "admin"
    | "management"
    | "purchase"
    | "accounts";
  assignedPost: string;
  shift: "Day Shift A (06:00 - 14:00)" | "General Shift (09:00 - 18:00)" | "Night Shift B (14:00 - 22:00)";
  isActive: boolean;
  lastLogin: string;
}
