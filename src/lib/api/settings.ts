import { apiRequest } from "@/lib/api/client";

export interface ApprovalThresholds {
  purchasePricePaiseMax: number;
  expensePaiseMax: number;
  creditLimitInrMax: number;
  weightAdjustmentKgMax: number;
}

export interface DefaultQcTolerances {
  moistureMax: number;
  ashMax: number;
  gcvMin: number;
  foreignMatterMax?: number;
  bulkDensityMin?: number;
}

export interface PlantSettingsData {
  approval_thresholds: ApprovalThresholds;
  low_stock_limits: Record<string, number>;
  default_qc_tolerances: DefaultQcTolerances;
  [key: string]: unknown;
}

export const settingsApi = {
  async get(): Promise<PlantSettingsData> {
    return await apiRequest<PlantSettingsData>("/api/v1/settings");
  },

  async update(settings: Partial<PlantSettingsData>): Promise<PlantSettingsData> {
    return await apiRequest<PlantSettingsData>("/api/v1/settings", {
      method: "PUT",
      body: settings,
    });
  },
};
