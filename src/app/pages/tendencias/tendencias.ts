import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-tendencias',
  imports: [FormsModule, CurrencyPipe],
  template: `
    <section class="mx-auto max-w-6xl px-4 py-12">
      <h1 class="font-display text-3xl font-extrabold md:text-4xl">Tendencias de venta digital</h1>
      <p class="mt-2 max-w-2xl text-slate-600">Compara categorías y productos según su crecimiento en los últimos 12 meses, y conoce por qué vender en una web propia marca la diferencia.</p>

      <div class="mt-10 grid gap-6 lg:grid-cols-2">
        <div class="tarjeta">
          <h2 class="font-display text-xl font-bold">Crecimiento promedio por categoría</h2>
          <div class="mt-5 space-y-4">
            @for (c of porCategoria(); track c.nombre) {
              <div>
                <div class="mb-1 flex justify-between text-sm font-semibold"><span>{{ c.nombre }}</span><span class="text-indigo-600">+{{ c.crecimiento }}%</span></div>
                <div class="h-3 overflow-hidden rounded-full bg-white"><div class="h-full rounded-full bg-indigo-600" [style.width.%]="c.ancho"></div></div>
              </div>
            }
          </div>
        </div>

        <div class="tarjeta">
          <h2 class="font-display text-xl font-bold">Top 5 en crecimiento</h2>
          <ol class="mt-5 space-y-3">
            @for (p of ranking(); track p.id; let i = $index) {
              <li class="flex items-center gap-3 rounded-xl bg-white p-3">
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-sm font-bold text-slate-900">{{ i + 1 }}</span>
                <span class="flex-1 text-sm font-semibold">{{ p.icono }} {{ p.nombre }}</span>
                <span class="text-sm font-bold text-teal-600">+{{ p.crecimiento }}%</span>
              </li>
            }
          </ol>
        </div>
      </div>

      <div class="mt-10">
        <h2 class="font-display text-2xl font-bold">Compara dos productos</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <select class="campo" [(ngModel)]="idA" aria-label="Primer producto">
            @for (p of productos; track p.id) { <option [ngValue]="p.id">{{ p.nombre }}</option> }
          </select>
          <select class="campo" [(ngModel)]="idB" aria-label="Segundo producto">
            @for (p of productos; track p.id) { <option [ngValue]="p.id">{{ p.nombre }}</option> }
          </select>
        </div>

        @if (idA() === idB()) {
          <p class="tarjeta mt-4 text-sm text-slate-600">Elige dos productos distintos para ver la comparación.</p>
        } @else if (comparacion(); as c) {
          <div class="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table class="w-full min-w-[32rem] text-left text-sm">
              <thead class="bg-slate-100 font-semibold">
                <tr><th class="p-3">Característica</th><th class="p-3">{{ c.a.nombre }}</th><th class="p-3">{{ c.b.nombre }}</th></tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr><td class="p-3 font-medium">Categoría</td><td class="p-3">{{ c.a.categoria }}</td><td class="p-3">{{ c.b.categoria }}</td></tr>
                <tr><td class="p-3 font-medium">Precio</td><td class="p-3">{{ c.a.precio | currency:'CLP':'symbol-narrow':'1.0-0' }}</td><td class="p-3">{{ c.b.precio | currency:'CLP':'symbol-narrow':'1.0-0' }}</td></tr>
                <tr><td class="p-3 font-medium">Valoración</td><td class="p-3">⭐ {{ c.a.rating }}</td><td class="p-3">⭐ {{ c.b.rating }}</td></tr>
                <tr><td class="p-3 font-medium">Crecimiento</td><td class="p-3">+{{ c.a.crecimiento }}%</td><td class="p-3">+{{ c.b.crecimiento }}%</td></tr>
                <tr><td class="p-3 font-medium">Ventas</td><td class="p-3">{{ c.a.ventas }}</td><td class="p-3">{{ c.b.ventas }}</td></tr>
              </tbody>
            </table>
          </div>
          <p class="mt-3 rounded-xl bg-cyan-500/15 p-3 text-sm font-medium text-cyan-900">
            <strong>{{ c.ganador.nombre }}</strong> lidera en crecimiento con una diferencia de {{ c.diferencia }} puntos porcentuales.
          </p>
        }
      </div>

      <div class="mt-12">
        <h2 class="font-display text-2xl font-bold">Nuestra propuesta de valor</h2>
        <div class="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table class="w-full min-w-[32rem] text-left text-sm">
            <thead class="bg-indigo-600 text-white">
              <tr><th class="p-3">Aspecto</th><th class="p-3">Canales tradicionales</th><th class="p-3">VentaNova Digital</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (v of ventajas; track v.aspecto) {
                <tr><td class="p-3 font-semibold">{{ v.aspecto }}</td><td class="p-3 text-slate-600">{{ v.tradicional }}</td><td class="p-3 font-medium text-indigo-600">{{ v.ventanova }}</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `
})
export class Tendencias {
  private readonly servicio = inject(ProductosService);
  protected readonly productos = this.servicio.getProductos();
  protected readonly ventajas = this.servicio.getVentajas();

  protected readonly idA = signal(1);
  protected readonly idB = signal(4);

  /** Crecimiento promedio por categoría, con ancho relativo para las barras. */
  protected readonly porCategoria = computed(() => {
    const filas = this.servicio.getCategorias().map(nombre => {
      const lista = this.productos.filter(p => p.categoria === nombre);
      const promedio = lista.reduce((s, p) => s + p.crecimiento, 0) / lista.length;
      return { nombre, crecimiento: Math.round(promedio) };
    });
    const max = Math.max(...filas.map(f => f.crecimiento));
    return filas.map(f => ({ ...f, ancho: (f.crecimiento / max) * 100 })).sort((x, y) => y.crecimiento - x.crecimiento);
  });

  protected readonly ranking = computed(() => [...this.productos].sort((x, y) => y.crecimiento - x.crecimiento).slice(0, 5));

  /** Comparación derivada de los dos productos elegidos. */
  protected readonly comparacion = computed(() => {
    const a = this.servicio.getProducto(this.idA());
    const b = this.servicio.getProducto(this.idB());
    if (!a || !b) return null;
    const ganador = a.crecimiento >= b.crecimiento ? a : b;
    return { a, b, ganador, diferencia: Math.abs(a.crecimiento - b.crecimiento) };
  });
}
