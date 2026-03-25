import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <aside class="sl-sidebar">
      <div class="sl-sidebar-logo">
        <div class="sl-logo-icon">
          <app-icon name="shield" [size]="20" [strokeWidth]="2.5"></app-icon>
        </div>
        <span class="sl-logo-text">SENTINEL_LEDGER</span>
      </div>
      
      <div class="sl-sidebar-user">
        <div class="sl-user-name">COMMAND_OPERATOR</div>
        <div class="sl-user-role">LEVEL_04_CLEARANCE</div>
      </div>

      <nav class="sl-sidebar-nav">
        <!-- Main Nav -->
        <a class="sl-nav-item" routerLink="/dashboard" routerLinkActive="active">
          <app-icon name="dashboard" class="sl-nav-icon"></app-icon>
          Dashboard
        </a>
        <a class="sl-nav-item" routerLink="/vu-viec" routerLinkActive="active">
          <app-icon name="cases" class="sl-nav-icon"></app-icon>
          Cases
        </a>
        <a class="sl-nav-item" routerLink="/reports" routerLinkActive="active">
          <app-icon name="reports" class="sl-nav-icon"></app-icon>
          Reports
        </a>
        <a class="sl-nav-item" routerLink="/settings" routerLinkActive="active">
          <app-icon name="settings" class="sl-nav-icon"></app-icon>
          Settings
        </a>

        <!-- Bottom Actions -->
        <a class="sl-nav-item logout-link" (click)="logout()">
          <app-icon name="logout" class="sl-nav-icon"></app-icon>
          Sign Out
        </a>
      </nav>

      <div class="sl-sidebar-bottom">
        <button class="sl-new-case-btn" routerLink="/vu-viec/new">
          NEW_CASE
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .logout-link { margin-top: auto; border-top: 1px solid var(--sl-border); padding-top: 16px; }
  `]
})
export class SidebarComponent {
  private router = inject(Router);

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
