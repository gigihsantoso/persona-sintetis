/**
 * Storage Service
 * Handles Supabase Storage operations for images
 */

import type { Env, UploadResult } from '../types';

export class StorageService {
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor(private env: Env) {
    this.supabaseUrl = env.SUPABASE_URL;
    this.supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
  }

  /**
   * Upload image to Supabase Storage
   */
  async uploadImage(
    bucket: string,
    path: string,
    file: File | Blob,
    contentType: string
  ): Promise<UploadResult> {
    const url = `${this.supabaseUrl}/storage/v1/object/${bucket}/${path}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.supabaseKey}`,
        'Content-Type': contentType,
      },
      body: file,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${error}`);
    }

    const publicUrl = `${this.supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
    
    return {
      publicUrl,
      path,
      size: file.size,
    };
  }

  /**
   * Download image from Supabase Storage
   */
  async downloadImage(bucket: string, path: string): Promise<Blob> {
    const url = `${this.supabaseUrl}/storage/v1/object/${bucket}/${path}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    return response.blob();
  }

  /**
   * Delete image from Supabase Storage
   */
  async deleteImage(bucket: string, path: string): Promise<void> {
    const url = `${this.supabaseUrl}/storage/v1/object/${bucket}/${path}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.status}`);
    }
  }

  /**
   * Get public URL for an object
   */
  getPublicUrl(bucket: string, path: string): string {
    return `${this.supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  }

  /**
   * Create signed URL with expiration
   */
  async createSignedUrl(
    bucket: string,
    path: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const url = `${this.supabaseUrl}/storage/v1/object/sign/${bucket}/${path}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expiresIn }),
    });

    if (!response.ok) {
      throw new Error(`Signed URL creation failed: ${response.status}`);
    }

    const data = await response.json();
    return `${this.supabaseUrl}${data.signedURL}`;
  }
}
