import { create } from "zustand";
import { FarmerWaste, WasteType } from "../types/waste";

interface OlivesDashFormState {
  formData: Omit<FarmerWaste, "id">;
  updateFormField: (field: keyof Omit<FarmerWaste, "id">, value: any) => void;
  resetForm: () => void;
}

export const useOlivesDashFormStore = create<OlivesDashFormState>((set) => ({
  formData: {
    type: WasteType.OLIVES,
    quantity: 0,
    harvestDate: new Date(),
    status: "READY",
  },
  updateFormField: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),
  resetForm: () =>
    set(() => ({
      formData: {
        type: WasteType.OLIVES,
        quantity: 0,
        harvestDate: new Date(),
        status: "READY",
      },
    })),
}));
