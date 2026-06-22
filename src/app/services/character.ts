import { Injectable, signal, computed } from '@angular/core';

export interface Character {
  id: string;
  name: string;
  description: string;
  appearance: string;
  personality: string;
  backstory: string;
  imageUrl?: string;
  createdAt: Date;
  tags: string[];
}

export interface CharacterCreateDto {
  name: string;
  description: string;
  appearance: string;
  personality: string;
  backstory: string;
  tags?: string[];
}

export interface CharacterUpdateDto {
  name?: string;
  description?: string;
  appearance?: string;
  personality?: string;
  backstory?: string;
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private charactersSignal = signal<Character[]>([]);
  public characters = this.charactersSignal.asReadonly();
  public characterCount = computed(() => this.charactersSignal().length);

  // Mock data
  private mockCharacters: Character[] = [
    {
      id: '1',
      name: 'Aria Stormwind',
      description: 'A powerful mage from the northern realms',
      appearance: 'Long silver hair, piercing blue eyes, tall and slender',
      personality: 'Intelligent, reserved, but fiercely loyal to friends',
      backstory: 'Born into a family of mages, Aria showed exceptional talent from a young age...',
      imageUrl: 'https://via.placeholder.com/300x400?text=Aria',
      createdAt: new Date('2024-01-15'),
      tags: ['mage', 'magic', 'female']
    },
    {
      id: '2',
      name: 'Theron Ironfist',
      description: 'A seasoned warrior with a mysterious past',
      appearance: 'Muscular build, short brown hair, scar across left eye',
      personality: 'Brave, honorable, sometimes stubborn',
      backstory: 'Once a captain of the royal guard, Theron left after uncovering a conspiracy...',
      imageUrl: 'https://via.placeholder.com/300x400?text=Theron',
      createdAt: new Date('2024-01-16'),
      tags: ['warrior', 'fighter', 'male']
    },
    {
      id: '3',
      name: 'Luna Shadowstep',
      description: 'A nimble rogue with secrets to hide',
      appearance: 'Petite, black hair in a ponytail, green eyes',
      personality: 'Cunning, witty, values freedom above all',
      backstory: 'Growing up on the streets taught Luna to be quick and clever...',
      imageUrl: 'https://via.placeholder.com/300x400?text=Luna',
      createdAt: new Date('2024-01-17'),
      tags: ['rogue', 'thief', 'female']
    }
  ];

  constructor() {
    // Load mock data
    this.charactersSignal.set(this.mockCharacters);
  }

  getAll(): Character[] {
    return this.charactersSignal();
  }

  getById(id: string): Character | undefined {
    return this.charactersSignal().find(c => c.id === id);
  }

  create(character: CharacterCreateDto): Promise<Character> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCharacter: Character = {
          ...character,
          id: Date.now().toString(),
          imageUrl: `https://via.placeholder.com/300x400?text=${encodeURIComponent(character.name)}`,
          createdAt: new Date(),
          tags: character.tags || []
        };
        this.charactersSignal.update(chars => [newCharacter, ...chars]);
        resolve(newCharacter);
      }, 300);
    });
  }

  update(id: string, updates: CharacterUpdateDto): Promise<Character | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updated = this.charactersSignal().map(c => 
          c.id === id ? { ...c, ...updates } : c
        );
        const character = updated.find(c => c.id === id);
        if (character) {
          this.charactersSignal.set(updated);
          resolve(character);
        } else {
          resolve(null);
        }
      }, 300);
    });
  }

  delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.charactersSignal.update(chars => chars.filter(c => c.id !== id));
        resolve(true);
      }, 300);
    });
  }

  search(query: string): Character[] {
    const lowerQuery = query.toLowerCase();
    return this.charactersSignal().filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}
