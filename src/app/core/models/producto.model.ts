export type UnidadMedida = 'GRAMO' | 'LITRO' | 'UNIDAD' | 'PIEZA';

export interface Producto {
  id: number;
  nombre: string;
  unidad: UnidadMedida;
  stockActual: number;
  stockMinimo: number;
  precioCompra: number;
  activo: boolean;
}

export interface ProductoRequest {
  nombre: string;
  unidad: UnidadMedida;
  precioCompra: number;
  stockMinimo?: number;
}
