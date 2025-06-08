"use client";

import { useState } from "react";
import { RequestsStats } from "@/modules/requests/components/requests-stats";
import { RequestsList } from "@/modules/requests/components/requests-list";
import { RequestForm } from "@/modules/requests/components/request-form";
import { HotelSelector } from "@/modules/hotels/components/hotel-selector";
import { GuestRequest } from "@/shared/types/request";
import { useHotelStore } from "@/shared/stores/hotel-store";
import { Plus, Hotel, Building2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function Home() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const { selectedHotel } = useHotelStore();

  const handleViewRequest = (request: GuestRequest) => {
    // Request details are now handled by RequestDetailsDialog in RequestsList
    console.log("Viewing request:", request);
  };

  const handleHotelSelected = () => {
    // Refresh requests when hotel is selected
    // The RequestsList component will handle this automatically
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <Hotel className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <div>
                <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">
                  {selectedHotel ? (
                    selectedHotel.name
                  ) : (
                    <>
                      <span className="sm:hidden">Request Manager</span>
                      <span className="hidden sm:inline">
                        Guest Request Management System
                      </span>
                    </>
                  )}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  {selectedHotel ? (
                    <>
                      <span className="sm:hidden">Dashboard</span>
                      <span className="hidden sm:inline">
                        Hotel Management Dashboard
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="sm:hidden">Multi-Hotel SaaS</span>
                      <span className="hidden sm:inline">
                        SaaS Mode - Multi-Hotel Management
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowRequestForm(true)}
              disabled={!selectedHotel}
              title={
                !selectedHotel
                  ? "Please select a hotel first"
                  : "Create new request"
              }
              className="text-xs sm:text-sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">New Request</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-10">
          {/* Hotel Selection Section */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-blue-600" />
                    </div>
                    Hotel Configuration
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Configure your hotel to start managing guest requests
                  </p>
                </div>
                {selectedHotel && (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Hotel Active
                  </div>
                )}
              </div>
            </div>
            <div className="p-8">
              <HotelSelector onHotelSelected={handleHotelSelected} />
            </div>
          </section>

          {/* Dashboard Content */}
          {selectedHotel ? (
            <div className="space-y-8">
              {/* Statistics Section */}
              <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Request Statistics
                  </h3>
                  <p className="text-sm text-gray-600">
                    Overview of current request status for {selectedHotel.name}
                  </p>
                </div>
                <div className="p-6">
                  <RequestsStats />
                </div>
              </section>

              {/* Requests List Section */}
              <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">
                    All Requests
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage and track all guest requests for {selectedHotel.name}
                  </p>
                </div>
                <div className="p-6">
                  <RequestsList onViewRequest={handleViewRequest} />
                </div>
              </section>
            </div>
          ) : (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-600 mb-6">
                  Select or create a hotel above to begin managing guest
                  requests and operations. Your dashboard will appear here once
                  a hotel is configured.
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Multi-Hotel Support
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Real-time Updates
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    SaaS Ready
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Request Form Dialog */}
      {selectedHotel && (
        <RequestForm
          open={showRequestForm}
          onClose={() => setShowRequestForm(false)}
          onSuccess={() => {
            setShowRequestForm(false);
            // Optional: Show success notification
          }}
        />
      )}
    </div>
  );
}
