import { cn } from "@/shared/utils/cn";

interface PriorityBadgeProps {
  priority: "low" | "medium" | "high";
  className?: string;
}

const priorityConfig = {
  low: {
    label: "Low",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  medium: {
    label: "Medium",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
  high: {
    label: "High",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
