import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProductosService } from './services/productos.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a routerLink="/" class="flex items-center gap-2 font-display text-lg font-extrabold">
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">V</span>
          VentaNova <span class="text-cyan-500">Digital</span>
        </a>

        <ul class="hidden items-center gap-1 md:flex">
          @for (e of enlaces; track e.ruta) {
            <li>
              <a [routerLink]="e.ruta" routerLinkActive="bg-indigo-600/10 text-indigo-600" [routerLinkActiveOptions]="{ exact: e.ruta === '/' }"
                class="rounded-lg px-4 py-2 text-sm font-semibold text-slate-900 transition hover:text-indigo-600">{{ e.texto }}</a>
            </li>
          }
        </ul>

        <div class="flex items-center gap-2">
          <span class="rounded-full bg-cyan-500 px-3 py-1 text-xs font-bold text-slate-900" title="Productos en tu lista de interés">★ {{ servicio.totalInteres() }}</span>
          <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold md:hidden" (click)="menuAbierto.set(!menuAbierto())" aria-label="Abrir menú">☰</button>
        </div>
      </nav>

      @if (menuAbierto()) {
        <ul class="space-y-1 border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          @for (e of enlaces; track e.ruta) {
            <li><a [routerLink]="e.ruta" (click)="menuAbierto.set(false)" routerLinkActive="bg-indigo-600/10 text-indigo-600" [routerLinkActiveOptions]="{ exact: e.ruta === '/' }"
              class="block rounded-lg px-4 py-2 text-sm font-semibold">{{ e.texto }}</a></li>
          }
        </ul>
      }
    </header>

    <main class="min-h-[70vh]"><router-outlet /></main>

    <footer class="bg-slate-900 text-slate-100">
      <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm md:flex-row">
        <p class="font-display font-bold">VentaNova <span class="text-cyan-500">Digital</span></p>
        <p class="text-slate-400">© 2026 VentaNova Digital. Vende más, en digital.</p>
      </div>
    </footer>
  `
})
export class App {
  protected readonly servicio = inject(ProductosService);
  protected readonly menuAbierto = signal(false);
  protected readonly enlaces = [
    { ruta: '/', texto: 'Inicio' },
    { ruta: '/catalogo', texto: 'Catálogo' },
    { ruta: '/tendencias', texto: 'Tendencias' },
    { ruta: '/contacto', texto: 'Contacto' }
  ];
}
