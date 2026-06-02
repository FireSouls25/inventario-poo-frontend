import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/api/auth/')) {
        const refreshToken = auth.getRefreshToken();
        if (refreshToken) {
          return auth.refresh({ refreshToken }).pipe(
            switchMap(() => {
              const newToken = auth.getToken();
              const cloned = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(cloned);
            }),
            catchError(() => {
              auth.logout();
              router.navigate(['/auth/login']);
              return throwError(() => error);
            })
          );
        }
      }
      if (error.status === 403 && !req.url.includes('/api/auth/')) {
        auth.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
