import { apiRequest } from "@/lib/api/client";
import { AdminUserItem } from "@/lib/types/admin";

// Shape returned by Mahaurja-Backend /api/v1/users (modules/users/service.ts).
export interface ApiUser {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  department: string;
  roleId: string;
  assignedPost: string;
  rosterShift: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
}

interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

const SHIFTS: AdminUserItem["shift"][] = [
  "Day Shift A (06:00 - 14:00)",
  "General Shift (09:00 - 18:00)",
  "Night Shift B (14:00 - 22:00)",
];

function toShift(value: string | null): AdminUserItem["shift"] {
  return SHIFTS.find((s) => s === value) ?? "General Shift (09:00 - 18:00)";
}

function formatLastLogin(iso: string | null): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toAdminUserItem(user: ApiUser): AdminUserItem {
  return {
    id: user.id,
    employeeCode: user.employeeCode,
    name: user.name,
    email: user.email,
    department: user.department,
    roleId: user.roleId as AdminUserItem["roleId"],
    assignedPost: user.assignedPost,
    shift: toShift(user.rosterShift),
    isActive: user.isActive,
    lastLogin: formatLastLogin(user.lastLoginAt),
  };
}

export interface NewUserInput {
  employeeCode: string;
  name: string;
  email: string;
  password: string;
  roleId: AdminUserItem["roleId"];
  department: string;
  assignedPost: string;
  shift: AdminUserItem["shift"];
}

export const usersApi = {
  async list(): Promise<AdminUserItem[]> {
    const res = await apiRequest<Paginated<ApiUser>>("/api/v1/users", {
      query: { pageSize: 100 },
    });
    return res.data.map(toAdminUserItem);
  },

  async create(input: NewUserInput): Promise<AdminUserItem> {
    const { shift, ...rest } = input;
    const user = await apiRequest<ApiUser>("/api/v1/users", {
      method: "POST",
      body: { ...rest, rosterShift: shift },
    });
    return toAdminUserItem(user);
  },

  async setActive(id: string, isActive: boolean): Promise<AdminUserItem> {
    const user = await apiRequest<ApiUser>(`/api/v1/users/${id}`, {
      method: "PATCH",
      body: { isActive },
    });
    return toAdminUserItem(user);
  },
};
