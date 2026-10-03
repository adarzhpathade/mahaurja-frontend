# MAHAURJA – Client UI & Role-wise Operational Flow

This document explains **which role uses which page**, and **how the interface behaves in each real plant situation**, so the complete UI journey can be presented to the client clearly.

## 1) End-to-End Operational Situation Flow (Plant Lifecycle)

| Situation in Plant | Primary Role | UI Page / Module | Interface Behavior |
|---|---|---|---|
| Supplier/vehicle expected at plant | Gate / Security Operator | `gate/dashboard` (current: `/gate`) | Operator sees expected arrivals, live queue, and opens quick gate actions from the operations hub. |
| Vehicle arrives at gate | Gate / Security Operator | `gate/entries` (current: `/gate/entry`) | Entry form captures vehicle, driver, material/customer context, creates gate entry ID, and pushes record into live tracker. |
| Vehicle movement must be monitored inside plant | Gate / Security Operator | `gate/dashboard` / `gate/tracker` (current: `/gate/tracker`) | Live stage tracker shows each vehicle status progression and enables rapid movement oversight. |
| Gross/tare weighment required | Weighbridge Operator | `weighbridge/weighments`, `weighbridge/slips` | Operator records gross and tare; UI auto-calculates net weight and generates weighbridge slip for downstream teams. |
| Raw material or FG sample must be quality checked | QC / Lab Technician | `quality/rm-testing`, `quality/fg-testing`, `quality/reports` | QC entry screens capture test parameters and enforce Approve/Hold/Reject decisions before inventory release. |
| Approved RM must be stored and tracked lot-wise | Warehouse / Inventory Manager | `inventory/raw-materials`, `inventory/lots` | Inventory dashboards show location-wise stock and lot traceability from supplier to storage location. |
| Production has to be planned and executed | Production Supervisor | `production/plans`, `production/material-issue`, `production/processing`, `production/batches`, `production/downtime` | UI guides stage-wise production flow (issue → process stages → batch output) with machine, shift, and downtime logging. |
| FG stock must be packaged and made dispatch-ready | Warehouse / Inventory Manager | `inventory/finished-goods`, `inventory/packaging` | Batch-wise FG status and packaging entries prepare stock for reservation and loading. |
| Customer order to dispatch execution | Sales / Dispatch Manager | `sales/customers`, `sales/orders`, `sales/dispatch`, `sales/invoices`, `sales/delivery`, `sales/payments` | UI moves order through quotation/order/dispatch/delivery/payment stages with document generation and receivable tracking. |
| Vehicle exits plant after checks | Gate / Security Operator | `gate/exits` (current: `/gate/exit`) | Exit desk validates safety + documentation + weighment reconciliation, then clears barrier and archives pass trail. |
| Dispatch document legal validation | Gate / Security Operator | `gate/verification` (current: `/gate/verification`) | Verification UI checks e-way bill/challan/LR compliance with flagging and printable clearance support. |
| Leadership requires live operational visibility | Management / Plant Director | `management/dashboard`, `management/traceability`, `management/reports` | KPI and traceability views provide forward and reverse chain visibility (Supplier → Customer and Customer → Supplier). |
| User/masters/system setup needed | Admin / Super Admin | `admin/users`, `admin/masters/*`, `admin/settings` | Admin interfaces manage users, permissions, materials, suppliers, formulas, and base system configuration. |

---

## 2) Role-wise UI Responsibility Map

## Admin / Super Admin
- **When they come into flow:** Before and during operations (master setup, users, permissions).
- **Pages:** `admin/users`, `admin/masters/suppliers`, `admin/masters/materials`, `admin/masters/storage-locations`, `admin/masters/formulas`, `admin/settings`.
- **UI working style:** Configuration-heavy forms and master tables; governs access and all operational dependencies.

## Gate / Security Operator (**Currently Implemented**)
- **When they come into flow:** Start and end of physical movement (entry, tracking, verification, exit).
- **Pages:** `/gate`, `/gate/entry`, `/gate/tracker`, `/gate/verification`, `/gate/exit`.
- **UI working style:** Real-time command center with quick actions, live queue/status monitoring, and compliance/safety checks.

## Weighbridge Operator
- **When they come into flow:** After gate entry and before final receiving/dispatch closure.
- **Pages:** `weighbridge/weighments`, `weighbridge/slips`.
- **UI working style:** Fast weighment capture, auto net-weight calculation, printable slip generation.

## QC / Lab Technician
- **When they come into flow:** After unload/production output and before stock approval.
- **Pages:** `quality/rm-testing`, `quality/fg-testing`, `quality/reports`.
- **UI working style:** Parameter entry + mandatory status decision (Approve/Hold/Reject) controlling downstream eligibility.

## Warehouse / Inventory Manager
- **When they come into flow:** After QC approval and during lot/stock movement.
- **Pages:** `inventory/raw-materials`, `inventory/finished-goods`, `inventory/lots`, `inventory/packaging`.
- **UI working style:** Location-wise inventory dashboards, lot-level traceability, and stock movement visibility.

## Production Supervisor
- **When they come into flow:** After RM availability; governs conversion of RM to FG.
- **Pages:** `production/plans`, `production/material-issue`, `production/processing`, `production/batches`, `production/downtime`.
- **UI working style:** Stage-based production execution with process logging and batch linkage.

## Sales / Dispatch Manager
- **When they come into flow:** After FG availability to customer collection and payment closure.
- **Pages:** `sales/customers`, `sales/orders`, `sales/dispatch`, `sales/invoices`, `sales/delivery`, `sales/payments`.
- **UI working style:** Workflow-driven CRM + dispatch + billing + payment tracking from enquiry to closure.

## Management / Plant Director
- **When they come into flow:** Continuous oversight across all modules.
- **Pages:** `management/dashboard`, `management/traceability`, `management/reports`.
- **UI working style:** Executive dashboard KPIs and bi-directional traceability decision support.

---

## 3) Status Flow to UI Mapping

### Raw Material
**Expected → Arrived → Gross Weighed → Unloaded → QC Pending → Approved/Hold/Rejected → Tare Weighed → Received → Stored → Issued → Consumed**
- Gate handles **Expected/Arrived**
- Weighbridge handles **Gross/Tare/Net**
- QC handles **QC Pending/Decision**
- Inventory handles **Received/Stored/Issued**
- Production handles **Consumed**

### Production
**Planned → Material Issued → Processing → Pelletisation → Cooling → Screening → Produced → QC Pending → Approved/Hold/Rejected → Stored**
- Production module controls process progression
- QC validates produced output
- Inventory stores approved FG

### Finished Goods
**Produced → QC Pending → Approved → Available → Reserved → Loading → Dispatched → Delivered**
- Production creates output
- QC approves output
- Inventory/Sales coordinate availability and loading
- Sales/Dispatch + Gate complete dispatch and delivery progression

### Sales Order
**Enquiry → Quotation → Order Received → Confirmed → Partially Dispatched → Fully Dispatched → Closed**
- Sales module is source of truth for customer commercial lifecycle

### Payment
**Invoice Generated → Outstanding → Part Payment → Fully Paid → Closed**
- Sales Payments screens track receivable closure per invoice/order

---

## 4) Current Build State for Client Demo

- **Live in UI now:** Gate role flow (`/gate`, `/gate/entry`, `/gate/tracker`, `/gate/verification`, `/gate/exit`)
- **Planned next in phased rollout:** Weighbridge → QC → Inventory → Production → Sales/Dispatch → Management (with Admin foundation ongoing as per scope)

This gives a clear story to the client: **the UI is designed role-first, status-driven, and fully traceability-oriented across the complete plant lifecycle.**
