import { Injectable, computed, signal } from '@angular/core';
import { PRODUCTOS, VENTAJAS } from '../data/productos.data';
import { Categoria, Producto, Ventaja } from '../models/producto.interface';

/** Entrega los datos a las páginas y guarda la lista de interés compartida. */
@Injectable({ providedIn: 'root' })
export class ProductosService {
  /** Ids de productos marcados como de interés (compartido entre vistas). */
  readonly interes = signal<number[]>([]);
  readonly totalInteres = computed(() => this.interes().length);

  getProductos(): Producto[] {
    return PRODUCTOS;
  }

  getProducto(id: number): Producto | undefined {
    return PRODUCTOS.find(p => p.id === id);
  }

  getDestacados(): Producto[] {
    return PRODUCTOS.filter(p => p.destacado);
  }

  getCategorias(): Categoria[] {
    return [...new Set(PRODUCTOS.map(p => p.categoria))];
  }

  getVentajas(): Ventaja[] {
    return VENTAJAS;
  }

  esInteres(id: number): boolean {
    return this.interes().includes(id);
  }

  alternarInteres(id: number): void {
    this.interes.update(lista => (lista.includes(id) ? lista.filter(i => i !== id) : [...lista, id]));
  }
}
