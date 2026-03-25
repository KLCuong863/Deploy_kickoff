import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { CommonService } from './common.service';
import { forkJoin, catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutStateService {
  private userService = inject(UserService);
  private commonService = inject(CommonService);
  private router = inject(Router);

  // App State Signals
  user = signal<any>(null);
  permissions = signal<any[]>([]);
  loading = signal<boolean>(false);

  /**
   * Initialize state from session data to avoid initial flicker
   */
  initializeFromSession(sessionData: any) {
    if (sessionData) {
      this.user.set({
        ...sessionData,
        // Ensure name is present, fallback to unknown if not
        name: sessionData.name || 'UNKNOWN_OPERATOR'
      });
      this.permissions.set(sessionData.permissions || []);
      console.log('[LayoutState] Initialized from session');
    }
  }

  /**
   * Fetch initial data for the protected layout
   * @param userId The user ID to fetch
   * @param roleId The role ID for permissions
   */
  refreshState(userId: any, roleId: number) {
    if (this.loading()) return; // Avoid duplicate calls

    this.loading.set(true);
    console.log(`[LayoutState] Refreshing data for userId: ${userId}`);

    forkJoin({
      user: this.userService.getById(userId),
      permissions: this.commonService.getPermissions(roleId)
    }).pipe(
      catchError(err => {
        console.error('[LayoutState] Critical data load failed:', err);
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        }
        return of({ user: null, permissions: [] });
      }),
      tap(() => this.loading.set(false))
    ).subscribe(result => {
      if (result.user) {
        this.user.set(result.user);
        this.permissions.set(result.permissions);
        console.log('[LayoutState] State refreshed successfully');
      }
    });
  }

  /**
   * Clear state on logout
   */
  clearState() {
    this.user.set(null);
    this.permissions.set([]);
    this.loading.set(false);
  }
}
