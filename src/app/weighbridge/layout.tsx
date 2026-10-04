import React from "react";
import { verifyServerDeskAccess } from "@/lib/auth/server-guard";
import WeighbridgeClientLayout from "./weighbridge-client-layout";

export default async function WeighbridgeLayout({ children }: { children: React.ReactNode }) {
  await verifyServerDeskAccess("/weighbridge");
  return <WeighbridgeClientLayout>{children}</WeighbridgeClientLayout>;
}
