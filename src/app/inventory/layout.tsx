import React from "react";
import { verifyServerDeskAccess } from "@/lib/auth/server-guard";
import InventoryClientLayout from "./inventory-client-layout";

export default async function InventoryLayout({ children }: { children: React.ReactNode }) {
  await verifyServerDeskAccess("/inventory");
  return <InventoryClientLayout>{children}</InventoryClientLayout>;
}
