import { cn } from "@/shared/utils/cn";
import { RequestStatus } from "@/shared/types/request";

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

const statusConfig = {
  [RequestStatus.PENDING]: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  [RequestStatus.IN_PROGRESS]: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  [RequestStatus.DONE]: {
    label: "Done",
    className: "bg-green-100 text-green-800 border-green-200",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
