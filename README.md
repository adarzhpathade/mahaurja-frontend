# MAHAURJA – Plant Operational Management System

> **Client Engagement & Enterprise Project Notice**  
> This repository houses the bespoke enterprise software engineered for **Bharat Industrial & Renewables LLP**. Developed under contract by **Adarsh Pathade** as an end-to-end digital transformation and operational control system for commercial biomass pellet manufacturing facilities.

---

## 🏭 Executive Overview

**MAHAURJA** is an industrial-grade, Awwwards-level plant operational management system designed to govern the full manufacturing lifecycle of biomass pellets and biofuels. 

From the arrival of raw agricultural biomass at security boom barriers to final customer dispatch, weighing, QC certification, and payment reconciliation, MAHAURJA provides complete, tamper-evident, bi-directional traceability:
* **Supplier → Customer:** Raw Material Consignment → Gate Inward → Gross Weighment → Lab Sampling & Testing → Yard Pit Allocation → Production Batch → Pelletisation & Cooling → Finished Goods Lot → Customer Dispatch & Invoicing.
* **Customer → Supplier:** Given any customer bag or bulk pellet lot, trace backward instantly to the exact batch, machine run, moisture log, and farmer/supplier consignments that created it.

---

## 👥 8 Plant Operational Roles

The platform provides dedicated, role-specific terminals tailored for on-site plant operators and executive decision makers:

| Role | Operational Scope & Purpose | Status / Priority |
| :--- | :--- | :--- |
| **1. Gate / Security Operator** | Physical perimeter access control, vehicle check-in, preliminary consignment inspection, boom barrier interlocks, and departure gate pass verification. | 🟢 **Completed & Dedicated** |
| **2. Weighbridge Operator** | Gross, tare, and net weighment capture, automatic weight difference calculations, calibrated scale interlocks, and weight slip issuance. | 🏗️ In Development |
| **3. QC / Lab Technician** | Mandatory sampling, rapid proximate analysis (Moisture %, Ash %, GCV, Bulk Density, Foreign Matter %), and Approval / Hold / Reject workflow. | 📋 Scheduled |
| **4. Warehouse & Inventory Manager** | Location-wise raw material inventory, silo allocations, bagging lines, and finished goods lot management. | 📋 Scheduled |
| **5. Production Supervisor** | Production recipes, blend masters, stage-wise logging (Cleaning → Grinding → Drying → Blending → Pelletisation → Cooling → Screening), and downtime audits. | 📋 Scheduled |
| **6. Sales / Dispatch Manager** | Customer orders, dispatch scheduling, e-Way bill audit, Lorry Receipts (LR), tax invoices, and payment tracking. | 📋 Scheduled |
| **7. Management / Plant Director** | High-level operational command center, live throughput KPIs, bi-directional traceability trees, and yield/cost analytics. | 📋 Scheduled |
| **8. Admin / Super Admin** | User access control, permission settings, material masters, formula masters, and plant system configuration. | 📋 Scheduled |

---

## 🛡️ Dedicated Gate / Security Terminal (Live)

The Security Operator desk operates as a dedicated, low-latency station located at plant perimeter gates:

* **Operations Command Center (`/gate`):** Real-time arrival roster, security checklist, telemetry clock, and gate event stream.
* **Gate Entry Registration (`/gate/entry`):** Full-screen terminal for logging inbound raw materials (Groundnut Shell, Sawdust, Bagasse) and outbound dispatch trailers, running safety compliance checks (Breathalyzer 0.00% BAC), and routing carriers to Weighbridge 01.
* **Live Fleet Tracker (`/gate/tracker`):** Interactive yard matrix monitoring all carriers currently inside the plant across 5 operational stages.
* **Departure Verification Desk (`/gate/exit`):** Exit barrier clearance, tare weight slip reconciliation, and gate pass stamping.
* **Document Audit Desk (`/gate/verification`):** Validation of GST e-Way bills, transporter LRs, and purchase order matching.

---

## 🎨 Industrial Design Philosophy

MAHAURJA adheres to a minimalist, functional industrial aesthetic engineered for high-visibility plant control rooms and outdoor rugged tablets:

* **Strict 80 / 15 / 5 Color Distribution Rule:**
  - **80% Grays & Neutrals:** Canvas (`#F4F5F7`), borders (`#E2E8F0`), unselected panels (`#ECEFF2`), text (`#0F172A` / `#64748B`), and heavy charcoal accents (`#18181B`).
  - **15% Studio White Surfaces:** Crisp white card containers (`#FFFFFF`), tables, and elevated modals.
  - **5% Surgical Bio-Emerald Green:** Focal accents strictly reserved for active states, verified badges, and primary action triggers (`#059669` / `#10B981`).
* **Zero Corner Rounding:** `rounded-none` / 0px border radius strictly applied across all buttons, inputs, tables, and dialogs.
* **Large Typography & Industrial Spacing:** High-contrast `space-y-12 md:space-y-14` section spacing, tabular monospace figures for weights and passes, and clean hairline dividers.
* **Center-Aligned Desktop Navigation:** Precision top bar with mathematically centered desk navigation tabs and an unverbose on-duty user profile popover.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router, React Server Components & Hooks) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict type safety) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first `@theme` configuration) |
| **Animations** | [Motion](https://motion.dev/) (Hardware-accelerated layout transitions) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Fonts** | Switzer / Inter & Monospace tabular typography |

---

## 📂 Project Architecture

```
src/
├── app/
│   ├── layout.tsx                    # Root layout with providers & global styles
│   ├── page.tsx                      # Root entrance (redirects to active desk)
│   └── gate/                         # Dedicated Gate / Security Station
│       ├── layout.tsx                # Gate navigation shell & context provider
│       ├── page.tsx                  # Gate Home / Operations Command Center
│       ├── entry/page.tsx            # Dedicated Gate Entry Registration Desk
│       ├── tracker/page.tsx          # Live Vehicle & Yard Movement Tracker
│       ├── exit/page.tsx             # Departure Clearance & Barrier 02 Exit Desk
│       └── verification/page.tsx     # Consignment Document Audit Desk
├── components/
│   ├── gate/                         # Gate station UI components
│   │   ├── gate-home.tsx             # Operations dashboard & shift checklist
│   │   ├── gate-entry.tsx            # Entry pass creation & safety inspection
│   │   ├── live-vehicle-tracker.tsx  # Interactive 5-stage yard matrix
│   │   ├── gate-exit.tsx             # Exit verification & pass archiving
│   │   ├── gate-doc-verification.tsx # E-Way bill & LR discrepancy auditor
│   │   └── gate-entry-modal.tsx      # Fallback quick-entry modal
│   └── layout/
│       └── industrial-nav.tsx        # Centered top navigation & guard profile
├── lib/
│   ├── context/                      # Shared React Context (GateContext)
│   ├── data/                         # Mock data fixtures & operational feeds
│   └── types/                        # Strict TypeScript interfaces
└── styles/
    └── globals.css                   # Tailwind v4 theme tokens & styles
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js:** v18.18.0 or higher
* **npm:** v9.0.0 or higher

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/adarzhpathade/mahaurja-frontend.git
   cd mahaurja-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser. The system will automatically route to the active Gate Security station at `/gate`.

---

## 🔒 Confidentiality & Client Attribution

This application is actively being built for **Bharat Industrial & Renewables LLP**. All intellectual property, process logic, plant specifications, and operational workflows belong to the client organization.
