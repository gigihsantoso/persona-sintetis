/**
 * Character Service - Updated for Character Consistency API
 * Connects to Cloudflare Worker backend
 */

import { Injectable, signal, computed } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Character {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  tags: string[];
  image_url: string;
  image_path: string;
  image_size: number | null;
  image_mime: string | null;
  embedding: number[];
  default_strength: number;
  generation_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CharacterCreateDto {
  name: string;
  description?: string;
  tags?: string[];
  image: File;
  default_strength?: number;
}

export interface CharacterUpdateDto {
  name?: string;
  description?: string;
  tags?: string[];
  default_strength?: number;
}

export interface CharacterListResponse {
  characters: Character[];
  total: number;
}

export interface ApiPagination {
  limit: number;
  offset: number;
  total: number;
  has_more: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private readonly apiUrl = environment.apiUrl || 'http://localhost:8787/api/v1';
  
  private charactersSignal = signal<Character[]>([]);
  public characters = this.charactersSignal.asReadonly();
  public characterCount = computed(() => this.charactersSignal().length);

  constructor() {
    // Load initial data
    this.loadCharacters();
  }

  private getUserId(): string {
    // In production, get from auth service
    return localStorage.getItem('user_id') || 'anonymous';
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-User-ID': this.getUserId(),
    };
  }

  /**
   * Load all characters from API
   */
  async loadCharacters(limit: number = 100): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/characters?limit=${limit}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to load characters');
      }

      const data = await response.json();
      if (data.success) {
        this.charactersSignal.set(data.data.characters);
      }
    } catch (error) {
      console.error('Error loading characters:', error);
      throw error;
    }
  }

  /**
   * Get all characters (from cache)
   */
  getAll(): Character[] {
    return this.charactersSignal();
  }

  /**
   * Get character by ID
   */
  async getById(id: string): Promise<Character | null> {
    try {
      const response = await fetch(`${this.apiUrl}/characters/${id}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to get character');
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error getting character:', error);
      throw error;
    }
  }

  /**
   * Create new character with image upload
   */
  async create(dto: CharacterCreateDto): Promise<Character> {
    try {
      const formData = new FormData();
      formData.append('name', dto.name);
      if (dto.description) formData.append('description', dto.description);
      if (dto.tags && dto.tags.length > 0) {
        formData.append('tags', dto.tags.join(','));
      }
      formData.append('image', dto.image);
      if (dto.default_strength) {
        formData.append('default_strength', dto.default_strength.toString());
      }

      const response = await fetch(`${this.apiUrl}/characters`, {
        method: 'POST',
        headers: {
          'X-User-ID': this.getUserId(),
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create character');
      }

      const data = await response.json();
      
      // Update local cache
      this.charactersSignal.update(chars => [data.data, ...chars]);
      
      return data.data;
    } catch (error) {
      console.error('Error creating character:', error);
      throw error;
    }
  }

  /**
   * Update character metadata
   */
  async update(id: string, updates: CharacterUpdateDto): Promise<Character | null> {
    try {
      const response = await fetch(`${this.apiUrl}/characters/${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to update character');
      }

      const data = await response.json();
      
      // Update local cache
      this.charactersSignal.update(chars => 
        chars.map(c => c.id === id ? data.data : c)
      );
      
      return data.data;
    } catch (error) {
      console.error('Error updating character:', error);
      throw error;
    }
  }

  /**
   * Delete character
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/characters/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete character');
      }

      // Update local cache
      this.charactersSignal.update(chars => chars.filter(c => c.id !== id));
      
      return true;
    } catch (error) {
      console.error('Error deleting character:', error);
      throw error;
    }
  }

  /**
   * Search characters by text
   */
  async search(query: string, limit: number = 20): Promise<Character[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}/characters?search=${encodeURIComponent(query)}&limit=${limit}`,
        {
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      return data.success ? data.data.characters : [];
    } catch (error) {
      console.error('Error searching characters:', error);
      return [];
    }
  }

  /**
   * Search similar characters by image
   */
  async searchSimilar(image: File, limit: number = 10, threshold: number = 0.5): Promise<Character[]> {
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('limit', limit.toString());
      formData.append('threshold', threshold.toString());

      const response = await fetch(`${this.apiUrl}/characters/search`, {
        method: 'POST',
        headers: {
          'X-User-ID': this.getUserId(),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Similarity search failed');
      }

      const data = await response.json();
      return data.success ? data.data.characters : [];
    } catch (error) {
      console.error('Error searching similar characters:', error);
      return [];
    }
  }

  /**
   * Get generation history for a character
   */
  async getGenerations(characterId: string, limit: number = 20, offset: number = 0): Promise<{
    generations: any[];
    total: number;
    pagination: ApiPagination;
  }> {
    try {
      const response = await fetch(
        `${this.apiUrl}/characters/${characterId}/generations?limit=${limit}&offset=${offset}`,
        {
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load generations');
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading character generations:', error);
      throw error;
    }
  }

  /**
   * Increment local generation count (optimistic update)
   */
  incrementGenerationCount(characterId: string): void {
    this.charactersSignal.update(chars =>
      chars.map(c => 
        c.id === characterId 
          ? { ...c, generation_count: c.generation_count + 1 }
          : c
      )
    );
  }
}
