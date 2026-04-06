import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

export const roleRedirectGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.user();

  if (!user) {
    return router.parseUrl('/login');
  }

  if (user.role === 'ADMIN') {
    return router.parseUrl('/admin');
  }

  if (user.role === 'OFFICER') {
    return router.parseUrl('/officer');
  }

  return router.parseUrl('/citizen');
};
