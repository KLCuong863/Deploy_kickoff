import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorDialogService } from '../../core/services/error-dialog.service';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (svc.dialog()) {
      <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div class="sl-error-dialog">
          <!-- Header -->
          <div class="sl-error-header">
            <div class="sl-error-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <span class="sl-error-title">{{ svc.dialog()?.title || 'LỖI HỆ THỐNG' }}</span>
            @if (svc.dialog()?.code) {
              <span class="sl-error-code">ERR_{{ svc.dialog()?.code }}</span>
            }
          </div>
          <!-- Body -->
          <div class="sl-error-body">
            <p class="sl-error-msg">{{ svc.dialog()?.message }}</p>
          </div>
          <!-- Footer -->
          <div class="sl-error-footer">
            <button (click)="svc.close()" class="sl-btn-primary">
              XÁC NHẬN ĐÃ NHẬN
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .sl-error-dialog {
      background: #0f172a;
      border: 1px solid #ef4444;
      border-top: 3px solid #ef4444;
      border-radius: 8px;
      width: 420px;
      max-width: 90vw;
      box-shadow: 0 25px 50px rgba(239,68,68,0.2);
      overflow: hidden;
      font-family: 'Inter', sans-serif;
    }
    .sl-error-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 20px;
      background: rgba(239,68,68,0.1);
      border-bottom: 1px solid rgba(239,68,68,0.2);
    }
    .sl-error-icon { color: #ef4444; flex-shrink: 0; }
    .sl-error-title {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #ef4444;
      flex: 1;
    }
    .sl-error-code {
      font-size: 10px;
      color: #6b7280;
      letter-spacing: 0.05em;
      font-family: monospace;
    }
    .sl-error-body {
      padding: 20px;
    }
    .sl-error-msg {
      color: #cbd5e1;
      font-size: 14px;
      line-height: 1.6;
      margin: 0;
    }
    .sl-error-footer {
      padding: 14px 20px;
      border-top: 1px solid #1e293b;
      display: flex;
      justify-content: flex-end;
    }
    .sl-btn-primary {
      background: #1e293b;
      border: 1px solid #334155;
      color: #94a3b8;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      padding: 8px 18px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .sl-btn-primary:hover {
      background: #ef4444;
      border-color: #ef4444;
      color: white;
    }
  `]
})
export class ErrorDialogComponent {
  svc = inject(ErrorDialogService);
}
