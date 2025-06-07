"use client";

import { useState } from "react";
import { RequestType, CreateRequestDto } from "@/shared/types/request";
import { useCreateRequest } from "../api/use-create-request";
import { useHotelStore } from "@/shared/stores/hotel-store";
import { Plus } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";

interface RequestFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const requestTypeOptions = [
  { value: RequestType.CLEANING, label: "Cleaning" },
  { value: RequestType.SLIPPERS, label: "Slippers" },
  { value: RequestType.LATE_CHECKOUT, label: "Late Checkout" },
  { value: RequestType.TOWELS, label: "Towels" },
  { value: RequestType.ROOM_SERVICE, label: "Room Service" },
  { value: RequestType.MAINTENANCE, label: "Maintenance" },
  { value: RequestType.OTHER, label: "Other" },
];

const priorityOptions = [
  { value: "low" as const, label: "Low" },
  { value: "medium" as const, label: "Medium" },
  { value: "high" as const, label: "High" },
];

export function RequestForm({ open, onClose, onSuccess }: RequestFormProps) {
  const { selectedHotel } = useHotelStore();

  const [formData, setFormData] = useState<CreateRequestDto>({
    hotelId: selectedHotel?.id || "",
    guestName: "",
    roomNumber: "",
    requestType: RequestType.CLEANING,
    priority: "medium",
    description: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateRequestDto, string>>
  >({});

  const createRequestMutation = useCreateRequest();

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateRequestDto, string>> = {};

    if (!formData.guestName.trim()) {
      newErrors.guestName = "Guest name is required";
    }

    if (!formData.roomNumber?.trim()) {
      newErrors.roomNumber = "Room number is required";
    }

    if (!formData.requestType) {
      newErrors.requestType = "Request type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Ensure hotelId is current
    const requestData = {
      ...formData,
      hotelId: selectedHotel?.id || "",
    };

    createRequestMutation.mutate(requestData, {
      onSuccess: () => {
        onSuccess?.();
        onClose();
        // Reset form
        setFormData({
          hotelId: selectedHotel?.id || "",
          guestName: "",
          roomNumber: "",
          requestType: RequestType.CLEANING,
          priority: "medium",
          description: "",
        });
        setErrors({});
      },
    });
  };

  const handleInputChange = (
    field: keyof CreateRequestDto,
    value: string | RequestType
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    setFormData({
      hotelId: selectedHotel?.id || "",
      guestName: "",
      roomNumber: "",
      requestType: RequestType.CLEANING,
      priority: "medium",
      description: "",
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            New Guest Request
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">Guest Name *</Label>
            <Input
              id="guestName"
              type="text"
              value={formData.guestName}
              onChange={(e) => handleInputChange("guestName", e.target.value)}
              className={errors.guestName ? "border-red-500" : ""}
              placeholder="Enter guest name"
            />
            {errors.guestName && (
              <p className="text-red-500 text-xs">{errors.guestName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomNumber">Room Number *</Label>
            <Input
              id="roomNumber"
              type="text"
              value={formData.roomNumber}
              onChange={(e) => handleInputChange("roomNumber", e.target.value)}
              className={errors.roomNumber ? "border-red-500" : ""}
              placeholder="e.g., 101"
            />
            {errors.roomNumber && (
              <p className="text-red-500 text-xs">{errors.roomNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Request Type *</Label>
            <Select
              value={formData.requestType}
              onValueChange={(value) =>
                handleInputChange("requestType", value as RequestType)
              }
            >
              <SelectTrigger
                className={errors.requestType ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select request type" />
              </SelectTrigger>
              <SelectContent>
                {requestTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.requestType && (
              <p className="text-red-500 text-xs">{errors.requestType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) =>
                handleInputChange(
                  "priority",
                  value as "low" | "medium" | "high"
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              placeholder="Additional information about the request..."
            />
          </div>

          <DialogFooter className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createRequestMutation.isPending}>
              {createRequestMutation.isPending ? (
                "Creating..."
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Request
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
