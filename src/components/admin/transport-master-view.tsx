"use client";

import React, { useState } from "react";
import {
  Truck,
  UserCheck,
  Building2,
  Search,
  Plus,
  AlertTriangle,
  LayoutGrid,
  Table as TableIcon,
  X,
  Edit2,
  PowerOff,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateDriverInput,
  CreateTransporterInput,
  CreateVehicleInput,
  DriverItem,
  TransporterItem,
  UpdateDriverInput,
  UpdateTransporterInput,
  UpdateVehicleInput,
  VEHICLE_TYPE_LABELS,
  VEHICLE_TYPES,
  VehicleExpiringDocument,
  VehicleItem,
  VehicleType,
  driversApi,
  formatVehicleDisplay,
  normalizeVehicleNumber,
  transportersApi,
  vehiclesApi,
} from "@/lib/api/transport";
import { describeApiError } from "@/lib/api/client";
import { usePlantEvents } from "@/lib/api/realtime";
import { Can } from "@/lib/context/auth-context";

export function TransportMasterView() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"vehicles" | "drivers" | "transporters">("vehicles");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>("ALL");

  // Global action error banner
  const [actionError, setActionError] = useState<string | null>(null);

  // 1. Vehicles Query
  const {
    data: vehicles = [],
    isLoading: vehiclesLoading,
    error: vehiclesQueryError,
  } = useQuery<VehicleItem[]>({
    queryKey: ["vehicles", { q: searchQuery, vehicleType: vehicleTypeFilter }],
    queryFn: () =>
      vehiclesApi.list({
        q: searchQuery.trim() || undefined,
        vehicleType: vehicleTypeFilter === "ALL" ? undefined : vehicleTypeFilter,
      }),
    enabled: activeTab === "vehicles",
  });

  // 2. Expiring Vehicles Query (≤ 30 days)
  const { data: expiringVehicles = [] } = useQuery<VehicleItem[]>({
    queryKey: ["vehicles-expiring"],
    queryFn: () => vehiclesApi.getExpiring(30),
  });

  // 3. Drivers Query
  const {
    data: drivers = [],
    isLoading: driversLoading,
    error: driversQueryError,
  } = useQuery<DriverItem[]>({
    queryKey: ["drivers", { q: searchQuery }],
    queryFn: () => driversApi.list({ q: searchQuery.trim() || undefined }),
    enabled: activeTab === "drivers",
  });

  // 4. Transporters Query
  const {
    data: transporters = [],
    isLoading: transportersLoading,
    error: transportersQueryError,
  } = useQuery<TransporterItem[]>({
    queryKey: ["transporters", { q: searchQuery }],
    queryFn: () => transportersApi.list({ q: searchQuery.trim() || undefined }),
  });

  // Live SSE updates for transport domain
  usePlantEvents(["vehicle.*", "driver.*", "transporter.*"], () => {
    void queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    void queryClient.invalidateQueries({ queryKey: ["vehicles-expiring"] });
    void queryClient.invalidateQueries({ queryKey: ["drivers"] });
    void queryClient.invalidateQueries({ queryKey: ["transporters"] });
  });

  // ----------------------------------------------------
  // Vehicle Modal State & Handlers
  // ----------------------------------------------------
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleItem | null>(null);
  const [vehNumber, setVehNumber] = useState("");
  const [vehType, setVehType] = useState<VehicleType>("TRUCK_10_TYRE");
  const [vehCapacityMt, setVehCapacityMt] = useState("25");
  const [vehTransporterId, setVehTransporterId] = useState("");
  const [vehOwnerName, setVehOwnerName] = useState("");
  const [vehOwnerMobile, setVehOwnerMobile] = useState("");
  const [vehInsuranceExpiry, setVehInsuranceExpiry] = useState("");
  const [vehFitnessExpiry, setVehFitnessExpiry] = useState("");
  const [vehPermitExpiry, setVehPermitExpiry] = useState("");
  const [vehPucExpiry, setVehPucExpiry] = useState("");
  const [vehicleModalError, setVehicleModalError] = useState<string | null>(null);
  const [isSavingVehicle, setIsSavingVehicle] = useState(false);

  const handleOpenAddVehicle = () => {
    setEditingVehicle(null);
    setVehNumber("");
    setVehType("TRUCK_10_TYRE");
    setVehCapacityMt("25");
    setVehTransporterId("");
    setVehOwnerName("");
    setVehOwnerMobile("");
    setVehInsuranceExpiry("");
    setVehFitnessExpiry("");
    setVehPermitExpiry("");
    setVehPucExpiry("");
    setVehicleModalError(null);
    setIsVehicleModalOpen(true);
  };

  const handleOpenEditVehicle = (veh: VehicleItem) => {
    setEditingVehicle(veh);
    setVehNumber(veh.displayNumber || veh.vehicleNumber);
    setVehType((veh.vehicleType as VehicleType) || "TRUCK_10_TYRE");
    setVehCapacityMt(String(veh.capacityMt || 25));
    setVehTransporterId(veh.transporterId || "");
    setVehOwnerName(veh.ownerName || "");
    setVehOwnerMobile(veh.ownerMobile || "");
    setVehInsuranceExpiry(veh.insuranceExpiry ? veh.insuranceExpiry.split("T")[0] : "");
    setVehFitnessExpiry(veh.fitnessExpiry ? veh.fitnessExpiry.split("T")[0] : "");
    setVehPermitExpiry(veh.permitExpiry ? veh.permitExpiry.split("T")[0] : "");
    setVehPucExpiry(veh.pucExpiry ? veh.pucExpiry.split("T")[0] : "");
    setVehicleModalError(null);
    setIsVehicleModalOpen(true);
  };

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehNumber.trim()) return;

    setVehicleModalError(null);
    setIsSavingVehicle(true);
    try {
      const normalizedNumber = normalizeVehicleNumber(vehNumber);
      const capMt = parseFloat(vehCapacityMt) || 0;

      if (editingVehicle) {
        const input: UpdateVehicleInput = {
          vehicleNumber: normalizedNumber,
          vehicleType: vehType,
          capacityMt: capMt,
          capacityKg: capMt * 1000,
          transporterId: vehTransporterId || null,
          ownerName: vehOwnerName.trim() || null,
          ownerMobile: vehOwnerMobile.trim() || null,
          insuranceExpiry: vehInsuranceExpiry || null,
          fitnessExpiry: vehFitnessExpiry || null,
          permitExpiry: vehPermitExpiry || null,
          pucExpiry: vehPucExpiry || null,
        };
        await vehiclesApi.update(editingVehicle.id, input, editingVehicle.version);
      } else {
        const input: CreateVehicleInput = {
          vehicleNumber: normalizedNumber,
          vehicleType: vehType,
          capacityMt: capMt,
          capacityKg: capMt * 1000,
          transporterId: vehTransporterId || null,
          ownerName: vehOwnerName.trim() || undefined,
          ownerMobile: vehOwnerMobile.trim() || undefined,
          insuranceExpiry: vehInsuranceExpiry || undefined,
          fitnessExpiry: vehFitnessExpiry || undefined,
          permitExpiry: vehPermitExpiry || undefined,
          pucExpiry: vehPucExpiry || undefined,
          isActive: true,
        };
        await vehiclesApi.create(input);
      }

      await queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      await queryClient.invalidateQueries({ queryKey: ["vehicles-expiring"] });
      setIsVehicleModalOpen(false);
      setEditingVehicle(null);
    } catch (err: unknown) {
      setVehicleModalError(
        describeApiError(err, "Could not save vehicle. Please check details and try again."),
      );
    } finally {
      setIsSavingVehicle(false);
    }
  };

  const handleDeactivateVehicle = async (veh: VehicleItem) => {
    if (!confirm(`Are you sure you want to deactivate vehicle ${veh.displayNumber || veh.vehicleNumber}?`)) {
      return;
    }
    setActionError(null);
    try {
      await vehiclesApi.deactivate(veh.id, veh.version);
      await queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      await queryClient.invalidateQueries({ queryKey: ["vehicles-expiring"] });
    } catch (err: unknown) {
      setActionError(describeApiError(err, "Could not deactivate vehicle."));
    }
  };

  // ----------------------------------------------------
  // Driver Modal State & Handlers
  // ----------------------------------------------------
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DriverItem | null>(null);
  const [driverName, setDriverName] = useState("");
  const [driverMobile, setDriverMobile] = useState("");
  const [driverAltMobile, setDriverAltMobile] = useState("");
  const [driverLicenseNumber, setDriverLicenseNumber] = useState("");
  const [driverLicenseExpiry, setDriverLicenseExpiry] = useState("");
  const [driverTransporterId, setDriverTransporterId] = useState("");
  const [driverModalError, setDriverModalError] = useState<string | null>(null);
  const [isSavingDriver, setIsSavingDriver] = useState(false);

  const handleOpenAddDriver = () => {
    setEditingDriver(null);
    setDriverName("");
    setDriverMobile("");
    setDriverAltMobile("");
    setDriverLicenseNumber("");
    setDriverLicenseExpiry("");
    setDriverTransporterId("");
    setDriverModalError(null);
    setIsDriverModalOpen(true);
  };

  const handleOpenEditDriver = (drv: DriverItem) => {
    setEditingDriver(drv);
    setDriverName(drv.name);
    setDriverMobile(drv.mobile);
    setDriverAltMobile(drv.alternateMobile || "");
    setDriverLicenseNumber(drv.licenseNumber || "");
    setDriverLicenseExpiry(drv.licenseExpiry ? drv.licenseExpiry.split("T")[0] : "");
    setDriverTransporterId(drv.transporterId || "");
    setDriverModalError(null);
    setIsDriverModalOpen(true);
  };

  const handleDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName.trim() || !driverMobile.trim()) return;

    setDriverModalError(null);
    setIsSavingDriver(true);
    try {
      if (editingDriver) {
        const input: UpdateDriverInput = {
          name: driverName.trim(),
          mobile: driverMobile.trim(),
          alternateMobile: driverAltMobile.trim() || null,
          licenseNumber: driverLicenseNumber.trim() || null,
          licenseExpiry: driverLicenseExpiry || null,
          transporterId: driverTransporterId || null,
        };
        await driversApi.update(editingDriver.id, input, editingDriver.version);
      } else {
        const input: CreateDriverInput = {
          name: driverName.trim(),
          mobile: driverMobile.trim(),
          alternateMobile: driverAltMobile.trim() || undefined,
          licenseNumber: driverLicenseNumber.trim() || undefined,
          licenseExpiry: driverLicenseExpiry || undefined,
          transporterId: driverTransporterId || null,
          isActive: true,
        };
        await driversApi.create(input);
      }

      await queryClient.invalidateQueries({ queryKey: ["drivers"] });
      setIsDriverModalOpen(false);
      setEditingDriver(null);
    } catch (err: unknown) {
      setDriverModalError(
        describeApiError(err, "Could not save driver. Please check details and try again."),
      );
    } finally {
      setIsSavingDriver(false);
    }
  };

  const handleDeactivateDriver = async (drv: DriverItem) => {
    if (!confirm(`Are you sure you want to deactivate driver ${drv.name}?`)) return;
    setActionError(null);
    try {
      await driversApi.deactivate(drv.id, drv.version);
      await queryClient.invalidateQueries({ queryKey: ["drivers"] });
    } catch (err: unknown) {
      setActionError(describeApiError(err, "Could not deactivate driver."));
    }
  };

  // ----------------------------------------------------
  // Transporter Modal State & Handlers
  // ----------------------------------------------------
  const [isTransporterModalOpen, setIsTransporterModalOpen] = useState(false);
  const [editingTransporter, setEditingTransporter] = useState<TransporterItem | null>(null);
  const [trnName, setTrnName] = useState("");
  const [trnContactPerson, setTrnContactPerson] = useState("");
  const [trnMobile, setTrnMobile] = useState("");
  const [trnGstin, setTrnGstin] = useState("");
  const [trnPan, setTrnPan] = useState("");
  const [trnAddress, setTrnAddress] = useState("");
  const [trnCity, setTrnCity] = useState("");
  const [trnState, setTrnState] = useState("Madhya Pradesh");
  const [trnBankAccount, setTrnBankAccount] = useState("");
  const [trnBankIfsc, setTrnBankIfsc] = useState("");
  const [trnBankName, setTrnBankName] = useState("");
  const [transporterModalError, setTransporterModalError] = useState<string | null>(null);
  const [isSavingTransporter, setIsSavingTransporter] = useState(false);

  const handleOpenAddTransporter = () => {
    setEditingTransporter(null);
    setTrnName("");
    setTrnContactPerson("");
    setTrnMobile("");
    setTrnGstin("");
    setTrnPan("");
    setTrnAddress("");
    setTrnCity("");
    setTrnState("Madhya Pradesh");
    setTrnBankAccount("");
    setTrnBankIfsc("");
    setTrnBankName("");
    setTransporterModalError(null);
    setIsTransporterModalOpen(true);
  };

  const handleOpenEditTransporter = (trn: TransporterItem) => {
    setEditingTransporter(trn);
    setTrnName(trn.name);
    setTrnContactPerson(trn.contactPerson || "");
    setTrnMobile(trn.mobile);
    setTrnGstin(trn.gstin || "");
    setTrnPan(trn.pan || "");
    setTrnAddress(trn.address || "");
    setTrnCity(trn.city || "");
    setTrnState(trn.state || "Madhya Pradesh");
    setTrnBankAccount(trn.bankAccount || "");
    setTrnBankIfsc(trn.bankIfsc || "");
    setTrnBankName(trn.bankName || "");
    setTransporterModalError(null);
    setIsTransporterModalOpen(true);
  };

  const handleTransporterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trnName.trim() || !trnMobile.trim()) return;

    setTransporterModalError(null);
    setIsSavingTransporter(true);
    try {
      if (editingTransporter) {
        const input: UpdateTransporterInput = {
          name: trnName.trim(),
          contactPerson: trnContactPerson.trim() || null,
          mobile: trnMobile.trim(),
          gstin: trnGstin.trim().toUpperCase() || null,
          pan: trnPan.trim().toUpperCase() || null,
          address: trnAddress.trim() || null,
          city: trnCity.trim() || null,
          state: trnState.trim() || undefined,
          bankAccount: trnBankAccount.trim() || null,
          bankIfsc: trnBankIfsc.trim().toUpperCase() || null,
          bankName: trnBankName.trim() || null,
        };
        await transportersApi.update(editingTransporter.id, input, editingTransporter.version);
      } else {
        const input: CreateTransporterInput = {
          name: trnName.trim(),
          contactPerson: trnContactPerson.trim() || undefined,
          mobile: trnMobile.trim(),
          gstin: trnGstin.trim().toUpperCase() || undefined,
          pan: trnPan.trim().toUpperCase() || undefined,
          address: trnAddress.trim() || undefined,
          city: trnCity.trim() || undefined,
          state: trnState.trim() || undefined,
          bankAccount: trnBankAccount.trim() || undefined,
          bankIfsc: trnBankIfsc.trim().toUpperCase() || undefined,
          bankName: trnBankName.trim() || undefined,
          isActive: true,
        };
        await transportersApi.create(input);
      }

      await queryClient.invalidateQueries({ queryKey: ["transporters"] });
      setIsTransporterModalOpen(false);
      setEditingTransporter(null);
    } catch (err: unknown) {
      setTransporterModalError(
        describeApiError(err, "Could not save transporter. Please check details and try again."),
      );
    } finally {
      setIsSavingTransporter(false);
    }
  };

  const handleDeactivateTransporter = async (trn: TransporterItem) => {
    if (!confirm(`Are you sure you want to deactivate transporter ${trn.name}?`)) return;
    setActionError(null);
    try {
      await transportersApi.deactivate(trn.id, trn.version);
      await queryClient.invalidateQueries({ queryKey: ["transporters"] });
    } catch (err: unknown) {
      setActionError(describeApiError(err, "Could not deactivate transporter."));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
            Transport & Fleet Master
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Registered commercial vehicles, drivers, logistics agencies & document validity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Can perm="masters:manage">
            {activeTab === "vehicles" && (
              <button
                type="button"
                onClick={handleOpenAddVehicle}
                className="h-10 px-3.5 bg-[#18181B] text-white hover:bg-neutral-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Vehicle</span>
              </button>
            )}
            {activeTab === "drivers" && (
              <button
                type="button"
                onClick={handleOpenAddDriver}
                className="h-10 px-3.5 bg-[#18181B] text-white hover:bg-neutral-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Driver</span>
              </button>
            )}
            {activeTab === "transporters" && (
              <button
                type="button"
                onClick={handleOpenAddTransporter}
                className="h-10 px-3.5 bg-[#18181B] text-white hover:bg-neutral-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Transporter</span>
              </button>
            )}
          </Can>
        </div>
      </div>

      {/* Global Error Banner */}
      {actionError && (
        <div
          role="alert"
          className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-red-500 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Documents Expiring in 30 Days Panel */}
      {expiringVehicles.length > 0 && (
        <section aria-label="Expiring Documents" className="p-4 bg-amber-50/60 border border-amber-300 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <label className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Documents Expiring in 30 Days ({expiringVehicles.length} vehicles)
              </label>
            </div>
            <span className="text-[11px] font-semibold text-amber-800">
              Immediate inspection required before gate inward
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {expiringVehicles.map((veh) => (
              <div
                key={veh.id}
                className="p-3 bg-white border border-amber-200 space-y-2 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 text-neutral-900 inline-block">
                      {veh.displayNumber || veh.vehicleNumber}
                    </span>
                    <span className="text-[11px] text-neutral-600 block mt-1">
                      {VEHICLE_TYPE_LABELS[veh.vehicleType] || veh.vehicleType}
                    </span>
                  </div>
                  {veh.transporterName && (
                    <span className="text-[10px] text-neutral-500 font-medium truncate max-w-[120px]">
                      {veh.transporterName}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-neutral-100 flex flex-wrap gap-1.5">
                  {(veh.expiringDocuments || []).map((doc: VehicleExpiringDocument, idx: number) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                        doc.isExpired
                          ? "bg-red-50 text-red-700 border-red-300"
                          : "bg-amber-50 text-amber-800 border-amber-300"
                      }`}
                    >
                      {doc.document} {doc.isExpired ? "EXPIRED" : `expires in ${doc.daysRemaining} days`}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Tab Segment Switcher: Vehicles / Drivers / Transporters */}
      <div className="flex items-center gap-2 border-b border-neutral-300 pb-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab("vehicles");
            setSearchQuery("");
          }}
          className={`px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 -mb-2.5 ${
            activeTab === "vehicles"
              ? "border-[#18181B] text-neutral-900 bg-white"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Vehicles ({vehicles.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("drivers");
            setSearchQuery("");
          }}
          className={`px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 -mb-2.5 ${
            activeTab === "drivers"
              ? "border-[#18181B] text-neutral-900 bg-white"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Drivers ({drivers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("transporters");
            setSearchQuery("");
          }}
          className={`px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 -mb-2.5 ${
            activeTab === "transporters"
              ? "border-[#18181B] text-neutral-900 bg-white"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Transporters ({transporters.length})</span>
        </button>
      </div>

      {/* Operational Controls Bar (Search + Filter + View Switcher) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-100/60 p-2.5 border border-neutral-300">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "vehicles"
                  ? "Search by plate number, owner, or transporter..."
                  : activeTab === "drivers"
                  ? "Search by driver name, mobile, or license..."
                  : "Search by transporter name, GSTIN, or city..."
              }
              className="w-full h-10 pl-9 pr-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669]"
            />
          </div>

          {activeTab === "vehicles" && (
            <select
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
              className="h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
            >
              <option value="ALL">All Vehicle Types</option>
              {VEHICLE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {VEHICLE_TYPE_LABELS[t] || t}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* View Switcher: Mandatory Desktop Dual View [ Cards ] [ Table ] */}
        <div className="hidden sm:inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`px-3 flex items-center gap-1.5 transition-colors ${
              viewMode === "cards"
                ? "bg-[#18181B] text-white font-semibold"
                : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`px-3 flex items-center gap-1.5 transition-colors ${
              viewMode === "table"
                ? "bg-[#18181B] text-white font-semibold"
                : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* TAB 1: VEHICLES */}
      {activeTab === "vehicles" && (
        <>
          {vehiclesLoading ? (
            <div className="p-12 text-center text-xs text-neutral-500 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-neutral-400" />
              <span>Loading fleet vehicles...</span>
            </div>
          ) : vehiclesQueryError ? (
            <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-xs">
              {describeApiError(vehiclesQueryError, "Could not load vehicles.")}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-neutral-300 bg-white/40">
              <Truck className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-neutral-700">
                {searchQuery || vehicleTypeFilter !== "ALL"
                  ? "No vehicles match your search criteria."
                  : "No vehicles registered yet."}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Add trucks, tippers, or tractor trolleys to authorize gate entry.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="grid grid-cols-1 sm:hidden gap-3">
                {vehicles.map((veh) => (
                  <VehicleCardItem
                    key={veh.id}
                    vehicle={veh}
                    onEdit={handleOpenEditVehicle}
                    onDeactivate={handleDeactivateVehicle}
                  />
                ))}
              </div>

              {/* Desktop Cards or Table */}
              <div className="hidden sm:block">
                {viewMode === "cards" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vehicles.map((veh) => (
                      <VehicleCardItem
                        key={veh.id}
                        vehicle={veh}
                        onEdit={handleOpenEditVehicle}
                        onDeactivate={handleDeactivateVehicle}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="border border-neutral-300 overflow-x-auto bg-transparent">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">Vehicle Number</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3 text-right">Capacity (MT)</th>
                          <th className="py-2.5 px-3">Transporter / Owner</th>
                          <th className="py-2.5 px-3">Compliance Expiry</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-300">
                        {vehicles.map((veh) => (
                          <tr
                            key={veh.id}
                            className="hover:bg-neutral-200/40 transition-colors"
                          >
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 font-mono font-bold text-xs bg-neutral-50 border border-neutral-300 text-neutral-900 inline-block">
                                {veh.displayNumber || veh.vehicleNumber}
                              </span>
                              <span className="font-mono text-[10px] text-neutral-500 block mt-0.5">
                                {veh.code}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="font-semibold text-neutral-800">
                                {VEHICLE_TYPE_LABELS[veh.vehicleType] || veh.vehicleType}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-900">
                              {veh.capacityMt.toFixed(1)} MT
                            </td>
                            <td className="py-2.5 px-3 text-neutral-600">
                              <span className="font-medium text-neutral-900 block">
                                {veh.transporterName || "Self-Owned / Individual"}
                              </span>
                              {veh.ownerName && (
                                <span className="text-[11px] text-neutral-500 block">
                                  Owner: {veh.ownerName}
                                  {veh.ownerMobile && ` (${veh.ownerMobile})`}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              {veh.hasExpiringDocs ? (
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-300 inline-block">
                                  Expiring Soon
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-[#047857] border border-emerald-200 inline-block">
                                  Valid
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                                  veh.isActive
                                    ? "bg-emerald-50 text-[#047857] border border-emerald-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                              >
                                {veh.isActive ? "ACTIVE" : "INACTIVE"}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <Can perm="masters:manage">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditVehicle(veh)}
                                    className="px-2 py-1 text-xs border border-neutral-300 hover:bg-neutral-100 font-medium text-neutral-700"
                                  >
                                    Edit
                                  </button>
                                  {veh.isActive && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeactivateVehicle(veh)}
                                      className="px-2 py-1 text-xs border border-red-200 text-red-600 hover:bg-red-50 font-medium"
                                    >
                                      Deactivate
                                    </button>
                                  )}
                                </div>
                              </Can>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* TAB 2: DRIVERS */}
      {activeTab === "drivers" && (
        <>
          {driversLoading ? (
            <div className="p-12 text-center text-xs text-neutral-500 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-neutral-400" />
              <span>Loading registered drivers...</span>
            </div>
          ) : driversQueryError ? (
            <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-xs">
              {describeApiError(driversQueryError, "Could not load drivers.")}
            </div>
          ) : drivers.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-neutral-300 bg-white/40">
              <UserCheck className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-neutral-700">
                {searchQuery ? "No drivers match your search criteria." : "No drivers registered yet."}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Register authorized commercial drivers and verify driving license validity.
              </p>
            </div>
          ) : (
            <div className="border border-neutral-300 overflow-x-auto bg-transparent">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Code / Driver Name</th>
                    <th className="py-2.5 px-3">Mobile</th>
                    <th className="py-2.5 px-3">License Number</th>
                    <th className="py-2.5 px-3">License Expiry</th>
                    <th className="py-2.5 px-3">Transporter</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300">
                  {drivers.map((drv) => (
                    <tr
                      key={drv.id}
                      className="hover:bg-neutral-200/40 transition-colors"
                    >
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-xs text-neutral-500 block">
                          {drv.code}
                        </span>
                        <span className="font-bold text-neutral-900 block">
                          {drv.name}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-neutral-800">
                        {drv.mobile}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-neutral-700">
                        {drv.licenseNumber || "—"}
                      </td>
                      <td className="py-2.5 px-3">
                        {drv.licenseExpiry ? (
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono font-bold border ${
                              drv.licenseStatus === "EXPIRED"
                                ? "bg-red-50 text-red-700 border-red-300"
                                : drv.licenseStatus === "EXPIRING_SOON"
                                ? "bg-amber-50 text-amber-800 border-amber-300"
                                : "bg-neutral-50 text-neutral-700 border-neutral-300"
                            }`}
                          >
                            {drv.licenseExpiry.split("T")[0]}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-600">
                        {drv.transporterName || "Independent"}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                            drv.isActive
                              ? "bg-emerald-50 text-[#047857] border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {drv.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Can perm="masters:manage">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditDriver(drv)}
                              className="px-2 py-1 text-xs border border-neutral-300 hover:bg-neutral-100 font-medium text-neutral-700"
                            >
                              Edit
                            </button>
                            {drv.isActive && (
                              <button
                                type="button"
                                onClick={() => handleDeactivateDriver(drv)}
                                className="px-2 py-1 text-xs border border-red-200 text-red-600 hover:bg-red-50 font-medium"
                              >
                                Deactivate
                              </button>
                            )}
                          </div>
                        </Can>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* TAB 3: TRANSPORTERS */}
      {activeTab === "transporters" && (
        <>
          {transportersLoading ? (
            <div className="p-12 text-center text-xs text-neutral-500 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-neutral-400" />
              <span>Loading transport agencies...</span>
            </div>
          ) : transportersQueryError ? (
            <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-xs">
              {describeApiError(transportersQueryError, "Could not load transporters.")}
            </div>
          ) : transporters.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-neutral-300 bg-white/40">
              <Building2 className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-neutral-700">
                {searchQuery
                  ? "No transporters match your search criteria."
                  : "No transporters registered yet."}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Register logistics partners and fleet contracting agencies.
              </p>
            </div>
          ) : (
            <div className="border border-neutral-300 overflow-x-auto bg-transparent">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Code / Agency Name</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3">GSTIN / PAN</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3 text-right">Fleet Vehicles</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300">
                  {transporters.map((trn) => (
                    <tr
                      key={trn.id}
                      className="hover:bg-neutral-200/40 transition-colors"
                    >
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-xs text-neutral-500 block">
                          {trn.code}
                        </span>
                        <span className="font-bold text-neutral-900 block">
                          {trn.name}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-neutral-600">
                        <span className="font-medium text-neutral-900 block">
                          {trn.contactPerson || "—"}
                        </span>
                        <span className="font-mono text-[11px]">{trn.mobile}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono text-neutral-800 font-semibold block">
                          {trn.gstin || "—"}
                        </span>
                        {trn.pan && (
                          <span className="font-mono text-[10px] text-neutral-500 block">
                            PAN: {trn.pan}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-600">
                        {trn.city ? `${trn.city}, ${trn.state || ""}` : trn.state || "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-900">
                        {trn.vehicleCount}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                            trn.isActive
                              ? "bg-emerald-50 text-[#047857] border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {trn.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Can perm="masters:manage">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditTransporter(trn)}
                              className="px-2 py-1 text-xs border border-neutral-300 hover:bg-neutral-100 font-medium text-neutral-700"
                            >
                              Edit
                            </button>
                            {trn.isActive && (
                              <button
                                type="button"
                                onClick={() => handleDeactivateTransporter(trn)}
                                className="px-2 py-1 text-xs border border-red-200 text-red-600 hover:bg-red-50 font-medium"
                              >
                                Deactivate
                              </button>
                            )}
                          </div>
                        </Can>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ----------------------------------------------------
          VEHICLE MODAL
      ---------------------------------------------------- */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-neutral-300 shadow-xl w-full max-w-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#059669]" />
                <h2 className="text-base font-black text-neutral-900">
                  {editingVehicle ? "Edit Vehicle Record" : "Add Vehicle to Fleet"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsVehicleModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {vehicleModalError && (
              <div
                role="alert"
                className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{vehicleModalError}</span>
              </div>
            )}

            <form onSubmit={handleVehicleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={vehNumber}
                    onChange={(e) => setVehNumber(e.target.value.toUpperCase())}
                    onBlur={() => setVehNumber(formatVehicleDisplay(vehNumber))}
                    placeholder="e.g. MH 12 RN 4821"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    Normalised automatically (e.g. MH 12 RN 4821 or 22 BH 1234 AA)
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Vehicle Type *
                  </label>
                  <select
                    value={vehType}
                    onChange={(e) => setVehType(e.target.value as VehicleType)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  >
                    {VEHICLE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {VEHICLE_TYPE_LABELS[t] || t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Carrying Capacity (MT) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={vehCapacityMt}
                    onChange={(e) => setVehCapacityMt(e.target.value)}
                    placeholder="e.g. 25"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Transporter Agency
                  </label>
                  <select
                    value={vehTransporterId}
                    onChange={(e) => setVehTransporterId(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="">Self-Owned / Individual</option>
                    {transporters.map((trn) => (
                      <option key={trn.id} value={trn.id}>
                        {trn.name} ({trn.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    value={vehOwnerName}
                    onChange={(e) => setVehOwnerName(e.target.value)}
                    placeholder="Registered owner name"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Owner Mobile
                  </label>
                  <input
                    type="tel"
                    value={vehOwnerMobile}
                    onChange={(e) => setVehOwnerMobile(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Compliance & Document Expiry Dates */}
              <div className="pt-3 border-t border-neutral-200 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block">
                  Document Expiry Dates
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-neutral-600 block mb-0.5">
                      Insurance Expiry
                    </label>
                    <input
                      type="date"
                      value={vehInsuranceExpiry}
                      onChange={(e) => setVehInsuranceExpiry(e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-neutral-300 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#059669]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-neutral-600 block mb-0.5">
                      Fitness Certificate Expiry
                    </label>
                    <input
                      type="date"
                      value={vehFitnessExpiry}
                      onChange={(e) => setVehFitnessExpiry(e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-neutral-300 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#059669]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-neutral-600 block mb-0.5">
                      National / State Permit Expiry
                    </label>
                    <input
                      type="date"
                      value={vehPermitExpiry}
                      onChange={(e) => setVehPermitExpiry(e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-neutral-300 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#059669]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-neutral-600 block mb-0.5">
                      PUC Expiry
                    </label>
                    <input
                      type="date"
                      value={vehPucExpiry}
                      onChange={(e) => setVehPucExpiry(e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-neutral-300 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVehicleModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingVehicle}
                  className="px-4 py-2 bg-[#18181B] hover:bg-neutral-800 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isSavingVehicle
                    ? "Saving..."
                    : editingVehicle
                    ? "Update Vehicle"
                    : "Save Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          DRIVER MODAL
      ---------------------------------------------------- */}
      {isDriverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-neutral-300 shadow-xl w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#059669]" />
                <h2 className="text-base font-black text-neutral-900">
                  {editingDriver ? "Edit Driver Record" : "Register Driver"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsDriverModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {driverModalError && (
              <div
                role="alert"
                className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{driverModalError}</span>
              </div>
            )}

            <form onSubmit={handleDriverSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Driver Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Primary Mobile (10 digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={driverMobile}
                    onChange={(e) => setDriverMobile(e.target.value)}
                    placeholder="e.g. 9823411223"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Alternate Mobile
                  </label>
                  <input
                    type="tel"
                    value={driverAltMobile}
                    onChange={(e) => setDriverAltMobile(e.target.value)}
                    placeholder="Optional"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    value={driverLicenseNumber}
                    onChange={(e) => setDriverLicenseNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. MH1220180012345"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    License Expiry Date
                  </label>
                  <input
                    type="date"
                    value={driverLicenseExpiry}
                    onChange={(e) => setDriverLicenseExpiry(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Transporter Agency
                </label>
                <select
                  value={driverTransporterId}
                  onChange={(e) => setDriverTransporterId(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                >
                  <option value="">Independent Driver</option>
                  {transporters.map((trn) => (
                    <option key={trn.id} value={trn.id}>
                      {trn.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDriverModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingDriver}
                  className="px-4 py-2 bg-[#18181B] hover:bg-neutral-800 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isSavingDriver
                    ? "Saving..."
                    : editingDriver
                    ? "Update Driver"
                    : "Save Driver"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TRANSPORTER MODAL
      ---------------------------------------------------- */}
      {isTransporterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-neutral-300 shadow-xl w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#059669]" />
                <h2 className="text-base font-black text-neutral-900">
                  {editingTransporter ? "Edit Transporter Record" : "Add Transporter Agency"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsTransporterModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {transporterModalError && (
              <div
                role="alert"
                className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{transporterModalError}</span>
              </div>
            )}

            <form onSubmit={handleTransporterSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Agency / Transporter Name *
                </label>
                <input
                  type="text"
                  required
                  value={trnName}
                  onChange={(e) => setTrnName(e.target.value)}
                  placeholder="e.g. Malwa Roadways Transport"
                  className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={trnContactPerson}
                    onChange={(e) => setTrnContactPerson(e.target.value)}
                    placeholder="Supervisor or Manager"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={trnMobile}
                    onChange={(e) => setTrnMobile(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    value={trnGstin}
                    onChange={(e) => setTrnGstin(e.target.value.toUpperCase())}
                    placeholder="e.g. 23AAAAA0000A1Z5"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={trnCity}
                    onChange={(e) => setTrnCity(e.target.value)}
                    placeholder="e.g. Indore"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTransporterModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingTransporter}
                  className="px-4 py-2 bg-[#18181B] hover:bg-neutral-800 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isSavingTransporter
                    ? "Saving..."
                    : editingTransporter
                    ? "Update Transporter"
                    : "Save Transporter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Vehicle Card Sub-component
function VehicleCardItem({
  vehicle,
  onEdit,
  onDeactivate,
}: {
  vehicle: VehicleItem;
  onEdit: (veh: VehicleItem) => void;
  onDeactivate: (veh: VehicleItem) => void;
}) {
  return (
    <div className="bg-white/40 border border-neutral-300 hover:border-neutral-900 transition-all p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="px-2 py-0.5 font-mono font-bold text-xs bg-neutral-50 border border-neutral-300 text-neutral-900 inline-block">
            {vehicle.displayNumber || vehicle.vehicleNumber}
          </span>
          <span className="text-[11px] font-semibold text-neutral-700 block mt-1">
            {VEHICLE_TYPE_LABELS[vehicle.vehicleType] || vehicle.vehicleType}
          </span>
        </div>
        <span
          className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
            vehicle.isActive
              ? "bg-emerald-50 text-[#047857] border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {vehicle.isActive ? "ACTIVE" : "INACTIVE"}
        </span>
      </div>

      <div className="text-xs space-y-1 text-neutral-600">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">Transporter:</span>
          <span className="font-medium text-neutral-900">
            {vehicle.transporterName || "Self-Owned"}
          </span>
        </div>
        {vehicle.ownerName && (
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">Owner:</span>
            <span>
              {vehicle.ownerName}
              {vehicle.ownerMobile && ` (${vehicle.ownerMobile})`}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">Payload Capacity:</span>
          <span className="font-mono font-bold text-neutral-900">
            {vehicle.capacityMt.toFixed(1)} MT
          </span>
        </div>
      </div>

      {vehicle.expiringDocuments && vehicle.expiringDocuments.length > 0 && (
        <div className="pt-2 border-t border-neutral-200 flex flex-wrap gap-1">
          {vehicle.expiringDocuments.map((doc: VehicleExpiringDocument, idx: number) => (
            <span
              key={idx}
              className={`px-1.5 py-0.5 text-[9px] font-bold uppercase border ${
                doc.isExpired
                  ? "bg-red-50 text-red-700 border-red-300"
                  : "bg-amber-50 text-amber-800 border-amber-300"
              }`}
            >
              {doc.document} {doc.isExpired ? "EXPIRED" : `${doc.daysRemaining}d`}
            </span>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
        <span className="font-mono text-[10px] text-neutral-500">{vehicle.code}</span>

        <Can perm="masters:manage">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(vehicle)}
              className="p-1 hover:bg-neutral-200 text-neutral-600 transition-colors"
              title="Edit Vehicle"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            {vehicle.isActive && (
              <button
                type="button"
                onClick={() => onDeactivate(vehicle)}
                className="p-1 hover:bg-red-100 text-red-600 transition-colors"
                title="Deactivate Vehicle"
              >
                <PowerOff className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </Can>
      </div>
    </div>
  );
}
