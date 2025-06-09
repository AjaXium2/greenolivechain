// API service for connecting with the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP Error: ${response.status}`
        );
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Add waste to blockchain
  async addWaste(wasteData: WasteData): Promise<ApiResponse<any>> {
    return this.makeRequest('/api/waste/add', {
      method: 'POST',
      body: JSON.stringify({ wasteData }),
    });
  }

  // Get list of wastes
  async getWastes(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/api/waste/list', {
      method: 'GET',
    });
  }
  // Add extraction data
  async addExtraction(extractionData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/api/extraction/add', {
      method: 'POST',
      body: JSON.stringify({ extractionData }),
    });
  }

  // Get list of extractions
  async getExtractions(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/api/extraction/list', {
      method: 'GET',
    });
  }

  // Add recycling data
  async addRecycling(recyclingData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/api/recycling/add', {
      method: 'POST',
      body: JSON.stringify({ recyclingData }),
    });
  }

  // Get list of recyclings
  async getRecyclings(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/api/recycling/list', {
      method: 'GET',
    });
  }
}

export const apiService = new ApiService();
