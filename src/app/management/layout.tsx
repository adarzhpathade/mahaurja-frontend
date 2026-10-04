import React from "react";
import { verifyServerDeskAccess } from "@/lib/auth/server-guard";
import ManagementClientLayout from "./management-client-layout";

export default async function ManagementLayout({ children }: { children: React.ReactNode }) {
  await verifyServerDeskAccess("/management");
  return <ManagementClientLayout>{children}</ManagementClientLayout>;
}
