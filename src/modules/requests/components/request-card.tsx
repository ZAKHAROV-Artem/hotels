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
  ChevronRight,
  CheckCircle,
  PlayCircle,
  Clock,
  AlertTriangle,
  Phone,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils";

interface RequestCardProps {
  request: GuestRequest;
  onView?: (request: GuestRequest) => void;
  onAssign?: (request: GuestRequest) => void;
  onContact?: (request: GuestRequest) => void;
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

export function RequestCard({
  request,
  onView,
  onAssign,
  onContact,
}: RequestCardProps) {
  const updateStatusMutation = useUpdateRequestStatus();

  const handleStatusChange = (newStatus: RequestStatus) => {
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

  const nextStatus = getNextStatus(request.status);

  const getTimeElapsed = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  const isUrgent = (date: Date, priority?: string) => {
    const diffMs = new Date().getTime() - new Date(date).getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // Urgent if high priority and > 30 min, or any request > 2 hours
    return (priority === "high" && diffHours > 0.5) || diffHours > 2;
  };

  const isOverdue = (date: Date) => {
    const diffMs = new Date().getTime() - new Date(date).getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours > 4; // Overdue after 4 hours
  };

  const urgent = isUrgent(request.createdAt, request.priority);
  const overdue = isOverdue(request.createdAt);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-all h-full flex flex-col border-l-4",
        urgent && !overdue && "border-l-orange-400 bg-orange-50/30",
        overdue && "border-l-red-500 bg-red-50/30",
        request.status === RequestStatus.DONE &&
          "border-l-green-400 bg-green-50/20",
        !urgent &&
          !overdue &&
          request.status !== RequestStatus.DONE &&
          "border-l-blue-200"
      )}
    >
      <CardContent className="flex-grow p-3 sm:p-4">
        {/* Header with Room Number and Status - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Prominent Room Number */}
            <div className="bg-slate-100 rounded-lg px-3 py-1.5 border w-fit">
              <div className="text-xs text-gray-500 font-medium">ROOM</div>
              <div className="text-xl sm:text-lg font-bold text-gray-900">
                {request.roomNumber}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-semibold text-gray-900 text-base sm:text-sm truncate">
                  {request.guestName}
                </h3>
                {(urgent || overdue) && (
                  <AlertTriangle
                    className={cn(
                      "w-4 h-4 flex-shrink-0",
                      overdue ? "text-red-500" : "text-orange-500"
                    )}
                  />
                )}
              </div>
              <div className="text-sm sm:text-sm text-gray-600 font-medium">
                {requestTypeLabels[request.requestType]}
              </div>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2">
            <StatusBadge status={request.status} />
            <PriorityBadge priority={request.priority || "medium"} />
          </div>
        </div>

        {/* Time and Assignment Info - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 sm:gap-0">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span
              className={cn(
                "font-medium",
                overdue && "text-red-600",
                urgent && !overdue && "text-orange-600",
                !urgent && !overdue && "text-gray-600"
              )}
            >
              {getTimeElapsed(request.createdAt)}
            </span>
            <span className="text-gray-400 text-xs sm:text-sm">
              ({formatTime(request.createdAt)})
            </span>
          </div>

          {request.assignedTo && (
            <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
              <UserCheck className="w-3 h-3 flex-shrink-0" />
              <span className="font-medium truncate">
                {request.assignedTo.name}
              </span>
            </div>
          )}
        </div>

        {/* Description - Mobile Responsive */}
        {request.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 line-clamp-3 sm:line-clamp-2 leading-relaxed bg-gray-50 p-3 sm:p-2 rounded border-l-2 border-gray-200">
              {request.description}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center p-3 pt-0 mt-auto border-t bg-gray-50/50 gap-3 sm:gap-0">
        {/* Quick Actions - Mobile Responsive */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          <Button
            variant="ghost"
            size="sm"
            title="Request Details"
            onClick={() => onView?.(request)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 px-3 py-2 h-9 sm:h-8 sm:px-2 sm:py-1 flex-1 sm:flex-initial min-w-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            title="Contact Guest"
            onClick={() => onContact?.(request)}
            className="text-green-600 hover:text-green-800 hover:bg-green-100 px-3 py-2 h-9 sm:h-8 sm:px-2 sm:py-1 flex-1 sm:flex-initial min-w-0"
          >
            <Phone className="w-4 h-4 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
          </Button>

          {!request.assignedToId && (
            <Button
              variant="ghost"
              size="sm"
              title="Assign Employee57E6-AE02"
              onClick={() => onAssign?.(request)}
              className="text-purple-600 hover:text-purple-800 hover:bg-purple-100 px-3 py-2 h-9 sm:h-8 sm:px-2 sm:py-1 flex-1 sm:flex-initial min-w-0"
            >
              <User className="w-4 h-4 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
            </Button>
          )}
        </div>

        {/* Status Progression - Mobile Responsive */}
        {nextStatus && (
          <Button
            onClick={() => handleStatusChange(nextStatus)}
            disabled={updateStatusMutation.isPending}
            size="sm"
            className={cn(
              "flex items-center justify-center gap-2 h-10 sm:h-8 w-full sm:w-auto px-4 sm:px-3 font-medium",
              nextStatus === RequestStatus.IN_PROGRESS &&
                "bg-blue-600 hover:bg-blue-700",
              nextStatus === RequestStatus.DONE &&
                "bg-green-600 hover:bg-green-700"
            )}
          >
            {nextStatus === RequestStatus.IN_PROGRESS ? (
              <>
                <PlayCircle className="w-4 h-4 sm:w-3 sm:h-3 flex-shrink-0" />
                <span>Start Task</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 sm:w-3 sm:h-3 flex-shrink-0" />
                <span>Mark Complete</span>
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
