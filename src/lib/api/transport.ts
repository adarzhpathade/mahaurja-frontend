import { apiRequest } from "@/lib/api/client";
import { DriverItem, TransporterItem, VehicleExpiringDocument, VehicleItem } from "@/lib/types/admin";

export type { DriverItem, TransporterItem, VehicleExpiringDocument, VehicleItem };

export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export const VEHICLE_TYPES = [
  "TRUCK_10_TYRE",
  "TRUCK_6_TYRE",
  "TRUCK_12_TYRE",
  "TRUCK_14_TYRE",
  "TRAILER",
  "TRACTOR",
  "TIPPER",
  "OTHER",
] as const;

export type VehicleType = (typeof VEHICLE_TYPES)[number];

// ONE plain-English label map for all vehicle types
export const VEHICLE_TYPE_LABELS: Record<string, string> = {
  TRUCK_10_TYRE: "10-Wheeler Tipper",
  TRUCK_6_TYRE: "6-Wheeler Truck",
  TRUCK_12_TYRE: "12-Wheeler Truck",
  TRUCK_14_TYRE: "14-Wheeler Heavy Truck",
  TRAILER: "Multi-Axle Trailer",
  TRACTOR: "Tractor Trolley",
  TIPPER: "Tipper",
  OTHER: "Other Commercial Vehicle",
};

export function normalizeVehicleNumber(raw: string): string {
  return raw.replace(/[\s\-_.]/g, "").toUpperCase();
}

export function formatVehicleDisplay(raw: string): string {
  const norm = normalizeVehicleNumber(raw);
  const bh = norm.match(/^(\d{2})(BH)(\d{4})([A-Z]{1,2})$/);
  if (bh) {
    return `${bh[1]} ${bh[2]} ${bh[3]} ${bh[4]}`;
  }
  const m = norm.match(/^([A-Z]{2})(\d{1,2})([A-Z]{0,3})(\d{1,4})$/);
  if (m) {
    return [m[1], m[2], m[3], m[4]].filter(Boolean).join(" ");
  }
  return norm;
}

// ==========================================
// Transporters
// ==========================================
export interface ApiTransporter {
  id: string;
  code: string;
  name: string;
  contactPerson?: string | null;
  contactNumber: string;
  mobile: string;
  gstin?: string | null;
  pan?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  bankAccount?: string | null;
  bankIfsc?: string | null;
  bankName?: string | null;
  vehicleCount: number;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export function toTransporterItem(trn: ApiTransporter): TransporterItem {
  return {
    id: trn.id,
    code: trn.code,
    name: trn.name,
    contactPerson: trn.contactPerson || undefined,
    contactNumber: trn.mobile || trn.contactNumber,
    mobile: trn.mobile,
    gstin: trn.gstin || undefined,
    pan: trn.pan || undefined,
    address: trn.address || undefined,
    city: trn.city || undefined,
    state: trn.state || "Madhya Pradesh",
    bankAccount: trn.bankAccount || undefined,
    bankIfsc: trn.bankIfsc || undefined,
    bankName: trn.bankName || undefined,
    vehicleCount: trn.vehicleCount || 0,
    isActive: trn.isActive,
    version: trn.version,
    createdAt: trn.createdAt,
  };
}

export interface CreateTransporterInput {
  name: string;
  contactPerson?: string;
  mobile: string;
  gstin?: string;
  pan?: string;
  address?: string;
  city?: string;
  state?: string;
  bankAccount?: string;
  bankIfsc?: string;
  bankName?: string;
  isActive?: boolean;
}

export interface UpdateTransporterInput {
  name?: string;
  contactPerson?: string | null;
  mobile?: string;
  gstin?: string | null;
  pan?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string;
  bankAccount?: string | null;
  bankIfsc?: string | null;
  bankName?: string | null;
  isActive?: boolean;
  version?: number;
}

export const transportersApi = {
  async list(params?: { q?: string; isActive?: boolean; page?: number; pageSize?: number }): Promise<TransporterItem[]> {
    const query: Record<string, string | number | boolean> = {
      pageSize: params?.pageSize ?? 100,
    };
    if (params?.page) query.page = params.page;
    if (params?.q && params.q.trim()) query.q = params.q.trim();
    if (params?.isActive !== undefined) query.isActive = params.isActive;

    const res = await apiRequest<Paginated<ApiTransporter>>("/api/v1/transporters", { query });
    return res.data.map(toTransporterItem);
  },

  async get(id: string): Promise<TransporterItem> {
    const res = await apiRequest<ApiTransporter>(`/api/v1/transporters/${id}`);
    return toTransporterItem(res);
  },

  async create(input: CreateTransporterInput): Promise<TransporterItem> {
    const res = await apiRequest<ApiTransporter>("/api/v1/transporters", {
      method: "POST",
      body: input,
    });
    return toTransporterItem(res);
  },

  async update(id: string, input: UpdateTransporterInput, version?: number): Promise<TransporterItem> {
    const headers: Record<string, string> = {};
    const v = version ?? input.version;
    if (v !== undefined) {
      headers["If-Match"] = `"${v}"`;
    }
    const res = await apiRequest<ApiTransporter>(`/api/v1/transporters/${id}`, {
      method: "PATCH",
      headers,
      body: input,
    });
    return toTransporterItem(res);
  },

  async deactivate(id: string, version?: number): Promise<TransporterItem> {
    const headers: Record<string, string> = {};
    if (version !== undefined) {
      headers["If-Match"] = `"${version}"`;
    }
    const res = await apiRequest<ApiTransporter>(`/api/v1/transporters/${id}/deactivate`, {
      method: "POST",
      headers,
    });
    return toTransporterItem(res);
  },
};

// ==========================================
// Vehicles
// ==========================================
export interface ApiVehicle {
  id: string;
  code: string;
  vehicleNumber: string;
  displayNumber: string;
  vehicleType: string;
  capacityKg: number;
  capacityMt: number;
  transporterId?: string | null;
  transporterName?: string | null;
  ownerName?: string | null;
  ownerMobile?: string | null;
  insuranceExpiry?: string | null;
  fitnessExpiry?: string | null;
  permitExpiry?: string | null;
  pucExpiry?: string | null;
  expiringDocuments?: VehicleExpiringDocument[];
  hasExpiringDocs: boolean;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export function toVehicleItem(v: ApiVehicle): VehicleItem {
  return {
    id: v.id,
    code: v.code,
    vehicleNumber: v.vehicleNumber,
    displayNumber: v.displayNumber || formatVehicleDisplay(v.vehicleNumber),
    vehicleType: v.vehicleType,
    capacityKg: v.capacityKg || 0,
    capacityMt: v.capacityMt || (v.capacityKg ? v.capacityKg / 1000 : 0),
    transporterId: v.transporterId || undefined,
    transporterName: v.transporterName || undefined,
    ownerName: v.ownerName || undefined,
    ownerMobile: v.ownerMobile || undefined,
    insuranceExpiry: v.insuranceExpiry || undefined,
    fitnessExpiry: v.fitnessExpiry || undefined,
    permitExpiry: v.permitExpiry || undefined,
    pucExpiry: v.pucExpiry || undefined,
    expiringDocuments: v.expiringDocuments || [],
    hasExpiringDocs: v.hasExpiringDocs || (v.expiringDocuments && v.expiringDocuments.length > 0) || false,
    isActive: v.isActive,
    version: v.version,
    createdAt: v.createdAt,
  };
}

export interface CreateVehicleInput {
  vehicleNumber: string;
  vehicleType?: string;
  capacityMt?: number;
  capacityKg?: number;
  transporterId?: string | null;
  ownerName?: string;
  ownerMobile?: string;
  insuranceExpiry?: string;
  fitnessExpiry?: string;
  permitExpiry?: string;
  pucExpiry?: string;
  isActive?: boolean;
}

export interface UpdateVehicleInput {
  vehicleNumber?: string;
  vehicleType?: string;
  capacityMt?: number;
  capacityKg?: number;
  transporterId?: string | null;
  ownerName?: string | null;
  ownerMobile?: string | null;
  insuranceExpiry?: string | null;
  fitnessExpiry?: string | null;
  permitExpiry?: string | null;
  pucExpiry?: string | null;
  isActive?: boolean;
  version?: number;
}

export const vehiclesApi = {
  async list(params?: {
    q?: string;
    vehicleType?: string;
    transporterId?: string;
    isActive?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<VehicleItem[]> {
    const query: Record<string, string | number | boolean> = {
      pageSize: params?.pageSize ?? 100,
    };
    if (params?.page) query.page = params.page;
    if (params?.q && params.q.trim()) query.q = params.q.trim();
    if (params?.vehicleType && params.vehicleType !== "ALL") query.vehicleType = params.vehicleType;
    if (params?.transporterId) query.transporterId = params.transporterId;
    if (params?.isActive !== undefined) query.isActive = params.isActive;

    const res = await apiRequest<Paginated<ApiVehicle>>("/api/v1/vehicles", { query });
    return res.data.map(toVehicleItem);
  },

  async getExpiring(days = 30): Promise<VehicleItem[]> {
    const res = await apiRequest<{ data: ApiVehicle[]; total: number }>("/api/v1/vehicles/expiring", {
      query: { days },
    });
    return res.data.map(toVehicleItem);
  },

  async get(id: string): Promise<VehicleItem> {
    const res = await apiRequest<ApiVehicle>(`/api/v1/vehicles/${id}`);
    return toVehicleItem(res);
  },

  async create(input: CreateVehicleInput): Promise<VehicleItem> {
    const res = await apiRequest<ApiVehicle>("/api/v1/vehicles", {
      method: "POST",
      body: input,
    });
    return toVehicleItem(res);
  },

  async update(id: string, input: UpdateVehicleInput, version?: number): Promise<VehicleItem> {
    const headers: Record<string, string> = {};
    const v = version ?? input.version;
    if (v !== undefined) {
      headers["If-Match"] = `"${v}"`;
    }
    const res = await apiRequest<ApiVehicle>(`/api/v1/vehicles/${id}`, {
      method: "PATCH",
      headers,
      body: input,
    });
    return toVehicleItem(res);
  },

  async deactivate(id: string, version?: number): Promise<VehicleItem> {
    const headers: Record<string, string> = {};
    if (version !== undefined) {
      headers["If-Match"] = `"${version}"`;
    }
    const res = await apiRequest<ApiVehicle>(`/api/v1/vehicles/${id}/deactivate`, {
      method: "POST",
      headers,
    });
    return toVehicleItem(res);
  },
};

// ==========================================
// Drivers
// ==========================================
export interface ApiDriver {
  id: string;
  code: string;
  name: string;
  mobile: string;
  alternateMobile?: string | null;
  licenseNumber?: string | null;
  licenseExpiry?: string | null;
  transporterId?: string | null;
  transporterName?: string | null;
  licenseStatus?: "EXPIRED" | "EXPIRING_SOON" | "VALID" | "UNKNOWN";
  licenseDaysRemaining?: number | null;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export function toDriverItem(d: ApiDriver): DriverItem {
  return {
    id: d.id,
    code: d.code,
    name: d.name,
    mobile: d.mobile,
    alternateMobile: d.alternateMobile || undefined,
    licenseNumber: d.licenseNumber || undefined,
    licenseExpiry: d.licenseExpiry || undefined,
    transporterId: d.transporterId || undefined,
    transporterName: d.transporterName || undefined,
    licenseStatus: d.licenseStatus,
    licenseDaysRemaining: d.licenseDaysRemaining ?? undefined,
    isActive: d.isActive,
    version: d.version,
    createdAt: d.createdAt,
  };
}

export interface CreateDriverInput {
  name: string;
  mobile: string;
  alternateMobile?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  transporterId?: string | null;
  isActive?: boolean;
}

export interface UpdateDriverInput {
  name?: string;
  mobile?: string;
  alternateMobile?: string | null;
  licenseNumber?: string | null;
  licenseExpiry?: string | null;
  transporterId?: string | null;
  isActive?: boolean;
  version?: number;
}

export const driversApi = {
  async list(params?: {
    q?: string;
    transporterId?: string;
    isActive?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<DriverItem[]> {
    const query: Record<string, string | number | boolean> = {
      pageSize: params?.pageSize ?? 100,
    };
    if (params?.page) query.page = params.page;
    if (params?.q && params.q.trim()) query.q = params.q.trim();
    if (params?.transporterId) query.transporterId = params.transporterId;
    if (params?.isActive !== undefined) query.isActive = params.isActive;

    const res = await apiRequest<Paginated<ApiDriver>>("/api/v1/drivers", { query });
    return res.data.map(toDriverItem);
  },

  async get(id: string): Promise<DriverItem> {
    const res = await apiRequest<ApiDriver>(`/api/v1/drivers/${id}`);
    return toDriverItem(res);
  },

  async create(input: CreateDriverInput): Promise<DriverItem> {
    const res = await apiRequest<ApiDriver>("/api/v1/drivers", {
      method: "POST",
      body: input,
    });
    return toDriverItem(res);
  },

  async update(id: string, input: UpdateDriverInput, version?: number): Promise<DriverItem> {
    const headers: Record<string, string> = {};
    const v = version ?? input.version;
    if (v !== undefined) {
      headers["If-Match"] = `"${v}"`;
    }
    const res = await apiRequest<ApiDriver>(`/api/v1/drivers/${id}`, {
      method: "PATCH",
      headers,
      body: input,
    });
    return toDriverItem(res);
  },

  async deactivate(id: string, version?: number): Promise<DriverItem> {
    const headers: Record<string, string> = {};
    if (version !== undefined) {
      headers["If-Match"] = `"${version}"`;
    }
    const res = await apiRequest<ApiDriver>(`/api/v1/drivers/${id}/deactivate`, {
      method: "POST",
      headers,
    });
    return toDriverItem(res);
  },
};
