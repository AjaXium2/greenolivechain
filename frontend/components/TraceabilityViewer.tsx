import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";

interface TraceabilityData {
  wasteId: string;
  waste: any;
  extractions: any[];
  recyclings: any[];
  traceabilityChain: any[];
}

interface TraceabilityViewerProps {
  wasteId: string;
  onClose: () => void;
}

const TraceabilityViewer: React.FC<TraceabilityViewerProps> = ({
  wasteId,
  onClose,
}) => {
  const [traceabilityData, setTraceabilityData] =
    useState<TraceabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTraceability = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCompleteTraceability(wasteId);

        if (response.success && response.data) {
          setTraceabilityData(response.data);
          setError(null);
        } else {
          setError(response.error || "Failed to fetch traceability data");
        }
      } catch (err) {
        setError("Network error occurred");
        console.error("Traceability fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (wasteId) {
      fetchTraceability();
    }
  }, [wasteId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-center">Loading traceability data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-md">
          <div className="text-red-500 text-center">
            <h3 className="text-lg font-bold mb-2">
              Error Loading Traceability
            </h3>
            <p className="mb-4">{error}</p>
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            {" "}
            <h2 className="text-2xl font-bold text-black">
              Complete Traceability Chain
            </h2>{" "}
            <button
              onClick={onClose}
              className="text-black hover:text-gray-900 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {traceabilityData && (
            <div className="space-y-6">
              {/* Waste Information */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                    1
                  </span>
                  Waste Origin
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium">Type:</span>{" "}
                    {traceabilityData.waste?.type || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Quantity:</span>{" "}
                    {traceabilityData.waste?.quantity || "N/A"} kg
                  </div>
                  <div>
                    <span className="font-medium">Quality:</span>{" "}
                    {traceabilityData.waste?.qualityGrade || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Source:</span>{" "}
                    {traceabilityData.waste?.location || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    {traceabilityData.waste?.status || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Harvest Date:</span>{" "}
                    {traceabilityData.waste?.harvestDate
                      ? new Date(
                          traceabilityData.waste.harvestDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>

              {/* Extractions */}
              {traceabilityData.extractions &&
                traceabilityData.extractions.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                      <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                        2
                      </span>
                      Processing & Extraction (
                      {traceabilityData.extractions.length})
                    </h3>
                    <div className="space-y-3">
                      {traceabilityData.extractions.map((extraction, index) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded border"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="font-medium">Product:</span>{" "}
                              {extraction.productType}
                            </div>
                            <div>
                              <span className="font-medium">Quantity:</span>{" "}
                              {extraction.quantity} L
                            </div>
                            <div>
                              <span className="font-medium">Quality:</span>{" "}
                              {extraction.quality}
                            </div>
                            <div>
                              <span className="font-medium">Method:</span>{" "}
                              {extraction.extractionMethod}
                            </div>
                            <div>
                              <span className="font-medium">Temperature:</span>{" "}
                              {extraction.temperature}°C
                            </div>
                            <div>
                              <span className="font-medium">Pressure:</span>{" "}
                              {extraction.pressure} bars
                            </div>
                            <div>
                              <span className="font-medium">Yield:</span>{" "}
                              {extraction.yieldPercentage}%
                            </div>
                            <div>
                              <span className="font-medium">Date:</span>{" "}
                              {new Date(
                                extraction.extractionDate
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Recycling */}
              {traceabilityData.recyclings &&
                traceabilityData.recyclings.length > 0 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
                      <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                        3
                      </span>
                      Recycling & Sustainability (
                      {traceabilityData.recyclings.length})
                    </h3>
                    <div className="space-y-3">
                      {traceabilityData.recyclings.map((recycling, index) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded border"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="font-medium">Product:</span>{" "}
                              {recycling.recycledProduct}
                            </div>
                            <div>
                              <span className="font-medium">Quantity:</span>{" "}
                              {recycling.quantity} kg
                            </div>
                            <div>
                              <span className="font-medium">Method:</span>{" "}
                              {recycling.method}
                            </div>
                            <div>
                              <span className="font-medium">Quality:</span>{" "}
                              {recycling.qualityGrade}
                            </div>
                            <div>
                              <span className="font-medium">Impact:</span>{" "}
                              {recycling.environmentalImpact}
                            </div>
                            <div>
                              <span className="font-medium">
                                Processing Time:
                              </span>{" "}
                              {recycling.processingTime}
                            </div>
                            <div>
                              <span className="font-medium">
                                Certifications:
                              </span>{" "}
                              {recycling.certifications}
                            </div>
                            <div>
                              <span className="font-medium">Date:</span>{" "}
                              {new Date(
                                recycling.recyclingDate
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Blockchain Verification */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
                  <span className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                    🔗
                  </span>
                  Blockchain Verification
                </h3>
                <div className="text-sm space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>
                      All records verified on Hyperledger Fabric blockchain
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Immutable traceability from farm to recycling</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Waste ID: {wasteId}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TraceabilityViewer;
