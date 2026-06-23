import { Component, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CharacterService, Character } from '../../services/character';

@Component({
  selector: 'app-character-library',
  imports: [FormsModule],
  templateUrl: './character-library.html',
  styleUrl: './character-library.css'
})
export class CharacterLibraryComponent {
  characters = signal<Character[]>([]);
  searchQuery = '';
  filterTags = '';
  isDeleting = signal(false);
  editingCharacter = signal<Character | null>(null);
  editName = signal('');
  editTags = signal('');
  showDeleteConfirm = signal<string | null>(null);

  filteredCharacters = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    const tagsFilter = this.filterTags.toLowerCase().trim();
    const chars = this.characters();
    
    return chars.filter(c => {
      const matchesSearch = !query || 
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.tags.some(tag => tag.toLowerCase().includes(query));
      
      const matchesTags = !tagsFilter ||
        c.tags.some(tag => tag.toLowerCase().includes(tagsFilter));
      
      return matchesSearch && matchesTags;
    });
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
    this.router.navigate(['/characters/create']);
  }

  onGenerate(): void {
    this.router.navigate(['/generate']);
  }

  viewCharacter(character: Character): void {
    // Future: navigate to character detail page
    console.log('View character:', character.name);
  }

  startEdit(character: Character): void {
    this.editingCharacter.set(character);
    this.editName.set(character.name);
    this.editTags.set(character.tags.join(', '));
  }

  cancelEdit(): void {
    this.editingCharacter.set(null);
    this.editName.set('');
    this.editTags.set('');
  }

  saveEdit(): void {
    const character = this.editingCharacter();
    if (!character) return;

    const tagsArray = this.editTags()
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t);

    this.characterService.update(character.id, {
      name: this.editName(),
      tags: tagsArray
    }).then(() => {
      this.loadCharacters();
      this.cancelEdit();
    });
  }

  confirmDelete(characterId: string): void {
    this.showDeleteConfirm.set(characterId);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(null);
  }

  deleteCharacter(characterId: string): void {
    this.isDeleting.set(true);
    this.characterService.delete(characterId).then(() => {
      this.loadCharacters();
      this.isDeleting.set(false);
      this.showDeleteConfirm.set(null);
    });
  }

  useInGenerate(character: Character): void {
    // Store selected character in service for generate page
    this.router.navigate(['/generate'], { 
      queryParams: { characterId: character.id }
    });
  }

  getUniqueTags(): string[] {
    const allTags = this.characters().flatMap(c => c.tags);
    return [...new Set(allTags)].sort();
  }
}
