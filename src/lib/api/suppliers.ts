import { apiRequest } from "@/lib/api/client";
import { SupplierItem } from "@/lib/types/admin";

export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export type SupplierType = "Farmer" | "Trader" | "Aggregator" | "Company";

export interface ApiSupplier {
  id: string;
  code: string;
  name: string;
  type: SupplierType;
  contactPerson?: string | null;
  contactNumber: string;
  mobile: string;
  alternateMobile?: string | null;
  villageOrCity?: string | null;
  village?: string | null;
  tehsil?: string | null;
  district?: string | null;
  state?: string | null;
  pincode?: string | null;
  materialsSupplied: string[];
  materialIds: string[];
  gstin?: string | null;
  pan?: string | null;
  bankAccount?: string | null;
  bankIfsc?: string | null;
  bankName?: string | null;
  bankBranch?: string | null;
  landAreaAcres?: number | null;
  seasonalAvailability?: string | null;
  remarks?: string | null;
  totalSuppliedMt: number;
  totalPayoutInr: number;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export function toSupplierItem(sup: ApiSupplier): SupplierItem {
  return {
    id: sup.id,
    code: sup.code,
    name: sup.name,
    type: sup.type,
    villageOrCity: sup.villageOrCity || sup.village || "",
    district: sup.district || "",
    contactPerson: sup.contactPerson || sup.name,
    contactNumber: sup.mobile || sup.contactNumber || "",
    materialsSupplied: sup.materialsSupplied || [],
    materialIds: sup.materialIds || [],
    gstin: sup.gstin || undefined,
    pan: sup.pan || undefined,
    bankAccount: sup.bankAccount || undefined,
    bankIfsc: sup.bankIfsc || undefined,
    bankName: sup.bankName || undefined,
    bankBranch: sup.bankBranch || undefined,
    remarks: sup.remarks || undefined,
    totalSuppliedMt: sup.totalSuppliedMt || 0,
    totalPayoutInr: sup.totalPayoutInr || 0,
    isActive: sup.isActive,
    version: sup.version,
    createdAt: sup.createdAt,
  };
}

export interface ListSuppliersParams {
  page?: number;
  pageSize?: number;
  q?: string;
  type?: SupplierType | "ALL";
  isActive?: boolean;
}

export interface CreateSupplierInput {
  name: string;
  type?: SupplierType;
  mobile: string;
  alternateMobile?: string;
  contactPerson?: string;
  village?: string;
  villageOrCity?: string;
  tehsil?: string;
  district?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
  pan?: string;
  bankAccount?: string;
  bankIfsc?: string;
  bankName?: string;
  bankBranch?: string;
  landAreaAcres?: number;
  seasonalAvailability?: string;
  remarks?: string;
  materialsSupplied?: string[];
  materialIds?: string[];
  isActive?: boolean;
}

export interface QuickRegisterSupplierInput {
  name: string;
  mobile: string;
  village: string;
  district?: string;
  type?: SupplierType;
  materialIds?: string[];
  remarks?: string;
}

export interface UpdateSupplierInput {
  name?: string;
  type?: SupplierType;
  mobile?: string;
  alternateMobile?: string | null;
  contactPerson?: string | null;
  village?: string | null;
  villageOrCity?: string | null;
  tehsil?: string | null;
  district?: string | null;
  state?: string;
  pincode?: string | null;
  gstin?: string | null;
  pan?: string | null;
  bankAccount?: string | null;
  bankIfsc?: string | null;
  bankName?: string | null;
  bankBranch?: string | null;
  remarks?: string | null;
  materialsSupplied?: string[];
  materialIds?: string[];
  isActive?: boolean;
  version?: number;
}

export const suppliersApi = {
  async list(params?: ListSuppliersParams): Promise<SupplierItem[]> {
    const query: Record<string, string | number | boolean> = {
      pageSize: params?.pageSize ?? 100,
    };
    if (params?.page) query.page = params.page;
    if (params?.q && params.q.trim()) query.q = params.q.trim();
    if (params?.type && params.type !== "ALL") query.type = params.type;
    if (params?.isActive !== undefined) query.isActive = params.isActive;

    const res = await apiRequest<Paginated<ApiSupplier>>("/api/v1/suppliers", {
      query,
    });
    return res.data.map(toSupplierItem);
  },

  async get(id: string): Promise<SupplierItem> {
    const res = await apiRequest<ApiSupplier>(`/api/v1/suppliers/${id}`);
    return toSupplierItem(res);
  },

  async create(input: CreateSupplierInput): Promise<SupplierItem> {
    const res = await apiRequest<ApiSupplier>("/api/v1/suppliers", {
      method: "POST",
      body: input,
    });
    return toSupplierItem(res);
  },

  async quickRegister(input: QuickRegisterSupplierInput): Promise<SupplierItem> {
    const res = await apiRequest<ApiSupplier>("/api/v1/suppliers/quick", {
      method: "POST",
      body: input,
    });
    return toSupplierItem(res);
  },

  async update(id: string, input: UpdateSupplierInput, version?: number): Promise<SupplierItem> {
    const headers: Record<string, string> = {};
    const v = version ?? input.version;
    if (v !== undefined) {
      headers["If-Match"] = `"${v}"`;
    }
    const res = await apiRequest<ApiSupplier>(`/api/v1/suppliers/${id}`, {
      method: "PATCH",
      headers,
      body: input,
    });
    return toSupplierItem(res);
  },

  async deactivate(id: string, version?: number): Promise<SupplierItem> {
    const headers: Record<string, string> = {};
    if (version !== undefined) {
      headers["If-Match"] = `"${version}"`;
    }
    const res = await apiRequest<ApiSupplier>(`/api/v1/suppliers/${id}/deactivate`, {
      method: "POST",
      headers,
    });
    return toSupplierItem(res);
  },
};
