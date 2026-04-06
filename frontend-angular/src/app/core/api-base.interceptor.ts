import { HttpInterceptorFn } from '@angular/common/http';

export const apiBaseInterceptor: HttpInterceptorFn = (req, next) => {
  if (/^https?:\/\//.test(req.url)) {
    return next(req);
  }

  if (req.url.startsWith('/assets/') || req.url.startsWith('/i18n/')) {
    return next(req);
  }

  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
  const apiUrl = `${protocol}//${host}:8080${req.url.startsWith('/api') ? req.url : `/api${req.url}`}`;
  return next(req.clone({ url: apiUrl }));
};
