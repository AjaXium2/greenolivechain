// Recycling Dashboard Page for Recyclers
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { apiService } from "../../services/api";

interface RecyclingData {
  id: number;
  wasteId: number;
  recyclingDate: string;
  recycledProduct: string;
  quantity: number;
  method: string;
  status: string;
}

export default function RecyclingDash() {
  const [recyclings, setRecyclings] = useState<RecyclingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    wasteId: "",
    recycledProduct: "",
    quantity: "",
    method: "",
  });

  const router = useRouter();

  // Load recyclings on component mount
  useEffect(() => {
    loadRecyclings();
  }, []);

  const loadRecyclings = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getRecyclings();
      if (response.success && response.data) {
        setRecyclings(response.data);
      } else {
        setError(response.error || "Erreur lors du chargement des recyclages");
      }
    } catch (err) {
      setError("Erreur réseau lors du chargement des recyclages");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.wasteId ||
      !formData.recycledProduct ||
      !formData.quantity ||
      !formData.method
    ) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const recyclingData = {
        wasteId: parseInt(formData.wasteId),
        recyclingDate: new Date().toISOString(),
        recycledProduct: formData.recycledProduct,
        quantity: parseFloat(formData.quantity),
        method: formData.method,
        status: "COMPLETED",
      };

      const response = await apiService.addRecycling(recyclingData);

      if (response.success) {
        // Reset form
        setFormData({
          wasteId: "",
          recycledProduct: "",
          quantity: "",
          method: "",
        });

        // Reload recyclings
        await loadRecyclings();

        alert("Recyclage ajouté avec succès!");
      } else {
        setError(response.error || "Erreur lors de l'ajout du recyclage");
      }
    } catch (err) {
      setError("Erreur réseau lors de l'ajout du recyclage");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            ♻️ Tableau de Bord - Recyclage
          </h1>{" "}
          <p className="text-black">
            Gestion du recyclage et de la valorisation des déchets d'olive
          </p>
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
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              ➕ Nouveau Recyclage
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                {" "}
                <label className="block text-sm font-medium text-black mb-2">
                  Produit Recyclé
                </label>
                <select
                  name="recycledProduct"
                  value={formData.recycledProduct}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un produit</option>
                  <option value="Compost">Compost</option>
                  <option value="Biochar">Biochar</option>
                  <option value="Paillis">Paillis</option>
                  <option value="Biomasse">Biomasse</option>
                  <option value="Amendement organique">
                    Amendement organique
                  </option>
                  <option value="Substrat de culture">
                    Substrat de culture
                  </option>
                </select>
              </div>

              <div>
                {" "}
                <label className="block text-sm font-medium text-black mb-2">
                  Quantité (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                {" "}
                <label className="block text-sm font-medium text-black mb-2">
                  Méthode de Recyclage
                </label>
                <select
                  name="method"
                  value={formData.method}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner une méthode</option>
                  <option value="Compostage traditionnel">
                    Compostage traditionnel
                  </option>
                  <option value="Compostage accéléré">
                    Compostage accéléré
                  </option>
                  <option value="Méthanisation">Méthanisation</option>
                  <option value="Pyrolyse">Pyrolyse</option>
                  <option value="Broyage et valorisation">
                    Broyage et valorisation
                  </option>
                  <option value="Transformation biologique">
                    Transformation biologique
                  </option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "⏳ Ajout en cours..." : "♻️ Ajouter le Recyclage"}
              </button>
            </form>
          </div>

          {/* Liste des recyclages */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              📋 Recyclages Récents
            </h2>

            {loading && recyclings.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>{" "}
                <p className="mt-4 text-black">Chargement des recyclages...</p>
              </div>
            ) : recyclings.length === 0 ? (
              <div className="text-center py-8 text-black">
                <p>Aucun recyclage enregistré</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recyclings.map((recycling) => (
                  <div
                    key={recycling.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-blue-800">
                        {recycling.recycledProduct}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          recycling.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {recycling.status}
                      </span>
                    </div>
                    <div className="text-sm text-black space-y-1">
                      <p>
                        <strong>ID:</strong> {recycling.id}
                      </p>
                      <p>
                        <strong>Déchet source:</strong> {recycling.wasteId}
                      </p>
                      <p>
                        <strong>Quantité:</strong> {recycling.quantity} kg
                      </p>
                      <p>
                        <strong>Méthode:</strong> {recycling.method}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(recycling.recyclingDate).toLocaleDateString(
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
            onClick={loadRecyclings}
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
