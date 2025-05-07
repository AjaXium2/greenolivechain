import { create } from "zustand";
import { RecyclingProcess } from "../types/waste";

interface RecyclingFormState {
  formData: Omit<RecyclingProcess, "id" | "wasteId">;
  updateFormData: (key: string, value: any) => void;
  resetForm: () => void;
}

const useRecyclingFormStore = create<RecyclingFormState>((set) => ({
  formData: {
    processType: "COMPOST",
    startDate: new Date(),
    status: "IN_PROGRESS",
    notes: "",
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
        processType: "COMPOST",
        startDate: new Date(),
        status: "IN_PROGRESS",
        notes: "",
      },
    })),
}));

export default useRecyclingFormStore;
