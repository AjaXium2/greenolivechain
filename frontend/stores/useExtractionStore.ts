import { create } from "zustand";
import { ExtractionWaste, WasteType } from "../types/waste";

interface ExtractionState {
  wastes: ExtractionWaste[];
  showForm: boolean;
  handleAddWaste: (newWaste: Omit<ExtractionWaste, "id">) => void;
  handleTransferWaste: (id: string) => void;
  toggleForm: () => void;
}

const useExtractionStore = create<ExtractionState>((set) => ({
  wastes: [],
  showForm: false,
  handleAddWaste: (newWaste) =>
    set((state) => ({
      wastes: [
        ...state.wastes,
        { ...newWaste, id: `extr-waste-${Date.now()}` },
      ],
      showForm: false,
    })),
  handleTransferWaste: (id) =>
    set((state) => ({
      wastes: state.wastes.map((waste) =>
        waste.id === id
          ? { ...waste, status: "TRANSFERRED", transferDate: new Date() }
          : waste
      ),
    })),
  toggleForm: () =>
    set((state) => ({
      showForm: !state.showForm,
    })),
}));

export default useExtractionStore;
