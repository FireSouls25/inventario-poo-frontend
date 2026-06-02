export interface OpcionMenu {
  id: number;
  nombre: string;
  ruta: string | null;
  roles: string;
  icono: string;
  orden: number;
  hijos: OpcionMenu[];
}
