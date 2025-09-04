const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request<{
      token: string;
      user: { id: string; name: string; email: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = response.token;
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async register(name: string, email: string, password: string) {
    const response = await this.request<{
      token: string;
      user: { id: string; name: string; email: string };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    this.token = response.token;
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async getMe() {
    return this.request<{ user: any }>('/auth/me');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  // Vehicle methods
  async getPublicVehicles(params?: {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
    fuel?: string;
    transmission?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const query = searchParams.toString();
    return this.request<{
      vehicles: Vehicle[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/vehicles/public${query ? `?${query}` : ''}`);
  }

  async getVehicles(params?: {
    status?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
    fuel?: string;
    transmission?: string;
    plate?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const query = searchParams.toString();
    return this.request<{
      vehicles: Vehicle[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/vehicles${query ? `?${query}` : ''}`);
  }

  async getVehicleById(id: string) {
    return this.request<{ vehicle: Vehicle }>(`/vehicles/public/${id}`);
  }

  async createVehicle(vehicleData: CreateVehicleData) {
    return this.request<{ message: string; vehicle: Vehicle }>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicle(id: string, vehicleData: Partial<CreateVehicleData>) {
    return this.request<{ message: string; vehicle: Vehicle }>(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  }

  async deleteVehicle(id: string) {
    return this.request<{ message: string }>(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  }

  // Lead methods
  async createLead(leadData: {
    vehicleId: string;
    clientName?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }) {
    return this.request<{
      message: string;
      lead: {
        id: string;
        vehicleId: string;
        vehicleTitle: string;
        createdAt: string;
      };
    }>('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  }

  async getLeads(params?: {
    vehicleId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const query = searchParams.toString();
    return this.request<{
      leads: Lead[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/leads${query ? `?${query}` : ''}`);
  }

  async getLeadStats() {
    return this.request<{
      stats: {
        totalLeads: number;
        leadsLast30Days: number;
        topVehicles: Array<{
          vehicle: { id: string; title: string; slug: string };
          leadCount: number;
        }>;
        leadsBySource: Array<{
          source: string;
          count: number;
        }>;
      };
    }>('/leads/stats');
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

// Types
export interface Vehicle {
  id: string;
  title: string;
  slug: string;
  price: number;
  year: number;
  mileageKm: number;
  transmission: string;
  fuel: string;
  color: string;
  location: string;
  description: string;
  plate?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SOLD';
  createdAt: string;
  updatedAt: string;
  images?: VehicleImage[];
  user?: { id: string; name: string };
  _count?: { leads: number };
}

export interface VehicleImage {
  id: string;
  vehicleId: string;
  url: string;
  position: number;
  createdAt: string;
}

export interface CreateVehicleData {
  title: string;
  price: number;
  year: number;
  mileageKm: number;
  transmission: string;
  fuel: string;
  color: string;
  location: string;
  description: string;
  plate?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SOLD';
}

export interface Lead {
  id: string;
  vehicleId: string;
  clientName?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  ipHashed?: string;
  userAgent?: string;
  createdAt: string;
  vehicle?: {
    id: string;
    title: string;
    slug: string;
    price: number;
    year: number;
    color: string;
  };
}

export default new ApiService();
