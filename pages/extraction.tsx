"use client";

import { useState } from "react";
import Link from "next/link";
import { ExtractionWaste, WasteType } from "../types/waste";
import ExtractionForm from "../components/ExtractionForm";

export default function ExtractionPage() {
  const [wastes, setWastes] = useState<ExtractionWaste[]>([
    {
      id: "extr-waste-1",
      type: WasteType.OLIVE_PASTE,
      quantity: 120,
      sourceOlives: "batch-456",
      productionDate: new Date(),
      status: "READY",
    },
    {
      id: "extr-waste-2",
      type: WasteType.RESIDUAL_WATER,
      quantity: 200,
      sourceOlives: "batch-456",
      productionDate: new Date(),
      status: "READY",
    },
    {
      id: "extr-waste-3",
      type: WasteType.PITS,
      quantity: 80,
      sourceOlives: "batch-455",
      productionDate: new Date(Date.now() - 172800000), // Il y a 2 jours
      transferDate: new Date(Date.now() - 86400000), // Hier
      status: "TRANSFERRED",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const handleAddWaste = (newWaste: Omit<ExtractionWaste, "id">) => {
    const waste: ExtractionWaste = {
      ...newWaste,
      id: `extr-waste-${Date.now()}`,
    };
    setWastes([...wastes, waste]);
    setShowForm(false);
  };

  const handleTransferWaste = (id: string) => {
    setWastes(
      wastes.map((waste) =>
        waste.id === id
          ? { ...waste, status: "TRANSFERRED", transferDate: new Date() }
          : waste
      )
    );
  };

  return (
    <main className="min-h-screen bg-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/"
              className="text-yellow-700 hover:underline mb-4 inline-block"
            >
              &larr; Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-yellow-800">
              Extraction d'Huile - Gestion des Déchets
            </h1>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors"
          >
            {showForm ? "Annuler" : "Ajouter des déchets"}
          </button>
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
          <h2 className="text-xl font-semibold p-4 bg-yellow-100 text-gray-500 text-gray-700">
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
}
