// src/types/waste.ts

export enum WasteType {
    BRANCHES = "Branches",
    LEAVES = "Feuilles",
    OLIVE_PASTE = "Pâte d'olive",
    RESIDUAL_WATER = "Eau résiduelle",
    PITS = "Noyaux",
    OTHER = "Autre"
  }
  
  export interface WasteRecord {
    id: string;
    type: WasteType;
    quantity: number; // en kg
    sourceOrganization: string;
    destinationOrganization: string;
    createdAt: Date;
    status: "PENDING" | "TRANSFERRED" | "PROCESSED";
    notes?: string;
  }
  
  export interface FarmerWaste {
    id: string;
    type: WasteType;
    quantity: number;
    harvestDate: Date;
    transferDate?: Date;
    status: "READY" | "TRANSFERRED";
  }
  
  export interface ExtractionWaste {
    id: string;
    type: WasteType;
    quantity: number;
    sourceOlives: string; // ID du lot d'olives
    productionDate: Date;
    transferDate?: Date;
    status: "READY" | "TRANSFERRED";
  }
  
  export interface RecyclingProcess {
    id: string;
    wasteId: string;
    processType: "COMPOST" | "FUEL" | "FERTILIZER" | "OTHER";
    startDate: Date;
    endDate?: Date;
    outputQuantity?: number;
    status: "IN_PROGRESS" | "COMPLETED";
    notes?: string;
  }