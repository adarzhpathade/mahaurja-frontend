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
  id: string; // MAT-seq
  name: string;
  category: "RAW_BIOMASS" | "FINISHED_PELLET";
  unit: "MT";
  targetMoistureMax: number; // %
  targetAshMax: number; // %
  targetGcvMin: number; // kcal/kg
  baseRatePerMt: number; // INR
  currentInventoryMt: number;
  isActive: boolean;
}

export interface StorageLocationItem {
  id: string; // LOC-seq
  name: string;
  type: "Raw Material Yard" | "Finished Goods Shed" | "Quarantine Hold";
  capacityMt: number;
  currentStockMt: number;
  currentMaterial: string;
  supervisorName: string;
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
