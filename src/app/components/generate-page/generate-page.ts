import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GenerationService, GenerationResult } from '../../services/generation';
import { CharacterService, Character } from '../../services/character';
import { CharacterSelectorComponent } from '../character-selector/character-selector';

@Component({
  selector: 'app-generate-page',
  imports: [FormsModule, CharacterSelectorComponent],
  templateUrl: './generate-page.html',
  styleUrl: './generate-page.css'
})
export class GeneratePageComponent {
  prompt = signal('');
  style = signal('fantasy');
  traits = signal('');
  selectedCharacter = signal<Character | null>(null);
  consistencyStrength = signal(0.8);
  isGenerating = signal(false);
  currentGeneration = signal<GenerationResult | null>(null);

  styles = [
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'scifi', label: 'Sci-Fi' },
    { value: 'modern', label: 'Modern' },
    { value: 'horror', label: 'Horror' },
    { value: 'historical', label: 'Historical' }
  ];

  constructor(
    private generationService: GenerationService,
    private characterService: CharacterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check for characterId in query params
    this.route.queryParams.subscribe(params => {
      const characterId = params['characterId'];
      if (characterId) {
        const character = this.characterService.getById(characterId);
        if (character) {
          this.selectedCharacter.set(character);
        }
      }
    });
  }

  onCharacterSelected(character: Character | null): void {
    this.selectedCharacter.set(character);
  }

  onManageCharacters(): void {
    this.router.navigate(['/characters']);
  }

  getStrengthLabel(): string {
    const strength = this.consistencyStrength();
    if (strength >= 0.95) return 'Very High';
    if (strength >= 0.85) return 'High';
    if (strength >= 0.75) return 'Medium';
    if (strength >= 0.65) return 'Low';
    return 'Very Low';
  }

  getStrengthColor(): string {
    const strength = this.consistencyStrength();
    if (strength >= 0.9) return 'var(--color-success-600)';
    if (strength >= 0.8) return 'var(--color-primary-600)';
    if (strength >= 0.7) return 'var(--color-warning-500)';
    return 'var(--color-gray-500)';
  }

  onGenerate(): void {
    if (!this.prompt().trim()) {
      alert('Please enter a prompt');
      return;
    }

    this.isGenerating.set(true);
    const traitList = this.traits().split(',').map((t: string) => t.trim()).filter((t: string) => t);

    this.generationService.generate({
      prompt: this.prompt(),
      style: this.style(),
      traits: traitList,
      characterId: this.selectedCharacter()?.id,
      consistencyStrength: this.consistencyStrength()
    }).then((result) => {
      this.currentGeneration.set(result);
      
      // Poll for completion
      this.pollGeneration(result.id);
    });
  }

  private pollGeneration(id: string): void {
    const checkStatus = () => {
      const gen = this.generationService.getGeneration(id);
      if (gen) {
        this.currentGeneration.set(gen);
        if (gen.status === 'completed' && gen.character) {
          this.isGenerating.set(false);
          // Navigate to gallery after completion
          setTimeout(() => {
            this.router.navigate(['/gallery']);
          }, 1500);
        } else if (gen.status === 'processing') {
          setTimeout(checkStatus, 500);
        }
      }
    };
    setTimeout(checkStatus, 1000);
  }

  onCancel(): void {
    if (this.currentGeneration()) {
      this.generationService.cancelGeneration(this.currentGeneration()!.id);
      this.isGenerating.set(false);
      this.currentGeneration.set(null);
    }
  }
}
