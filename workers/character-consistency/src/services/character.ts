/**
 * Character Service
 * Handles database operations for characters table
 */

import type { Env, Character, CharacterCreateInput, CharacterUpdateInput, ListOptions } from '../types';

export class CharacterService {
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
   * Create a new character
   */
  async create(input: CharacterCreateInput): Promise<Character> {
    const result = await this.rpc<Character[]>('characters', {
      method: 'POST',
      body: JSON.stringify(input),
    });

    return result[0];
  }

  /**
   * Get character by ID
   */
  async getById(id: string, userId: string): Promise<Character | null> {
    const result = await this.rpc<Character[]>(
      `characters?id=eq.${id}&user_id=eq.${userId}&deleted_at=is.null`
    );

    return result.length > 0 ? result[0] : null;
  }

  /**
   * List characters with pagination and filtering
   */
  async list(options: ListOptions): Promise<{ characters: Character[]; total: number }> {
    const { user_id, limit = 20, offset = 0, search, sort = 'created_at', order = 'DESC' } = options;

    // Build query parameters
    let query = `user_id=eq.${user_id}&deleted_at=is.null`;
    
    // Search by name or tags
    if (search) {
      query += `&or=(name.ilike.%25${search}%25,tags.cs.{${search}})`;
    }

    // Sorting
    const sortParam = `${sort}.${order.toLowerCase()}`;

    // Get total count
    const countResponse = await fetch(
      `${this.supabaseUrl}/rest/v1/characters?${query}&select=id`,
      {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Prefer': 'count=exact',
        },
      }
    );

    const total = parseInt(countResponse.headers.get('Content-Range')?.split('/')[1] || '0');

    // Get characters
    const characters = await this.rpc<Character[]>(
      `characters?${query}&select=*&order=${sortParam}&limit=${limit}&offset=${offset}`
    );

    return { characters, total };
  }

  /**
   * Update character
   */
  async update(id: string, userId: string, input: CharacterUpdateInput): Promise<Character | null> {
    const existing = await this.getById(id, userId);
    if (!existing) {
      return null;
    }

    const updateData: Record<string, any> = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.tags !== undefined) updateData.tags = input.tags;
    if (input.default_strength !== undefined) updateData.default_strength = input.default_strength;

    const result = await this.rpc<Character[]>(`characters?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });

    return result.length > 0 ? result[0] : null;
  }

  /**
   * Delete character (soft delete)
   */
  async delete(id: string, userId: string): Promise<void> {
    await this.rpc(`characters?id=eq.${id}&user_id=eq.${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ deleted_at: new Date().toISOString() }),
    });
  }

  /**
   * Increment generation count
   */
  async incrementGenerationCount(id: string): Promise<void> {
    await this.rpc(`characters?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        generation_count: this.rpc<any>('characters?id=eq.' + id).then(r => (r[0]?.generation_count || 0) + 1) 
      }),
    });
    
    // Simpler approach using RPC function or direct increment
    await fetch(`${this.supabaseUrl}/rest/v1/rpc/increment_generation_count`, {
      method: 'POST',
      headers: {
        'apikey': this.supabaseKey,
        'Authorization': `Bearer ${this.supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ char_id: id }),
    }).catch(() => {
      // Fallback: direct update
      this.rpc(`characters?id=eq.${id}`, {
        method: 'PATCH',
        body: 'generation_count=characters.generation_count+1',
        headers: {
          'Content-Type': 'text/csv',
        },
      });
    });
  }

  /**
   * Search similar characters using vector similarity
   */
  async searchSimilar(
    userId: string,
    embedding: number[],
    limit: number = 10,
    threshold: number = 0.5
  ): Promise<Character[]> {
    // Convert embedding to string format for RPC
    const embeddingStr = `[${embedding.join(',')}]`;

    const result = await this.rpc<any[]>(`rpc/search_similar_characters`, {
      method: 'POST',
      body: JSON.stringify({
        target_embedding: embeddingStr,
        target_user_id: userId,
        result_limit: limit,
        similarity_threshold: threshold,
      }),
    });

    return result.map(row => ({
      id: row.id,
      user_id: userId,
      name: row.name,
      description: null,
      tags: [],
      image_url: row.image_url,
      image_path: '',
      image_size: null,
      image_mime: null,
      embedding,
      default_strength: 0.8,
      generation_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }));
  }
}
