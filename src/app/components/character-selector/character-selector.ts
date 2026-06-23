import { Component, signal, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CharacterService, Character } from '../../services/character';

@Component({
  selector: 'app-character-selector',
  imports: [FormsModule],
  templateUrl: './character-selector.html',
  styleUrl: './character-selector.css'
})
export class CharacterSelectorComponent {
  // Input: currently selected character ID (optional)
  selectedCharacterId = input<string | null>(null);
  
  // Output: emit when character is selected
  characterSelected = output<Character | null>();
  
  // Output: emit when user wants to manage characters
  manageCharacters = output<void>();

  characters = signal<Character[]>([]);
  searchQuery = signal('');
  isOpen = signal(false);
  isLoading = signal(false);

  filteredCharacters = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const chars = this.characters();
    
    if (!query) {
      return chars;
    }
    
    return chars.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  selectedCharacter = computed(() => {
    const selectedId = this.selectedCharacterId();
    if (!selectedId) return null;
    return this.characters().find(c => c.id === selectedId) || null;
  });

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.isLoading.set(true);
    this.characters.set(this.characterService.getAll());
    this.isLoading.set(false);
  }

  toggleOpen(): void {
    if (!this.isOpen()) {
      this.loadCharacters();
    }
    this.isOpen.set(!this.isOpen());
  }

  close(): void {
    this.isOpen.set(false);
    this.searchQuery.set('');
  }

  selectCharacter(character: Character): void {
    this.characterSelected.emit(character);
    this.close();
  }

  clearSelection(): void {
    this.characterSelected.emit(null);
  }

  onManageCharacters(): void {
    this.manageCharacters.emit();
    this.close();
  }

  // Handle click outside to close dropdown
  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
