export interface SupplierItem {
  id: string; // uuid
  code?: string; // SUP-000001
  name: string;
  type: "Farmer" | "Trader" | "Aggregator" | "Company";
  villageOrCity: string;
  district: string;
  contactPerson: string;
  contactNumber: string;
  materialsSupplied: string[];
  materialIds?: string[];
  gstin?: string;
  pan?: string;
  bankAccount?: string;
  bankIfsc?: string;
  bankName?: string;
  bankBranch?: string;
  remarks?: string;
  totalSuppliedMt: number;
  totalPayoutInr: number;
  isActive: boolean;
  version?: number;
  createdAt: string;
}

export interface CustomerDeliveryAddress {
  id?: string;
  label?: string;
  siteName?: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  gstin?: string;
  isDefault?: boolean;
}

export interface CustomerItem {
  id: string; // uuid
  code?: string; // CUST-000001
  companyName: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  gstin: string;
  pan?: string;
  deliveryAddress: string;
  destinationState: string;
  deliveryAddresses?: CustomerDeliveryAddress[];
  paymentTerms: string; // e.g. "30 Days Credit"
  creditLimitInr: number;
  creditLimitPaise?: number;
  outstandingBalanceInr: number;
  preferredProduct: string; // e.g. "8mm Premium Biomass Pellet"
  status?: "LEAD" | "PROSPECT" | "TRIAL" | "ACTIVE" | "INACTIVE";
  totalOrdersMt: number;
  isActive: boolean;
  version?: number;
  createdAt: string;
}

export interface TransporterItem {
  id: string;
  code: string;
  name: string;
  contactPerson?: string;
  contactNumber: string;
  mobile: string;
  gstin?: string;
  pan?: string;
  address?: string;
  city?: string;
  state?: string;
  bankAccount?: string;
  bankIfsc?: string;
  bankName?: string;
  vehicleCount: number;
  isActive: boolean;
  version: number;
  createdAt: string;
}

export interface VehicleExpiringDocument {
  document: "insurance" | "fitness" | "permit" | "puc";
  expiryDate: string;
  daysRemaining: number;
  isExpired: boolean;
  status: "EXPIRED" | "EXPIRING_SOON" | "VALID";
}

export interface VehicleItem {
  id: string;
  code: string;
  vehicleNumber: string;
  displayNumber: string;
  vehicleType: string;
  capacityKg: number;
  capacityMt: number;
  transporterId?: string;
  transporterName?: string;
  ownerName?: string;
  ownerMobile?: string;
  insuranceExpiry?: string;
  fitnessExpiry?: string;
  permitExpiry?: string;
  pucExpiry?: string;
  expiringDocuments?: VehicleExpiringDocument[];
  hasExpiringDocs: boolean;
  isActive: boolean;
  version: number;
  createdAt: string;
}

export interface DriverItem {
  id: string;
  code: string;
  name: string;
  mobile: string;
  alternateMobile?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  transporterId?: string;
  transporterName?: string;
  licenseStatus?: "EXPIRED" | "EXPIRING_SOON" | "VALID" | "UNKNOWN";
  licenseDaysRemaining?: number;
  isActive: boolean;
  version: number;
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
  id: string;
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
