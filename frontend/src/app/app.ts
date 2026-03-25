import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorDialogComponent } from './shared/error-dialog/error-dialog.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { TopbarComponent } from './shared/components/topbar/topbar.component';
import { AuthService } from './core/services/auth.service';
import { LayoutStateService } from './core/services/layout-state.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    CommonModule, 
    ErrorDialogComponent,
    SidebarComponent,
    TopbarComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  layoutState = inject(LayoutStateService);

  isSidebarVisible = false;

  ngOnInit() {
    this.checkSessionAndLoad();

    // Watch for navigation events to handle route shifts and data loading
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkSessionAndLoad();
    });
  }

  checkSessionAndLoad() {
    if (this.authService.isLoggedIn()) {
      const currentUser = this.authService.getUser();
      
      // Initialize layout state from stored session data immediately
      if (currentUser && !this.layoutState.user()) {
        this.layoutState.initializeFromSession(currentUser);
      }

      // Periodically refresh full state from server if we have an ID
      if (currentUser && currentUser.id) {
        this.layoutState.refreshState(currentUser.id, currentUser.roleId || 1);
      }
      
      if (this.isLoginPage()) {
        this.router.navigate(['/dashboard']);
      }
    } else {
      if (!this.isLoginPage()) {
        this.router.navigate(['/login']);
        this.layoutState.clearState();
      }
    }
  }

  toggleSidebar(visible: boolean) {
    this.isSidebarVisible = visible;
  }

  isLoginPage(): boolean {
    return this.router.url.includes('/login');
  }
}
