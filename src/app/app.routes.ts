import { Routes } from '@angular/router';
import { GalleryComponent } from './components/gallery/gallery';
import { CharacterFormComponent } from './components/character-form/character-form';
import { GeneratePageComponent } from './components/generate-page/generate-page';
import { CharacterLibraryComponent } from './components/character-library/character-library';
import { CharacterCreateComponent } from './components/character-create/character-create';

export const routes: Routes = [
  { path: '', redirectTo: 'characters', pathMatch: 'full' },
  { path: 'characters', component: CharacterLibraryComponent },
  { path: 'characters/create', component: CharacterCreateComponent },
  { path: 'characters/new', component: CharacterFormComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'generate', component: GeneratePageComponent },
  { path: '**', redirectTo: 'characters' }
];
