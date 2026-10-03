import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toUpperCase().replace(/\s+/g, "_");

  switch (normalized) {
    case "APPROVED":
    case "FULLY_PAID":
    case "FULLY_DISPATCHED":
    case "CONFIRMED":
    case "DELIVERED":
    case "RECEIVED":
    case "STORED":
      return (
        <Badge variant="success" className={className}>
          <CheckCircle2 className="w-3 h-3" />
          <span>{status}</span>
        </Badge>
      );

    case "ARRIVED":
    case "IN_TRANSIT":
    case "PROCESSING":
    case "PELLETISATION":
    case "COOLING":
    case "SCREENING":
    case "LOADING":
    case "DISPATCHED":
      return (
        <Badge variant="info" className={className}>
          <Truck className="w-3 h-3 animate-pulse" />
          <span>{status}</span>
        </Badge>
      );

    case "PENDING":
    case "QC_PENDING":
    case "WAITING":
    case "OUTSTANDING":
    case "ORDER_RECEIVED":
      return (
        <Badge variant="warning" className={className}>
          <Clock className="w-3 h-3" />
          <span>{status}</span>
        </Badge>
      );

    case "HOLD":
    case "PART_PAYMENT":
    case "PARTIALLY_DISPATCHED":
      return (
        <Badge variant="warning" className={className}>
          <RotateCcw className="w-3 h-3" />
          <span>{status}</span>
        </Badge>
      );

    case "REJECTED":
    case "FAILED":
      return (
        <Badge variant="danger" className={className}>
          <XCircle className="w-3 h-3" />
          <span>{status}</span>
        </Badge>
      );

    case "EXPECTED":
    case "PLANNED":
    case "ENQUIRY":
    case "QUOTATION":
    default:
      return (
        <Badge variant="default" className={className}>
          <Sparkles className="w-3 h-3 opacity-60" />
          <span>{status}</span>
        </Badge>
      );
  }
}
