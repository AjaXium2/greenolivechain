import { create } from "zustand";
import { ExtractionWaste, WasteType } from "../types/waste";

interface FormState {
  formData: Omit<ExtractionWaste, "id">;
  updateFormData: (key: string, value: string | number | Date) => void;
  resetForm: () => void;
}

const useExtractionFormStore = create<FormState>((set) => ({
  formData: {
    type: WasteType.OLIVE_PASTE,
    quantity: 0,
    sourceOlives: "",
    productionDate: new Date(),
    status: "READY",
  },
  updateFormData: (key, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: value,
      },
    })),
  resetForm: () =>
    set(() => ({
      formData: {
        type: WasteType.OLIVE_PASTE,
        quantity: 0,
        sourceOlives: "",
        productionDate: new Date(),
        status: "READY",
      },
    })),
}));

export default useExtractionFormStore;
