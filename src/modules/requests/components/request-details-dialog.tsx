"use client";

import { useState } from "react";
import {
  GuestRequest,
  RequestStatus,
  RequestType,
  UpdateRequestDto,
} from "@/shared/types/request";
import { useUpdateRequestStatus } from "../api/use-update-request-status";
import { useUpdateRequest } from "../api/use-update-request";
import { useDeleteRequest } from "../api/use-delete-request";
import { useEmployees } from "@/modules/employees/api/use-employees";
import { useHotelStore } from "@/shared/stores/hotel-store";
import {
  User,
  CheckCircle,
  PlayCircle,
  Edit2,
  Save,
  X,
  Trash2,
  UserCheck,
  AlertTriangle,
  Phone,
  MessageSquare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface RequestDetailsDialogProps {
  request: GuestRequest | null;
  open: boolean;
  onClose: () => void;
}

const requestTypeLabels: Record<RequestType, string> = {
  [RequestType.CLEANING]: "Room Cleaning",
  [RequestType.SLIPPERS]: "Slippers",
  [RequestType.LATE_CHECKOUT]: "Late Checkout",
  [RequestType.TOWELS]: "Fresh Towels",
  [RequestType.ROOM_SERVICE]: "Room Service",
  [RequestType.MAINTENANCE]: "Maintenance",
  [RequestType.OTHER]: "Other Request",
};

const priorityColors: Record<string, string> = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
};

const statusColors: Record<RequestStatus, string> = {
  [RequestStatus.PENDING]: "bg-orange-100 text-orange-800 border-orange-200",
  [RequestStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800 border-blue-200",
  [RequestStatus.DONE]: "bg-green-100 text-green-800 border-green-200",
};

interface ExtendedUpdateRequestDto extends UpdateRequestDto {
  guestName?: string;
  roomNumber?: string;
}

export function RequestDetailsDialog({
  request,
  open,
  onClose,
}: RequestDetailsDialogProps) {
  const { selectedHotel } = useHotelStore();
  const updateStatusMutation = useUpdateRequestStatus();
  const updateRequestMutation = useUpdateRequest();
  const deleteRequestMutation = useDeleteRequest();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editData, setEditData] = useState<ExtendedUpdateRequestDto>({});

  // Fetch employees for assignment
  const { data: employees } = useEmployees({
    hotelId: selectedHotel?.id || "",
  });

  const handleStatusChange = (newStatus: RequestStatus) => {
    if (!request) return;
    updateStatusMutation.mutate({ id: request.id, status: newStatus });
  };

  const handleEditToggle = () => {
    if (!request) return;

    if (!isEditing) {
      setEditData({
        guestName: request.guestName,
        roomNumber: request.roomNumber || "",
        description: request.description || "",
        priority: request.priority || "medium",
        assignedToId: request.assignedToId || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleEditSave = () => {
    if (!request) return;

    updateRequestMutation.mutate(
      { id: request.id, data: editData },
      {
        onSuccess: () => {
          setIsEditing(false);
          setEditData({});
          // Close and reopen dialog to refresh data
          onClose();
        },
      }
    );
  };

  const handleEditChange = (
    field: keyof ExtendedUpdateRequestDto,
    value: string
  ) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteConfirm = () => {
    if (!request) return;

    deleteRequestMutation.mutate(request.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        onClose();
      },
    });
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          {request ? (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                      {requestTypeLabels[request.requestType]}
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${
                          statusColors[request.status]
                        }`}
                      >
                        {request.status === RequestStatus.PENDING && "Pending"}
                        {request.status === RequestStatus.IN_PROGRESS &&
                          "In Progress"}
                        {request.status === RequestStatus.DONE && "Completed"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${
                          priorityColors[request.priority || "medium"]
                        }`}
                      >
                        {(request.priority || "medium")
                          .charAt(0)
                          .toUpperCase() +
                          (request.priority || "medium").slice(1)}{" "}
                        Priority
                      </span>
                    </div>
                  </div>

                  {!isEditing ? (
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditToggle}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditCancel}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleEditSave}
                        disabled={updateRequestMutation.isPending}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </DialogHeader>

              <div className="space-y-4">
                {/* Guest Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Guest
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editData.guestName || ""}
                          onChange={(e) =>
                            handleEditChange("guestName", e.target.value)
                          }
                          className="mt-1"
                        />
                      ) : (
                        <p className="font-medium">{request.guestName}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Room
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editData.roomNumber || ""}
                          onChange={(e) =>
                            handleEditChange("roomNumber", e.target.value)
                          }
                          className="mt-1"
                        />
                      ) : (
                        <p className="font-medium">
                          {request.roomNumber || "N/A"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Description
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editData.description || ""}
                      onChange={(e) =>
                        handleEditChange("description", e.target.value)
                      }
                      rows={3}
                      className="mt-1"
                      placeholder="What does the guest need?"
                    />
                  ) : (
                    <p className="mt-1 text-sm bg-gray-50 p-3 rounded">
                      {request.description || "No details provided"}
                    </p>
                  )}
                </div>

                {/* Priority (when editing) */}
                {isEditing && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Priority
                    </Label>
                    <Select
                      value={editData.priority || request.priority || "medium"}
                      onValueChange={(value) =>
                        handleEditChange("priority", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Assignment */}
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Assigned To
                  </Label>
                  {isEditing ? (
                    <Select
                      value={editData.assignedToId || "unassigned"}
                      onValueChange={(value) =>
                        handleEditChange(
                          "assignedToId",
                          value === "unassigned" ? "" : value
                        )
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Assign to employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {employees?.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name} - {employee.role.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      {request.assignedTo ? (
                        <div className="flex items-center gap-2 bg-green-50 p-2 rounded">
                          <UserCheck className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">
                            {request.assignedTo.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({request.assignedTo.role.replace("_", " ")})
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Not assigned
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Info */}
                {!isEditing && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    Created {formatTime(request.createdAt)}
                    {request.updatedAt &&
                      request.updatedAt !== request.createdAt &&
                      ` • Updated ${formatTime(request.updatedAt)}`}
                  </div>
                )}
              </div>

              <DialogFooter className="pt-4">
                {!isEditing ? (
                  <div className="flex justify-between w-full">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    </div>

                    <div className="flex gap-2">
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
                        >
                          {nextStatus === RequestStatus.IN_PROGRESS ? (
                            <>
                              <PlayCircle className="w-4 h-4 mr-1" />
                              Start
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Complete
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleEditCancel}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleEditSave}
                      disabled={updateRequestMutation.isPending}
                    >
                      {updateRequestMutation.isPending
                        ? "Saving..."
                        : "Save Changes"}
                    </Button>
                  </div>
                )}
              </DialogFooter>
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No request selected</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Delete Request
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-700 mb-3">
              Delete this request for <strong>{request?.guestName}</strong> in
              room <strong>{request?.roomNumber}</strong>?
            </p>
            <p className="text-xs text-gray-500">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleteRequestMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteRequestMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
