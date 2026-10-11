import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const superAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (authService.isAuthenticated() && authService.isSuperAdmin()) {
    return true;
  }

  toast.error('This administrative module requires Super Administrator privileges.', 'Access Denied');
  return router.createUrlTree(['/admin/dashboard']);
};
