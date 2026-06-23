/**
 * Generation Service - Updated for Character Consistency API
 * Connects to Cloudflare Worker backend
 */

import { Injectable, signal } from '@angular/core';
import { Character } from './character';
import { environment } from '../../environments/environment';

export interface GenerationRequest {
  character_id?: string;
  prompt: string;
  negative_prompt?: string;
  action?: string;
  location?: string;
  outfit?: string;
  consistency_strength?: number;
  width?: number;
  height?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
}

export interface Generation {
  id: string;
  user_id: string;
  character_id: string | null;
  prompt: string;
  negative_prompt: string | null;
  action: string | null;
  location: string | null;
  outfit: string | null;
  consistency_strength: number;
  image_url: string;
  image_path: string;
  image_size: number | null;
  image_mime: string | null;
  width: number;
  height: number;
  similarity_score: number | null;
  generation_time_ms: number | null;
  model_used: string;
  ip_adapter_weight: number;
  controlnet_enabled: boolean;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message: string | null;
  created_at: string;
}

export interface GenerationResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  character?: Character;
  error?: string;
  progress: number;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class GenerationService {
  private readonly apiUrl = environment.apiUrl || 'http://localhost:8787/api/v1';
  
  private generationsSignal = signal<Generation[]>([]);
  public generations = this.generationsSignal.asReadonly();

  constructor() {
    // Load recent generations
    this.loadGenerations();
  }

  private getUserId(): string {
    return localStorage.getItem('user_id') || 'anonymous';
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-User-ID': this.getUserId(),
    };
  }

  /**
   * Load generations from API
   */
  async loadGenerations(limit: number = 50): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/generations?limit=${limit}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to load generations');
      }

      const data = await response.json();
      if (data.success) {
        this.generationsSignal.set(data.data.generations);
      }
    } catch (error) {
      console.error('Error loading generations:', error);
    }
  }

  /**
   * Generate image with character consistency
   */
  async generate(request: GenerationRequest): Promise<Generation> {
    try {
      const response = await fetch(`${this.apiUrl}/generate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Generation failed');
      }

      const data = await response.json();
      const generation = data.data;

      // Add to local cache
      this.generationsSignal.update(gens => [generation, ...gens]);

      return generation;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  /**
   * Get generation by ID
   */
  async getById(id: string): Promise<Generation | null> {
    try {
      const response = await fetch(`${this.apiUrl}/generations/${id}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to get generation');
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error getting generation:', error);
      throw error;
    }
  }

  /**
   * List generations with filtering
   */
  async list(options?: {
    character_id?: string;
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    limit?: number;
    offset?: number;
  }): Promise<{ generations: Generation[]; total: number; pagination: any }> {
    try {
      const params = new URLSearchParams();
      if (options?.character_id) params.append('character_id', options.character_id);
      if (options?.status) params.append('status', options.status);
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());

      const response = await fetch(`${this.apiUrl}/generations?${params}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to list generations');
      }

      return await response.json();
    } catch (error) {
      console.error('Error listing generations:', error);
      throw error;
    }
  }

  /**
   * Delete generation
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/generations/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete generation');
      }

      // Update local cache
      this.generationsSignal.update(gens => gens.filter(g => g.id !== id));

      return true;
    } catch (error) {
      console.error('Error deleting generation:', error);
      throw error;
    }
  }

  /**
   * Get generations by character
   */
  async getByCharacter(characterId: string, limit: number = 20): Promise<Generation[]> {
    try {
      const result = await this.list({ character_id: characterId, limit });
      return result.generations;
    } catch (error) {
      console.error('Error getting generations by character:', error);
      return [];
    }
  }

  /**
   * Get completed generations only
   */
  getCompleted(): Generation[] {
    return this.generationsSignal().filter(g => g.status === 'completed');
  }

  /**
   * Get processing generations
   */
  getProcessing(): Generation[] {
    return this.generationsSignal().filter(g => 
      g.status === 'pending' || g.status === 'processing'
    );
  }

  /**
   * Clear completed generations from cache
   */
  clearCompleted(): void {
    this.generationsSignal.update(gens => 
      gens.filter(g => g.status === 'pending' || g.status === 'processing')
    );
  }
}
