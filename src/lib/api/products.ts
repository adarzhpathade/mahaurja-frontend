import { apiRequest } from "@/lib/api/client";

export interface ApiProduct {
  id: string;
  code: string;
  name: string;
  diameterMm: number;
  gcvMin: number;
  gcvMax?: number | null;
  moistureMax: number;
  ashMax: number;
  finesMax?: number | null;
  bulkDensityMin?: number | null;
  packagingOptions: string[];
  hsn: string;
  unit: string;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProducts {
  data: ApiProduct[];
  total: number;
  page: number;
  pageSize: number;
}

export const productsApi = {
  async list(params?: { q?: string; isActive?: boolean }): Promise<ApiProduct[]> {
    const res = await apiRequest<PaginatedProducts>("/api/v1/products", {
      query: {
        pageSize: 100,
        ...params,
      },
    });
    return res.data;
  },

  async get(id: string): Promise<ApiProduct> {
    return await apiRequest<ApiProduct>(`/api/v1/products/${id}`);
  },
};
