import { UserRole } from "../types";

export const APP_NAME = "MAHAURJA";
export const COMPANY_NAME = "Bharat Industrial & Renewables LLP";

export const ROLE_CONFIG: Record<
  UserRole,
  { label: string; description: string; defaultRoute: string }
> = {
  admin: {
    label: "Admin / Super Admin",
    description: "System configuration, user management & master data",
    defaultRoute: "/admin/masters/suppliers",
  },
  gate: {
    label: "Gate / Security",
    description: "Vehicle arrivals, exits, and document checking",
    defaultRoute: "/gate/dashboard",
  },
  weighbridge: {
    label: "Weighbridge Operator",
    description: "Gross, tare & net weighments, slips",
    defaultRoute: "/weighbridge/weighments",
  },
  quality: {
    label: "QC / Lab Technician",
    description: "Sampling, testing parameters & COA",
    defaultRoute: "/quality/rm-testing",
  },
  inventory: {
    label: "Warehouse / Inventory",
    description: "Location-wise RM & FG stock and lot tracking",
    defaultRoute: "/inventory/raw-materials",
  },
  production: {
    label: "Production Supervisor",
    description: "Plans, material issues, processing stages & batches",
    defaultRoute: "/production/plans",
  },
  sales: {
    label: "Sales & Dispatch",
    description: "Orders, dispatch planning, invoicing & payments",
    defaultRoute: "/sales/orders",
  },
  management: {
    label: "Management / Plant Director",
    description: "Plant KPIs, forward & reverse traceability, reports",
    defaultRoute: "/management/dashboard",
  },
};

export const ID_PREFIXES = {
  SUPPLIER: "SUP-",
  RM_GATE_ENTRY: "RM-GATE-",
  QC_REPORT_RM: "QC-",
  RM_RECEIPT: "RM-",
  RM_LOT: "RMLOT-",
  PRODUCTION_PLAN: "PRD-",
  MATERIAL_ISSUE: "ISS-",
  PRODUCTION_BATCH: "PB-",
  FG_BATCH: "FG-BATCH-",
  FG_QC_REPORT: "FG-QC-",
  SALES_ORDER: "SO-",
  DISPATCH: "DIS-",
} as const;
