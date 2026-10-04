"use client";

import React, { createContext, useContext, useState } from "react";
import {
  SalesOrder,
  DispatchPlan,
  SalesInvoice,
  DeliveryRecord,
} from "@/lib/types/sales";

export const INITIAL_ORDERS: SalesOrder[] = [
  {
    id: "SO-261002-015",
    orderDate: "02 Oct 2026",
    customerId: "CUST-00042",
    customerName: "ABC Industries Pvt. Ltd.",
    productName: "MAHAURJA Biomass Pellet",
    pelletDiameterMm: 8.0,
    quantityMT: 50.0,
    dispatchedMT: 15.0,
    ratePerMT: 6800,
    totalAmountINR: 340000,
    deliveryLocation: "MIDC Kurkumbh, Pune, MH",
    requiredDate: "05 Oct 2026",
    paymentTerms: "30 Days Net from Delivery",
    customerSpecs: "8mm Diameter, GCV ≥ 4200 kcal/kg, Moisture ≤ 8%, Ash ≤ 5%",
    status: "PARTIALLY_DISPATCHED",
  },
  {
    id: "SO-261004-001",
    orderDate: "04 Oct 2026",
    customerId: "CUST-00088",
    customerName: "Thermax Energy Solutions",
    productName: "MAHAURJA Biomass Pellet",
    pelletDiameterMm: 8.0,
    quantityMT: 100.0,
    dispatchedMT: 0,
    ratePerMT: 6950,
    totalAmountINR: 695000,
    deliveryLocation: "Chakan Industrial Zone, Pune",
    requiredDate: "08 Oct 2026",
    paymentTerms: "15 Days Post-Delivery",
    customerSpecs: "Pure Biomass 8mm, Bulk Tipper Delivery",
    status: "CONFIRMED",
  },
  {
    id: "SO-261004-002",
    orderDate: "04 Oct 2026",
    customerId: "CUST-00104",
    customerName: "Tata Chemicals Boiler Plant",
    productName: "MAHAURJA Biomass Pellet",
    pelletDiameterMm: 8.0,
    quantityMT: 80.0,
    dispatchedMT: 0,
    ratePerMT: 7100,
    totalAmountINR: 568000,
    deliveryLocation: "Nanded Dist. Biomass Power Unit",
    requiredDate: "10 Oct 2026",
    paymentTerms: "Advance 50% / Balance on Delivery",
    customerSpecs: "8mm Bagged 50kg, Moisture ≤ 7%",
    status: "NEW",
  },
];

export const INITIAL_DISPATCHES: DispatchPlan[] = [
  {
    id: "DIS-261002-001",
    salesOrderId: "SO-261002-015",
    customerName: "ABC Industries Pvt. Ltd.",
    targetQuantityMT: 15.0,
    allocatedFgBatch: "FG-BATCH-261003-009",
    vehicleNumber: "MH 12 RN 4821",
    driverName: "Dnyaneshwar Shinde",
    driverMobile: "98224 81920",
    transporterName: "Mahalaxmi Freight Carriers",
    grossWeightKg: 27850,
    tareWeightKg: 12850,
    netDispatchMT: 15.0,
    weighbridgeSlipNumber: "WB-DIS-261003-001",
    status: "DELIVERED",
    plannedDate: "03 Oct 2026",
    dispatchedDate: "03 Oct 07:30 PM",
    destination: "MIDC Kurkumbh, Pune",
  },
  {
    id: "DIS-261004-001",
    salesOrderId: "SO-261002-015",
    customerName: "ABC Industries Pvt. Ltd.",
    targetQuantityMT: 20.0,
    allocatedFgBatch: "FG-BATCH-261003-009",
    vehicleNumber: "MH 14 TC 5519",
    driverName: "Santosh Mane",
    driverMobile: "94210 33882",
    transporterName: "Western Logistics Corp",
    status: "LOADING",
    plannedDate: "04 Oct 2026",
    destination: "MIDC Kurkumbh, Pune",
  },
];

export const INITIAL_INVOICES: SalesInvoice[] = [
  {
    invoiceNumber: "INV-261003-001",
    dispatchNumber: "DIS-261002-001",
    salesOrderNumber: "SO-261002-015",
    customerName: "ABC Industries Pvt. Ltd.",
    customerGst: "27AABCA1234F1Z8",
    deliveryAddress: "Plot C-14, MIDC Kurkumbh, Pune, MH 413802",
    eWayBillNumber: "3810 4921 8842",
    lrNumber: "LR-99420",
    coaNumber: "COA-261003-001",
    invoiceDate: "03 Oct 2026",
    quantityMT: 15.0,
    ratePerMT: 6800,
    taxableValue: 102000,
    gstAmount: 5100, // 5% GST on biomass pellets
    totalInvoiceAmount: 107100,
    paidAmount: 50000,
    outstandingAmount: 57100,
    paymentDueDate: "02 Nov 2026",
    paymentStatus: "PART_PAYMENT",
  },
];

export const INITIAL_DELIVERIES: DeliveryRecord[] = [
  {
    id: "DEL-261003-001",
    dispatchNumber: "DIS-261002-001",
    vehicleNumber: "MH 12 RN 4821",
    driverName: "Dnyaneshwar Shinde",
    customerName: "ABC Industries Pvt. Ltd.",
    deliveryLocation: "MIDC Kurkumbh, Pune",
    dispatchedQuantityMT: 15.0,
    destinationArrivalTime: "04 Oct 06:15 AM",
    receiverName: "K. R. Kulkarni (Stores Officer)",
    podDocumentUploaded: true,
    customerAckStatus: "CONFIRMED",
    qualityFeedback: "Unloaded cleanly at Boiler hopper. No fines observed.",
    status: "POD_RECEIVED",
  },
];

interface SalesContextType {
  orders: SalesOrder[];
  dispatches: DispatchPlan[];
  invoices: SalesInvoice[];
  deliveries: DeliveryRecord[];
  createOrder: (order: Omit<SalesOrder, "id">) => void;
  createDispatch: (dispatch: Omit<DispatchPlan, "id">) => void;
  recordPayment: (invoiceNumber: string, amount: number) => void;
  uploadPod: (deliveryId: string, receiverName: string, feedback: string) => void;
  metrics: {
    ordersPendingMT: number;
    dispatchesTodayCount: number;
    dispatchQuantityTodayMT: number;
    outstandingReceivablesINR: number;
  };
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export function SalesProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<SalesOrder[]>(INITIAL_ORDERS);
  const [dispatches, setDispatches] = useState<DispatchPlan[]>(INITIAL_DISPATCHES);
  const [invoices, setInvoices] = useState<SalesInvoice[]>(INITIAL_INVOICES);
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(INITIAL_DELIVERIES);

  const createOrder = (orderData: Omit<SalesOrder, "id">) => {
    const newOrder: SalesOrder = {
      ...orderData,
      id: `SO-261004-00${orders.length + 1}`,
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const createDispatch = (dispatchData: Omit<DispatchPlan, "id">) => {
    const newDispatch: DispatchPlan = {
      ...dispatchData,
      id: `DIS-261004-00${dispatches.length + 1}`,
    };
    setDispatches((prev) => [newDispatch, ...prev]);
  };

  const recordPayment = (invoiceNumber: string, amount: number) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.invoiceNumber === invoiceNumber) {
          const newPaid = inv.paidAmount + amount;
          const newOutstanding = Math.max(0, inv.totalInvoiceAmount - newPaid);
          const newStatus = newOutstanding === 0 ? "FULLY_PAID" : "PART_PAYMENT";
          return {
            ...inv,
            paidAmount: newPaid,
            outstandingAmount: newOutstanding,
            paymentStatus: newStatus,
          };
        }
        return inv;
      })
    );
  };

  const uploadPod = (deliveryId: string, receiverName: string, feedback: string) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === deliveryId
          ? {
              ...d,
              podDocumentUploaded: true,
              receiverName,
              qualityFeedback: feedback,
              customerAckStatus: "CONFIRMED",
              status: "POD_RECEIVED",
            }
          : d
      )
    );
  };

  // Metrics (PDF Sec 37 KPI alignment)
  const ordersPendingMT = orders
    .filter((o) => o.status !== "CLOSED" && o.status !== "FULLY_DISPATCHED")
    .reduce((sum, o) => sum + (o.quantityMT - o.dispatchedMT), 0);
  const dispatchesTodayCount = dispatches.filter((d) => d.plannedDate.includes("04 Oct")).length;
  const dispatchQuantityTodayMT = 20.0;
  const outstandingReceivablesINR = invoices.reduce((sum, inv) => sum + inv.outstandingAmount, 0);

  return (
    <SalesContext.Provider
      value={{
        orders,
        dispatches,
        invoices,
        deliveries,
        createOrder,
        createDispatch,
        recordPayment,
        uploadPod,
        metrics: {
          ordersPendingMT,
          dispatchesTodayCount,
          dispatchQuantityTodayMT,
          outstandingReceivablesINR,
        },
      }}
    >
      {children}
    </SalesContext.Provider>
  );
}

export function useSales() {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error("useSales must be used within a SalesProvider");
  }
  return context;
}
