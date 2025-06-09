// Extraction Dashboard Page for Processors
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { apiService } from "../../services/api";
import BlockchainStatusIndicator from "../../components/BlockchainStatusIndicator";
import TraceabilityViewer from "../../components/TraceabilityViewer";

interface ExtractionData {
  id: number;
  wasteId: number;
  extractionDate: string;
  productType: string;
  quantity: number;
  quality: string;
  status: string;
}

export default function ExtractionDash() {
  const [extractions, setExtractions] = useState<ExtractionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    wasteId: "",
    productType: "",
    quantity: "",
    quality: "",
  });

  const router = useRouter();

  // Load extractions on component mount
  useEffect(() => {
    loadExtractions();
  }, []);

  const loadExtractions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getExtractions();
      if (response.success && response.data) {
        setExtractions(response.data);
      } else {
        setError(response.error || "Erreur lors du chargement des extractions");
      }
    } catch (err) {
      setError("Erreur réseau lors du chargement des extractions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.wasteId ||
      !formData.productType ||
      !formData.quantity ||
      !formData.quality
    ) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const extractionData = {
        wasteId: parseInt(formData.wasteId),
        extractionDate: new Date().toISOString(),
        productType: formData.productType,
        quantity: parseFloat(formData.quantity),
        quality: formData.quality,
        status: "PROCESSED",
      };

      const response = await apiService.addExtraction(extractionData);

      if (response.success) {
        // Reset form
        setFormData({
          wasteId: "",
          productType: "",
          quantity: "",
          quality: "",
        });

        // Reload extractions
        await loadExtractions();

        alert("Extraction ajoutée avec succès!");
      } else {
        setError(response.error || "Erreur lors de l'ajout de l'extraction");
      }
    } catch (err) {
      setError("Erreur réseau lors de l'ajout de l'extraction");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-olive-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            🏭 Tableau de Bord - Extraction
          </h1>{" "}
          <p className="text-black">
            Gestion des extractions de produits à partir des déchets d'olive
          </p>
        </div>

        {/* Blockchain Status Indicator */}
        <div className="mb-6">
          <BlockchainStatusIndicator />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Erreur:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulaire d'ajout */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              ➕ Nouvelle Extraction
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                {" "}
                <label className="block text-sm font-medium text-black mb-2">
                  ID du Déchet Source
                </label>
                <input
                  type="number"
                  name="wasteId"
                  value={formData.wasteId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                {" "}
                <label className="block text-sm font-medium text-black mb-2">
                  Type de Produit
                </label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Huile d'olive extra vierge">
                    Huile d'olive extra vierge
                  </option>
                  <option value="Huile d'olive vierge">
                    Huile d'olive vierge
                  </option>
                  <option value="Huile d'olive raffinée">
                    Huile d'olive raffinée
                  </option>
                  <option value="Tourteau">Tourteau</option>
                  <option value="Eau de végétation">Eau de végétation</option>
                </select>
              </div>

              <div>
                {" "}
                <label className="block text-sm font-medium text-black mb-2">
                  Quantité (L ou kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                {" "}
                <label className="block text-sm font-medium text-black mb-2">
                  Qualité
                </label>
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Sélectionner la qualité</option>
                  <option value="Premium">Premium</option>
                  <option value="Extra Vierge">Extra Vierge</option>
                  <option value="Vierge">Vierge</option>
                  <option value="Standard">Standard</option>
                  <option value="Industriel">Industriel</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? "⏳ Ajout en cours..." : "✅ Ajouter l'Extraction"}
              </button>
            </form>
          </div>

          {/* Liste des extractions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              📋 Extractions Récentes
            </h2>

            {loading && extractions.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>{" "}
                <p className="mt-4 text-black">Chargement des extractions...</p>
              </div>
            ) : extractions.length === 0 ? (
              <div className="text-center py-8 text-black">
                <p>Aucune extraction enregistrée</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {extractions.map((extraction) => (
                  <div
                    key={extraction.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-green-800">
                        {extraction.productType}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          extraction.status === "PROCESSED"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {extraction.status}
                      </span>
                    </div>
                    <div className="text-sm text-black space-y-1">
                      <p>
                        <strong>ID:</strong> {extraction.id}
                      </p>
                      <p>
                        <strong>Déchet source:</strong> {extraction.wasteId}
                      </p>
                      <p>
                        <strong>Quantité:</strong> {extraction.quantity} L/kg
                      </p>
                      <p>
                        <strong>Qualité:</strong> {extraction.quality}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(extraction.extractionDate).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => router.push("/")}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            🏠 Accueil
          </button>
          <button
            onClick={loadExtractions}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            🔄 Actualiser
          </button>
        </div>
      </div>
    </div>
  );
}
