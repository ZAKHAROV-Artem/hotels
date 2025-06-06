"use client";

import {
  RequestStatus,
  RequestType,
  RequestFilters,
} from "@/shared/types/request";
import { Filter, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface RequestsFilterProps {
  filters: RequestFilters;
  onFiltersChange: (filters: RequestFilters) => void;
  onClearFilters: () => void;
}

const statusOptions = [
  { value: RequestStatus.PENDING, label: "Pending" },
  { value: RequestStatus.IN_PROGRESS, label: "In Progress" },
  { value: RequestStatus.DONE, label: "Completed" },
];

const typeOptions = [
  { value: RequestType.CLEANING, label: "Cleaning" },
  { value: RequestType.SLIPPERS, label: "Slippers" },
  { value: RequestType.LATE_CHECKOUT, label: "Late Checkout" },
  { value: RequestType.TOWELS, label: "Towels" },
  { value: RequestType.ROOM_SERVICE, label: "Room Service" },
  { value: RequestType.MAINTENANCE, label: "Maintenance" },
  { value: RequestType.OTHER, label: "Other" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function RequestsFilter({
  filters,
  onFiltersChange,
  onClearFilters,
}: RequestsFilterProps) {
  const updateFilter = (
    key: keyof RequestFilters,
    value: string | RequestStatus | RequestType | undefined
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== ""
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Status</Label>
          <Select
            value={filters.status || ""}
            onValueChange={(value) =>
              updateFilter("status", value as RequestStatus)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Request Type
          </Label>
          <Select
            value={filters.requestType || ""}
            onValueChange={(value) =>
              updateFilter("requestType", value as RequestType)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Priority</Label>
          <Select
            value={filters.priority || ""}
            onValueChange={(value) =>
              updateFilter("priority", value as "low" | "medium" | "high")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Room Number
          </Label>
          <Select
            value={filters.roomNumber || ""}
            onValueChange={(value) => updateFilter("roomNumber", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All rooms" />
            </SelectTrigger>
            <SelectContent>
              {/* Room numbers would typically come from an API */}
              {Array.from({ length: 20 }, (_, i) => (i + 101).toString()).map(
                (room) => (
                  <SelectItem key={room} value={room}>
                    Room {room}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Assigned To
          </Label>
          <Select
            value={filters.assignedToId || "all"}
            onValueChange={(value) => {
              // If value is "all", treat as undefined to clear the filter
              updateFilter("assignedToId", value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All staff" />
            </SelectTrigger>
            <SelectContent>
              {/* TODO: Load employees from API based on selected hotel */}
              <SelectItem value="all">All staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
