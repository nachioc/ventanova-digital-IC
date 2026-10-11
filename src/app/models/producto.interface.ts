export type Categoria = 'Cursos' | 'Plantillas' | 'Servicios' | 'Suscripciones';

/** Recurso comercial que ofrece VentaNova Digital. */
export interface Producto {
  id: number;
  nombre: string;
  categoria: Categoria;
  descripcion: string;
  precio: number;          // CLP
  rating: number;          // 1 a 5
  crecimiento: number;     // % de crecimiento de ventas en 12 meses
  ventas: number;          // unidades vendidas
  destacado: boolean;
  icono: string;
  caracteristicas: string[];
}

export interface Ventaja {
  aspecto: string;
  tradicional: string;
  ventanova: string;
}
