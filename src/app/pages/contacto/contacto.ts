import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-contacto',
  imports: [FormsModule, CurrencyPipe],
  template: `
    <section class="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-2">
      <div>
        <h1 class="text-3xl font-extrabold md:text-4xl">Registra tu interés</h1>
        <p class="mt-2 text-slate-600">Cuéntanos qué necesitas y te enviaremos una propuesta a tu medida.</p>

        <div class="tarjeta mt-6 space-y-4">
          <div>
            <label class="mb-1 block text-sm font-semibold" for="nombre">Nombre</label>
            <input id="nombre" class="campo" placeholder="Tu nombre" [(ngModel)]="nombre">
          </div>
          <div>
            <label class="mb-1 block text-sm font-semibold" for="correo">Correo electrónico</label>
            <input id="correo" type="email" class="campo" placeholder="tu@correo.cl" [(ngModel)]="correo">
            @if (correo() && !correoValido()) { <p class="mt-1 text-xs font-medium text-red-600">Ingresa un correo válido.</p> }
          </div>
          <div>
            <label class="mb-1 block text-sm font-semibold" for="producto">Producto de interés</label>
            <select id="producto" class="campo" [(ngModel)]="productoId">
              <option [ngValue]="0">Selecciona una opción</option>
              @for (p of productos; track p.id) { <option [ngValue]="p.id">{{ p.nombre }}</option> }
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-semibold" for="comentario">Comentario</label>
            <textarea id="comentario" rows="4" maxlength="300" class="campo" placeholder="¿Algo que debamos saber?" [(ngModel)]="comentario"></textarea>
            <p class="mt-1 text-right text-xs text-slate-600">{{ comentario().length }}/300</p>
          </div>
          <button type="button" class="btn-primary w-full" [disabled]="!formularioValido()" (click)="enviar()">Enviar registro</button>
        </div>
      </div>

      <aside class="space-y-4 lg:pt-24">
        @if (enviado()) {
          <div class="rounded-2xl border-2 border-teal-500 bg-white p-6">
            <p class="text-3xl">✅</p>
            <h2 class="mt-2 text-xl font-bold">¡Gracias, {{ nombre() }}!</h2>
            <p class="mt-1 text-sm text-slate-600">Recibimos tu registro. Te escribiremos a <strong>{{ correo() }}</strong> muy pronto.</p>
            <button type="button" class="btn-outline mt-4" (click)="reiniciar()">Enviar otro registro</button>
          </div>
        }
        <div class="tarjeta">
          <h2 class="text-lg font-bold">Resumen en vivo</h2>
          <dl class="mt-3 space-y-2 text-sm">
            <div class="flex justify-between gap-4"><dt class="text-slate-600">Nombre</dt><dd class="font-semibold">{{ nombre() || '—' }}</dd></div>
            <div class="flex justify-between gap-4"><dt class="text-slate-600">Correo</dt><dd class="font-semibold">{{ correo() || '—' }}</dd></div>
            <div class="flex justify-between gap-4"><dt class="text-slate-600">Interés</dt><dd class="text-right font-semibold">{{ productoElegido()?.nombre || '—' }}</dd></div>
            @if (productoElegido(); as p) {
              <div class="flex justify-between gap-4"><dt class="text-slate-600">Valor de referencia</dt><dd class="font-bold text-indigo-600">{{ p.precio | currency:'CLP':'symbol-narrow':'1.0-0' }}</dd></div>
            }
          </dl>
        </div>
        @if (interesados().length > 0) {
          <div class="tarjeta">
            <h2 class="text-lg font-bold">Tu lista de interés ({{ interesados().length }})</h2>
            <ul class="mt-3 space-y-2 text-sm">
              @for (p of interesados(); track p.id) {
                <li class="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                  <span class="font-medium">{{ p.icono }} {{ p.nombre }}</span>
                  <button type="button" class="text-xs font-semibold text-indigo-600 hover:underline" (click)="productoId.set(p.id)">Elegir</button>
                </li>
              }
            </ul>
          </div>
        }
      </aside>
    </section>
  `
})
export class Contacto {
  private readonly servicio = inject(ProductosService);
  protected readonly productos = this.servicio.getProductos();

  protected readonly nombre = signal('');
  protected readonly correo = signal('');
  protected readonly productoId = signal(0);
  protected readonly comentario = signal('');
  protected readonly enviado = signal(false);

  constructor() {
    // Si llega desde el catálogo, el producto viene en la URL (?producto=ID)
    const desdeUrl = Number(inject(ActivatedRoute).snapshot.queryParamMap.get('producto'));
    if (desdeUrl) this.productoId.set(desdeUrl);
  }

  protected readonly productoElegido = computed(() => this.servicio.getProducto(this.productoId()));
  protected readonly interesados = computed(() =>
    this.servicio.interes().map(id => this.servicio.getProducto(id)).filter(p => !!p)
  );
  protected readonly correoValido = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(this.correo()));
  protected readonly formularioValido = computed(() =>
    this.nombre().trim().length > 1 && this.correoValido() && this.productoId() !== 0
  );

  protected enviar(): void {
    if (this.formularioValido()) this.enviado.set(true);
  }

  protected reiniciar(): void {
    this.nombre.set('');
    this.correo.set('');
    this.productoId.set(0);
    this.comentario.set('');
    this.enviado.set(false);
  }
}
