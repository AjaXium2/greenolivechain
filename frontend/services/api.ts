// API service for connecting with the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface WasteData {
  type: string;
  quantity: number;
  harvestDate: string;
  status: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error("API Request failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Add waste to blockchain
  async addWaste(wasteData: WasteData): Promise<ApiResponse<any>> {
    return this.makeRequest("/api/waste/add", {
      method: "POST",
      body: JSON.stringify({ wasteData }),
    });
  }

  // Get list of wastes
  async getWastes(): Promise<ApiResponse<any[]>> {
    return this.makeRequest("/api/waste/list", {
      method: "GET",
    });
  }
  // Add extraction data
  async addExtraction(extractionData: any): Promise<ApiResponse<any>> {
    return this.makeRequest("/api/extraction/add", {
      method: "POST",
      body: JSON.stringify({ extractionData }),
    });
  }

  // Get list of extractions
  async getExtractions(): Promise<ApiResponse<any[]>> {
    return this.makeRequest("/api/extraction/list", {
      method: "GET",
    });
  }

  // Add recycling data
  async addRecycling(recyclingData: any): Promise<ApiResponse<any>> {
    return this.makeRequest("/api/recycling/add", {
      method: "POST",
      body: JSON.stringify({ recyclingData }),
    });
  }

  // Get list of recyclings
  async getRecyclings(): Promise<ApiResponse<any[]>> {
    return this.makeRequest("/api/recycling/list", {
      method: "GET",
    });
  }

  // Blockchain-specific methods
  async getBlockchainStatus(): Promise<ApiResponse<any>> {
    return this.makeRequest("/api/blockchain/status", {
      method: "GET",
    });
  }

  // Get waste history from blockchain
  async getWasteHistory(wasteId: string): Promise<ApiResponse<any[]>> {
    return this.makeRequest(`/api/waste/history/${wasteId}`, {
      method: "GET",
    });
  }

  // Get extraction by ID
  async getExtractionById(extractionId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/api/extraction/${extractionId}`, {
      method: "GET",
    });
  }

  // Get extractions by waste ID
  async getExtractionsByWasteId(wasteId: string): Promise<ApiResponse<any[]>> {
    return this.makeRequest(`/api/extraction/by-waste/${wasteId}`, {
      method: "GET",
    });
  }

  // Get recycling by ID
  async getRecyclingById(recyclingId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/api/recycling/${recyclingId}`, {
      method: "GET",
    });
  }

  // Get recyclings by waste ID
  async getRecyclingsByWasteId(wasteId: string): Promise<ApiResponse<any[]>> {
    return this.makeRequest(`/api/recycling/by-waste/${wasteId}`, {
      method: "GET",
    });
  }

  // Get complete traceability chain
  async getCompleteTraceability(wasteId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/api/traceability/${wasteId}`, {
      method: "GET",
    });
  }

  // Update waste status
  async updateWasteStatus(
    wasteId: string,
    newStatus: string
  ): Promise<ApiResponse<any>> {
    return this.makeRequest("/api/waste/update-status", {
      method: "PUT",
      body: JSON.stringify({ wasteId, newStatus }),
    });
  }

  // Update extraction status
  async updateExtractionStatus(
    extractionId: string,
    newStatus: string
  ): Promise<ApiResponse<any>> {
    return this.makeRequest("/api/extraction/update-status", {
      method: "PUT",
      body: JSON.stringify({ extractionId, newStatus }),
    });
  }
}

export const apiService = new ApiService();
