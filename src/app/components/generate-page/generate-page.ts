import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GenerationService, GenerationResult } from '../../services/generation';

@Component({
  selector: 'app-generate-page',
  imports: [FormsModule],
  templateUrl: './generate-page.html',
  styleUrl: './generate-page.css'
})
export class GeneratePageComponent {
  prompt = '';
  style = 'fantasy';
  traits = '';
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
    private router: Router
  ) {}

  onGenerate(): void {
    if (!this.prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    this.isGenerating.set(true);
    const traitList = this.traits.split(',').map(t => t.trim()).filter(t => t);

    this.generationService.generate({
      prompt: this.prompt,
      style: this.style,
      traits: traitList
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
