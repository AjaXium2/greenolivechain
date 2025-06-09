import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";
import BlockchainStatusIndicator from "../components/BlockchainStatusIndicator";
import TraceabilityViewer from "../components/TraceabilityViewer";

interface DashboardStats {
  totalWastes: number;
  totalExtractions: number;
  totalRecyclings: number;
  blockchainTransactions: number;
}

interface RecentActivity {
  id: string;
  type: "waste" | "extraction" | "recycling";
  description: string;
  timestamp: string;
  blockchainTxId?: string;
}

const BlockchainDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalWastes: 0,
    totalExtractions: 0,
    totalRecyclings: 0,
    blockchainTransactions: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [selectedWasteForTraceability, setSelectedWasteForTraceability] =
    useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load wastes, extractions, and recyclings
      const [wastesResponse, extractionsResponse, recyclingsResponse] =
        await Promise.all([
          apiService.getWastes(),
          apiService.getExtractions(),
          apiService.getRecyclings(),
        ]);

      // Calculate stats
      const totalWastes = wastesResponse.data?.length || 0;
      const totalExtractions = extractionsResponse.data?.length || 0;
      const totalRecyclings = recyclingsResponse.data?.length || 0;
      const blockchainTransactions =
        totalWastes + totalExtractions + totalRecyclings;

      setStats({
        totalWastes,
        totalExtractions,
        totalRecyclings,
        blockchainTransactions,
      });

      // Create recent activity from all data
      const activities: RecentActivity[] = [];

      if (wastesResponse.data) {
        wastesResponse.data.slice(0, 5).forEach((waste: any) => {
          activities.push({
            id: waste.id,
            type: "waste",
            description: `New waste: ${waste.type} (${waste.quantity}kg)`,
            timestamp: waste.timestamp || waste.harvestDate,
            blockchainTxId: waste.blockchainTxId,
          });
        });
      }

      if (extractionsResponse.data) {
        extractionsResponse.data.slice(0, 3).forEach((extraction: any) => {
          activities.push({
            id: extraction.id,
            type: "extraction",
            description: `Extraction: ${extraction.productType} (${extraction.quantity}L)`,
            timestamp: extraction.timestamp || extraction.extractionDate,
            blockchainTxId: extraction.blockchainTxId,
          });
        });
      }

      if (recyclingsResponse.data) {
        recyclingsResponse.data.slice(0, 3).forEach((recycling: any) => {
          activities.push({
            id: recycling.id,
            type: "recycling",
            description: `Recycling: ${recycling.recycledProduct} (${recycling.quantity}kg)`,
            timestamp: recycling.timestamp || recycling.recyclingDate,
            blockchainTxId: recycling.blockchainTxId,
          });
        });
      }

      // Sort by timestamp (most recent first)
      activities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setRecentActivity(activities.slice(0, 10));

      setError(null);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "waste":
        return "🌱";
      case "extraction":
        return "🏭";
      case "recycling":
        return "♻️";
      default:
        return "📊";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "waste":
        return "bg-green-100 text-green-800";
      case "extraction":
        return "bg-blue-100 text-blue-800";
      case "recycling":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-black";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading blockchain dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            🔗 Blockchain Monitoring Dashboard
          </h1>{" "}
          <p className="text-black">
            Real-time monitoring of Green Olive Chain blockchain operations
          </p>
        </div>

        {/* Blockchain Status */}
        <div className="mb-8">
          <BlockchainStatusIndicator />
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
            <button
              onClick={loadDashboardData}
              className="ml-4 text-sm underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                🌱
              </div>
              <div className="ml-4">
                {" "}
                <p className="text-sm font-medium text-black">
                  Total Wastes
                </p>{" "}
                <p className="text-2xl font-bold text-black">
                  {stats.totalWastes}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                🏭
              </div>
              <div className="ml-4">
                {" "}
                <p className="text-sm font-medium text-black">
                  Total Extractions
                </p>{" "}
                <p className="text-2xl font-bold text-black">
                  {stats.totalExtractions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                ♻️
              </div>
              <div className="ml-4">
                {" "}
                <p className="text-sm font-medium text-black">
                  Total Recyclings
                </p>{" "}
                <p className="text-2xl font-bold text-black">
                  {stats.totalRecyclings}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            {" "}
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-100 text-black">🔗</div>
              <div className="ml-4">
                {" "}
                <p className="text-sm font-medium text-black">
                  Blockchain Txs
                </p>{" "}
                <p className="text-2xl font-bold text-black">
                  {stats.blockchainTransactions}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              {" "}
              <h2 className="text-lg font-semibold text-black">
                Recent Activity
              </h2>
            </div>
            <div className="p-6">
              {recentActivity.length === 0 ? (
                <p className="text-black text-center py-8">
                  No recent activity
                </p>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <span className="text-lg">
                          {getActivityIcon(activity.type)}
                        </span>
                      </div>{" "}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-black">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(
                              activity.type
                            )}`}
                          >
                            {activity.type}
                          </span>{" "}
                          <span className="text-xs text-black">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                          {activity.blockchainTxId && (
                            <span
                              className="text-xs text-green-600"
                              title="Blockchain Transaction"
                            >
                              🔗 {activity.blockchainTxId.slice(0, 8)}...
                            </span>
                          )}
                        </div>
                      </div>
                      {activity.type === "waste" && (
                        <button
                          onClick={() =>
                            setSelectedWasteForTraceability(activity.id)
                          }
                          className="text-xs text-purple-600 hover:text-purple-800"
                          title="View full traceability"
                        >
                          View Chain
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border">
            {" "}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-black">
                Quick Actions
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <button
                onClick={loadDashboardData}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <span className="mr-2">🔄</span>
                Refresh Data
              </button>

              <a
                href="/farmer/wasteDash"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center text-decoration-none"
              >
                <span className="mr-2">🌱</span>
                Manage Wastes
              </a>

              <a
                href="/processor/extractionDash"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center text-decoration-none"
              >
                <span className="mr-2">🏭</span>
                Manage Extractions
              </a>

              <a
                href="/recycler/recyclingDash"
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center text-decoration-none"
              >
                <span className="mr-2">♻️</span>
                Manage Recycling
              </a>
            </div>
          </div>
        </div>

        {/* Traceability Viewer */}
        {selectedWasteForTraceability && (
          <TraceabilityViewer
            wasteId={selectedWasteForTraceability}
            onClose={() => setSelectedWasteForTraceability(null)}
          />
        )}
      </div>
    </div>
  );
};

export default BlockchainDashboard;
