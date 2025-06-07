"use client";

import { useState } from "react";
import {
  RequestStatus,
  RequestType,
  RequestFilters,
  RequestSort,
  RequestSortBy,
  SortOrder,
} from "@/shared/types/request";
import {
  Filter,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

interface RequestsControlsProps {
  filters: RequestFilters;
  sort: RequestSort;
  onFiltersChange: (filters: RequestFilters) => void;
  onSortChange: (sort: RequestSort) => void;
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

const sortOptions: Array<{ value: RequestSortBy; label: string }> = [
  { value: "createdAt", label: "Created Date" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
  { value: "roomNumber", label: "Room Number" },
  { value: "guestName", label: "Guest Name" },
  { value: "requestType", label: "Request Type" },
];

export function RequestsControls({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  onClearFilters,
}: RequestsControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (
    key: keyof RequestFilters,
    value: string | RequestStatus | RequestType | undefined
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleSortChange = (sortBy: RequestSortBy) => {
    // If clicking the same sort field, toggle order
    if (sort.sortBy === sortBy) {
      onSortChange({
        sortBy,
        sortOrder: sort.sortOrder === "asc" ? "desc" : "asc",
      });
    } else {
      // Default to descending for new sorts (most recent first, high priority first, etc.)
      const defaultOrder: SortOrder =
        sortBy === "createdAt" || sortBy === "priority" ? "desc" : "asc";
      onSortChange({
        sortBy,
        sortOrder: defaultOrder,
      });
    }
  };

  const getSortIcon = () => {
    if (sort.sortOrder === "asc") {
      return <ArrowUp className="w-4 h-4" />;
    } else {
      return <ArrowDown className="w-4 h-4" />;
    }
  };

  const getCurrentSortLabel = () => {
    return (
      sortOptions.find((option) => option.value === sort.sortBy)?.label ||
      "Created Date"
    );
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== ""
  );

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(
      (value) => value !== undefined && value !== ""
    ).length;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Compact Controls Bar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                {getActiveFilterCount()}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>

          {/* Quick Filter Pills */}
          {hasActiveFilters && !isExpanded && (
            <div className="flex items-center gap-2">
              {filters.status && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
                  Status:{" "}
                  {
                    statusOptions.find((opt) => opt.value === filters.status)
                      ?.label
                  }
                  <button
                    onClick={() => updateFilter("status", undefined)}
                    className="hover:bg-blue-100 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.requestType && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs">
                  Type:{" "}
                  {
                    typeOptions.find((opt) => opt.value === filters.requestType)
                      ?.label
                  }
                  <button
                    onClick={() => updateFilter("requestType", undefined)}
                    className="hover:bg-green-100 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.priority && (
                <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-xs">
                  Priority:{" "}
                  {
                    priorityOptions.find(
                      (opt) => opt.value === filters.priority
                    )?.label
                  }
                  <button
                    onClick={() => updateFilter("priority", undefined)}
                    className="hover:bg-orange-100 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.roomNumber && (
                <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs">
                  Room: {filters.roomNumber}
                  <button
                    onClick={() => updateFilter("roomNumber", undefined)}
                    className="hover:bg-purple-100 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="w-4 h-4" />
                Sort: {getCurrentSortLabel()}
                {getSortIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-3 py-2 text-sm font-medium text-gray-700">
                Sort by:
              </div>
              <DropdownMenuSeparator />
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`cursor-pointer ${
                    sort.sortBy === option.value
                      ? "bg-blue-50 text-blue-700"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    {sort.sortBy === option.value && getSortIcon()}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Status
              </Label>
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

            <div className="space-y-2">
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

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Priority
              </Label>
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

            <div className="space-y-2">
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
                  {Array.from({ length: 20 }, (_, i) =>
                    (i + 101).toString()
                  ).map((room) => (
                    <SelectItem key={room} value={room}>
                      Room {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Assigned To
              </Label>
              <Select
                value={filters.assignedToId || "all"}
                onValueChange={(value) => {
                  updateFilter(
                    "assignedToId",
                    value === "all" ? undefined : value
                  );
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
