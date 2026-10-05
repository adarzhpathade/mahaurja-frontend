import { apiRequest } from "@/lib/api/client";
import { StorageLocationItem } from "@/lib/types/admin";

export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiStorageLocation {
  id: string;
  code: string;
  name: string;
  type: string;
  displayType: string;
  capacityKg: number;
  capacityMt: number;
  currentStockKg: number;
  currentStockMt: number;
  primaryMaterialId?: string | null;
  currentMaterial: string;
  supervisorName?: string | null;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export function toStorageLocationItem(loc: ApiStorageLocation): StorageLocationItem {
  return {
    id: loc.id,
    code: loc.code,
    name: loc.name,
    type: loc.displayType || loc.type,
    displayType: loc.displayType,
    capacityMt: loc.capacityMt,
    currentStockMt: loc.currentStockMt,
    currentMaterial: loc.currentMaterial || "Unassigned",
    supervisorName: loc.supervisorName || "Unassigned",
    isActive: loc.isActive,
    version: loc.version,
  };
}

export interface CreateStorageLocationInput {
  code?: string;
  name: string;
  type: string;
  capacityMt: number;
  primaryMaterialId?: string | null;
  primaryMaterialCode?: string | null;
  supervisorName?: string | null;
  isActive?: boolean;
}

export interface UpdateStorageLocationInput {
  name?: string;
  type?: string;
  capacityMt?: number;
  primaryMaterialId?: string | null;
  primaryMaterialCode?: string | null;
  supervisorName?: string | null;
  isActive?: boolean;
  version?: number;
}

export const storageLocationsApi = {
  async list(): Promise<StorageLocationItem[]> {
    const res = await apiRequest<Paginated<ApiStorageLocation>>("/api/v1/storage-locations", {
      query: { pageSize: 100 },
    });
    return res.data.map(toStorageLocationItem);
  },

  async get(id: string): Promise<StorageLocationItem> {
    const res = await apiRequest<ApiStorageLocation>(`/api/v1/storage-locations/${id}`);
    return toStorageLocationItem(res);
  },

  async create(input: CreateStorageLocationInput): Promise<StorageLocationItem> {
    const res = await apiRequest<ApiStorageLocation>("/api/v1/storage-locations", {
      method: "POST",
      body: input,
    });
    return toStorageLocationItem(res);
  },

  async update(
    id: string,
    input: UpdateStorageLocationInput,
    version?: number,
  ): Promise<StorageLocationItem> {
    const headers: Record<string, string> = {};
    const v = version ?? input.version;
    if (v !== undefined) {
      headers["If-Match"] = `"${v}"`;
    }
    const res = await apiRequest<ApiStorageLocation>(`/api/v1/storage-locations/${id}`, {
      method: "PATCH",
      headers,
      body: input,
    });
    return toStorageLocationItem(res);
  },
};
