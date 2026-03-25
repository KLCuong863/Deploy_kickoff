import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; color: #fff;">
      <h2 style="font-weight: 200; letter-spacing: 0.1em;">SENTINEL_DASHBOARD_VOID</h2>
    </div>
  `
})
export class DashboardComponent {}
