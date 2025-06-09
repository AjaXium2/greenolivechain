import useExtractionFormStore from "../stores/useExtractionFormStore";
import { ExtractionWaste, WasteType } from "../types/waste";

interface ExtractionFormProps {
  onSubmit: (waste: Omit<ExtractionWaste, "id">) => void;
}

export default function ExtractionForm({ onSubmit }: ExtractionFormProps) {
  const { formData, updateFormData, resetForm } = useExtractionFormStore();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      updateFormData(name, parseFloat(value) || 0);
    } else if (name === "productionDate") {
      updateFormData(name, new Date(value));
    } else {
      updateFormData(name, value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          {" "}
          <label
            htmlFor="type"
            className="block text-base font-semibold text-black"
          >
            Type de déchet
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full text-base text-black border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
            required
          >
            <option value={WasteType.OLIVE_PASTE}>Pâte d'olive</option>
            <option value={WasteType.RESIDUAL_WATER}>Eau résiduelle</option>
            <option value={WasteType.PITS}>Noyaux</option>
            <option value={WasteType.LEAVES}>Feuilles</option>
            <option value={WasteType.OTHER}>Autre</option>
          </select>
        </div>{" "}
        <div className="space-y-2">
          <label
            htmlFor="quantity"
            className="block text-base font-semibold text-black"
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
            className="w-full text-base text-black border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="space-y-2">
          {" "}
          <label
            htmlFor="sourceOlives"
            className="block text-base font-semibold text-black"
          >
            Source des olives (ID du lot)
          </label>
          <input
            type="text"
            id="sourceOlives"
            name="sourceOlives"
            value={formData.sourceOlives}
            onChange={handleChange}
            className="w-full text-base text-black border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="space-y-2">
          {" "}
          <label
            htmlFor="productionDate"
            className="block text-base font-semibold text-black"
          >
            Date de production
          </label>
          <input
            type="date"
            id="productionDate"
            name="productionDate"
            value={formData.productionDate.toISOString().split("T")[0]}
            onChange={handleChange}
            className="w-full text-base text-black border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-yellow-600 text-white text-base font-semibold py-2 px-5 rounded hover:bg-yellow-700 transition-colors"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}
