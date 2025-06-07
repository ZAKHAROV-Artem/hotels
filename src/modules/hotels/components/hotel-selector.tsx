"use client";

import { useState, useEffect } from "react";
import { useHotelStore, Hotel } from "@/shared/stores/hotel-store";
import { Button } from "@/shared/components/ui/button";
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
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Hotel as HotelIcon, Plus, Building2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

interface CreateHotelRequest {
  name: string;
  address?: string;
}

interface HotelSelectorProps {
  onHotelSelected?: (hotel: Hotel) => void;
}

export function HotelSelector({ onHotelSelected }: HotelSelectorProps) {
  const { selectedHotel, hotels, setSelectedHotel, setHotels, addHotel } =
    useHotelStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newHotelName, setNewHotelName] = useState("");
  const [newHotelAddress, setNewHotelAddress] = useState("");

  const queryClient = useQueryClient();

  // Fetch hotels
  const { data: hotelsData, isLoading } = useQuery({
    queryKey: ["hotels"],
    queryFn: async () => {
      const response = await api.get<Hotel[]>("/hotels");
      return response.data;
    },
  });

  // Create hotel mutation
  const createHotelMutation = useMutation({
    mutationFn: async (data: CreateHotelRequest): Promise<Hotel> => {
      const response = await api.post<Hotel>("/hotels", data);
      return response.data;
    },
    onSuccess: (newHotel) => {
      addHotel(newHotel);
      setSelectedHotel(newHotel);
      setShowCreateForm(false);
      setNewHotelName("");
      setNewHotelAddress("");
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      onHotelSelected?.(newHotel);
    },
  });

  // Update store when data is fetched
  useEffect(() => {
    if (hotelsData) {
      setHotels(hotelsData);
    }
  }, [hotelsData, setHotels]);

  const handleHotelSelect = (hotelId: string) => {
    const hotel = hotels.find((h) => h.id === hotelId);
    if (hotel) {
      setSelectedHotel(hotel);
      onHotelSelected?.(hotel);
    }
  };

  const handleCreateHotel = () => {
    if (newHotelName.trim()) {
      createHotelMutation.mutate({
        name: newHotelName.trim(),
        address: newHotelAddress.trim() || undefined,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Hotel Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Choose Your Hotel
          </Label>
          <Select
            value={selectedHotel?.id || ""}
            onValueChange={handleHotelSelect}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full min-h-11 h-11 text-left">
              <SelectValue
                placeholder={
                  isLoading
                    ? "Loading hotels..."
                    : hotels.length > 0
                    ? "Select a hotel from the list..."
                    : "No hotels available - create one first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {hotels.length === 0 && !isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  <Building2 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No hotels found</p>
                  <p className="text-xs">
                    Create your first hotel to get started
                  </p>
                </div>
              ) : (
                hotels.map((hotel) => (
                  <SelectItem key={hotel.id} value={hotel.id} className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {hotel.name}
                        </p>
                        {hotel.address && (
                          <p className="text-xs text-gray-500 truncate">
                            {hotel.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 invisible">
            Actions
          </Label>
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button
                className="w-full min-h-11 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                size="default"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Hotel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader className="space-y-3">
                <DialogTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <HotelIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Create New Hotel
                    </h2>
                    <p className="text-sm font-normal text-gray-600">
                      Add a new hotel to your management system
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="hotel-name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Hotel Name
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="hotel-name"
                    value={newHotelName}
                    onChange={(e) => setNewHotelName(e.target.value)}
                    placeholder="e.g., Grand Plaza Hotel"
                    className="h-11"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="hotel-address"
                    className="text-sm font-medium text-gray-700"
                  >
                    Address
                    <span className="text-gray-400 text-xs ml-1">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="hotel-address"
                    value={newHotelAddress}
                    onChange={(e) => setNewHotelAddress(e.target.value)}
                    placeholder="e.g., 123 Main Street, City, State"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  disabled={createHotelMutation.isPending}
                  className="sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateHotel}
                  disabled={
                    !newHotelName.trim() || createHotelMutation.isPending
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white sm:w-auto"
                >
                  {createHotelMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Hotel...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Hotel
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Empty State when no hotels exist */}
      {!isLoading && hotels.length === 0 && !selectedHotel && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Hotels Found
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by creating your first hotel. You&apos;ll be able to
            manage requests and operations once you have at least one hotel
            configured.
          </p>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Hotel
          </Button>
        </div>
      )}
    </div>
  );
}
