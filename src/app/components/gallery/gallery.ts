import { Component, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CharacterService, Character } from '../../services/character';

@Component({
  selector: 'app-gallery',
  imports: [FormsModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class GalleryComponent {
  characters = signal<Character[]>([]);
  searchQuery = '';
  selectedCharacter = signal<Character | null>(null);
  isDeleting = signal(false);

  filteredCharacters = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    const chars = this.characters();
    
    if (!query) {
      return chars;
    }
    
    return chars.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  constructor(
    private characterService: CharacterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.characters.set(this.characterService.getAll());
  }

  onCreateNew(): void {
    this.router.navigate(['/characters/new']);
  }

  onGenerate(): void {
    this.router.navigate(['/generate']);
  }

  viewCharacter(character: Character): void {
    this.selectedCharacter.set(character);
  }

  closePreview(): void {
    this.selectedCharacter.set(null);
  }

  deleteCharacter(character: Character): void {
    if (confirm(`Are you sure you want to delete "${character.name}"?`)) {
      this.isDeleting.set(true);
      this.characterService.delete(character.id).then(() => {
        this.loadCharacters();
        this.isDeleting.set(false);
        if (this.selectedCharacter()?.id === character.id) {
          this.closePreview();
        }
      });
    }
  }

  editCharacter(character: Character): void {
    // In a real app, navigate to edit page
    alert(`Edit functionality for "${character.name}" - coming soon!`);
  }
}
