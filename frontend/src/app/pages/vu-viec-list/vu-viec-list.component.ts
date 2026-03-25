import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { VuViecService } from '../../core/services/vu-viec.service';
import { AuthService } from '../../core/services/auth.service';
import { VuViec, MUC_DO_LABELS, TRANG_THAI_LABELS } from '../../core/models/vu-viec.model';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vu-viec-list',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, FormsModule],
  templateUrl: './vu-viec-list.component.html',
  styles: [`
    .sl-container {
      padding: 0;
      background-color: var(--sl-bg-main);
      min-height: 100%;
    }

    .sl-header {
      padding: 24px 32px 16px;
    }

    .sl-title {
      font-size: 28px;
      font-weight: 850;
      color: #1a202c;
      letter-spacing: -0.02em;
    }

    /* Filter Bar Styles */
    .sl-filter-bar {
      background: #f1f5f9;
      padding: 24px 32px;
      margin-bottom: 24px;
    }

    .sl-filter-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .sl-filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sl-filter-label {
      font-size: 11px;
      font-weight: 800;
      color: #64748b;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .sl-filter-input, .sl-filter-select {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid transparent;
      border-radius: 4px;
      background: #fff;
      font-size: 13px;
      color: #1e293b;
      outline: none;
      transition: all 0.2s;
    }

    .sl-filter-input:focus, .sl-filter-select:focus {
      border-color: #cbd5e1;
      box-shadow: 0 0 0 2px rgba(0,0,0,0.02);
    }

    .sl-filter-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 24px;
    }

    .sl-btn-reset {
      background: transparent;
      border: none;
      color: #1e293b;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.1em;
      cursor: pointer;
      text-transform: uppercase;
    }

    .sl-btn-filter {
      background: #c3ddfd;
      color: #1e293b;
      border: none;
      padding: 10px 24px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sl-table-content {
      padding: 0 32px 32px;
    }

    .sl-table-wrap {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .sl-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .sl-table th {
      background: #1a202c;
      color: #94a3b8;
      text-align: left;
      padding: 14px 16px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .sl-table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      color: #4b5563;
    }

    .sl-table tr:hover {
      background: #f8fafc;
      cursor: pointer;
    }

    .sl-cell-desc {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .sl-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .badge-cao { background: #fee2e2; color: #ef4444; }
    .badge-tb { background: #fef3c7; color: #d97706; }
    .badge-thap { background: #f1f5f9; color: #64748b; }

    .sl-fab {
      position: fixed;
      bottom: 30px;
      right: 30px;
      padding: 12px 24px;
      border-radius: 6px;
      background-color: #000;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px rgba(0,0,0,0.25);
      cursor: pointer;
      border: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 999;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
      white-space: nowrap;
      gap: 8px;
    }

    .sl-fab:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 25px rgba(0,0,0,0.3);
      background-color: #1a202c;
    }

    .sl-fab-icon {
      font-size: 16px;
      font-weight: 300;
    }
  `]
})
export class VuViecListComponent implements OnInit {
  private vuViecService = inject(VuViecService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private authService = inject(AuthService);

  vuViecs: VuViec[] = [];
  loaiOptions: any[] = [];
  loading = false;
  canCreate = false;
  
  // Filters
  filterLoai = '';
  filterMucDo = '';
  filterTrangThai = '';
  filterDonVi = '';
  filterDate = '';
  errorMessage: string | null = null;

  mucDoLabels = MUC_DO_LABELS;
  trangThaiLabels = TRANG_THAI_LABELS;

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.canCreate = user?.permissions?.includes('CREATE') || false;

    this.loadLookups();
    this.loadVuViecs();
  }

  loadLookups(): void {
    this.vuViecService.getLoaiVuViec().subscribe({
      next: (d) => { this.loaiOptions = d; this.cdr.markForCheck(); },
    });
  }

  loadVuViecs(): void {
    this.loading = true;
    this.errorMessage = null;
    const req = {
      loai: this.filterLoai || undefined,
      mucDo: this.filterMucDo || undefined,
      trangThai: this.filterTrangThai || undefined,
      page: 0, 
      limit: 50
    };
    this.vuViecService.search(req as any).subscribe({
      next: (res) => {
        this.vuViecs = res.content;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        this.vuViecs = [];
        this.errorMessage = err.error?.message || err.message || 'Bạn không có quyền tìm kiếm vụ việc.';
        this.cdr.markForCheck();
      }
    });
  }

  applyFilter(): void {
    this.loadVuViecs();
  }

  resetFilter(): void {
    this.filterLoai = '';
    this.filterMucDo = '';
    this.filterTrangThai = '';
    this.filterDonVi = '';
    this.filterDate = '';
    this.loadVuViecs();
  }

  getMucDoClass(m: string): string {
    if (m === 'CAO') return 'badge-cao';
    if (m === 'TRUNG_BINH') return 'badge-tb';
    return 'badge-thap';
  }

  navigateToDetail(id: string): void {
    this.router.navigate(['/vu-viec', id]);
  }
}
