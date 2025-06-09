import Link from "next/link";
import { useOlivesDashStore } from "../../stores/useWasteStore";
import WasteDashForm from "../../components/WasteDashForm";
import BlockchainStatusIndicator from "../../components/BlockchainStatusIndicator";
import TraceabilityViewer from "../../components/TraceabilityViewer";
import { useEffect, useState } from "react";
import { apiService } from "../../services/api";

export default function FarmerPage() {
  const {
    wastes,
    showForm,
    loading,
    error,
    toggleForm,
    addWaste,
    transferWaste,
    loadWastes,
    clearError,
  } = useOlivesDashStore();

  const [selectedWasteForTraceability, setSelectedWasteForTraceability] =
    useState<string | null>(null);
  const [wasteHistory, setWasteHistory] = useState<{ [key: string]: any[] }>(
    {}
  );

  // Load wastes when component mounts
  useEffect(() => {
    loadWastes();
  }, [loadWastes]);

  const handleViewTraceability = (wasteId: string) => {
    setSelectedWasteForTraceability(wasteId);
  };

  const handleCloseTraceability = () => {
    setSelectedWasteForTraceability(null);
  };
  const handleViewHistory = async (wasteId: string) => {
    try {
      const response = await apiService.getWasteHistory(wasteId);
      if (response.success && response.data) {
        setWasteHistory((prev) => ({
          ...prev,
          [wasteId]: response.data || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching waste history:", error);
    }
  };

  const getBlockchainStatusIcon = (source?: string) => {
    if (source === "blockchain") {
      return (
        <span className="text-green-500 text-sm" title="Recorded on blockchain">
          🔗
        </span>
      );
    }
    return (
      <span className="text-black text-sm" title="Temporary storage">
        ⏳
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/"
              className="text-green-700 hover:underline mb-4 inline-block"
            >
              &larr; Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-green-800">
              Agriculteur - Gestion des Déchets
            </h1>
          </div>

          <button
            onClick={toggleForm}
            disabled={loading}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {showForm ? "Annuler" : "Ajouter des déchets"}
          </button>
        </div>
        {/* Error display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          </div>
        )}
        {/* Blockchain Status Indicator */}
        <div className="mb-6">
          <BlockchainStatusIndicator />
        </div>
        {/* Loading indicator */}
        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            Chargement en cours...
          </div>
        )}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            {" "}
            <h2 className="text-xl font-semibold mb-4 text-black">
              Déclarer des nouveaux déchets
            </h2>
            <WasteDashForm onSubmit={addWaste} loading={loading} />
          </div>
        )}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {" "}
          <h2 className="text-xl font-semibold p-4 bg-green-100 text-black">
            Déchets agricoles
          </h2>{" "}
          {wastes.length === 0 ? (
            <p className="p-4 text-black">Aucun déchet enregistré</p>
          ) : (
            <table className="w-full text-sm text-black">
              <thead className="bg-green-600 text-white text-left">
                <tr>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Quantité (kg)</th>
                  <th className="p-4 font-semibold">Date de récolte</th>
                  <th className="p-4 font-semibold">Statut</th>
                  <th className="p-4 font-semibold">Blockchain</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {wastes.map((waste) => (
                  <tr
                    key={waste.id}
                    className="hover:bg-green-50 transition-colors"
                  >
                    <td className="p-4 capitalize">
                      {waste.type.toLowerCase()}
                    </td>
                    <td className="p-4">{waste.quantity}</td>
                    <td className="p-4">
                      {waste.harvestDate.toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          waste.status === "READY"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {waste.status === "READY"
                          ? "Prêt à transférer"
                          : "Transféré"}
                      </span>
                    </td>
                    <td className="p-4">
                      {" "}
                      <div className="flex items-center space-x-2">
                        {getBlockchainStatusIcon((waste as any).source)}
                        <span className="text-xs text-black">
                          {(waste as any).source === "blockchain"
                            ? "Blockchain"
                            : "Local"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        {waste.status === "READY" ? (
                          <button
                            onClick={() => transferWaste(waste.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-xs shadow-sm transition-colors"
                          >
                            Transférer
                          </button>
                        ) : (
                          <span className="text-black text-xs">
                            Transféré le{" "}
                            {waste.transferDate?.toLocaleDateString()}
                          </span>
                        )}
                        <button
                          onClick={() => handleViewHistory(waste.id)}
                          className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded-md text-xs"
                          title="Voir l'historique"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => handleViewTraceability(waste.id)}
                          className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-2 rounded-md text-xs"
                          title="Voir la traçabilité complète"
                        >
                          🔗
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>{" "}
        {/* Traceability Viewer Modal */}
        {selectedWasteForTraceability && (
          <TraceabilityViewer
            wasteId={selectedWasteForTraceability}
            onClose={handleCloseTraceability}
          />
        )}
      </div>
    </main>
  );
}
