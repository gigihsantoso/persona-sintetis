import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();
  public isAuthenticated = signal(false);

  // Mock user data
  private mockUser: User = {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User'
  };

  constructor(private router: Router) {
    // Check for existing session (mock)
    const stored = localStorage.getItem('mock_auth');
    if (stored) {
      this.currentUserSignal.set(this.mockUser);
      this.isAuthenticated.set(true);
    }
  }

  login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Mock login - accept any non-empty credentials
      setTimeout(() => {
        if (email && password) {
          this.currentUserSignal.set({
            ...this.mockUser,
            email
          });
          this.isAuthenticated.set(true);
          localStorage.setItem('mock_auth', 'true');
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('mock_auth');
    this.router.navigate(['/login']);
  }

  register(email: string, password: string, name: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email && password && name) {
          this.currentUserSignal.set({
            id: '1',
            email,
            name
          });
          this.isAuthenticated.set(true);
          localStorage.setItem('mock_auth', 'true');
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }
}
