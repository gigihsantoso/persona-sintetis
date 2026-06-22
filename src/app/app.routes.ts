import { Routes } from '@angular/router';
import { GalleryComponent } from './components/gallery/gallery';
import { CharacterFormComponent } from './components/character-form/character-form';
import { GeneratePageComponent } from './components/generate-page/generate-page';

export const routes: Routes = [
  { path: '', redirectTo: 'gallery', pathMatch: 'full' },
  { path: 'gallery', component: GalleryComponent },
  { path: 'characters/new', component: CharacterFormComponent },
  { path: 'generate', component: GeneratePageComponent },
  { path: '**', redirectTo: 'gallery' }
];
