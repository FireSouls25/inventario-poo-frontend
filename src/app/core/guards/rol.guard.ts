import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

const roleHome: Record<string, string> = {
  ADMIN: '/dashboard',
  CHEF: '/stock',
  MESERO: '/menu',
};

export const rolGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as string[];
  const userRol = auth.rol();

  if (allowedRoles?.includes(userRol ?? '')) {
    return true;
  }

  const home = userRol ? roleHome[userRol] || '/auth/login' : '/auth/login';
  return router.parseUrl(home);
};
