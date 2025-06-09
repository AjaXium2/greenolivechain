import { create } from "zustand";
import { FarmerWaste, WasteType } from "../types/waste";

interface OlivesDashStore {
  wastes: FarmerWaste[];
  showForm: boolean;
  toggleForm: () => void;
  addWaste: (newWaste: Omit<FarmerWaste, "id">) => void;
  transferWaste: (id: string) => void;
}

export const useOlivesDashStore = create<OlivesDashStore>((set) => ({
  wastes: [],
  showForm: false,
  toggleForm: () => set((state) => ({ showForm: !state.showForm })),
  addWaste: (newWaste) =>
    set((state) => ({
      wastes: [
        ...state.wastes,
        {
          ...newWaste,
          id: `waste-${Date.now()}`,
        },
      ],
      showForm: false,
    })),
  transferWaste: (id) =>
    set((state) => ({
      wastes: state.wastes.map((waste) =>
        waste.id === id
          ? { ...waste, status: "TRANSFERRED", transferDate: new Date() }
          : waste
      ),
    })),
}));
