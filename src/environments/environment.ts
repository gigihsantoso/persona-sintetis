/**
 * Environment Configuration
 * Update sesuai dengan environment (development, production)
 */

export const environment = {
  production: false,
  
  // API URL - Cloudflare Worker
  apiUrl: 'http://localhost:8787/api/v1',
  
  // Supabase Configuration
  supabase: {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key',
  },
  
  // Cloudflare Configuration
  cloudflare: {
    // Untuk direct access jika diperlukan
    apiUrl: 'https://character-consistency-api.your-subdomain.workers.dev/api/v1',
  },
  
  // Feature Flags
  features: {
    characterConsistency: true,
    similaritySearch: true,
    batchGeneration: false,  // Future feature
  },
  
  // Limits
  limits: {
    maxImageSize: 10 * 1024 * 1024, // 10MB
    maxCharactersPerUser: 100,
    maxGenerationsPerDay: 50,
  },
};
