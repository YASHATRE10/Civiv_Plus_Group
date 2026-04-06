import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));

      if (!isAuthEndpoint && (error.status === 401 || error.status === 403)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      return throwError(() => error);
    })
  );
};
