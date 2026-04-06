import { HttpInterceptorFn } from '@angular/common/http';
import { apiBaseInterceptor } from './api-base.interceptor';

const AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password'
];

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));

  let request = req;
  if (token && !isAuthEndpoint) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return apiBaseInterceptor(request, next);
};
