import React from "react";
import { verifyServerDeskAccess } from "@/lib/auth/server-guard";
import ProductionClientLayout from "./production-client-layout";

export default async function ProductionLayout({ children }: { children: React.ReactNode }) {
  await verifyServerDeskAccess("/production");
  return <ProductionClientLayout>{children}</ProductionClientLayout>;
}
