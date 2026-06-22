import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-character-form',
  imports: [FormsModule],
  templateUrl: './character-form.html',
  styleUrl: './character-form.css'
})
export class CharacterFormComponent {
  name = '';
  description = '';
  appearance = '';
  personality = '';
  backstory = '';
  tags = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.name || !this.description) {
      alert('Name and description are required');
      return;
    }

    this.isSubmitting = true;
    
    // Simulate form submission
    setTimeout(() => {
      this.isSubmitting = false;
      alert('Character created successfully! (mock)');
      this.router.navigate(['/gallery']);
    }, 1000);
  }

  cancel(): void {
    this.router.navigate(['/gallery']);
  }
}
