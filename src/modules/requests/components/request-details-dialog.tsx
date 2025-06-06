"use client";

import {
  GuestRequest,
  RequestStatus,
  RequestType,
} from "@/shared/types/request";
import { StatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";
import { useUpdateRequestStatus } from "../api/use-update-request-status";
import {
  User,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  PlayCircle,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

interface RequestDetailsDialogProps {
  request: GuestRequest | null;
  open: boolean;
  onClose: () => void;
}

const requestTypeLabels: Record<RequestType, string> = {
  [RequestType.CLEANING]: "Cleaning",
  [RequestType.SLIPPERS]: "Slippers",
  [RequestType.LATE_CHECKOUT]: "Late Checkout",
  [RequestType.TOWELS]: "Towels",
  [RequestType.ROOM_SERVICE]: "Room Service",
  [RequestType.MAINTENANCE]: "Maintenance",
  [RequestType.OTHER]: "Other",
};

export function RequestDetailsDialog({
  request,
  open,
  onClose,
}: RequestDetailsDialogProps) {
  const updateStatusMutation = useUpdateRequestStatus();

  const handleStatusChange = (newStatus: RequestStatus) => {
    if (!request) return;
    updateStatusMutation.mutate({ id: request.id, status: newStatus });
  };

  const getNextStatus = (
    currentStatus: RequestStatus
  ): RequestStatus | null => {
    switch (currentStatus) {
      case RequestStatus.PENDING:
        return RequestStatus.IN_PROGRESS;
      case RequestStatus.IN_PROGRESS:
        return RequestStatus.DONE;
      default:
        return null;
    }
  };

  const nextStatus = request ? getNextStatus(request.status) : null;

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {request ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold">
                  {requestTypeLabels[request.requestType]} Request
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={request.priority} />
                  <StatusBadge status={request.status} />
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Guest Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Guest Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Guest Name
                    </label>
                    <p className="text-sm text-gray-900">{request.guestName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Room Number
                    </label>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Room {request.roomNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Request Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Request Type
                    </label>
                    <p className="text-sm text-gray-900">
                      {requestTypeLabels[request.requestType]}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Priority
                    </label>
                    <div className="mt-1">
                      <PriorityBadge priority={request.priority} />
                    </div>
                  </div>
                </div>

                {request.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Description
                    </label>
                    <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded-md">
                      {request.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Status & Assignment */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Status & Timeline
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Current Status
                    </label>
                    <div className="mt-1">
                      <StatusBadge status={request.status} />
                    </div>
                  </div>
                  {request.assignedTo && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Assigned To
                      </label>
                      <p className="text-sm text-gray-900">
                        {request.assignedTo}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Created
                    </label>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatTime(request.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Last Updated
                    </label>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(request.updatedAt)}
                    </p>
                  </div>
                </div>

                {request.estimatedCompletion && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Estimated Completion
                    </label>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(request.estimatedCompletion)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>

              {nextStatus && (
                <Button
                  onClick={() => {
                    handleStatusChange(nextStatus);
                    onClose();
                  }}
                  disabled={updateStatusMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {nextStatus === RequestStatus.IN_PROGRESS ? (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      Start Request
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Mark Complete
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <div className="p-6">
            <p className="text-gray-500">No request selected</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
