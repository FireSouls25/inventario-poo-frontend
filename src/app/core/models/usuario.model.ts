export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'MESERO' | 'CHEF';
  activo: boolean;
}

export interface UsuarioRequest {
  nombre: string;
  email: string;
  password: string;
  rol: 'ADMIN' | 'MESERO' | 'CHEF';
}
