export enum RequestStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

export enum RequestType {
  CLEANING = "cleaning",
  SLIPPERS = "slippers",
  LATE_CHECKOUT = "late_checkout",
  TOWELS = "towels",
  ROOM_SERVICE = "room_service",
  MAINTENANCE = "maintenance",
  OTHER = "other",
}

export enum EmployeeRole {
  HOUSEKEEPING = "housekeeping",
  MAINTENANCE = "maintenance",
  FRONT_DESK = "front_desk",
  ROOM_SERVICE = "room_service",
  CONCIERGE = "concierge",
  MANAGER = "manager",
}

export interface Employee {
  id: string;
  hotelId: string;
  name: string;
  role: EmployeeRole;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GuestRequest {
  id: string;
  hotelId: string;
  guestName: string;
  roomNumber?: string;
  requestType: RequestType;
  description?: string;
  status: RequestStatus;
  priority?: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt?: Date;
  assignedToId?: string;
  assignedTo?: Employee;
  estimatedCompletion?: Date;
}

export interface CreateRequestDto {
  hotelId: string;
  guestName: string;
  roomNumber?: string;
  requestType: RequestType;
  description?: string;
  priority?: "low" | "medium" | "high";
}

export interface UpdateRequestDto {
  status?: RequestStatus;
  assignedToId?: string;
  estimatedCompletion?: Date;
  description?: string;
  priority?: "low" | "medium" | "high";
}

export interface RequestFilters {
  status?: RequestStatus;
  requestType?: RequestType;
  priority?: "low" | "medium" | "high";
  roomNumber?: string;
  assignedToId?: string;
}

export interface RequestsResponse {
  requests: GuestRequest[];
  total: number;
  page: number;
  limit: number;
}

export type RequestSortBy =
  | "createdAt"
  | "priority"
  | "status"
  | "roomNumber"
  | "guestName"
  | "requestType";

export type SortOrder = "asc" | "desc";

export interface RequestSort {
  sortBy: RequestSortBy;
  sortOrder: SortOrder;
}
