import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { APP_CONSTANTS } from '../constants/app.constant';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken() || 
    (typeof localStorage !== 'undefined' 
      ? (localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN) || localStorage.getItem('om_token') || localStorage.getItem('token'))
      : null);

  // Attach Authorization Bearer token to all administrative, company, and upload routes
  if (token && !req.headers.has('Authorization')) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};

