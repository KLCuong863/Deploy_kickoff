import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AuthService } from './core/services/auth.service';
import { ErrorDialogService } from './core/services/error-dialog.service';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        // Auth Interceptor
        (req, next) => {
          const authService = inject(AuthService);
          const token = authService.getToken();
          if (token) {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }
          return next(req);
        },
        // Global Error Interceptor
        (req, next) => {
          const errorService = inject(ErrorDialogService);
          const router = inject(Router);
          const authService = inject(AuthService);

          return next(req).pipe(
            catchError((error: HttpErrorResponse) => {
              let message = 'An unexpected error occurred';
              let title = 'Hệ thống lỗi';

              if (error.error instanceof ErrorEvent) {
                // Client-side error
                message = error.error.message;
              } else {
                // Server-side error
                message = error.error?.message || error.error?.error || error.message;
                
                if (error.status === 401) {
                  title = 'Phiên làm việc hết hạn';
                  message = 'Vui lòng đăng nhập lại để tiếp tục';
                  authService.logout();
                  router.navigate(['/login']);
                } else if (error.status === 403) {
                  title = 'Không có quyền truy cập';
                  message = 'Bạn không có quyền thực hiện hành động này';
                } else if (error.status === 404) {
                  title = 'Không tìm thấy';
                  message = 'Dữ liệu yêu cầu không tồn tại';
                }
              }

              // Skip global dialog for auth and vu-viec list endpoints to allow local component handling
              const isAuthEndpoint = req.url.includes('/api/v1/auth/');
              const isVuViecList = req.url.includes('/api/vu-viec') && req.method === 'GET';
              
              if (!isAuthEndpoint && !isVuViecList) {
                errorService.show({ title, message, code: error.status });
              }
              
              return throwError(() => error);
            })
          );
        }
      ])
    ),
    provideClientHydration(withEventReplay()),
  ],
};
