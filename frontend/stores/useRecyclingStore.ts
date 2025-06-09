import { create } from "zustand";
import { RecyclingProcess, WasteRecord, WasteType } from "../types/waste";

interface RecyclingState {
  wasteRecords: WasteRecord[];
  processes: RecyclingProcess[];
  showForm: boolean;
  selectedWaste: WasteRecord | null;
  handleReceiveWaste: (id: string) => void;
  handleStartProcess: (wasteId: string) => void;
  handleAddProcess: (
    newProcess: Omit<RecyclingProcess, "id" | "wasteId">
  ) => void;
  completeProcess: (id: string) => void;
  toggleForm: (show: boolean) => void;
  setSelectedWaste: (waste: WasteRecord | null) => void;
}

const useRecyclingStore = create<RecyclingState>((set) => ({
  wasteRecords: [],
  processes: [],
  showForm: false,
  selectedWaste: null,
  handleReceiveWaste: (id) =>
    set((state) => ({
      wasteRecords: state.wasteRecords.map((record) =>
        record.id === id ? { ...record, status: "TRANSFERRED" } : record
      ),
    })),
  handleStartProcess: (wasteId) =>
    set((state) => {
      const waste = state.wasteRecords.find((w) => w.id === wasteId) || null;
      return { selectedWaste: waste, showForm: !!waste };
    }),
  handleAddProcess: (newProcess) =>
    set((state) => {
      if (state.selectedWaste) {
        const process: RecyclingProcess = {
          ...newProcess,
          id: `process-${Date.now()}`,
          wasteId: state.selectedWaste.id,
        };
        return {
          processes: [...state.processes, process],
          wasteRecords: state.wasteRecords.map((record) =>
            record.id === state.selectedWaste!.id
              ? { ...record, status: "PROCESSED" }
              : record
          ),
          showForm: false,
          selectedWaste: null,
        };
      }
      return {};
    }),
  completeProcess: (id) =>
    set((state) => ({
      processes: state.processes.map((process) =>
        process.id === id
          ? { ...process, status: "COMPLETED", endDate: new Date() }
          : process
      ),
    })),
  toggleForm: (show) => set({ showForm: show }),
  setSelectedWaste: (waste) => set({ selectedWaste: waste }),
}));

export default useRecyclingStore;
