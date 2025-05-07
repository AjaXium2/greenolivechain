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
  wastes: [
    {
      id: "extr-waste-1",
      type: WasteType.OLIVE_PASTE,
      quantity: 120,
      sourceOlives: "batch-456",
      productionDate: new Date(),
      status: "READY",
    },
    {
      id: "extr-waste-2",
      type: WasteType.RESIDUAL_WATER,
      quantity: 200,
      sourceOlives: "batch-456",
      productionDate: new Date(),
      status: "READY",
    },
    {
      id: "extr-waste-3",
      type: WasteType.PITS,
      quantity: 80,
      sourceOlives: "batch-455",
      productionDate: new Date(Date.now() - 172800000), // 2 days ago
      transferDate: new Date(Date.now() - 86400000), // Yesterday
      status: "TRANSFERRED",
    },
  ],
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
