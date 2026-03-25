import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'vu-viec',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/vu-viec-list/vu-viec-list.component').then((m) => m.VuViecListComponent),
  },
  {
    path: 'vu-viec/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/vu-viec-create/vu-viec-create.component').then((m) => m.VuViecCreateComponent),
  },
  {
    path: 'vu-viec/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/vu-viec-detail/vu-viec-detail.component').then((m) => m.VuViecDetailComponent),
  },
  {
    path: 'reports',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/reports/reports.component').then((m) => m.ReportsComponent),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
  },
  { path: '**', redirectTo: 'dashboard' }
];
