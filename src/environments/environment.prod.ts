/**
 * Production Environment Configuration
 */

export const environment = {
  production: true,
  
  // API URL - Cloudflare Worker (production)
  apiUrl: 'https://character-consistency-api.personasintetis.workers.dev/api/v1',
  
  // Supabase Configuration
  supabase: {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key',
  },
  
  // Cloudflare Configuration
  cloudflare: {
    apiUrl: 'https://character-consistency-api.personasintetis.workers.dev/api/v1',
  },
  
  // Feature Flags
  features: {
    characterConsistency: true,
    similaritySearch: true,
    batchGeneration: false,
  },
  
  // Limits
  limits: {
    maxImageSize: 10 * 1024 * 1024, // 10MB
    maxCharactersPerUser: 100,
    maxGenerationsPerDay: 50,
  },
};
