import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Catalogo } from './pages/catalogo/catalogo';
import { Tendencias } from './pages/tendencias/tendencias';
import { Contacto } from './pages/contacto/contacto';

export const routes: Routes = [
  { path: '', component: Inicio, title: 'VentaNova Digital | Inicio' },
  { path: 'catalogo', component: Catalogo, title: 'VentaNova Digital | Catálogo' },
  { path: 'tendencias', component: Tendencias, title: 'VentaNova Digital | Tendencias' },
  { path: 'contacto', component: Contacto, title: 'VentaNova Digital | Contacto' },
  { path: '**', redirectTo: '' }
];
