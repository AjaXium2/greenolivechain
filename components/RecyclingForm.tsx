"use client";

import { useState } from "react";
import { RecyclingProcess } from "../types/waste";

interface RecyclingFormProps {
  onSubmit: (process: Omit<RecyclingProcess, "id" | "wasteId">) => void;
  onCancel: () => void;
}

export default function RecyclingForm({
  onSubmit,
  onCancel,
}: RecyclingFormProps) {
  const [formData, setFormData] = useState<
    Omit<RecyclingProcess, "id" | "wasteId">
  >({
    processType: "COMPOST",
    startDate: new Date(),
    status: "IN_PROGRESS",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "startDate") {
      setFormData({ ...formData, startDate: new Date(value) });
    } else if (name === "processType") {
      setFormData({
        ...formData,
        processType: value as "COMPOST" | "FUEL" | "FERTILIZER" | "OTHER",
      });
    } else if (name === "notes") {
      setFormData({ ...formData, notes: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="processType"
            className="block text-base font-semibold text-gray-600"
          >
            Type de processus
          </label>
          <select
            id="processType"
            name="processType"
            value={formData.processType}
            onChange={handleChange}
            className="w-full text-base text-gray-600 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            required
          >
            <option value="COMPOST">Compostage</option>
            <option value="FUEL">Combustible</option>
            <option value="FERTILIZER">Fertilisant</option>
            <option value="OTHER">Autre</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="startDate"
            className="block text-base font-semibold text-gray-600"
          >
            Date de début
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate.toISOString().split("T")[0]}
            onChange={handleChange}
            className="w-full text-base text-gray-600 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="notes"
          className="block text-base font-semibold text-gray-600"
        >
          Notes (optionnel)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full text-base text-gray-600 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-600 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white text-base font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Démarrer le processus
        </button>
      </div>
    </form>
  );
}
