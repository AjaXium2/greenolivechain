import { create } from "zustand";
import { FarmerWaste, WasteType } from "../types/waste";

interface FarmerStore {
  wastes: FarmerWaste[];
  showForm: boolean;
  toggleForm: () => void;
  addWaste: (newWaste: Omit<FarmerWaste, "id">) => void;
  transferWaste: (id: string) => void;
}

export const useFarmerStore = create<FarmerStore>((set) => ({
  wastes: [
    {
      id: "waste-1",
      type: WasteType.BRANCHES,
      quantity: 50,
      harvestDate: new Date(),
      status: "READY",
    },
    {
      id: "waste-2",
      type: WasteType.LEAVES,
      quantity: 30,
      harvestDate: new Date(Date.now() - 86400000),
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
