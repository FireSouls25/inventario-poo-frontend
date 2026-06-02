export interface IngredienteInfo {
  id: number;
  productoNombre: string;
  cantidad: number;
  unidad: string;
}

export interface Plato {
  id: number;
  nombre: string;
  precioVenta: number;
  disponible: boolean;
  descripcion?: string;
  ingredientes: IngredienteInfo[];
  conStock: boolean;
}

export interface PlatoRequest {
  nombre: string;
  precioVenta: number;
  descripcion?: string;
}

export interface RecetaIngredienteRequest {
  productoId: number;
  cantidad: number;
}
