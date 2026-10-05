import { apiRequest } from "@/lib/api/client";

// =========================================================================
// Tax Rates
// =========================================================================

export interface TaxRateItem {
  id: string;
  hsn: string;
  hsnSac: string;
  description: string;
  rate: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive?: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTaxRates {
  data: TaxRateItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateTaxRateInput {
  hsn?: string;
  hsnSac?: string;
  description: string;
  rate: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
}

export interface UpdateTaxRateInput {
  description?: string;
  rate?: number;
  effectiveFrom?: string;
  effectiveTo?: string | null;
  version?: number;
}

export const taxRatesApi = {
  async list(params?: { hsn?: string; activeOn?: string }): Promise<TaxRateItem[]> {
    const res = await apiRequest<PaginatedTaxRates>("/api/v1/tax-rates", {
      query: {
        pageSize: 100,
        ...params,
      },
    });
    return res.data;
  },

  async lookup(hsn: string, date?: string): Promise<{ hsn: string; rate: number; effectiveFrom: string; effectiveTo: string | null } | null> {
    return await apiRequest<{ hsn: string; rate: number; effectiveFrom: string; effectiveTo: string | null } | null>(
      "/api/v1/tax-rates/lookup",
      {
        query: { hsn, date },
      },
    );
  },

  async create(input: CreateTaxRateInput): Promise<TaxRateItem> {
    const hsnCode = input.hsnSac || input.hsn;
    return await apiRequest<TaxRateItem>("/api/v1/tax-rates", {
      method: "POST",
      body: {
        ...input,
        hsnSac: hsnCode,
        hsn: hsnCode,
      },
    });
  },

  async update(id: string, input: UpdateTaxRateInput, version?: number): Promise<TaxRateItem> {
    const headers: Record<string, string> = {};
    const v = version ?? input.version;
    if (v !== undefined) {
      headers["If-Match"] = `"${v}"`;
    }
    return await apiRequest<TaxRateItem>(`/api/v1/tax-rates/${id}`, {
      method: "PATCH",
      headers,
      body: input,
    });
  },

  async delete(id: string, version?: number): Promise<{ success: boolean }> {
    const headers: Record<string, string> = {};
    if (version !== undefined) {
      headers["If-Match"] = `"${version}"`;
    }
    return await apiRequest<{ success: boolean }>(`/api/v1/tax-rates/${id}`, {
      method: "DELETE",
      headers,
    });
  },
};

// =========================================================================
// Expense Heads
// =========================================================================

export interface ExpenseHeadItem {
  id: string;
  code: string;
  name: string;
  category: string;
  approvalLimitPaise: number;
  approvalLimitInr: number;
  description: string | null;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedExpenseHeads {
  data: ExpenseHeadItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateExpenseHeadInput {
  name: string;
  code?: string;
  category?: string;
  approvalLimitInr?: number;
  approvalLimitPaise?: number;
  description?: string | null;
  isActive?: boolean;
}

export interface UpdateExpenseHeadInput {
  name?: string;
  category?: string;
  approvalLimitInr?: number;
  approvalLimitPaise?: number;
  description?: string | null;
  isActive?: boolean;
  version?: number;
}

export const expenseHeadsApi = {
  async list(params?: { q?: string; isActive?: boolean }): Promise<ExpenseHeadItem[]> {
    const res = await apiRequest<PaginatedExpenseHeads>("/api/v1/expense-heads", {
      query: {
        pageSize: 100,
        ...params,
      },
    });
    return res.data;
  },

  async create(input: CreateExpenseHeadInput): Promise<ExpenseHeadItem> {
    return await apiRequest<ExpenseHeadItem>("/api/v1/expense-heads", {
      method: "POST",
      body: input,
    });
  },

  async update(id: string, input: UpdateExpenseHeadInput, version?: number): Promise<ExpenseHeadItem> {
    const headers: Record<string, string> = {};
    const v = version ?? input.version;
    if (v !== undefined) {
      headers["If-Match"] = `"${v}"`;
    }
    return await apiRequest<ExpenseHeadItem>(`/api/v1/expense-heads/${id}`, {
      method: "PATCH",
      headers,
      body: input,
    });
  },

  async delete(id: string, version?: number): Promise<{ success: boolean }> {
    const headers: Record<string, string> = {};
    if (version !== undefined) {
      headers["If-Match"] = `"${version}"`;
    }
    return await apiRequest<{ success: boolean }>(`/api/v1/expense-heads/${id}`, {
      method: "DELETE",
      headers,
    });
  },
};

// =========================================================================
// Bank Accounts
// =========================================================================

export interface BankAccountItem {
  id: string;
  name: string;
  accountName?: string;
  bankName: string;
  branch?: string | null;
  accountNumber: string;
  ifsc: string;
  ifscCode?: string;
  openingBalancePaise: number;
  openingBalanceInr: number;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBankAccounts {
  data: BankAccountItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateBankAccountInput {
  name?: string;
  accountName?: string;
  bankName: string;
  branch?: string | null;
  accountNumber: string;
  ifsc?: string;
  ifscCode?: string;
  openingBalanceInr?: number;
  openingBalancePaise?: number;
  isActive?: boolean;
}

export interface UpdateBankAccountInput {
  name?: string;
  accountName?: string;
  bankName?: string;
  branch?: string | null;
  accountNumber?: string;
  ifsc?: string;
  ifscCode?: string;
  openingBalanceInr?: number;
  openingBalancePaise?: number;
  isActive?: boolean;
  version?: number;
}

export const bankAccountsApi = {
  async list(params?: { q?: string; isActive?: boolean }): Promise<BankAccountItem[]> {
    const res = await apiRequest<PaginatedBankAccounts>("/api/v1/bank-accounts", {
      query: {
        pageSize: 100,
        ...params,
      },
    });
    return res.data;
  },

  async create(input: CreateBankAccountInput): Promise<BankAccountItem> {
    const accName = input.accountName || input.name || "";
    const ifscVal = input.ifscCode || input.ifsc || "";
    return await apiRequest<BankAccountItem>("/api/v1/bank-accounts", {
      method: "POST",
      body: {
        ...input,
        accountName: accName,
        name: accName,
        ifscCode: ifscVal,
        ifsc: ifscVal,
      },
    });
  },

  async update(id: string, input: UpdateBankAccountInput, version?: number): Promise<BankAccountItem> {
    const headers: Record<string, string> = {};
    const v = version ?? input.version;
    if (v !== undefined) {
      headers["If-Match"] = `"${v}"`;
    }
    const accName = input.accountName || input.name;
    const ifscVal = input.ifscCode || input.ifsc;
    const body: Record<string, unknown> = { ...input };
    if (accName) {
      body.accountName = accName;
      body.name = accName;
    }
    if (ifscVal) {
      body.ifscCode = ifscVal;
      body.ifsc = ifscVal;
    }
    return await apiRequest<BankAccountItem>(`/api/v1/bank-accounts/${id}`, {
      method: "PATCH",
      headers,
      body,
    });
  },

  async delete(id: string, version?: number): Promise<{ success: boolean }> {
    const headers: Record<string, string> = {};
    if (version !== undefined) {
      headers["If-Match"] = `"${version}"`;
    }
    return await apiRequest<{ success: boolean }>(`/api/v1/bank-accounts/${id}`, {
      method: "DELETE",
      headers,
    });
  },
};
