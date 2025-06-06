"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useEmployees } from "@/modules/employees/api/use-employees";
import { useHotelStore } from "@/shared/stores/hotel-store";
import { GuestRequest, EmployeeRole } from "@/shared/types/request";
import { useAssignRequest } from "../api/use-assign-request";
import { User, Phone, Mail } from "lucide-react";

interface AssignEmployeeDialogProps {
  request: GuestRequest | null;
  open: boolean;
  onClose: () => void;
}

const roleLabels: Record<EmployeeRole, string> = {
  [EmployeeRole.HOUSEKEEPING]: "Housekeeping",
  [EmployeeRole.MAINTENANCE]: "Maintenance",
  [EmployeeRole.FRONT_DESK]: "Front Desk",
  [EmployeeRole.ROOM_SERVICE]: "Room Service",
  [EmployeeRole.CONCIERGE]: "Concierge",
  [EmployeeRole.MANAGER]: "Manager",
};

export function AssignEmployeeDialog({
  request,
  open,
  onClose,
}: AssignEmployeeDialogProps) {
  const { selectedHotel } = useHotelStore();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const { data: employees = [], isLoading } = useEmployees({
    hotelId: selectedHotel?.id || "",
    role: selectedRole === "all" || !selectedRole ? undefined : selectedRole,
    isActive: true,
  });

  const assignRequestMutation = useAssignRequest();

  const handleAssign = () => {
    if (!request || !selectedEmployeeId) return;

    assignRequestMutation.mutate(
      { id: request.id, assignedToId: selectedEmployeeId },
      {
        onSuccess: () => {
          onClose();
          setSelectedEmployeeId("");
          setSelectedRole("all");
        },
      }
    );
  };

  const handleClose = () => {
    onClose();
    setSelectedEmployeeId("");
    setSelectedRole("all");
  };

  const getRecommendedRoles = (requestType: string): EmployeeRole[] => {
    switch (requestType) {
      case "cleaning":
      case "towels":
      case "slippers":
        return [EmployeeRole.HOUSEKEEPING];
      case "maintenance":
        return [EmployeeRole.MAINTENANCE];
      case "room_service":
        return [EmployeeRole.ROOM_SERVICE];
      case "late_checkout":
        return [EmployeeRole.FRONT_DESK, EmployeeRole.MANAGER];
      default:
        return [EmployeeRole.CONCIERGE, EmployeeRole.MANAGER];
    }
  };

  const recommendedRoles = request
    ? getRecommendedRoles(request.requestType)
    : [];

  const selectedEmployee = employees.find(
    (emp) => emp.id === selectedEmployeeId
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Assign Employee
          </DialogTitle>
        </DialogHeader>

        {request && (
          <div className="space-y-4">
            {/* Request Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">
                <strong>Request:</strong> {request.guestName} - Room{" "}
                {request.roomNumber}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Type:</strong>{" "}
                {request.requestType.replace("_", " ").toUpperCase()}
              </div>
            </div>

            {/* Role Filter */}
            <div className="space-y-2">
              <Label>Filter by Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className={
                        recommendedRoles.includes(value as EmployeeRole)
                          ? "bg-blue-50"
                          : ""
                      }
                    >
                      {label}
                      {recommendedRoles.includes(value as EmployeeRole) &&
                        " ⭐"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {recommendedRoles.length > 0 && (
                <p className="text-xs text-blue-600">
                  ⭐ Recommended for this request type
                </p>
              )}
            </div>

            {/* Employee Selection */}
            <div className="space-y-2">
              <Label>Select Employee *</Label>
              <Select
                value={selectedEmployeeId}
                onValueChange={setSelectedEmployeeId}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={isLoading ? "Loading..." : "Choose employee"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-xs text-gray-500">
                            {roleLabels[employee.role]}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Employee Details */}
            {selectedEmployee && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {selectedEmployee.name}
                  </span>
                </div>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>{roleLabels[selectedEmployee.role]}</div>
                  {selectedEmployee.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {selectedEmployee.email}
                    </div>
                  )}
                  {selectedEmployee.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedEmployee.phone}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedEmployeeId || assignRequestMutation.isPending}
          >
            {assignRequestMutation.isPending ? "Assigning..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
