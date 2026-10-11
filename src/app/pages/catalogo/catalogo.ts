import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductoCard } from '../../components/producto-card/producto-card';
import { Categoria, Producto } from '../../models/producto.interface';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-catalogo',
  imports: [FormsModule, RouterLink, CurrencyPipe, ProductoCard],
  template: `
    <section class="mx-auto max-w-6xl px-4 py-12">
      <h1 class="text-3xl font-extrabold md:text-4xl">Catálogo</h1>
      <p class="mt-2 text-slate-600">Encuentra el producto o servicio ideal para tu negocio.</p>

      <div class="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
        <input type="search" class="campo md:max-w-sm" placeholder="Buscar por nombre o descripción..." [(ngModel)]="busqueda" aria-label="Buscar productos">
        <div class="flex flex-wrap gap-2">
          @for (c of categorias; track c) {
            <button type="button" (click)="categoria.set(c)"
              [class]="'rounded-full px-4 py-2 text-sm font-semibold transition ' + (categoria() === c ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-900 hover:bg-indigo-600/10')">{{ c }}</button>
          }
        </div>
      </div>

      <p class="mt-6 text-sm font-medium text-slate-600">{{ visibles().length }} resultado(s)</p>

      @if (seleccionado(); as p) {
        <div class="mt-4 rounded-2xl border-2 border-indigo-600 bg-white p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="text-4xl">{{ p.icono }}</span>
              <h2 class="mt-2 text-2xl font-bold">{{ p.nombre }}</h2>
              <p class="mt-1 text-sm text-slate-600">{{ p.categoria }} · ⭐ {{ p.rating }} · {{ p.ventas }} ventas</p>
            </div>
            <button type="button" class="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold hover:bg-slate-200" (click)="seleccionado.set(null)" aria-label="Cerrar detalle">✕</button>
          </div>
          <p class="mt-4 text-slate-700">{{ p.descripcion }}</p>
          <ul class="mt-4 grid gap-2 text-sm sm:grid-cols-3">
            @for (item of p.caracteristicas; track item) {
              <li class="rounded-xl bg-slate-100 px-3 py-2 font-medium"><span class="text-teal-600">✓</span> {{ item }}</li>
            }
          </ul>
          <div class="mt-5 flex flex-wrap items-center gap-4">
            <p class="text-2xl font-bold text-indigo-600">{{ p.precio | currency:'CLP':'symbol-narrow':'1.0-0' }}</p>
            <a routerLink="/contacto" [queryParams]="{ producto: p.id }" class="btn-primary">Solicitar información</a>
          </div>
        </div>
      }

      @if (visibles().length > 0) {
        <div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          @for (p of visibles(); track p.id) {
            <app-producto-card [producto]="p" [favorito]="servicio.esInteres(p.id)"
              (alternarFavorito)="servicio.alternarInteres($event)" (verDetalle)="seleccionado.set($event)" />
          }
        </div>
      } @else {
        <div class="tarjeta mt-6 py-12 text-center">
          <p class="text-4xl">🔎</p>
          <h2 class="mt-2 text-lg font-bold">No encontramos resultados</h2>
          <p class="mt-1 text-sm text-slate-600">Prueba con otra palabra o cambia la categoría.</p>
          <button type="button" class="btn-outline mt-4" (click)="limpiar()">Limpiar filtros</button>
        </div>
      }
    </section>
  `
})
export class Catalogo {
  protected readonly servicio = inject(ProductosService);
  private readonly productos = this.servicio.getProductos();
  protected readonly categorias: ('Todas' | Categoria)[] = ['Todas', ...this.servicio.getCategorias()];

  protected readonly busqueda = signal('');
  protected readonly categoria = signal<'Todas' | Categoria>('Todas');
  protected readonly seleccionado = signal<Producto | null>(null);

  /** Resultados visibles: se recalculan solos al cambiar búsqueda o categoría. */
  protected readonly visibles = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const cat = this.categoria();
    return this.productos.filter(p =>
      (cat === 'Todas' || p.categoria === cat) &&
      (!texto || `${p.nombre} ${p.descripcion}`.toLowerCase().includes(texto))
    );
  });

  protected limpiar(): void {
    this.busqueda.set('');
    this.categoria.set('Todas');
  }
}
