import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { UserRole } from '../shared/models';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.user();
  const roles = (route.data['roles'] as UserRole[] | undefined) ?? [];

  if (!user) {
    return router.parseUrl('/login');
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return router.parseUrl('/');
  }

  return true;
};
