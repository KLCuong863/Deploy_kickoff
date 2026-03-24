import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'vu-viec', pathMatch: 'full' },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/user-list/user-list.component').then((m) => m.UserListComponent),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./pages/task-list/task-list.component').then((m) => m.TaskListComponent),
  },
  {
    path: 'tasks/:id',
    loadComponent: () =>
      import('./pages/task-detail/task-detail.component').then((m) => m.TaskDetailComponent),
  },
  {
    path: 'vu-viec',
    loadComponent: () =>
      import('./pages/vu-viec-list/vu-viec-list.component').then((m) => m.VuViecListComponent),
  },
  {
    path: 'vu-viec/:id',
    loadComponent: () =>
      import('./pages/vu-viec-detail/vu-viec-detail.component').then((m) => m.VuViecDetailComponent),
  },
  { path: '**', redirectTo: 'vu-viec' },
];
