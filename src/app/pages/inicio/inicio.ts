import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <section class="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
      <div class="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span class="rounded-full bg-cyan-500 px-3 py-1 text-xs font-bold text-slate-900">Vende más, en digital</span>
          <h1 class="mt-5 font-display text-4xl font-extrabold leading-tight md:text-5xl">Productos y servicios digitales para hacer crecer tu negocio</h1>
          <p class="mt-5 max-w-lg text-indigo-100">En VentaNova Digital reunimos cursos, plantillas, servicios y suscripciones en un solo lugar, con información clara y tendencias reales del mercado.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a routerLink="/catalogo" class="btn bg-cyan-500 text-slate-900 hover:bg-cyan-400">Explorar catálogo</a>
            <a routerLink="/tendencias" class="btn border border-white/40 text-white hover:bg-white/10">Ver tendencias</a>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3 text-center">
          <div class="rounded-2xl bg-white/10 p-4"><p class="font-display text-3xl font-extrabold">{{ totalProductos }}</p><p class="text-xs text-indigo-100">Productos</p></div>
          <div class="rounded-2xl bg-white/10 p-4"><p class="font-display text-3xl font-extrabold">{{ totalVentas() }}</p><p class="text-xs text-indigo-100">Ventas totales</p></div>
          <div class="rounded-2xl bg-white/10 p-4"><p class="font-display text-3xl font-extrabold">{{ servicio.totalInteres() }}</p><p class="text-xs text-indigo-100">En tu lista</p></div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-14">
      <h2 class="font-display text-3xl font-extrabold">Recorre nuestros destacados</h2>
      <p class="mt-2 text-slate-600">Toca cada tarjeta para marcarla como visitada y completa tu exploración.</p>

      <div class="mt-6 rounded-2xl border border-slate-200 bg-slate-100 p-5">
        <div class="flex items-center justify-between text-sm font-semibold">
          <span>Exploración: {{ visitados().length }} de {{ destacados.length }}</span>
          <span class="text-indigo-600">{{ progreso() }}%</span>
        </div>
        <div class="mt-2 h-3 overflow-hidden rounded-full bg-white">
          <div class="h-full rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-500" [style.width.%]="progreso()"></div>
        </div>
        @if (progreso() === 100) {
          <p class="mt-3 rounded-xl bg-cyan-500/15 p-3 text-sm font-medium text-cyan-900">¡Excelente! Ya conoces todos los destacados. Revisa el catálogo completo para seguir explorando.</p>
        } @else {
          <p class="mt-3 text-sm text-slate-600">Te faltan {{ destacados.length - visitados().length }} destacados por visitar.</p>
        }
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        @for (p of destacados; track p.id) {
          <button type="button" (click)="alternarVisita(p.id)"
            [class]="'rounded-2xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-lg ' + (esVisitado(p.id) ? 'border-indigo-600 bg-white ring-2 ring-indigo-600/20' : 'border-slate-200 bg-slate-100')">
            <span class="text-3xl">{{ p.icono }}</span>
            <h3 class="mt-3 font-bold leading-snug">{{ p.nombre }}</h3>
            <p class="mt-1 text-sm text-slate-600">{{ p.categoria }}</p>
            <p class="mt-3 flex items-center justify-between">
              <span class="font-bold text-indigo-600">{{ p.precio | currency:'CLP':'symbol-narrow':'1.0-0' }}</span>
              @if (esVisitado(p.id)) { <span class="text-xs font-semibold text-teal-600">✓ Visitado</span> }
            </p>
          </button>
        }
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-16">
      <div class="grid gap-4 md:grid-cols-3">
        <div class="tarjeta"><p class="text-2xl">🛒</p><h3 class="mt-2 font-bold">Catálogo claro</h3><p class="mt-1 text-sm text-slate-600">Busca por nombre y filtra por categoría para encontrar lo que necesitas.</p></div>
        <div class="tarjeta"><p class="text-2xl">📊</p><h3 class="mt-2 font-bold">Tendencias reales</h3><p class="mt-1 text-sm text-slate-600">Compara productos y categorías según su crecimiento de ventas.</p></div>
        <div class="tarjeta"><p class="text-2xl">🤝</p><h3 class="mt-2 font-bold">Atención directa</h3><p class="mt-1 text-sm text-slate-600">Registra tu interés y te contactamos con una propuesta a tu medida.</p></div>
      </div>
    </section>
  `
})
export class Inicio {
  protected readonly servicio = inject(ProductosService);
  protected readonly destacados = this.servicio.getDestacados();
  protected readonly totalProductos = this.servicio.getProductos().length;

  /** Estado: ids de destacados que la persona ya visitó. */
  protected readonly visitados = signal<number[]>([]);

  /** Estado derivado: porcentaje de exploración completado. */
  protected readonly progreso = computed(() => Math.round((this.visitados().length / this.destacados.length) * 100));

  protected readonly totalVentas = computed(() =>
    this.servicio.getProductos().reduce((suma, p) => suma + p.ventas, 0).toLocaleString('es-CL')
  );

  protected esVisitado(id: number): boolean {
    return this.visitados().includes(id);
  }

  protected alternarVisita(id: number): void {
    this.visitados.update(v => (v.includes(id) ? v.filter(x => x !== id) : [...v, id]));
  }
}
