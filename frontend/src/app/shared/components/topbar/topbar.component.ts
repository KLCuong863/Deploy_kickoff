import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, IconComponent, RouterLink],
  template: `
    <header class="sl-topbar">
      <div class="sl-topbar-left">
        <span class="sl-brand">SENTINEL_LEDGER</span>
      </div>
      
      <div class="sl-topbar-center">
        <div class="sl-search">
          <app-icon name="search" [size]="14" class="sl-search-icon"></app-icon>
          <input type="text" placeholder="SEARCH OPERATIONAL DATA...">
        </div>
      </div>

      <div class="sl-topbar-right">
        <button class="sl-action-btn">
          <app-icon name="bell" [size]="18"></app-icon>
        </button>
        <button class="sl-action-btn">
          <app-icon name="lock-secure" [size]="18"></app-icon>
        </button>
        
        <div class="sl-user-profile-container">
          <div class="sl-user-trigger" (click)="toggleMenu($event)">
            <div class="sl-user-avatar">
              <img *ngIf="user?.avatar; else defaultIcon" [src]="user.avatar" class="sl-avatar-img" />
              <ng-template #defaultIcon>
                <app-icon name="user" [size]="18" style="color: white;"></app-icon>
              </ng-template>
            </div>
            <div class="sl-user-info" *ngIf="user">
              <span class="sl-user-name">{{ user.name }}</span>
            </div>
          </div>

          <!-- Dropdown Menu -->
          <div class="sl-dropdown-menu" *ngIf="isMenuOpen">
            <a class="sl-dropdown-item" routerLink="/profile" (click)="isMenuOpen = false">
              <app-icon name="edit" [size]="14"></app-icon>
              <span>Chỉnh sửa thông tin cá nhân</span>
            </a>
            <div class="sl-dropdown-divider"></div>
            <a class="sl-dropdown-item logout" (click)="logout()">
              <app-icon name="logout" [size]="14"></app-icon>
              <span>Đăng xuất</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .sl-topbar {
      height: 64px;
      background-color: var(--sl-bg-header);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      color: var(--sl-header-text);
      z-index: 100;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }

    .sl-brand {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.15em;
    }

    .sl-topbar-center {
      flex: 1;
      display: flex;
      justify-content: center;
      max-width: 600px;
    }

    .sl-search {
      width: 100%;
      background-color: rgba(255,255,255,0.05);
      border-radius: 4px;
      display: flex;
      align-items: center;
      padding: 8px 16px;
      transition: background-color 0.2s;
    }

    .sl-search:focus-within {
      background-color: rgba(255,255,255,0.1);
    }

    .sl-search input {
      background: none;
      border: none;
      color: white;
      font-size: 11px;
      letter-spacing: 0.05em;
      width: 100%;
      margin-left: 10px;
      outline: none;
    }

    .sl-search input::placeholder {
      color: rgba(255,255,255,0.3);
    }

    .sl-topbar-right {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .sl-action-btn {
      background: none;
      border: none;
      color: var(--sl-header-text);
      opacity: 0.7;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      transition: opacity 0.2s;
    }

    .sl-action-btn:hover {
      opacity: 1;
    }

    .sl-user-profile-container {
      position: relative;
    }

    .sl-user-trigger {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    
    .sl-user-trigger:hover {
      opacity: 0.8;
    }

    .sl-user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .sl-user-name {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: var(--sl-header-text);
    }

    .sl-user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .sl-avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Dropdown Animation */
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .sl-dropdown-menu {
      position: absolute;
      top: 120%;
      right: 0;
      width: 240px;
      background-color: var(--sl-bg-sidebar);
      border: 1px solid var(--sl-border);
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      z-index: 1000;
      padding: 8px;
      animation: slideDown 0.2s ease-out;
    }

    .sl-dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: var(--sl-text-secondary);
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .sl-dropdown-item:hover {
      background-color: rgba(255,255,255,0.05);
      color: var(--sl-text-primary);
    }

    .sl-dropdown-item.logout {
      color: #fc8181;
    }

    .sl-dropdown-item.logout:hover {
      background-color: rgba(252, 129, 129, 0.1);
    }

    .sl-dropdown-divider {
      height: 1px;
      background-color: var(--sl-border);
      margin: 8px 0;
    }
  `]
})
export class TopbarComponent {
  @Input() user: any;
  private authService = inject(AuthService);
  private router = inject(Router);

  isMenuOpen = false;

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen = false;
    this.router.navigate(['/login'], { queryParams: { logout: 'success' } });
  }

  constructor() {
    // Basic click-outside listener
    window.addEventListener('click', () => {
      this.isMenuOpen = false;
    });
  }
}
