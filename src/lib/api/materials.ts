import { apiRequest } from "@/lib/api/client";
import { MaterialItem } from "@/lib/types/admin";

export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiMaterial {
  id: string;
  code: string;
  name: string;
  category: "RAW_BIOMASS" | "FINISHED_PELLET";
  unit: string;
  baseRatePerMt: number;
  baseRatePaise: number;
  currentInventoryMt: number;
  isActive: boolean;
  version: number;
  targetMoistureMax: number;
  targetAshMax: number;
  targetGcvMin: number;
  foreignMatterMax?: number | null;
  bulkDensityMin?: number | null;
  createdAt: string;
  updatedAt: string;
}

export function toMaterialItem(mat: ApiMaterial): MaterialItem {
  return {
    id: mat.id,
    code: mat.code,
    name: mat.name,
    category: mat.category,
    unit: mat.unit,
    baseRatePerMt: mat.baseRatePerMt,
    targetMoistureMax: mat.targetMoistureMax,
    targetAshMax: mat.targetAshMax,
    targetGcvMin: mat.targetGcvMin,
    foreignMatterMax: mat.foreignMatterMax,
    bulkDensityMin: mat.bulkDensityMin,
    currentInventoryMt: mat.currentInventoryMt,
    isActive: mat.isActive,
    version: mat.version,
  };
}

export interface CreateMaterialInput {
  code: string;
  name: string;
  category?: "RAW_BIOMASS" | "FINISHED_PELLET";
  unit?: string;
  baseRatePerMt: number;
  targetMoistureMax: number;
  targetAshMax: number;
  targetGcvMin: number;
  foreignMatterMax?: number | null;
  bulkDensityMin?: number | null;
  isActive?: boolean;
}

export interface UpdateMaterialInput {
  name?: string;
  category?: "RAW_BIOMASS" | "FINISHED_PELLET";
  unit?: string;
  baseRatePerMt?: number;
  targetMoistureMax?: number;
  targetAshMax?: number;
  targetGcvMin?: number;
  foreignMatterMax?: number | null;
  bulkDensityMin?: number | null;
  isActive?: boolean;
  version?: number;
}

export const materialsApi = {
  async list(): Promise<MaterialItem[]> {
    const res = await apiRequest<Paginated<ApiMaterial>>("/api/v1/materials", {
      query: { pageSize: 100 },
    });
    return res.data.map(toMaterialItem);
  },

  async get(id: string): Promise<MaterialItem> {
    const res = await apiRequest<ApiMaterial>(`/api/v1/materials/${id}`);
    return toMaterialItem(res);
  },

  async create(input: CreateMaterialInput): Promise<MaterialItem> {
    const res = await apiRequest<ApiMaterial>("/api/v1/materials", {
      method: "POST",
      body: input,
    });
    return toMaterialItem(res);
  },

  async update(id: string, input: UpdateMaterialInput, version?: number): Promise<MaterialItem> {
    const headers: Record<string, string> = {};
    const v = version ?? input.version;
    if (v !== undefined) {
      headers["If-Match"] = `"${v}"`;
    }
    const res = await apiRequest<ApiMaterial>(`/api/v1/materials/${id}`, {
      method: "PATCH",
      headers,
      body: input,
    });
    return toMaterialItem(res);
  },

  async deactivate(id: string, version?: number): Promise<MaterialItem> {
    const headers: Record<string, string> = {};
    if (version !== undefined) {
      headers["If-Match"] = `"${version}"`;
    }
    const res = await apiRequest<ApiMaterial>(`/api/v1/materials/${id}/deactivate`, {
      method: "POST",
      headers,
    });
    return toMaterialItem(res);
  },
};
