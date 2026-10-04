"use client";

import React, { createContext, useContext, useState } from "react";
import {
  SupplierItem,
  CustomerItem,
  MaterialItem,
  StorageLocationItem,
  BlendFormulaItem,
  AdminUserItem,
} from "@/lib/types/admin";

interface AdminContextType {
  suppliers: SupplierItem[];
  customers: CustomerItem[];
  materials: MaterialItem[];
  storageLocations: StorageLocationItem[];
  blendFormulas: BlendFormulaItem[];
  users: AdminUserItem[];
  addSupplier: (
    supplier: Omit<SupplierItem, "id" | "totalSuppliedMt" | "totalPayoutInr" | "createdAt">
  ) => void;
  toggleSupplierStatus: (id: string) => void;
  addCustomer: (
    customer: Omit<CustomerItem, "id" | "outstandingBalanceInr" | "totalOrdersMt" | "createdAt">
  ) => void;
  toggleCustomerStatus: (id: string) => void;
  addMaterial: (material: Omit<MaterialItem, "id" | "currentInventoryMt">) => void;
  addStorageLocation: (location: Omit<StorageLocationItem, "id" | "currentStockMt">) => void;
  addBlendFormula: (formula: Omit<BlendFormulaItem, "id">) => void;
  toggleFormulaStatus: (id: string) => void;
  addUser: (user: Omit<AdminUserItem, "id" | "lastLogin">) => void;
  toggleUserStatus: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([
    {
      id: "SUP-2610-001",
      name: "Ramesh Patel (Kisan Agro)",
      type: "Farmer",
      villageOrCity: "Baramati",
      district: "Pune",
      contactPerson: "Ramesh Patel",
      contactNumber: "+91 98234 11223",
      materialsSupplied: ["Cotton Stalk", "Soybean Straw"],
      bankAccount: "910283019283",
      bankIfsc: "SBIN0001421",
      totalSuppliedMt: 145.5,
      totalPayoutInr: 574725,
      isActive: true,
      createdAt: "2026-08-15",
    },
    {
      id: "SUP-2610-002",
      name: "Vidarbha Agro FPC Ltd.",
      type: "Aggregator",
      villageOrCity: "Amravati",
      district: "Amravati",
      contactPerson: "Ganeshrao Deshmukh",
      contactNumber: "+91 94221 44556",
      materialsSupplied: ["Cotton Stalk", "Mustard Stalk"],
      gstin: "27AABCV1234F1Z8",
      pan: "AABCV1234F",
      bankAccount: "0832101000341",
      bankIfsc: "MAHB0000428",
      totalSuppliedMt: 320.0,
      totalPayoutInr: 1264000,
      isActive: true,
      createdAt: "2026-07-10",
    },
    {
      id: "SUP-2610-003",
      name: "Shree Timber Mills",
      type: "Trader",
      villageOrCity: "Hadapsar",
      district: "Pune",
      contactPerson: "Santosh Verma",
      contactNumber: "+91 98900 77665",
      materialsSupplied: ["Sawdust"],
      gstin: "27AAACS9988G1ZK",
      pan: "AAACS9988G",
      bankAccount: "50200029381928",
      bankIfsc: "HDFC0000120",
      totalSuppliedMt: 180.2,
      totalPayoutInr: 540600,
      isActive: true,
      createdAt: "2026-08-01",
    },
    {
      id: "SUP-2610-004",
      name: "Deccan Sugar Works Ltd.",
      type: "Company",
      villageOrCity: "Phaltan",
      district: "Satara",
      contactPerson: "Ajay Sawant",
      contactNumber: "+91 97654 33221",
      materialsSupplied: ["Bagasse"],
      gstin: "27AAACD5544E1ZM",
      pan: "AAACD5544E",
      bankAccount: "001105001234",
      bankIfsc: "ICIC0000011",
      totalSuppliedMt: 410.0,
      totalPayoutInr: 1025000,
      isActive: true,
      createdAt: "2026-06-20",
    },
  ]);

  const [customers, setCustomers] = useState<CustomerItem[]>([
    {
      id: "CUST-2610-001",
      companyName: "ABC Industries Pvt. Ltd.",
      contactPerson: "Rajesh Khanna",
      contactNumber: "+91 98200 12345",
      email: "procurement@abcind.com",
      gstin: "27AAACA1234A1Z5",
      deliveryAddress: "Plot No. 45, MIDC Chakan, Phase 2, Pune",
      destinationState: "Maharashtra",
      paymentTerms: "30 Days Credit",
      creditLimitInr: 1500000,
      outstandingBalanceInr: 485000,
      preferredProduct: "8mm High-Density Bio-Pellets (GCV > 4000)",
      totalOrdersMt: 340.0,
      isActive: true,
      createdAt: "2026-05-12",
    },
    {
      id: "CUST-2610-002",
      companyName: "Maharashtra Power & Steel Corp",
      contactPerson: "Sunil Mehta",
      contactNumber: "+91 98220 54321",
      email: "fuel.purchase@mahapower.co.in",
      gstin: "27AAACM9876B1Z2",
      deliveryAddress: "Industrial Estate, Butibori, Nagpur",
      destinationState: "Maharashtra",
      paymentTerms: "45 Days Credit",
      creditLimitInr: 3000000,
      outstandingBalanceInr: 0,
      preferredProduct: "8mm Industrial Standard Pellets",
      totalOrdersMt: 680.0,
      isActive: true,
      createdAt: "2026-04-18",
    },
    {
      id: "CUST-2610-003",
      companyName: "Deccan Paper & Board Mills",
      contactPerson: "Nilesh Shinde",
      contactNumber: "+91 94230 99887",
      email: "boiler@deccanpaper.com",
      gstin: "27AAACD1122C1Z9",
      deliveryAddress: "Khed City SEZ, Khed, Pune",
      destinationState: "Maharashtra",
      paymentTerms: "Advance 50% + 50% Delivery",
      creditLimitInr: 800000,
      outstandingBalanceInr: 120000,
      preferredProduct: "8mm Blend Pellets",
      totalOrdersMt: 195.0,
      isActive: true,
      createdAt: "2026-07-04",
    },
  ]);

  const [materials, setMaterials] = useState<MaterialItem[]>([
    {
      id: "MAT-001",
      name: "Cotton Stalk",
      category: "RAW_BIOMASS",
      unit: "MT",
      targetMoistureMax: 12.0,
      targetAshMax: 6.0,
      targetGcvMin: 4000,
      baseRatePerMt: 3950,
      currentInventoryMt: 185.5,
      isActive: true,
    },
    {
      id: "MAT-002",
      name: "Sawdust",
      category: "RAW_BIOMASS",
      unit: "MT",
      targetMoistureMax: 10.0,
      targetAshMax: 3.5,
      targetGcvMin: 4200,
      baseRatePerMt: 3000,
      currentInventoryMt: 95.0,
      isActive: true,
    },
    {
      id: "MAT-003",
      name: "Soybean Straw",
      category: "RAW_BIOMASS",
      unit: "MT",
      targetMoistureMax: 13.0,
      targetAshMax: 7.0,
      targetGcvMin: 3800,
      baseRatePerMt: 3400,
      currentInventoryMt: 62.0,
      isActive: true,
    },
    {
      id: "MAT-004",
      name: "Bagasse",
      category: "RAW_BIOMASS",
      unit: "MT",
      targetMoistureMax: 14.0,
      targetAshMax: 5.0,
      targetGcvMin: 3600,
      baseRatePerMt: 2500,
      currentInventoryMt: 42.5,
      isActive: true,
    },
    {
      id: "MAT-005",
      name: "Finished Bio-Pellets (8mm)",
      category: "FINISHED_PELLET",
      unit: "MT",
      targetMoistureMax: 8.0,
      targetAshMax: 5.5,
      targetGcvMin: 4200,
      baseRatePerMt: 6900,
      currentInventoryMt: 245.0,
      isActive: true,
    },
  ]);

  const [storageLocations, setStorageLocations] = useState<StorageLocationItem[]>([
    {
      id: "LOC-001",
      name: "Yard A (Uncovered Heavy)",
      type: "Raw Material Yard",
      capacityMt: 500,
      currentStockMt: 185.5,
      currentMaterial: "Cotton Stalk",
      supervisorName: "Nitin Joshi",
    },
    {
      id: "LOC-002",
      name: "Yard B (Covered Shed)",
      type: "Raw Material Yard",
      capacityMt: 350,
      currentStockMt: 157.0,
      currentMaterial: "Sawdust & Soybean",
      supervisorName: "Nitin Joshi",
    },
    {
      id: "LOC-003",
      name: "Shed 01 (Finished Goods)",
      type: "Finished Goods Shed",
      capacityMt: 400,
      currentStockMt: 245.0,
      currentMaterial: "8mm Bio-Pellets (Approved)",
      supervisorName: "Kishore Patil",
    },
    {
      id: "LOC-004",
      name: "Shed 02 (Holding / Quarantine)",
      type: "Quarantine Hold",
      capacityMt: 100,
      currentStockMt: 18.0,
      currentMaterial: "Unreleased Production Run",
      supervisorName: "Dr. Ananya Deshmukh",
    },
  ]);

  const [blendFormulas, setBlendFormulas] = useState<BlendFormulaItem[]>([
    {
      id: "FRM-001",
      name: "Industrial Boiler Grade (8mm)",
      targetProduct: "8mm High-Density Bio-Pellet",
      targetGcvMin: 4100,
      targetAshMax: 6.0,
      ingredients: [
        { materialName: "Cotton Stalk", percentage: 60 },
        { materialName: "Sawdust", percentage: 40 },
      ],
      notes: "Primary recipe for heavy boiler thermal efficiency. Low slag formation.",
      isActive: true,
    },
    {
      id: "FRM-002",
      name: "Eco-Agro Standard Blend",
      targetProduct: "8mm Standard Biomass Pellet",
      targetGcvMin: 3950,
      targetAshMax: 7.0,
      ingredients: [
        { materialName: "Cotton Stalk", percentage: 50 },
        { materialName: "Soybean Straw", percentage: 30 },
        { materialName: "Sawdust", percentage: 20 },
      ],
      notes: "Standard agricultural blend for brick kilns and secondary steam generation.",
      isActive: true,
    },
  ]);

  const [users, setUsers] = useState<AdminUserItem[]>([
    {
      id: "USR-001",
      employeeCode: "EMP-1001",
      name: "Ramesh Pawar",
      email: "ramesh.pawar@mahaurja.com",
      department: "Inbound / Outbound Gate",
      roleId: "gate-security",
      assignedPost: "Gate Post 01",
      shift: "Day Shift A (06:00 - 14:00)",
      isActive: true,
      lastLogin: "Today, 06:15 AM",
    },
    {
      id: "USR-002",
      employeeCode: "EMP-1002",
      name: "Sunil Shinde",
      email: "sunil.shinde@mahaurja.com",
      department: "Weighment Station",
      roleId: "weighbridge",
      assignedPost: "Weighbridge Station 01 / 02",
      shift: "Day Shift A (06:00 - 14:00)",
      isActive: true,
      lastLogin: "Today, 06:30 AM",
    },
    {
      id: "USR-003",
      employeeCode: "EMP-1003",
      name: "Dr. Ananya Deshmukh",
      email: "ananya.deshmukh@mahaurja.com",
      department: "Quality Assurance Lab",
      roleId: "qc-lab",
      assignedPost: "Central QC Testing Lab",
      shift: "General Shift (09:00 - 18:00)",
      isActive: true,
      lastLogin: "Today, 09:05 AM",
    },
    {
      id: "USR-004",
      employeeCode: "EMP-1004",
      name: "Mahesh Kadam",
      email: "mahesh.kadam@mahaurja.com",
      department: "Pelletising Plant Line 1 & 2",
      roleId: "production",
      assignedPost: "Pellet Line Control Room",
      shift: "Day Shift A (06:00 - 14:00)",
      isActive: true,
      lastLogin: "Today, 06:45 AM",
    },
    {
      id: "USR-005",
      employeeCode: "EMP-1005",
      name: "Nitin Joshi",
      email: "nitin.joshi@mahaurja.com",
      department: "Raw Yards & Finished Sheds",
      roleId: "warehouse",
      assignedPost: "Warehouse Sheds & Yard Office",
      shift: "General Shift (09:00 - 18:00)",
      isActive: true,
      lastLogin: "Today, 08:50 AM",
    },
    {
      id: "USR-006",
      employeeCode: "EMP-1006",
      name: "Vikram Malhotra",
      email: "vikram.malhotra@mahaurja.com",
      department: "Logistics & Outbound",
      roleId: "sales-dispatch",
      assignedPost: "Dispatch Planning Cabin",
      shift: "General Shift (09:00 - 18:00)",
      isActive: true,
      lastLogin: "Today, 09:12 AM",
    },
    {
      id: "USR-007",
      employeeCode: "EMP-1007",
      name: "Pravin Singhania",
      email: "pravin.singhania@mahaurja.com",
      department: "Executive Directorate",
      roleId: "management",
      assignedPost: "Plant Director Office",
      shift: "General Shift (09:00 - 18:00)",
      isActive: true,
      lastLogin: "Today, 08:30 AM",
    },
    {
      id: "USR-008",
      employeeCode: "EMP-1008",
      name: "Adarsh Sharma",
      email: "adarsh.sharma@mahaurja.com",
      department: "System Operations",
      roleId: "admin",
      assignedPost: "Admin Control Console",
      shift: "General Shift (09:00 - 18:00)",
      isActive: true,
      lastLogin: "Today, 07:00 AM",
    },
  ]);

  const addSupplier = (
    supplier: Omit<SupplierItem, "id" | "totalSuppliedMt" | "totalPayoutInr" | "createdAt">
  ) => {
    const seq = String(suppliers.length + 1).padStart(3, "0");
    const newSupplier: SupplierItem = {
      ...supplier,
      id: `SUP-2610-${seq}`,
      totalSuppliedMt: 0,
      totalPayoutInr: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setSuppliers((prev) => [newSupplier, ...prev]);
  };

  const toggleSupplierStatus = (id: string) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const addCustomer = (
    customer: Omit<CustomerItem, "id" | "outstandingBalanceInr" | "totalOrdersMt" | "createdAt">
  ) => {
    const seq = String(customers.length + 1).padStart(3, "0");
    const newCustomer: CustomerItem = {
      ...customer,
      id: `CUST-2610-${seq}`,
      outstandingBalanceInr: 0,
      totalOrdersMt: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setCustomers((prev) => [newCustomer, ...prev]);
  };

  const toggleCustomerStatus = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const addMaterial = (material: Omit<MaterialItem, "id" | "currentInventoryMt">) => {
    const seq = String(materials.length + 1).padStart(3, "0");
    const newMaterial: MaterialItem = {
      ...material,
      id: `MAT-${seq}`,
      currentInventoryMt: 0,
    };
    setMaterials((prev) => [...prev, newMaterial]);
  };

  const addStorageLocation = (
    location: Omit<StorageLocationItem, "id" | "currentStockMt">
  ) => {
    const seq = String(storageLocations.length + 1).padStart(3, "0");
    const newLocation: StorageLocationItem = {
      ...location,
      id: `LOC-${seq}`,
      currentStockMt: 0,
    };
    setStorageLocations((prev) => [...prev, newLocation]);
  };

  const addBlendFormula = (formula: Omit<BlendFormulaItem, "id">) => {
    const seq = String(blendFormulas.length + 1).padStart(3, "0");
    const newFormula: BlendFormulaItem = {
      ...formula,
      id: `FRM-${seq}`,
    };
    setBlendFormulas((prev) => [...prev, newFormula]);
  };

  const toggleFormulaStatus = (id: string) => {
    setBlendFormulas((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f))
    );
  };

  const addUser = (user: Omit<AdminUserItem, "id" | "lastLogin">) => {
    const seq = String(users.length + 1).padStart(3, "0");
    const newUser: AdminUserItem = {
      ...user,
      id: `USR-${seq}`,
      lastLogin: "Never",
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  return (
    <AdminContext.Provider
      value={{
        suppliers,
        customers,
        materials,
        storageLocations,
        blendFormulas,
        users,
        addSupplier,
        toggleSupplierStatus,
        addCustomer,
        toggleCustomerStatus,
        addMaterial,
        addStorageLocation,
        addBlendFormula,
        toggleFormulaStatus,
        addUser,
        toggleUserStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
