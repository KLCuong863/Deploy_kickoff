import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <header class="sl-topbar">
      <span class="sl-topbar-brand">SENTINEL_LEDGER</span>
      
      <div class="sl-search">
        <app-icon name="search" [size]="14" class="sl-search-icon"></app-icon>
        <input type="text" placeholder="SEARCH OPERATIONAL DATA...">
      </div>

      <div class="sl-topbar-actions">
        <button class="sl-topbar-icon" title="Notifications">
          <app-icon name="bell" [size]="18"></app-icon>
        </button>
        <button class="sl-topbar-icon" title="Security">
          <app-icon name="shield" [size]="18"></app-icon>
        </button>
        
        <div class="sl-user-pill">
          <div class="sl-avatar">
            <app-icon name="user" [size]="16"></app-icon>
          </div>
        </div>
      </div>
    </header>
  `
})
export class TopbarComponent {}
