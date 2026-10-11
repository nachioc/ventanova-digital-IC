import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Producto } from '../../models/producto.interface';

/** Tarjeta reutilizable de producto: recibe datos por @Input y avisa acciones por @Output. */
@Component({
  selector: 'app-producto-card',
  imports: [CurrencyPipe],
  template: `
    <article class="tarjeta flex h-full flex-col transition hover:-translate-y-1 hover:shadow-lg">
      <div class="mb-4 flex items-start justify-between">
        <span class="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-3xl shadow-sm">{{ producto.icono }}</span>
        <button type="button" (click)="alternarFavorito.emit(producto.id)"
          [attr.aria-label]="favorito ? 'Quitar de mi lista de interés' : 'Agregar a mi lista de interés'"
          [class]="'rounded-full p-2 text-xl transition ' + (favorito ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 hover:text-indigo-600')">
          {{ favorito ? '★' : '☆' }}
        </button>
      </div>
      <span class="mb-2 w-fit rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-800">{{ producto.categoria }}</span>
      <h3 class="text-base font-bold leading-snug">{{ producto.nombre }}</h3>
      <p class="mt-2 flex-1 text-sm text-slate-600">{{ producto.descripcion }}</p>
      <div class="mt-4 flex items-end justify-between">
        <p class="text-xl font-bold text-indigo-600">{{ producto.precio | currency:'CLP':'symbol-narrow':'1.0-0' }}</p>
        <p class="text-sm font-medium text-slate-600">⭐ {{ producto.rating }}</p>
      </div>
      <button type="button" class="btn-outline mt-4" (click)="verDetalle.emit(producto)">Ver detalle</button>
    </article>
  `
})
export class ProductoCard {
  @Input({ required: true }) producto!: Producto;
  @Input() favorito = false;
  @Output() alternarFavorito = new EventEmitter<number>();
  @Output() verDetalle = new EventEmitter<Producto>();
}
