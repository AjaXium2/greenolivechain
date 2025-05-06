import { create } from "zustand";
import { FarmerWaste, WasteType } from "../types/waste";

interface FarmerFormState {
  formData: Omit<FarmerWaste, "id">;
  updateFormField: (field: keyof Omit<FarmerWaste, "id">, value: any) => void;
  resetForm: () => void;
}

export const useFarmerFormStore = create<FarmerFormState>((set) => ({
  formData: {
    type: WasteType.BRANCHES,
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
        type: WasteType.BRANCHES,
        quantity: 0,
        harvestDate: new Date(),
        status: "READY",
      },
    })),
}));
