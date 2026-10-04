export type SalesOrderStatus = "NEW" | "CONFIRMED" | "PARTIALLY_DISPATCHED" | "FULLY_DISPATCHED" | "CLOSED";
export type DispatchStatus = "PLANNED" | "LOADING" | "WEIGHED" | "DISPATCHED" | "IN_TRANSIT" | "DELIVERED" | "POD_RECEIVED";
export type PaymentStatus = "INVOICE_GENERATED" | "OUTSTANDING" | "PART_PAYMENT" | "FULLY_PAID" | "CLOSED";

export interface SalesOrder {
  id: string;                  // SO-261002-015
  orderDate: string;
  customerId: string;
  customerName: string;
  productName: string;
  pelletDiameterMm: number;    // 8.0 mm
  quantityMT: number;
  dispatchedMT: number;
  ratePerMT: number;
  totalAmountINR: number;
  deliveryLocation: string;
  requiredDate: string;
  paymentTerms: string;
  customerSpecs: string;
  status: SalesOrderStatus;
}

export interface DispatchPlan {
  id: string;                  // DIS-261002-001
  salesOrderId: string;
  customerName: string;
  targetQuantityMT: number;
  allocatedFgBatch: string;    // FG-BATCH-261003-009
  vehicleNumber: string;
  driverName: string;
  driverMobile: string;
  transporterName: string;
  grossWeightKg?: number;
  tareWeightKg?: number;
  netDispatchMT?: number;
  weighbridgeSlipNumber?: string;
  status: DispatchStatus;
  plannedDate: string;
  dispatchedDate?: string;
  destination: string;
}

export interface SalesInvoice {
  invoiceNumber: string;       // INV-261004-001
  dispatchNumber: string;
  salesOrderNumber: string;
  customerName: string;
  customerGst: string;
  deliveryAddress: string;
  eWayBillNumber: string;
  lrNumber: string;
  coaNumber: string;
  invoiceDate: string;
  quantityMT: number;
  ratePerMT: number;
  taxableValue: number;
  gstAmount: number;           // 5% or 12%
  totalInvoiceAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  paymentDueDate: string;
  paymentStatus: PaymentStatus;
}

export interface DeliveryRecord {
  id: string;                  // DEL-261004-001
  dispatchNumber: string;
  vehicleNumber: string;
  driverName: string;
  customerName: string;
  deliveryLocation: string;
  dispatchedQuantityMT: number;
  destinationArrivalTime?: string;
  receiverName?: string;
  podDocumentUploaded: boolean;
  customerAckStatus: "CONFIRMED" | "VARIANCE_REPORTED" | "PENDING";
  qualityFeedback?: string;
  status: DispatchStatus;
}
