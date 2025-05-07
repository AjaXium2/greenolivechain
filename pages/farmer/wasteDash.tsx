import Link from "next/link";
import { useOlivesDashStore } from "../../stores/useOlivesStore";
import FarmerForm from "../../components/OlivesDashForm";

export default function FarmerPage() {
  const { wastes, showForm, toggleForm, addWaste, transferWaste } =
    useOlivesDashStore();

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
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
          >
            {showForm ? "Annuler" : "Ajouter des déchets"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Déclarer des nouveaux déchets
            </h2>
            <FarmerForm onSubmit={addWaste} />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <h2 className="text-xl font-semibold p-4 bg-green-100 text-gray-700">
            Déchets agricoles
          </h2>

          {wastes.length === 0 ? (
            <p className="p-4 text-gray-500">Aucun déchet enregistré</p>
          ) : (
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-green-600 text-white text-left">
                <tr>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Quantité (kg)</th>
                  <th className="p-4 font-semibold">Date de récolte</th>
                  <th className="p-4 font-semibold">Statut</th>
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
                      {waste.status === "READY" ? (
                        <button
                          onClick={() => transferWaste(waste.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-xs shadow-sm transition-colors"
                        >
                          Transférer
                        </button>
                      ) : (
                        <span className="text-gray-500 text-xs">
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
}
