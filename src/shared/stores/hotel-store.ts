import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Hotel {
  id: string;
  name: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

interface HotelStore {
  selectedHotel: Hotel | null;
  hotels: Hotel[];
  isLoading: boolean;

  // Actions
  setSelectedHotel: (hotel: Hotel | null) => void;
  setHotels: (hotels: Hotel[]) => void;
  setLoading: (loading: boolean) => void;
  addHotel: (hotel: Hotel) => void;
  clearHotelData: () => void;
}

export const useHotelStore = create<HotelStore>()(
  persist(
    (set) => ({
      selectedHotel: null,
      hotels: [],
      isLoading: false,

      setSelectedHotel: (hotel) => set({ selectedHotel: hotel }),

      setHotels: (hotels) => set({ hotels }),

      setLoading: (loading) => set({ isLoading: loading }),

      addHotel: (hotel) =>
        set((state) => ({
          hotels: [...state.hotels, hotel],
        })),

      clearHotelData: () =>
        set({
          selectedHotel: null,
          hotels: [],
          isLoading: false,
        }),
    }),
    {
      name: "hotel-store",
      partialize: (state) => ({
        selectedHotel: state.selectedHotel,
        hotels: state.hotels,
      }),
    }
  )
);
