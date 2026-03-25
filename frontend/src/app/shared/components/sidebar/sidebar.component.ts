import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutStateService } from '../../../core/services/layout-state.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <aside class="sl-sidebar">
      <div class="sl-sidebar-user">
        <div class="sl-user-name">{{ layoutState.user()?.name || 'COMMAND_OPERATOR' }}</div>
        <div class="sl-user-role">{{ getRoleName() || 'LEVEL_04_CLEARANCE' }}</div>
      </div>

      <nav class="sl-sidebar-nav">
        <a class="sl-nav-item" routerLink="/dashboard" routerLinkActive="active">
          <div class="sl-nav-icon">
            <app-icon name="dashboard" [size]="18"></app-icon>
          </div>
          <span>Dashboard</span>
        </a>
        <a class="sl-nav-item" routerLink="/vu-viec" routerLinkActive="active">
          <div class="sl-nav-icon">
            <app-icon name="cases" [size]="18"></app-icon>
          </div>
          <span>Cases</span>
        </a>
        <a class="sl-nav-item" routerLink="/reports" routerLinkActive="active">
          <div class="sl-nav-icon">
            <app-icon name="reports" [size]="18"></app-icon>
          </div>
          <span>Reports</span>
        </a>
        <a class="sl-nav-item" routerLink="/settings" routerLinkActive="active">
          <div class="sl-nav-icon">
            <app-icon name="settings" [size]="18"></app-icon>
          </div>
          <span>Settings</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sl-sidebar {
      width: 100%;
      height: 100%;
      background-color: var(--sl-bg-sidebar);
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--sl-border);
    }

    .sl-sidebar-user {
      padding: 40px 24px;
      border-bottom: 1px solid var(--sl-border);
    }

    .sl-user-name {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: var(--sl-text-primary);
      margin-bottom: 6px;
    }

    .sl-user-role {
      font-size: 11px;
      font-weight: 600;
      color: var(--sl-text-secondary);
      letter-spacing: 0.08em;
      opacity: 0.8;
    }

    .sl-sidebar-nav {
      flex: 1;
      padding: 24px 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .sl-nav-item {
      display: flex;
      align-items: center;
      padding: 14px 24px;
      color: var(--sl-text-secondary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      gap: 16px;
      border-right: 4px solid transparent;
    }

    .sl-nav-item:hover {
      background-color: rgba(0,0,0,0.02);
      color: var(--sl-text-primary);
    }

    .sl-nav-item.active {
      background-color: var(--sl-sidebar-active-bg);
      color: var(--sl-sidebar-active-text);
      border-right-color: var(--sl-accent);
    }

    .sl-nav-icon {
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.6;
      transition: opacity 0.2s;
    }

    .active .sl-nav-icon {
      opacity: 1;
    }

  `]
})
export class SidebarComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  protected layoutState = inject(LayoutStateService);

  getRoleName(): string {
    const user = this.layoutState.user() as any;
    if (!user) return '';
    return user.roleId === 1 ? 'ADMINISTRATOR' : 'FIELD_OPERATOR';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
