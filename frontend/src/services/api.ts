import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  Source, 
  WritingSample, 
  Trend, 
  Newsletter, 
  Feedback, 
  AuthResponse,
  ApiResponse,
  NewsletterStats
} from '../types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async signUp(email: string, password: string, name: string, timezone: string = 'UTC'): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/signup', {
      email,
      password,
      name,
      timezone,
    });
    return response.data;
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/signin', {
      email,
      password,
    });
    return response.data;
  }

  async signOut(): Promise<void> {
    await this.client.post('/auth/signout');
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<{ user: User }>('/auth/me');
    return response.data.user;
  }

  async updateProfile(data: { name: string; timezone: string }): Promise<User> {
    const response = await this.client.put<{ user: User }>('/auth/profile', data);
    return response.data.user;
  }

  // Sources endpoints
  async getSources(): Promise<Source[]> {
    const response = await this.client.get<{ sources: Source[] }>('/sources');
    return response.data.sources;
  }

  async createSource(source: Omit<Source, 'id' | 'user_id' | 'created_at'>): Promise<Source> {
    const response = await this.client.post<{ source: Source }>('/sources', source);
    return response.data.source;
  }

  async updateSource(id: string, source: Partial<Source>): Promise<Source> {
    const response = await this.client.put<{ source: Source }>(`/sources/${id}`, source);
    return response.data.source;
  }

  async deleteSource(id: string): Promise<void> {
    await this.client.delete(`/sources/${id}`);
  }

  // Newsletters endpoints
  async getNewsletters(): Promise<Newsletter[]> {
    const response = await this.client.get<{ newsletters: Newsletter[] }>('/newsletters');
    return response.data.newsletters;
  }

  async getNewsletter(id: string): Promise<Newsletter> {
    const response = await this.client.get<{ newsletter: Newsletter }>(`/newsletters/${id}`);
    return response.data.newsletter;
  }

  async generateNewsletter(): Promise<Newsletter> {
    const response = await this.client.post<{ newsletter: Newsletter }>('/newsletters/generate');
    return response.data.newsletter;
  }

  async updateNewsletter(id: string, content: string): Promise<Newsletter> {
    const response = await this.client.put<{ newsletter: Newsletter }>(`/newsletters/${id}`, { content });
    return response.data.newsletter;
  }

  async deleteNewsletter(id: string): Promise<void> {
    await this.client.delete(`/newsletters/${id}`);
  }

  async getNewsletterStats(): Promise<NewsletterStats> {
    const response = await this.client.get<NewsletterStats>('/newsletters/stats');
    return response.data;
  }

  // Trends endpoints
  async getTrends(): Promise<Trend[]> {
    const response = await this.client.get<{ trends: Trend[] }>('/trends');
    return response.data.trends;
  }

  async getLatestTrends(): Promise<Trend[]> {
    const response = await this.client.get<{ trends: Trend[] }>('/trends/latest');
    return response.data.trends;
  }

  async fetchTrends(): Promise<Trend[]> {
    const response = await this.client.post<{ trends: Trend[] }>('/trends/fetch');
    return response.data.trends;
  }

  // Feedback endpoints
  async getFeedback(newsletterId: string): Promise<Feedback[]> {
    const response = await this.client.get<{ feedback: Feedback[] }>(`/feedback/newsletter/${newsletterId}`);
    return response.data.feedback;
  }

  async submitFeedback(feedback: Omit<Feedback, 'id' | 'user_id' | 'created_at'>): Promise<Feedback> {
    const response = await this.client.post<{ feedback: Feedback }>('/feedback', feedback);
    return response.data.feedback;
  }

  async updateFeedback(id: string, rating: 'positive' | 'negative', comment?: string): Promise<Feedback> {
    const response = await this.client.put<{ feedback: Feedback }>(`/feedback/${id}`, { rating, comment });
    return response.data.feedback;
  }

  async deleteFeedback(id: string): Promise<void> {
    await this.client.delete(`/feedback/${id}`);
  }

  // Writing samples (we'll add these endpoints to the backend)
  async getWritingSamples(): Promise<WritingSample[]> {
    const response = await this.client.get<{ writing_samples: WritingSample[] }>('/writing-samples');
    return response.data.writing_samples;
  }

  async createWritingSample(content: string): Promise<WritingSample> {
    const response = await this.client.post<{ writing_sample: WritingSample }>('/writing-samples', { content });
    return response.data.writing_sample;
  }

  async deleteWritingSample(id: string): Promise<void> {
    await this.client.delete(`/writing-samples/${id}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.client.get<{ status: string; timestamp: string }>('/health');
    return response.data;
  }
}

export const apiClient = new ApiClient();
