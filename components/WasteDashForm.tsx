import { useState } from "react";

interface OlivesDashProps {
  onSubmit: (waste: {
    type: string;
    quantity: number;
    harvestDate: string;
    status: string;
  }) => void;
}


export default function WasteDashForm({ onSubmit }: OlivesDashProps) {
   const { formData, updateFormField, resetForm } = useOlivesDashFormStore();
  const [type, setType] = useState("BRANCHES");
  const [quantity, setQuantity] = useState(0);
  const [harvestDate, setHarvestDate] = useState(
    new Date().toISOString().split("T")[0]
  );


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const wasteData = {
    type,
    quantity,
    harvestDate,
    status: "READY",
  };

  try {
    console.log("Envoi des données:", wasteData);
    
    const response = await fetch("http://localhost:5000/api/waste/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wasteData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Erreur HTTP: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("Succès:", result);

    // Réinitialisation du formulaire
    setType("BRANCHES");
    setQuantity(0);
    setHarvestDate(new Date().toISOString().split("T")[0]);
    
    // Appel de la prop onSubmit
    onSubmit(wasteData);

  } catch (error) {
    console.error("Échec de la requête:", error);
    alert(`Erreur: ${error}`);
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
            onChange={(e) => setType(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 text-gray-700"
            required
          >
            <option value="BRANCHES">Branches</option>
            <option value="LEAVES">Feuilles</option>
            <option value="OTHER">Autre</option>
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
