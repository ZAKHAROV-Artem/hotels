"use client";

import { useState } from "react";
import { useRequests } from "../api/use-requests";
import {
  RequestFilters,
  GuestRequest,
  RequestSort,
} from "@/shared/types/request";
import { useHotelStore } from "@/shared/stores/hotel-store";
import { RequestCard } from "./request-card";
import { RequestsControls } from "./requests-controls";
import { RequestDetailsDialog } from "./request-details-dialog";
import { AssignEmployeeDialog } from "./assign-employee-dialog";
import { RequestForm } from "./request-form";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface RequestsListProps {
  onViewRequest?: (request: GuestRequest) => void;
}

export function RequestsList({ onViewRequest }: RequestsListProps) {
  const { selectedHotel } = useHotelStore();
  const [filters, setFilters] = useState<RequestFilters>({});
  const [sort, setSort] = useState<RequestSort>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<GuestRequest | null>(
    null
  );
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [requestToAssign, setRequestToAssign] = useState<GuestRequest | null>(
    null
  );
  const [isAddRequestDialogOpen, setIsAddRequestDialogOpen] = useState(false);
  const limit = 10;

  const { data, isLoading, error } = useRequests(
    selectedHotel?.id,
    filters,
    page,
    limit,
    sort
  );

  const handleFiltersChange = (newFilters: RequestFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (newSort: RequestSort) => {
    setSort(newSort);
    setPage(1); // Reset to first page when sort changes
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handleViewRequest = (request: GuestRequest) => {
    setSelectedRequest(request);
    setIsDetailsDialogOpen(true);
    onViewRequest?.(request);
  };

  const handleAssignRequest = (request: GuestRequest) => {
    setRequestToAssign(request);
    setIsAssignDialogOpen(true);
  };

  const handleContactGuest = (request: GuestRequest) => {
    // Implement contact functionality (e.g., call or email)
    console.log("Contacting guest:", request.guestName);
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
  };

  const handleCloseAssignDialog = () => {
    setIsAssignDialogOpen(false);
    setRequestToAssign(null);
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  if (error) {
    return (
      <div className="space-y-6">
        <RequestsControls
          filters={filters}
          sort={sort}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
          onClearFilters={handleClearFilters}
        />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span>Error loading requests</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Unified Controls */}
      <RequestsControls
        filters={filters}
        sort={sort}
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-28"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : data?.requests.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No requests found</p>
            <p className="text-sm mb-4">
              {Object.keys(filters).length > 0
                ? "Try changing your search criteria"
                : "No guest requests yet"}
            </p>
            <Button
              onClick={() => setIsAddRequestDialogOpen(true)}
              className="mt-2"
            >
              New Request
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onView={handleViewRequest}
                onAssign={handleAssignRequest}
                onContact={handleContactGuest}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>Showing</span>
                <span className="font-medium">
                  {(page - 1) * limit + 1}-
                  {Math.min(page * limit, data?.total || 0)}
                </span>
                <span>of</span>
                <span className="font-medium">{data?.total || 0}</span>
                <span>requests</span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    const isCurrentPage = pageNumber === page;

                    // Show first page, last page, current page, and pages around current
                    const shouldShow =
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      Math.abs(pageNumber - page) <= 1;

                    if (!shouldShow) {
                      // Show ellipsis for gaps
                      if (pageNumber === 2 && page > 4) {
                        return (
                          <span key={pageNumber} className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      if (
                        pageNumber === totalPages - 1 &&
                        page < totalPages - 3
                      ) {
                        return (
                          <span key={pageNumber} className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={isCurrentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Request Details Dialog */}
      <RequestDetailsDialog
        request={selectedRequest}
        open={isDetailsDialogOpen}
        onClose={handleCloseDetailsDialog}
      />

      {/* Employee Assignment Dialog */}
      <AssignEmployeeDialog
        request={requestToAssign}
        open={isAssignDialogOpen}
        onClose={handleCloseAssignDialog}
      />

      {/* Add Request Dialog */}
      <RequestForm
        open={isAddRequestDialogOpen}
        onClose={() => setIsAddRequestDialogOpen(false)}
        onSuccess={() => {
          setIsAddRequestDialogOpen(false);
          // The requests list will automatically refresh due to react-query
        }}
      />
    </div>
  );
}
