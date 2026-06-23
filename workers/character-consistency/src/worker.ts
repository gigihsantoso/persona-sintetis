/**
 * Character Consistency API
 * Cloudflare Worker untuk mengelola karakter dan generate gambar dengan konsistensi
 * 
 * Endpoints:
 * - POST /api/v1/characters - Upload character + extract embedding
 * - GET /api/v1/characters - List characters
 * - GET /api/v1/characters/:id - Get character details
 * - PATCH /api/v1/characters/:id - Update character
 * - DELETE /api/v1/characters/:id - Delete character
 * - POST /api/v1/characters/search - Similarity search
 * - POST /api/v1/generate - Generate image with character consistency
 * - GET /api/v1/generations - List generations
 * - GET /api/v1/generations/:id - Get generation details
 * - DELETE /api/v1/generations/:id - Delete generation
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { bearerAuth } from 'hono/bearer-auth';
import { CharacterService } from './services/character';
import { GenerationService } from './services/generation';
import { StorageService } from './services/storage';
import { AIService } from './services/ai';
import type { Env, Character, Generation, ApiResponse, ApiError } from './types';

const app = new Hono<{ Bindings: Env }>();

// ============================================================================
// Middleware
// ============================================================================

// CORS untuk semua route
app.use('/*', cors({
  origin: ['http://localhost:4300', 'https://personasintetis.com'],
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-User-ID'],
  exposeHeaders: ['X-Total-Count', 'X-Page-Count'],
  credentials: true,
  maxAge: 86400,
}));

// Logging middleware
app.use('/*', async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  console.log(`[${c.req.method}] ${c.req.path} - ${c.res.status} (${duration}ms)`);
});

// Auth middleware (optional for now, will be enabled in production)
// app.use('/api/v1/*', bearerAuth({ verifyToken: verifySupabaseToken }));

// ============================================================================
// Health Check
// ============================================================================

app.get('/health', (c) => {
  return c.json<ApiResponse<{ status: string; timestamp: string }>>({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  });
});

// ============================================================================
// Character Routes
// ============================================================================

/**
 * POST /api/v1/characters
 * Upload character reference image + extract embedding via CLIP
 */
app.post('/api/v1/characters', async (c) => {
  try {
    const formData = await c.req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    const tagsRaw = formData.get('tags') as string | null;
    const image = formData.get('image') as File | null;
    const defaultStrength = parseFloat(formData.get('default_strength') as string) || 0.8;

    // Validation
    if (!name || name.trim().length === 0) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Character name is required',
        },
      }, { status: 400 });
    }

    if (!image) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Character image is required',
        },
      }, { status: 400 });
    }

    // Validate image type
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimeTypes.includes(image.type)) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'INVALID_IMAGE',
          message: 'Image format not supported. Supported: JPEG, PNG, WebP',
          details: { received: image.type },
        },
      }, { status: 400 });
    }

    // Validate file size (10MB)
    const maxSize = parseInt(c.env.MAX_FILE_SIZE || '10485760');
    if (image.size > maxSize) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: `File size exceeds ${maxSize / 1048576}MB limit`,
          details: { received: image.size, max: maxSize },
        },
      }, { status: 413 });
    }

    // Get user ID from header (in production, extract from JWT)
    const userId = c.req.header('X-User-ID');
    if (!userId) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'X-User-ID header is required',
        },
      }, { status: 401 });
    }

    // Initialize services
    const storageService = new StorageService(c.env);
    const aiService = new AIService(c.env.AI);
    const characterService = new CharacterService(c.env);

    // Upload image to Supabase Storage
    const imageFileName = `${crypto.randomUUID()}.${image.type.split('/')[1]}`;
    const imagePath = `${userId}/${imageFileName}`;
    
    const uploadResult = await storageService.uploadImage(
      c.env.REFERENCE_IMAGES_BUCKET,
      imagePath,
      image,
      image.type
    );

    // Extract CLIP embedding
    const embedding = await aiService.extractEmbedding(image);

    // Parse tags
    let tags: string[] = [];
    if (tagsRaw) {
      tags = typeof tagsRaw === 'string' 
        ? tagsRaw.split(',').map(t => t.trim()).filter(t => t.length > 0)
        : [];
    }

    // Create character record
    const character = await characterService.create({
      user_id: userId,
      name: name.trim(),
      description: description?.trim() || null,
      tags,
      image_url: uploadResult.publicUrl,
      image_path: imagePath,
      image_size: image.size,
      image_mime: image.type,
      embedding,
      default_strength: Math.max(0.5, Math.min(1.0, defaultStrength)),
    });

    return c.json<ApiResponse<Character>>({
      success: true,
      data: character,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating character:', error);
    return c.json<ApiError>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to create character',
      },
    }, { status: 500 });
  }
});

/**
 * GET /api/v1/characters
 * List user's characters with pagination, search, and filtering
 */
app.get('/api/v1/characters', async (c) => {
  try {
    const userId = c.req.header('X-User-ID');
    if (!userId) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'X-User-ID header is required',
        },
      }, { status: 401 });
    }

    // Query parameters
    const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100);
    const offset = parseInt(c.req.query('offset') || '0');
    const search = c.req.query('search');
    const sort = c.req.query('sort') || 'created_at';
    const order = (c.req.query('order') || 'desc').toUpperCase();

    const characterService = new CharacterService(c.env);
    const result = await characterService.list({
      user_id: userId,
      limit,
      offset,
      search,
      sort: sort as 'created_at' | 'name' | 'generation_count',
      order: order as 'ASC' | 'DESC',
    });

    return c.json<ApiResponse<{ characters: Character[]; total: number }>>({
      success: true,
      data: {
        characters: result.characters,
        total: result.total,
      },
      pagination: {
        limit,
        offset,
        total: result.total,
        has_more: offset + limit < result.total,
      },
    });

  } catch (error) {
    console.error('Error listing characters:', error);
    return c.json<ApiError>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to list characters',
      },
    }, { status: 500 });
  }
});

/**
 * GET /api/v1/characters/:id
 * Get character details with stats
 */
app.get('/api/v1/characters/:id', async (c) => {
  try {
    const userId = c.req.header('X-User-ID');
    if (!userId) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'X-User-ID header is required',
        },
      }, { status: 401 });
    }

    const characterId = c.req.param('id');
    const characterService = new CharacterService(c.env);
    
    const character = await characterService.getById(characterId, userId);
    
    if (!character) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Character not found',
        },
      }, { status: 404 });
    }

    return c.json<ApiResponse<Character>>({
      success: true,
      data: character,
    });

  } catch (error) {
    console.error('Error getting character:', error);
    return c.json<ApiError>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to get character',
      },
    }, { status: 500 });
  }
});

/**
 * PATCH /api/v1/characters/:id
 * Update character metadata (name, tags, description)
 */
app.patch('/api/v1/characters/:id', async (c) => {
  try {
    const userId = c.req.header('X-User-ID');
    if (!userId) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'X-User-ID header is required',
        },
      }, { status: 401 });
    }

    const characterId = c.req.param('id');
    const body = await c.req.json();

    const characterService = new CharacterService(c.env);
    const character = await characterService.update(characterId, userId, {
      name: body.name,
      description: body.description,
      tags: body.tags,
      default_strength: body.default_strength,
    });

    if (!character) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Character not found',
        },
      }, { status: 404 });
    }

    return c.json<ApiResponse<Character>>({
      success: true,
      data: character,
    });

  } catch (error) {
    console.error('Error updating character:', error);
    return c.json<ApiError>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to update character',
      },
    }, { status: 500 });
  }
});

/**
 * DELETE /api/v1/characters/:id
 * Delete character (soft delete)
 */
app.delete('/api/v1/characters/:id', async (c) => {
  try {
    const userId = c.req.header('X-User-ID');
    if (!userId) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'X-User-ID header is required',
        },
      }, { status: 401 });
    }

    const characterId = c.req.param('id');
    const characterService = new CharacterService(c.env);
    const storageService = new StorageService(c.env);

    // Get character to delete image
    const character = await characterService.getById(characterId, userId);
    if (!character) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Character not found',
        },
      }, { status: 404 });
    }

    // Delete from storage
    await storageService.deleteImage(c.env.REFERENCE_IMAGES_BUCKET, character.image_path);

    // Soft delete from database
    await characterService.delete(characterId, userId);

    return c.json<ApiResponse<{ message: string }>>({
      success: true,
      data: { message: 'Character deleted successfully' },
    });

  } catch (error) {
    console.error('Error deleting character:', error);
    return c.json<ApiError>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to delete character',
      },
    }, { status: 500 });
  }
});

/**
 * POST /api/v1/characters/search
 * Search characters by similarity using vector search
 */
app.post('/api/v1/characters/search', async (c) => {
  try {
    const userId = c.req.header('X-User-ID');
    if (!userId) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'X-User-ID header is required',
        },
      }, { status: 401 });
    }

    const body = await c.req.json();
    const { image, limit = 10, threshold = 0.5 } = body;

    if (!image) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Image is required for similarity search',
        },
      }, { status: 400 });
    }

    const aiService = new AIService(c.env.AI);
    const characterService = new CharacterService(c.env);

    // Extract embedding from query image
    const queryEmbedding = await aiService.extractEmbedding(image);

    // Search similar characters
    const characters = await characterService.searchSimilar(
      userId,
      queryEmbedding,
      limit,
      threshold
    );

    return c.json<ApiResponse<{ characters: Character[]; query_embedding: number[] }>>({
      success: true,
      data: {
        characters,
        query_embedding: queryEmbedding,
      },
    });

  } catch (error) {
    console.error('Error searching characters:', error);
    return c.json<ApiError>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to search characters',
      },
    }, { status: 500 });
  }
});

/**
 * GET /api/v1/characters/:id/generations
 * Get generation history for a character
 */
app.get('/api/v1/characters/:id/generations', async (c) => {
  try {
    const userId = c.req.header('X-User-ID');
    if (!userId) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'X-User-ID header is required',
        },
      }, { status: 401 });
    }

    const characterId = c.req.param('id');
    const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100);
    const offset = parseInt(c.req.query('offset') || '0');

    const generationService = new GenerationService(c.env);
    const result = await generationService.listByCharacter(characterId, userId, limit, offset);

    return c.json<ApiResponse<{ generations: Generation[]; total: number }>>({
      success: true,
      data: result,
      pagination: {
        limit,
        offset,
        total: result.total,
        has_more: offset + limit < result.total,
      },
    });

  } catch (error) {
    console.error('Error getting character generations:', error);
    return c.json<ApiError>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to get generations',
      },
    }, { status: 500 });
  }
});

// ============================================================================
// Generation Routes
// ============================================================================

/**
 * POST /api/v1/generate
 * Generate image with character consistency using IP-Adapter + SDXL
 */
app.post('/api/v1/generate', async (c) => {
  try {
    const userId = c.req.header('X-User-ID');
    if (!userId) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'X-User-ID header is required',
        },
      }, { status: 401 });
    }

    const body = await c.req.json();
    const {
      character_id,
      prompt,
      negative_prompt,
      action,
      location,
      outfit,
      consistency_strength = 0.8,
      width = 1024,
      height = 1024,
      num_inference_steps = 25,
      guidance_scale = 7.5,
    } = body;

    // Validation
    if (!prompt || prompt.trim().length === 0) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Prompt is required',
        },
      }, { status: 400 });
    }

    const characterService = new CharacterService(c.env);
    const generationService = new GenerationService(c.env);
    const storageService = new StorageService(c.env);
    const aiService = new AIService(c.env.AI);

    // Get character if provided
    let character: Character | null = null;
    let referenceImageBlob: Blob | null = null;
    
    if (character_id) {
      character = await characterService.getById(character_id, userId);
      if (!character) {
        return c.json<ApiError>({
          success: false,
          error: {
            code: 'CHARACTER_NOT_FOUND',
            message: 'Character not found',
          },
        }, { status: 404 });
      }

      // Download reference image for IP-Adapter
      referenceImageBlob = await storageService.downloadImage(
        c.env.REFERENCE_IMAGES_BUCKET,
        character.image_path
      );
    }

    // Create generation record (pending status)
    const generation = await generationService.create({
      user_id: userId,
      character_id: character_id || null,
      prompt: prompt.trim(),
      negative_prompt: negative_prompt?.trim() || null,
      action: action?.trim() || null,
      location: location?.trim() || null,
      outfit: outfit?.trim() || null,
      consistency_strength: Math.max(0.5, Math.min(1.0, consistency_strength)),
      status: 'processing',
    });

    // Generate image with Cloudflare AI
    const startTime = Date.now();
    
    const generateResult = await aiService.generateImage({
      prompt: prompt.trim(),
      negative_prompt: negative_prompt?.trim(),
      reference_image: referenceImageBlob,
      reference_embedding: character?.embedding,
      consistency_strength,
      width,
      height,
      num_inference_steps,
      guidance_scale,
    });

    const generationTime = Date.now() - startTime;

    // Upload generated image to storage
    const imageFileName = `${generation.id}.png`;
    const imagePath = `${userId}/${imageFileName}`;
    
    const uploadResult = await storageService.uploadImage(
      c.env.GENERATED_IMAGES_BUCKET,
      imagePath,
      generateResult.image,
      'image/png'
    );

    // Calculate similarity score if character was used
    let similarityScore: number | null = null;
    if (character && generateResult.embedding) {
      similarityScore = aiService.calculateCosineSimilarity(
        character.embedding,
        generateResult.embedding
      );
    }

    // Update generation record
    const updatedGeneration = await generationService.update(generation.id, userId, {
      image_url: uploadResult.publicUrl,
      image_path: imagePath,
      image_size: generateResult.image.size,
      image_mime: 'image/png',
      width: generateResult.width,
      height: generateResult.height,
      similarity_score: similarityScore,
      generation_time_ms: generationTime,
      model_used: 'sdxl-turbo',
      ip_adapter_weight: consistency_strength,
      status: 'completed',
    });

    // Update character generation count
    if (character) {
      await characterService.incrementGenerationCount(character_id);
    }

    return c.json<ApiResponse<Generation>>({
      success: true,
      data: updatedGeneration,
    }, { status: 201 });

  } catch (error) {
    console.error('Error generating image:', error);
    
    // Update generation status to failed if we have a generation ID
    // This would be better handled with a transaction
    
    return c.json<ApiError>({
      success: false,
      error: {
        code: 'GENERATION_FAILED',
        message: error instanceof Error ? error.message : 'Failed to generate image',
        details: error instanceof Error ? { stack: error.stack } : undefined,
      },
    }, { status: 500 });
  }
});

/**
 * GET /api/v1/generations
 * List user's generations with filtering
 */
app.get('/api/v1/generations', async (c) => {
  try {
    const userId = c.req.header('X-User-ID');
    if (!userId) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'X-User-ID header is required',
        },
      }, { status: 401 });
    }

    const characterId = c.req.query('character_id');
    const status = c.req.query('status');
    const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100);
    const offset = parseInt(c.req.query('offset') || '0');

    const generationService = new GenerationService(c.env);
    const result = await generationService.list({
      user_id: userId,
      character_id: characterId || undefined,
      status: status as 'pending' | 'processing' | 'completed' | 'failed' | undefined,
      limit,
      offset,
    });

    return c.json<ApiResponse<{ generations: Generation[]; total: number }>>({
      success: true,
      data: result,
      pagination: {
        limit,
        offset,
        total: result.total,
        has_more: offset + limit < result.total,
      },
    });

  } catch (error) {
    console.error('Error listing generations:', error);
    return c.json<ApiError>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to list generations',
      },
    }, { status: 500 });
  }
});

/**
 * GET /api/v1/generations/:id
 * Get generation details
 */
app.get('/api/v1/generations/:id', async (c) => {
  try {
    const userId = c.req.header('X-User-ID');
    if (!userId) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'X-User-ID header is required',
        },
      }, { status: 401 });
    }

    const generationId = c.req.param('id');
    const generationService = new GenerationService(c.env);
    
    const generation = await generationService.getById(generationId, userId);
    
    if (!generation) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Generation not found',
        },
      }, { status: 404 });
    }

    return c.json<ApiResponse<Generation>>({
      success: true,
      data: generation,
    });

  } catch (error) {
    console.error('Error getting generation:', error);
    return c.json<ApiError>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to get generation',
      },
    }, { status: 500 });
  }
});

/**
 * DELETE /api/v1/generations/:id
 * Delete generation
 */
app.delete('/api/v1/generations/:id', async (c) => {
  try {
    const userId = c.req.header('X-User-ID');
    if (!userId) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'X-User-ID header is required',
        },
      }, { status: 401 });
    }

    const generationId = c.req.param('id');
    const generationService = new GenerationService(c.env);
    const storageService = new StorageService(c.env);

    // Get generation to delete image
    const generation = await generationService.getById(generationId, userId);
    if (!generation) {
      return c.json<ApiError>({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Generation not found',
        },
      }, { status: 404 });
    }

    // Delete from storage
    await storageService.deleteImage(c.env.GENERATED_IMAGES_BUCKET, generation.image_path);

    // Delete from database
    await generationService.delete(generationId, userId);

    return c.json<ApiResponse<{ message: string }>>({
      success: true,
      data: { message: 'Generation deleted successfully' },
    });

  } catch (error) {
    console.error('Error deleting generation:', error);
    return c.json<ApiError>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to delete generation',
      },
    }, { status: 500 });
  }
});

export default app;
