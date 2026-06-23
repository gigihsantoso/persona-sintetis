/**
 * Generation Service
 * Handles database operations for generations table
 */

import type { Env, Generation, GenerationCreateInput, GenerationUpdateInput, GenerationListOptions } from '../types';

export class GenerationService {
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor(private env: Env) {
    this.supabaseUrl = env.SUPABASE_URL;
    this.supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
  }

  private async rpc<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.supabaseUrl}/rest/v1/${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'apikey': this.supabaseKey,
        'Authorization': `Bearer ${this.supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Create a new generation record
   */
  async create(input: GenerationCreateInput): Promise<Generation> {
    const result = await this.rpc<Generation[]>('generations', {
      method: 'POST',
      body: JSON.stringify(input),
    });

    return result[0];
  }

  /**
   * Get generation by ID
   */
  async getById(id: string, userId: string): Promise<Generation | null> {
    const result = await this.rpc<Generation[]>(
      `generations?id=eq.${id}&user_id=eq.${userId}`
    );

    return result.length > 0 ? result[0] : null;
  }

  /**
   * List generations with filtering and pagination
   */
  async list(options: GenerationListOptions): Promise<{ generations: Generation[]; total: number }> {
    const { user_id, character_id, status, limit = 20, offset = 0 } = options;

    // Build query parameters
    let query = `user_id=eq.${user_id}`;
    
    if (character_id) {
      query += `&character_id=eq.${character_id}`;
    }
    
    if (status) {
      query += `&status=eq.${status}`;
    }

    // Get total count
    const countResponse = await fetch(
      `${this.supabaseUrl}/rest/v1/generations?${query}&select=id`,
      {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Prefer': 'count=exact',
        },
      }
    );

    const total = parseInt(countResponse.headers.get('Content-Range')?.split('/')[1] || '0');

    // Get generations
    const generations = await this.rpc<Generation[]>(
      `generations?${query}&select=*&order=created_at.desc&limit=${limit}&offset=${offset}`
    );

    return { generations, total };
  }

  /**
   * List generations by character
   */
  async listByCharacter(
    characterId: string,
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ generations: Generation[]; total: number }> {
    return this.list({
      user_id: userId,
      character_id: characterId,
      limit,
      offset,
    });
  }

  /**
   * Update generation
   */
  async update(id: string, userId: string, input: GenerationUpdateInput): Promise<Generation | null> {
    const existing = await this.getById(id, userId);
    if (!existing) {
      return null;
    }

    const result = await this.rpc<Generation[]>(`generations?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });

    return result.length > 0 ? result[0] : null;
  }

  /**
   * Delete generation
   */
  async delete(id: string, userId: string): Promise<void> {
    await this.rpc(`generations?id=eq.${id}&user_id=eq.${userId}`, {
      method: 'DELETE',
    });
  }
}
