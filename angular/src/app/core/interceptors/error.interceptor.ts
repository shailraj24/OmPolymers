import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected network error occurred.';

      if (error.error) {
        if (typeof error.error.message === 'string') {
          errorMessage = error.error.message;
        } else if (Array.isArray(error.error.errors) && error.error.errors.length > 0) {
          errorMessage = error.error.errors[0];
        }
      }

      switch (error.status) {
        case 400:
          toast.error(errorMessage, 'Validation Notice');
          break;
        case 401:
          toast.error('Session expired or unauthorized. Please log in again.', 'Authentication Required');
          authService.logout();
          if (router.url.startsWith('/admin')) {
            router.navigate(['/auth/login'], { queryParams: { returnUrl: router.url } });
          }
          break;
        case 403:
          toast.error('Access restricted. Your current role does not permit this operation.', 'Access Forbidden');
          break;
        case 404:
          toast.error('The requested record or resource was not found.', 'Not Found');
          break;
        case 429:
          toast.error('Rate limit reached. Please wait a minute before making further submissions.', 'Too Many Requests');
          break;
        case 500:
          toast.error('Server encountered an issue. Our engineering team has been notified.', 'Server Error');
          break;
        default:
          toast.error(errorMessage, `HTTP ${error.status || 'Network'} Error`);
          break;
      }

      return throwError(() => error);
    })
  );
};
