import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorDialogComponent } from './shared/error-dialog/error-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ErrorDialogComponent],
  template: `
    <div class="sl-layout">
      <!-- Sidebar -->
      <aside class="sl-sidebar">
        <div class="sl-sidebar-logo">
          <div class="sl-logo-icon">🛡️</div>
          <span class="sl-logo-text">SENTINEL</span>
        </div>
        <div class="sl-sidebar-user">
          <div class="sl-user-name">COMMAND_OPERATOR</div>
          <div class="sl-user-role">LEVEL_04_CLEARANCE</div>
        </div>
        <nav class="sl-sidebar-nav">
          <div class="sl-nav-label">Navigation</div>
          <a class="sl-nav-item" routerLink="/dashboard" routerLinkActive="active">
            <svg class="sl-nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </a>
          <a class="sl-nav-item" routerLink="/vu-viec" routerLinkActive="active">
            <svg class="sl-nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Cases
          </a>
          <a class="sl-nav-item" routerLink="/reports" routerLinkActive="active">
            <svg class="sl-nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Reports
          </a>
          <a class="sl-nav-item" routerLink="/settings" routerLinkActive="active">
            <svg class="sl-nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Settings
          </a>
        </nav>
        <div class="sl-sidebar-bottom">
          <button class="sl-new-case-btn" routerLink="/vu-viec/new">
            <span>＋</span> NEW_CASE
          </button>
        </div>
      </aside>

      <!-- Main Area -->
      <div class="sl-main">
        <!-- Top Bar -->
        <header class="sl-topbar">
          <span class="sl-topbar-brand">SENTINEL_LEDGER</span>
          <div class="sl-search">
            <span class="sl-search-icon">🔍</span>
            <input type="text" placeholder="Truy xuất dữ liệu...">
          </div>
          <div class="sl-topbar-actions">
            <button class="sl-topbar-icon" title="Thông báo">🔔</button>
            <button class="sl-topbar-icon" title="Cài đặt">🌐</button>
            <div class="sl-user-pill">
              <div>
                <div class="sl-user-pill-name">CÁN BỘ CHUYÊN TRÁCH</div>
                <div class="sl-user-pill-role">Sư đoàn 304</div>
              </div>
              <div class="sl-avatar">CB</div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <div class="sl-content">
          <router-outlet />
        </div>
      </div>
    </div>

    <!-- Global Error Dialog -->
    <app-error-dialog />
  `,
})
export class App {}
