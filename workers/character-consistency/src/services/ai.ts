/**
 * AI Service
 * Handles Cloudflare AI operations for CLIP embedding and SDXL image generation
 */

import type { Env, EmbeddingResult, ImageGenerationInput, ImageGenerationResult } from '../types';

export class AIService {
  constructor(private ai: any) {
    // Cloudflare AI binding
  }

  /**
   * Extract CLIP embedding from image
   * Uses CLIP ViT-B/32 model (512 dimensions)
   */
  async extractEmbedding(image: File | Blob): Promise<number[]> {
    try {
      // Convert to ArrayBuffer if needed
      const arrayBuffer = await image.arrayBuffer();
      
      // Run CLIP model via Cloudflare AI
      const response = await this.ai.run('@cf/openai/clip-vit-b-32', {
        image: Array.from(new Uint8Array(arrayBuffer)),
      });

      if (!response || !response.data || !response.data[0]) {
        throw new Error('Failed to extract embedding from image');
      }

      return response.data[0];
    } catch (error) {
      console.error('Error extracting embedding:', error);
      throw new Error(
        error instanceof Error 
          ? `Embedding extraction failed: ${error.message}` 
          : 'Embedding extraction failed'
      );
    }
  }

  /**
   * Generate image with character consistency using IP-Adapter + SDXL
   */
  async generateImage(input: ImageGenerationInput): Promise<ImageGenerationResult> {
    const {
      prompt,
      negative_prompt,
      reference_image,
      reference_embedding,
      consistency_strength = 0.8,
      width = 1024,
      height = 1024,
      num_inference_steps = 25,
      guidance_scale = 7.5,
      seed,
    } = input;

    try {
      // Build enhanced prompt
      const enhancedPrompt = this.buildEnhancedPrompt(prompt, input);
      
      // Prepare generation parameters
      const generationParams: any = {
        prompt: enhancedPrompt,
        negative_prompt: negative_prompt || 'ugly, blurry, distorted, low quality, bad anatomy, extra limbs',
        width,
        height,
        num_inference_steps,
        guidance_scale,
        seed: seed || Math.floor(Math.random() * 2147483647),
      };

      // Add IP-Adapter conditioning if reference image provided
      if (reference_image) {
        const imageArray = await reference_image.arrayBuffer();
        generationParams.image = Array.from(new Uint8Array(imageArray));
        generationParams.ip_adapter_weight = consistency_strength;
      }

      // Run SDXL Turbo model via Cloudflare AI
      const response = await this.ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', generationParams);

      if (!response || !response.image) {
        throw new Error('Failed to generate image');
      }

      // Convert base64 image to Blob
      const imageBlob = await this.base64ToBlob(response.image, 'image/png');

      // Extract embedding from generated image for similarity calculation
      let embedding: number[] | undefined = undefined;
      try {
        embedding = await this.extractEmbedding(imageBlob);
      } catch (e) {
        console.warn('Could not extract embedding from generated image:', e);
      }

      return {
        image: imageBlob,
        width: response.width || width,
        height: response.height || height,
        embedding,
        metadata: {
          model: 'sdxl-turbo',
          steps: num_inference_steps,
          seed: generationParams.seed,
        },
      };
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error(
        error instanceof Error 
          ? `Image generation failed: ${error.message}` 
          : 'Image generation failed'
      );
    }
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  calculateCosineSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same dimensions');
    }

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      magnitude1 += embedding1[i] * embedding1[i];
      magnitude2 += embedding2[i] * embedding2[i];
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }

    return dotProduct / (magnitude1 * magnitude2);
  }

  /**
   * Build enhanced prompt with character context
   */
  private buildEnhancedPrompt(prompt: string, input: ImageGenerationInput): string {
    const { action, location, outfit } = input;
    
    let enhancedPrompt = prompt;

    // Add action context
    if (action) {
      enhancedPrompt += `, ${action} pose, dynamic ${action}`;
    }

    // Add location/scene context
    if (location) {
      enhancedPrompt += `, background: ${location}`;
    }

    // Add outfit context
    if (outfit) {
      enhancedPrompt += `, wearing ${outfit}`;
    }

    // Add quality enhancers
    enhancedPrompt += ', high quality, detailed, sharp focus, professional';

    return enhancedPrompt;
  }

  /**
   * Convert base64 string to Blob
   */
  private async base64ToBlob(base64: string, mimeType: string): Promise<Blob> {
    // Remove data URL prefix if present
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: mimeType });
  }

  /**
   * Get available AI models
   */
  async getAvailableModels(): Promise<string[]> {
    // List of supported models for character consistency
    return [
      '@cf/openai/clip-vit-b-32',      // Embedding extraction
      '@cf/stabilityai/stable-diffusion-xl-base-1.0',  // Image generation
      '@cf/runwayml/stable-diffusion-v1-5-img2img',    // Image-to-image
    ];
  }
}
