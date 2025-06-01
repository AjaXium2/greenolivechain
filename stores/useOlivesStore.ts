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
  wastes: [
    {
      id: "waste-1",
      type: WasteType.OLIVES,
      quantity: 150,
      harvestDate: new Date(),
      status: "READY",
    },
    {
      id: "waste-2",
      type: WasteType.OLIVES,
      quantity: 200,
      harvestDate: new Date(Date.now() - 86400000), // 1 day ago
      status: "READY",
    },
    {
      id: "waste-3",
      type: WasteType.OLIVES,
      quantity: 120,
      harvestDate: new Date(Date.now() - 172800000), // 2 days ago
      transferDate: new Date(),
      status: "TRANSFERRED",
    },
  ],
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
