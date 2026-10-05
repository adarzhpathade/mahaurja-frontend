import { apiRequest } from "@/lib/api/client";

export interface FormulaIngredientDetail {
  id?: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  percentage: number;
}

export interface FormulaItem {
  id: string;
  code: string;
  name: string;
  targetProductId: string;
  targetProductName: string;
  targetProduct: string;
  targetGcvMin: number;
  targetAshMax: number;
  notes: string | null;
  status: "ACTIVE" | "ARCHIVED";
  isActive: boolean;
  versionNo: number;
  version: number;
  ingredients: FormulaIngredientDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedFormulas {
  data: FormulaItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FormulaRequirementRequirement {
  materialId: string;
  materialCode: string;
  materialName: string;
  percentage: number;
  theoreticalKg: number;
  theoreticalMt: number;
}

export interface FormulaRequirementResult {
  formulaId: string;
  formulaCode: string;
  formulaName: string;
  targetMt: number;
  targetKg: number;
  requirements: FormulaRequirementRequirement[];
}

export interface CreateFormulaInput {
  name: string;
  targetProductId: string;
  targetGcvMin: number;
  targetAshMax: number;
  notes?: string | null;
  ingredients: Array<{
    materialId: string;
    percentage: number;
  }>;
}

export interface UpdateFormulaInput {
  name?: string;
  targetProductId?: string;
  targetGcvMin?: number;
  targetAshMax?: number;
  notes?: string | null;
  ingredients?: Array<{
    materialId: string;
    percentage: number;
  }>;
  version?: number;
}

export const formulasApi = {
  async list(params?: { q?: string; status?: "ACTIVE" | "ARCHIVED" | "ALL" }): Promise<FormulaItem[]> {
    const res = await apiRequest<PaginatedFormulas>("/api/v1/formulas", {
      query: {
        pageSize: 100,
        status: params?.status ?? "ACTIVE",
        q: params?.q,
      },
    });
    return res.data;
  },

  async get(id: string): Promise<FormulaItem> {
    return await apiRequest<FormulaItem>(`/api/v1/formulas/${id}`);
  },

  async getVersions(id: string): Promise<FormulaItem[]> {
    return await apiRequest<FormulaItem[]>(`/api/v1/formulas/${id}/versions`);
  },

  async getRequirement(id: string, targetMt: number): Promise<FormulaRequirementResult> {
    return await apiRequest<FormulaRequirementResult>(`/api/v1/formulas/${id}/requirement`, {
      query: { targetMt },
    });
  },

  async create(input: CreateFormulaInput): Promise<FormulaItem> {
    return await apiRequest<FormulaItem>("/api/v1/formulas", {
      method: "POST",
      body: input,
    });
  },

  async update(id: string, input: UpdateFormulaInput, version?: number): Promise<FormulaItem> {
    const headers: Record<string, string> = {};
    const v = version ?? input.version;
    if (v !== undefined) {
      headers["If-Match"] = `"${v}"`;
    }
    return await apiRequest<FormulaItem>(`/api/v1/formulas/${id}`, {
      method: "PATCH",
      headers,
      body: input,
    });
  },

  async archive(id: string, version?: number): Promise<FormulaItem> {
    const headers: Record<string, string> = {};
    if (version !== undefined) {
      headers["If-Match"] = `"${version}"`;
    }
    return await apiRequest<FormulaItem>(`/api/v1/formulas/${id}/archive`, {
      method: "POST",
      headers,
    });
  },
};
