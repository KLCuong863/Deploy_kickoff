import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sl-placeholder-page">
      <h1>Settings</h1>
    </div>
  `,
  styles: [`
    .sl-placeholder-page {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ffffff;
    }
    h1 {
      font-size: 24px;
      font-weight: 300;
      letter-spacing: 0.1em;
      color: #1a202c;
      text-transform: uppercase;
    }
  `]
})
export class SettingsComponent {}
