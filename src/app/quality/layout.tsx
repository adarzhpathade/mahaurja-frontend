import React from "react";
import { verifyServerDeskAccess } from "@/lib/auth/server-guard";
import QualityClientLayout from "./quality-client-layout";

export default async function QualityLayout({ children }: { children: React.ReactNode }) {
  await verifyServerDeskAccess("/quality");
  return <QualityClientLayout>{children}</QualityClientLayout>;
}
