import Link from "next/link";
import useExtractionStore from "../stores/useExtractionStore";
import ExtractionForm from "../components/ExtractionForm";

export default function ExtractionPage() {
  const { wastes, showForm, handleAddWaste, handleTransferWaste, toggleForm } =
    useExtractionStore();

  // Données factices pour le portefeuille
  const walletBalance = 1845; // MAD

  return (
    <main className="min-h-screen bg-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* En-tête avec portefeuille intégré */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Link
              href="/"
              className="text-yellow-700 hover:underline mb-2 inline-block"
            >
              &larr; Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-yellow-800">
              Extraction d'Huile - Gestion des Déchets
            </h1>
          </div>

          <div className="flex flex-col md:flex-row items-end gap-4">
            {/* Portefeuille des récompenses */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg shadow-md min-w-[200px]">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-yellow-100 text-sm">Récompenses</p>
                  <p className="text-2xl font-bold">{walletBalance} MAD</p>
                </div>
                <span className="text-xl">💰</span>
              </div>
            </div>

            <button
              onClick={toggleForm}
              className="bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors"
            >
              {showForm ? "Annuler" : "Ajouter des déchets"}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-500">
              Déclarer des nouveaux déchets d'extraction
            </h2>
            <ExtractionForm onSubmit={handleAddWaste} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold p-4 bg-yellow-100 text-gray-500 hover:text-gray-700">
            Déchets d'extraction
          </h2>

          {wastes.length === 0 ? (
            <p className="p-4 text-gray-500">
              Aucun déchet d'extraction enregistré
            </p>
          ) : (
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-yellow-50">
                <tr>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Quantité (kg)</th>
                  <th className="p-4 text-left">Source (batch)</th>
                  <th className="p-4 text-left">Date de production</th>
                  <th className="p-4 text-left">Statut</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {wastes.map((waste) => (
                  <tr key={waste.id}>
                    <td className="p-4">{waste.type}</td>
                    <td className="p-4">{waste.quantity}</td>
                    <td className="p-4">{waste.sourceOlives}</td>
                    <td className="p-4">
                      {waste.productionDate.toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
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
                      {waste.status === "READY" && (
                        <button
                          onClick={() => handleTransferWaste(waste.id)}
                          className="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600"
                        >
                          Transférer
                        </button>
                      )}
                      {waste.status === "TRANSFERRED" && (
                        <span className="text-gray-500 text-sm">
                          Transféré le{" "}
                          {waste.transferDate?.toLocaleDateString()}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
};