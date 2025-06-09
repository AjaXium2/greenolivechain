import { useState } from "react";
import { WasteType } from "../types/waste";

interface WasteDashFormProps {
  onSubmit: (waste: {
    type: WasteType;
    quantity: number;
    harvestDate: Date;
    status: "READY" | "TRANSFERRED";
  }) => void;
  loading?: boolean;
}


export default function WasteDashForm({ onSubmit, loading = false }: WasteDashFormProps) {
  const [type, setType] = useState<WasteType>(WasteType.BRANCHES);
  const [quantity, setQuantity] = useState(0);
  const [harvestDate, setHarvestDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const wasteData = {
      type,
      quantity,
      harvestDate: new Date(harvestDate),
      status: "READY" as const,
    };

    try {
      // Call the onSubmit prop which now handles API calls through the store
      onSubmit(wasteData);
      
      // Reset form
      setType(WasteType.BRANCHES);
      setQuantity(0);
      setHarvestDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium text-gray-500">
            Type de déchet
          </label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as WasteType)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 text-gray-700"
            required
          >            <option value={WasteType.BRANCHES}>Branches</option>
            <option value={WasteType.LEAVES}>Feuilles</option>
            <option value={WasteType.OLIVE_PASTE}>Pâte d'olive</option>
            <option value={WasteType.RESIDUAL_WATER}>Eau résiduelle</option>
            <option value={WasteType.PITS}>Noyaux</option>
            <option value={WasteType.OTHER}>Autre</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-500">
            Quantité (kg)
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 text-gray-700"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-500">
            Date de récolte
          </label>
          <input
            type="date"
            id="harvestDate"
            name="harvestDate"
            value={harvestDate}
            onChange={(e) => setHarvestDate(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 text-gray-700"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
