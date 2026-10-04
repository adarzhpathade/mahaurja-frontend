import React from "react";
import { verifyServerDeskAccess } from "@/lib/auth/server-guard";
import AdminClientLayout from "./admin-client-layout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await verifyServerDeskAccess("/admin");
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
