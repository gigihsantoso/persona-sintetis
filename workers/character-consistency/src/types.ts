/**
 * Type definitions for Character Consistency API
 */

// Cloudflare AI Binding Interface
interface Ai {
  run(model: string, options: { image?: Blob; text?: string; input?: any }): Promise<any>;
}

// Cloudflare Worker Environment Bindings
export interface Env {
  // Cloudflare AI Binding
  AI: Ai;
  
  // Supabase Configuration
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  
  // Configuration
  ENVIRONMENT: string;
  MAX_FILE_SIZE: string;
  DEFAULT_CONSISTENCY_STRENGTH: string;
  REFERENCE_IMAGES_BUCKET: string;
  GENERATED_IMAGES_BUCKET: string;
}

// ============================================================================
// Database Types
// ============================================================================

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

export interface CharacterCreateInput {
  user_id: string;
  name: string;
  description?: string | null;
  tags?: string[];
  image_url: string;
  image_path: string;
  image_size: number;
  image_mime: string;
  embedding: number[] | Float32Array;
  default_strength?: number;
}

export interface CharacterUpdateInput {
  name?: string;
  description?: string | null;
  tags?: string[];
  default_strength?: number;
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

export interface GenerationCreateInput {
  user_id: string;
  character_id?: string | null;
  prompt: string;
  negative_prompt?: string | null;
  action?: string | null;
  location?: string | null;
  outfit?: string | null;
  consistency_strength?: number;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface GenerationUpdateInput {
  image_url?: string;
  image_path?: string;
  image_size?: number;
  image_mime?: string;
  width?: number;
  height?: number;
  similarity_score?: number | null;
  generation_time_ms?: number;
  model_used?: string;
  ip_adapter_weight?: number;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string | null;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: true;
  data: T;
  pagination?: {
    limit: number;
    offset: number;
    total: number;
    has_more: boolean;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    suggestions?: string[];
  };
}

// ============================================================================
// AI Service Types
// ============================================================================

export interface EmbeddingResult {
  embedding: number[];
  model: string;
  dimensions: number;
}

export interface ImageGenerationInput {
  prompt: string;
  negative_prompt?: string;
  reference_image?: Blob;
  reference_embedding?: number[];
  consistency_strength?: number;
  width?: number;
  height?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  seed?: number;
  // Additional context for enhanced generation
  action?: string;
  location?: string;
  outfit?: string;
}

export interface ImageGenerationResult {
  image: Blob;
  width: number;
  height: number;
  embedding?: number[];
  metadata: {
    model: string;
    steps: number;
    seed: number;
  };
}

// ============================================================================
// Storage Service Types
// ============================================================================

export interface UploadResult {
  publicUrl: string;
  path: string;
  size: number;
}

export interface ListOptions {
  user_id: string;
  limit?: number;
  offset?: number;
  search?: string;
  sort?: 'created_at' | 'name' | 'generation_count';
  order?: 'ASC' | 'DESC';
}

export interface GenerationListOptions extends ListOptions {
  character_id?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}
