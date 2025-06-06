"use client";

import { useRequestsStats } from "../api/use-requests-stats";
import { useHotelStore } from "@/shared/stores/hotel-store";
import { Clock, PlayCircle, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

export function RequestsStats() {
  const { selectedHotel } = useHotelStore();
  const { data: stats, isLoading, error } = useRequestsStats(selectedHotel?.id);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent>
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span>Error loading statistics</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    {
      label: "Total Requests",
      value: stats?.total || 0,
      icon: AlertCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      label: "Pending",
      value: stats?.pending || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "In Progress",
      value: stats?.inProgress || 0,
      icon: PlayCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Completed",
      value: stats?.done || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
