import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CharacterService } from '../../services/character';

@Component({
  selector: 'app-character-create',
  imports: [FormsModule],
  templateUrl: './character-create.html',
  styleUrl: './character-create.css'
})
export class CharacterCreateComponent {
  name = signal('');
  description = signal('');
  tags = signal('');
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  isUploading = signal(false);
  isSubmitting = signal(false);
  dragOver = signal(false);
  error = signal<string | null>(null);

  MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  constructor(
    private characterService: CharacterService,
    private router: Router
  ) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  handleFile(file: File): void {
    this.error.set(null);

    // Validate file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.error.set('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.');
      return;
    }

    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      this.error.set('Ukuran file melebihi 10MB. Silakan pilih file yang lebih kecil.');
      return;
    }

    this.selectedFile.set(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    const input = document.getElementById('fileInput') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  onSubmit(): void {
    this.error.set(null);

    // Validation
    if (!this.name().trim()) {
      this.error.set('Nama karakter wajib diisi');
      return;
    }

    if (!this.selectedFile()) {
      this.error.set('Gambar karakter wajib diunggah');
      return;
    }

    this.isSubmitting.set(true);

    const tagsArray = this.tags()
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t);

    // Create character with image
    const formData = new FormData();
    formData.append('name', this.name());
    formData.append('description', this.description());
    formData.append('tags', JSON.stringify(tagsArray));
    if (this.selectedFile()) {
      formData.append('image', this.selectedFile()!);
    }

    // Simulate API call
    setTimeout(() => {
      this.characterService.create({
        name: this.name(),
        description: this.description(),
        tags: tagsArray
      }).then(() => {
        this.isSubmitting.set(false);
        this.router.navigate(['/characters']);
      }).catch((err) => {
        this.isSubmitting.set(false);
        this.error.set('Gagal menyimpan karakter. Silakan coba lagi.');
      });
    }, 1000);
  }

  cancel(): void {
    this.router.navigate(['/characters']);
  }

  getFileName(): string {
    const file = this.selectedFile();
    if (!file) return '';
    
    const name = file.name;
    if (name.length > 30) {
      return name.substring(0, 27) + '...';
    }
    return name;
  }
}
