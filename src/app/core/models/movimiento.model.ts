export type TipoMovimiento = 'ENTRADA' | 'SALIDA' | 'AJUSTE';

export interface Movimiento {
  id: number;
  tipo: TipoMovimiento;
  cantidad: number;
  fecha: string;
  proveedor?: string;
  motivo?: string;
  productoId: number;
  productNombre: string;
  usuarioEmail: string;
  platoId?: number;
  platoNombre?: string;
}

export interface EntradaRequest {
  productoId: number;
  cantidad: number;
  proveedor: string;
}

export interface SalidaRequest {
  platoId: number;
}

export interface AjusteRequest {
  productoId: number;
  cantidad: number;
  motivo: string;
}
