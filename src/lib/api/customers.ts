import { apiRequest } from "@/lib/api/client";
import { CustomerDeliveryAddress, CustomerItem } from "@/lib/types/admin";

export type { CustomerDeliveryAddress, CustomerItem };

export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export type CustomerStatus = "LEAD" | "PROSPECT" | "TRIAL" | "ACTIVE" | "INACTIVE";

export interface ApiDeliveryAddress {
  id?: string;
  customerId?: string;
  label?: string;
  siteName?: string;
  address: string;
  city: string;
  state: string;
  pincode?: string | null;
  gstin?: string | null;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiCustomer {
  id: string;
  code: string;
  companyName: string;
  name?: string;
  contactPerson: string;
  contactNumber: string;
  mobile?: string;
  email?: string | null;
  gstin: string;
  pan?: string | null;
  industryType?: string | null;
  location?: string | null;
  boilerType?: string | null;
  existingFuel?: string | null;
  currentConsumptionMt?: number | null;
  requiredDiameterMm?: number | null;
  requiredGcvMin?: number | null;
  monthlyRequirementMt?: number | null;
  paymentTerms: string;
  creditLimitInr: number;
  creditLimitPaise: number;
  outstandingBalanceInr: number;
  preferredProduct?: string | null;
  deliveryAddress?: string | null;
  destinationState?: string | null;
  deliveryAddresses?: ApiDeliveryAddress[];
  salesExecutive?: string | null;
  status: CustomerStatus;
  totalOrdersMt: number;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export function toCustomerItem(cust: ApiCustomer): CustomerItem {
  return {
    id: cust.id,
    code: cust.code,
    companyName: cust.companyName || cust.name || "",
    contactPerson: cust.contactPerson,
    contactNumber: cust.contactNumber || cust.mobile || "",
    email: cust.email || "",
    gstin: cust.gstin,
    pan: cust.pan || undefined,
    deliveryAddress: cust.deliveryAddress || "",
    destinationState: cust.destinationState || "Madhya Pradesh",
    deliveryAddresses: (cust.deliveryAddresses || []).map((a) => ({
      id: a.id,
      label: a.label || a.siteName || "Delivery Site",
      siteName: a.siteName,
      address: a.address,
      city: a.city,
      state: a.state,
      pincode: a.pincode || undefined,
      gstin: a.gstin || undefined,
      isDefault: a.isDefault,
    })),
    paymentTerms: cust.paymentTerms || "30 Days Credit",
    creditLimitInr: cust.creditLimitInr ?? (cust.creditLimitPaise ? cust.creditLimitPaise / 100 : 0),
    creditLimitPaise: cust.creditLimitPaise,
    outstandingBalanceInr: cust.outstandingBalanceInr || 0,
    preferredProduct: cust.preferredProduct || "",
    status: cust.status,
    totalOrdersMt: cust.totalOrdersMt || 0,
    isActive: cust.isActive,
    version: cust.version,
    createdAt: cust.createdAt,
  };
}

export interface ListCustomersParams {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: CustomerStatus | "ALL";
  isActive?: boolean;
}

export interface CreateCustomerInput {
  companyName: string;
  contactPerson: string;
  contactNumber: string;
  email?: string;
  gstin: string;
  pan?: string;
  paymentTerms?: string;
  creditLimitInr?: number;
  preferredProduct?: string;
  deliveryAddress?: string;
  destinationState?: string;
  deliveryAddresses?: Array<{
    label?: string;
    siteName?: string;
    address: string;
    city: string;
    state: string;
    pincode?: string;
    gstin?: string;
    isDefault?: boolean;
  }>;
  status?: CustomerStatus;
  isActive?: boolean;
}

export interface UpdateCustomerInput {
  companyName?: string;
  contactPerson?: string;
  contactNumber?: string;
  email?: string | null;
  gstin?: string;
  pan?: string | null;
  paymentTerms?: string;
  creditLimitInr?: number;
  preferredProduct?: string | null;
  deliveryAddress?: string | null;
  destinationState?: string;
  status?: CustomerStatus;
  isActive?: boolean;
  version?: number;
}

export const customersApi = {
  async list(params?: ListCustomersParams): Promise<CustomerItem[]> {
    const query: Record<string, string | number | boolean> = {
      pageSize: params?.pageSize ?? 100,
    };
    if (params?.page) query.page = params.page;
    if (params?.q && params.q.trim()) query.q = params.q.trim();
    if (params?.status && params.status !== "ALL") query.status = params.status;
    if (params?.isActive !== undefined) query.isActive = params.isActive;

    const res = await apiRequest<Paginated<ApiCustomer>>("/api/v1/customers", {
      query,
    });
    return res.data.map(toCustomerItem);
  },

  async get(id: string): Promise<CustomerItem> {
    const res = await apiRequest<ApiCustomer>(`/api/v1/customers/${id}`);
    return toCustomerItem(res);
  },

  async create(input: CreateCustomerInput): Promise<CustomerItem> {
    const res = await apiRequest<ApiCustomer>("/api/v1/customers", {
      method: "POST",
      body: input,
    });
    return toCustomerItem(res);
  },

  async update(id: string, input: UpdateCustomerInput, version?: number): Promise<CustomerItem> {
    const headers: Record<string, string> = {};
    const v = version ?? input.version;
    if (v !== undefined) {
      headers["If-Match"] = `"${v}"`;
    }
    const res = await apiRequest<ApiCustomer>(`/api/v1/customers/${id}`, {
      method: "PATCH",
      headers,
      body: input,
    });
    return toCustomerItem(res);
  },

  async deactivate(id: string, version?: number): Promise<CustomerItem> {
    const headers: Record<string, string> = {};
    if (version !== undefined) {
      headers["If-Match"] = `"${version}"`;
    }
    const res = await apiRequest<ApiCustomer>(`/api/v1/customers/${id}/deactivate`, {
      method: "POST",
      headers,
    });
    return toCustomerItem(res);
  },
};
