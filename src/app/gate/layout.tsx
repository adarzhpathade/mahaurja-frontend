import React from "react";
import { verifyServerDeskAccess } from "@/lib/auth/server-guard";
import GateClientLayout from "./gate-client-layout";

export default async function GateLayout({ children }: { children: React.ReactNode }) {
  await verifyServerDeskAccess("/gate");
  return <GateClientLayout>{children}</GateClientLayout>;
}
