"use client";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { RequestSort, RequestSortBy, SortOrder } from "@/shared/types/request";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface RequestsSortProps {
  sort: RequestSort;
  onSortChange: (sort: RequestSort) => void;
}

const sortOptions: Array<{ value: RequestSortBy; label: string }> = [
  { value: "createdAt", label: "Created Date" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
  { value: "roomNumber", label: "Room Number" },
  { value: "guestName", label: "Guest Name" },
  { value: "requestType", label: "Request Type" },
];

export function RequestsSort({ sort, onSortChange }: RequestsSortProps) {
  const currentSortLabel =
    sortOptions.find((option) => option.value === sort.sortBy)?.label ||
    "Created Date";

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowUpDown className="w-4 h-4" />
          Sort: {currentSortLabel}
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
              sort.sortBy === option.value ? "bg-blue-50 text-blue-700" : ""
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
  );
}
