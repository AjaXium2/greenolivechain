"use client";

import { useState } from "react";
import { FarmerWaste, WasteType } from "../types/waste";

interface FarmerFormProps {
  onSubmit: (waste: Omit<FarmerWaste, "id">) => void;
}

export default function FarmerForm({ onSubmit }: FarmerFormProps) {
  const [formData, setFormData] = useState<Omit<FarmerWaste, "id">>({
    type: WasteType.BRANCHES,
    quantity: 0,
    harvestDate: new Date(),
    status: "READY",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      setFormData({ ...formData, quantity: parseFloat(value) || 0 });
    } else if (name === "harvestDate") {
      setFormData({ ...formData, harvestDate: new Date(value) });
    } else if (name === "type") {
      setFormData({ ...formData, type: value as WasteType });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-500"
          >
            Type de déchet
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 text-gray-700"
            required
          >
            <option value={WasteType.BRANCHES}>Branches</option>
            <option value={WasteType.LEAVES}>Feuilles</option>
            <option value={WasteType.OTHER}>Autre</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-500"
          >
            Quantité (kg)
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            step="0.1"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 text-gray-700"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="harvestDate"
            className="block text-sm font-medium text-gray-500"
          >
            Date de récolte
          </label>
          <input
            type="date"
            id="harvestDate"
            name="harvestDate"
            value={formData.harvestDate.toISOString().split("T")[0]}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 text-gray-700"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}
