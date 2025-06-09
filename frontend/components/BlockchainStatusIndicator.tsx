import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";

interface BlockchainStatus {
  initialized: boolean;
  timestamp: string;
  connected: boolean;
  network: {
    organization: string;
    channel: string;
    chaincode: string;
    status: string;
  };
}

const BlockchainStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<BlockchainStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBlockchainStatus();

      if (response.success && response.data) {
        setStatus(response.data);
        setError(null);
      } else {
        setError(response.error || "Failed to fetch blockchain status");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Blockchain status fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (loading) return "bg-gray-500";
    if (error || !status?.initialized || !status?.connected)
      return "bg-red-500";
    return "bg-green-500";
  };

  const getStatusText = () => {
    if (loading) return "Checking...";
    if (error) return "Disconnected";
    if (!status?.initialized) return "Not Initialized";
    if (!status?.connected) return "Connection Lost";
    return "Connected";
  };

  return (
    <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border">
      <div className="flex items-center space-x-2">
        <div
          className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}
        ></div>{" "}
        <span className="text-sm font-medium text-black">
          Blockchain: {getStatusText()}
        </span>
      </div>

      {status && !loading && !error && (
        <div className="flex items-center space-x-4 text-xs text-black">
          <span>Org: {status.network.organization}</span>
          <span>Channel: {status.network.channel}</span>
          <span>Mode: {status.network.status}</span>
        </div>
      )}

      <button
        onClick={fetchStatus}
        className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
        disabled={loading}
      >
        {loading ? "⟳" : "↻"}
      </button>
    </div>
  );
};

export default BlockchainStatusIndicator;
