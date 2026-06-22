import { Injectable, signal } from '@angular/core';
import { Character } from './character';

export interface GenerationRequest {
  prompt: string;
  style?: string;
  traits?: string[];
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
  private generationsSignal = signal<GenerationResult[]>([]);
  public generations = this.generationsSignal.asReadonly();

  // Mock character templates for generation
  private mockTemplates = [
    {
      name: 'Eldric the Wise',
      description: 'An ancient wizard with knowledge spanning centuries',
      appearance: 'Long white beard, twinkling eyes, robes adorned with stars',
      personality: 'Patient, wise, occasionally cryptic',
      backstory: 'Eldric has witnessed the rise and fall of kingdoms...',
      tags: ['wizard', 'magic', 'elder']
    },
    {
      name: 'Kara Flameheart',
      description: 'A fierce dragon rider from the volcanic lands',
      appearance: 'Red hair, athletic build, dragon-scale armor',
      personality: 'Bold, passionate, protective',
      backstory: 'Bonded with her dragon at a young age...',
      tags: ['dragon-rider', 'warrior', 'female']
    },
    {
      name: 'Nyx Nightwhisper',
      description: 'A mysterious assassin with a code of honor',
      appearance: 'Dark hooded cloak, masked face, lithe figure',
      personality: 'Quiet, observant, principled',
      backstory: 'Trained in the shadow arts from childhood...',
      tags: ['assassin', 'rogue', 'mysterious']
    }
  ];

  generate(request: GenerationRequest): Promise<GenerationResult> {
    return new Promise((resolve) => {
      const generationId = Date.now().toString();
      
      // Create pending generation
      const pendingResult: GenerationResult = {
        id: generationId,
        status: 'pending',
        progress: 0,
        createdAt: new Date()
      };

      this.generationsSignal.update(gens => [pendingResult, ...gens]);
      resolve(pendingResult);

      // Simulate generation process
      setTimeout(() => {
        this.generationsSignal.update(gens => 
          gens.map(g => g.id === generationId 
            ? { ...g, status: 'processing', progress: 50 } 
            : g
          )
        );
      }, 1000);

      // Complete generation
      setTimeout(() => {
        const template = this.mockTemplates[Math.floor(Math.random() * this.mockTemplates.length)];
        const completedResult: GenerationResult = {
          id: generationId,
          status: 'completed',
          progress: 100,
          createdAt: new Date(),
          character: {
            id: Date.now().toString(),
            name: request.prompt ? `Custom: ${template.name}` : template.name,
            description: template.description,
            appearance: template.appearance,
            personality: template.personality,
            backstory: template.backstory,
            imageUrl: `https://via.placeholder.com/300x400?text=${encodeURIComponent(template.name)}`,
            createdAt: new Date(),
            tags: template.tags
          }
        };

        this.generationsSignal.update(gens => 
          gens.map(g => g.id === generationId ? completedResult : g)
        );
      }, 2500);
    });
  }

  getGeneration(id: string): GenerationResult | undefined {
    return this.generationsSignal().find(g => g.id === id);
  }

  cancelGeneration(id: string): boolean {
    const exists = this.generationsSignal().find(g => g.id === id && g.status === 'processing');
    if (exists) {
      this.generationsSignal.update(gens =>
        gens.map(g => g.id === id ? { ...g, status: 'failed', error: 'Cancelled by user' } : g)
      );
      return true;
    }
    return false;
  }

  clearCompleted(): void {
    this.generationsSignal.update(gens => 
      gens.filter(g => g.status === 'pending' || g.status === 'processing')
    );
  }
}
