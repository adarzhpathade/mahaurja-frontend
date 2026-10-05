"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/client";
import { NewUserInput, usersApi } from "@/lib/api/users";
import {
  CreateMaterialInput,
  UpdateMaterialInput,
  materialsApi,
} from "@/lib/api/materials";
import {
  CreateStorageLocationInput,
  UpdateStorageLocationInput,
  storageLocationsApi,
} from "@/lib/api/storage-locations";
import { usePlantEvents } from "@/lib/api/realtime";
import {
  MaterialItem,
  StorageLocationItem,
  BlendFormulaItem,
  AdminUserItem,
} from "@/lib/types/admin";

interface AdminContextType {
  materials: MaterialItem[];
  storageLocations: StorageLocationItem[];
  blendFormulas: BlendFormulaItem[];
  users: AdminUserItem[];
  addMaterial: (material: CreateMaterialInput) => Promise<MaterialItem>;
  updateMaterial: (
    id: string,
    material: UpdateMaterialInput,
    version?: number
  ) => Promise<MaterialItem>;
  deactivateMaterial: (id: string, version?: number) => Promise<MaterialItem>;
  materialsLoading: boolean;
  materialsError: string | null;
  reloadMaterials: () => Promise<void>;
  addStorageLocation: (
    location: CreateStorageLocationInput
  ) => Promise<StorageLocationItem>;
  updateStorageLocation: (
    id: string,
    location: UpdateStorageLocationInput,
    version?: number
  ) => Promise<StorageLocationItem>;
  storageLocationsLoading: boolean;
  storageLocationsError: string | null;
  reloadStorageLocations: () => Promise<void>;
  addBlendFormula: (formula: Omit<BlendFormulaItem, "id">) => void;
  toggleFormulaStatus: (id: string) => void;
  usersLoading: boolean;
  usersError: string | null;
  reloadUsers: () => Promise<void>;
  addUser: (input: NewUserInput) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

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

  // 1. Materials managed via TanStack Query (/api/v1/materials) - Phase 10
  const {
    data: materials = [],
    isLoading: materialsLoading,
    error: materialsQueryError,
    refetch: refetchMaterials,
  } = useQuery<MaterialItem[]>({
    queryKey: ["materials"],
    queryFn: () => materialsApi.list(),
  });

  const materialsError = materialsQueryError
    ? materialsQueryError instanceof ApiError
      ? materialsQueryError.message
      : "Could not load materials."
    : null;

  const reloadMaterials = useCallback(async () => {
    await refetchMaterials();
  }, [refetchMaterials]);

  // 2. Storage Locations managed via TanStack Query (/api/v1/storage-locations) - Phase 15
  const {
    data: storageLocations = [],
    isLoading: storageLocationsLoading,
    error: storageLocationsQueryError,
    refetch: refetchStorageLocations,
  } = useQuery<StorageLocationItem[]>({
    queryKey: ["storage-locations"],
    queryFn: () => storageLocationsApi.list(),
  });

  const storageLocationsError = storageLocationsQueryError
    ? storageLocationsQueryError instanceof ApiError
      ? storageLocationsQueryError.message
      : "Could not load storage locations."
    : null;

  const reloadStorageLocations = useCallback(async () => {
    await refetchStorageLocations();
  }, [refetchStorageLocations]);

  // 3. Users managed via TanStack Query (/api/v1/users)
  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersQueryError,
    refetch: refetchUsers,
  } = useQuery<AdminUserItem[]>({
    queryKey: ["users"],
    queryFn: () => usersApi.list(),
  });

  const usersError = usersQueryError
    ? usersQueryError instanceof ApiError
      ? usersQueryError.message
      : "Could not load operators."
    : null;

  const reloadUsers = useCallback(async () => {
    await refetchUsers();
  }, [refetchUsers]);

  // Live updates via SSE invalidation
  usePlantEvents(["users.*"], () => {
    void queryClient.invalidateQueries({ queryKey: ["users"] });
  });

  usePlantEvents(["material.*"], () => {
    void queryClient.invalidateQueries({ queryKey: ["materials"] });
  });

  usePlantEvents(["storage_location.*"], () => {
    void queryClient.invalidateQueries({ queryKey: ["storage-locations"] });
  });

  usePlantEvents(["supplier.*"], () => {
    void queryClient.invalidateQueries({ queryKey: ["suppliers"] });
  });

  usePlantEvents(["customer.*"], () => {
    void queryClient.invalidateQueries({ queryKey: ["customers"] });
  });

  usePlantEvents(["transporter.*"], () => {
    void queryClient.invalidateQueries({ queryKey: ["transporters"] });
  });

  usePlantEvents(["vehicle.*"], () => {
    void queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    void queryClient.invalidateQueries({ queryKey: ["vehicles-expiring"] });
  });

  usePlantEvents(["driver.*"], () => {
    void queryClient.invalidateQueries({ queryKey: ["drivers"] });
  });

  // Action methods
  const addMaterial = async (input: CreateMaterialInput): Promise<MaterialItem> => {
    const created = await materialsApi.create(input);
    await queryClient.invalidateQueries({ queryKey: ["materials"] });
    return created;
  };

  const updateMaterial = async (
    id: string,
    input: UpdateMaterialInput,
    version?: number,
  ): Promise<MaterialItem> => {
    const updated = await materialsApi.update(id, input, version);
    await queryClient.invalidateQueries({ queryKey: ["materials"] });
    return updated;
  };

  const deactivateMaterial = async (
    id: string,
    version?: number,
  ): Promise<MaterialItem> => {
    const updated = await materialsApi.deactivate(id, version);
    await queryClient.invalidateQueries({ queryKey: ["materials"] });
    return updated;
  };

  const addStorageLocation = async (
    input: CreateStorageLocationInput,
  ): Promise<StorageLocationItem> => {
    const created = await storageLocationsApi.create(input);
    await queryClient.invalidateQueries({ queryKey: ["storage-locations"] });
    return created;
  };

  const updateStorageLocation = async (
    id: string,
    input: UpdateStorageLocationInput,
    version?: number,
  ): Promise<StorageLocationItem> => {
    const updated = await storageLocationsApi.update(id, input, version);
    await queryClient.invalidateQueries({ queryKey: ["storage-locations"] });
    return updated;
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

  const addUser = async (input: NewUserInput) => {
    await usersApi.create(input);
    await queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const toggleUserStatus = async (id: string) => {
    const current = users.find((u) => u.id === id);
    if (!current) return;
    await usersApi.setActive(id, !current.isActive);
    await queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  return (
    <AdminContext.Provider
      value={{
        materials,
        storageLocations,
        blendFormulas,
        users,
        addMaterial,
        updateMaterial,
        deactivateMaterial,
        materialsLoading,
        materialsError,
        reloadMaterials,
        addStorageLocation,
        updateStorageLocation,
        storageLocationsLoading,
        storageLocationsError,
        reloadStorageLocations,
        addBlendFormula,
        toggleFormulaStatus,
        usersLoading,
        usersError,
        reloadUsers,
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
