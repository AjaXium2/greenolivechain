import Link from "next/link";
import useRecyclingStore from "../stores/useRecyclingStore";
import RecyclingForm from "../components/RecyclingForm";

export default function RecyclingPage() {
  const {
    wasteRecords,
    processes,
    showForm,
    selectedWaste,
    handleReceiveWaste,
    handleStartProcess,
    handleAddProcess,
    completeProcess,
    toggleForm,
    setSelectedWaste,
  } = useRecyclingStore();

  return (
    <main className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8 flex-col md:flex-row gap-4">
          <div>
            <Link
              href="/"
              className="text-blue-700 hover:underline mb-2 inline-block"
            >
              &larr; Retour à l'accueil
            </Link>{" "}
            <h1 className="text-3xl font-bold text-blue-800">
              Organisation de Recyclage
            </h1>
          </div>
        </div>

        {showForm && selectedWaste && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Démarrer un processus de recyclage
            </h2>
            <p className="mb-4 text-black">
              <strong>Déchet sélectionné:</strong> {selectedWaste.type},{" "}
              {selectedWaste.quantity} kg
            </p>
            <RecyclingForm
              onSubmit={handleAddProcess}
              onCancel={() => {
                toggleForm(false);
                setSelectedWaste(null);
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Déchets reçus */}{" "}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl text-black font-semibold p-4 bg-blue-100">
              Déchets reçus
            </h2>

            {wasteRecords.length === 0 ? (
              <p className="p-4 text-black">Aucun déchet reçu</p>
            ) : (
              <table className="w-full text-black">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="p-4 text-left">Type</th>
                    <th className="p-4 text-left">Quantité</th>
                    <th className="p-4 text-left">Source</th>
                    <th className="p-4 text-left">Statut</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {wasteRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="p-4">{record.type}</td>
                      <td className="p-4">{record.quantity} kg</td>
                      <td className="p-4">{record.sourceOrganization}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            record.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : record.status === "TRANSFERRED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {record.status === "PENDING"
                            ? "En attente"
                            : record.status === "TRANSFERRED"
                            ? "Reçu"
                            : "Traité"}
                        </span>
                      </td>
                      <td className="p-4">
                        {record.status === "PENDING" && (
                          <button
                            onClick={() => handleReceiveWaste(record.id)}
                            className="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600"
                          >
                            Marquer comme reçu
                          </button>
                        )}
                        {record.status === "TRANSFERRED" && (
                          <button
                            onClick={() => handleStartProcess(record.id)}
                            className="bg-green-500 text-white py-1 px-3 rounded text-sm hover:bg-green-600"
                          >
                            Démarrer traitement
                          </button>
                        )}{" "}
                        {record.status === "PROCESSED" && (
                          <span className="text-black text-sm">Traité</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Processus de recyclage */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {" "}
            <h2 className="text-xl font-semibold p-4 bg-green-100 text-black">
              Processus de recyclage
            </h2>{" "}
            {processes.length === 0 ? (
              <p className="p-4 text-black">Aucun processus en cours</p>
            ) : (
              <table className="w-full text-sm text-black">
                <thead className="bg-green-50">
                  <tr>
                    <th className="p-4 text-left">Type</th>
                    <th className="p-4 text-left">Déchet</th>
                    <th className="p-4 text-left">Date de début</th>
                    <th className="p-4 text-left">Statut</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {processes.map((process) => {
                    const relatedWaste = wasteRecords.find(
                      (w) => w.id === process.wasteId
                    );
                    return (
                      <tr key={process.id}>
                        <td className="p-4">{process.processType}</td>
                        <td className="p-4">
                          {relatedWaste
                            ? `${relatedWaste.type} (${relatedWaste.quantity} kg)`
                            : "N/A"}
                        </td>
                        <td className="p-4">
                          {process.startDate.toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              process.status === "IN_PROGRESS"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {process.status === "IN_PROGRESS"
                              ? "En cours"
                              : "Terminé"}
                          </span>
                        </td>
                        <td className="p-4">
                          {process.status === "IN_PROGRESS" && (
                            <button
                              onClick={() => completeProcess(process.id)}
                              className="bg-green-500 text-white py-1 px-3 rounded text-sm hover:bg-green-600"
                            >
                              Terminer
                            </button>
                          )}{" "}
                          {process.status === "COMPLETED" && (
                            <span className="text-black text-sm">
                              Terminé le {process.endDate?.toLocaleDateString()}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
