export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  rol: 'ADMIN' | 'MESERO' | 'CHEF';
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  email: string;
  rol: string;
  nombre: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
