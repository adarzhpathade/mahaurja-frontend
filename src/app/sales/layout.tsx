import React from "react";
import { verifyServerDeskAccess } from "@/lib/auth/server-guard";
import SalesClientLayout from "./sales-client-layout";

export default async function SalesLayout({ children }: { children: React.ReactNode }) {
  await verifyServerDeskAccess("/sales");
  return <SalesClientLayout>{children}</SalesClientLayout>;
}
