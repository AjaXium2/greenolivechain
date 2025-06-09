import { create } from "zustand";
import { FarmerWaste, WasteType } from "../types/waste";
import { apiService, WasteData } from "../services/api";

interface OlivesDashStore {
  wastes: FarmerWaste[];
  showForm: boolean;
  loading: boolean;
  error: string | null;
  toggleForm: () => void;
  addWaste: (newWaste: Omit<FarmerWaste, "id">) => Promise<void>;
  transferWaste: (id: string) => void;
  loadWastes: () => Promise<void>;
  clearError: () => void;
}

export const useOlivesDashStore = create<OlivesDashStore>((set, get) => ({
  wastes: [],
  showForm: false,
  loading: false,
  error: null,
  
  toggleForm: () => set((state) => ({ showForm: !state.showForm })),
  
  clearError: () => set({ error: null }),
  
  loadWastes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.getWastes();
      if (response.success && response.data) {
        // Transform backend data to frontend format
        const transformedWastes = response.data.map((waste: any) => ({
          id: waste.id?.toString() || `waste-${Date.now()}`,
          type: waste.type as WasteType,
          quantity: waste.quantity,
          harvestDate: new Date(waste.harvestDate),
          transferDate: waste.transferDate ? new Date(waste.transferDate) : undefined,
          status: waste.status as "READY" | "TRANSFERRED",
        }));
        set({ wastes: transformedWastes, loading: false });
      } else {
        set({ error: response.error || 'Failed to load wastes', loading: false });
      }
    } catch (error) {
      set({ error: 'Network error occurred', loading: false });
    }
  },

  addWaste: async (newWaste) => {
    set({ loading: true, error: null });
    try {
      const wasteData: WasteData = {
        type: newWaste.type,
        quantity: newWaste.quantity,
        harvestDate: newWaste.harvestDate.toISOString(),
        status: "READY",
      };

      const response = await apiService.addWaste(wasteData);
      if (response.success) {
        // Add to local state
        const newWasteWithId: FarmerWaste = {
          ...newWaste,
          id: `waste-${Date.now()}`,
        };
        
        set((state) => ({
          wastes: [...state.wastes, newWasteWithId],
          showForm: false,
          loading: false,
        }));
        
        // Reload from backend to get updated data
        get().loadWastes();
      } else {
        set({ error: response.error || 'Failed to add waste', loading: false });
      }
    } catch (error) {
      set({ error: 'Network error occurred', loading: false });
    }
  },

  transferWaste: (id) =>
    set((state) => ({
      wastes: state.wastes.map((waste) =>
        waste.id === id
          ? { ...waste, status: "TRANSFERRED", transferDate: new Date() }
          : waste
      ),
    })),
}));
