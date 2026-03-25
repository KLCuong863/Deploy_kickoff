import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VuViecService } from '../../core/services/vu-viec.service';
import { ErrorDialogService } from '../../core/services/error-dialog.service';
import {
  VuViec, MucDo, TrangThai, DanhMucLoaiVuViec,
  VuViecSearchRequest, MUC_DO_LABELS, TRANG_THAI_LABELS,
} from '../../core/models/vu-viec.model';

import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-vu-viec-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  templateUrl: './vu-viec-list.component.html',
})
export class VuViecListComponent implements OnInit {
  private errSvc = inject(ErrorDialogService);

  vuViecs: VuViec[] = [];
  loaiOptions: DanhMucLoaiVuViec[] = [];
  loading = false;
  successMsg = '';
  totalElements = 0;

  // Filters
  filterSearch = '';
  filterLoai = '';
  filterMucDo = '';
  filterTrangThai = '';

  mucDoOptions: MucDo[] = ['CAO', 'TRUNG_BINH', 'THAP'];
  trangThaiOptions: TrangThai[] = ['MOI', 'DANG_XU_LY', 'CHO_DUYET', 'DA_KET_THUC'];
  mucDoLabels = MUC_DO_LABELS;
  trangThaiLabels = TRANG_THAI_LABELS;

  constructor(
    private vuViecService: VuViecService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadLookups();
    this.loadVuViecs();

    // Check for success messages from navigation
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state?.['success']) {
      this.showToast(state['success']);
    }
  }

  loadLookups(): void {
    this.vuViecService.getLoaiVuViec().subscribe({
      next: (d) => { this.loaiOptions = d; this.cdr.markForCheck(); },
    });
  }

  loadVuViecs(): void {
    this.loading = true;
    const req: VuViecSearchRequest = {
      search: this.filterSearch || undefined,
      loai: this.filterLoai || undefined,
      mucDo: (this.filterMucDo as MucDo) || undefined,
      trangThai: (this.filterTrangThai as TrangThai) || undefined,
      page: 0, limit: 20,
    };
    this.vuViecService.search(req).subscribe({
      next: (page) => {
        this.vuViecs = page.content;
        this.totalElements = page.totalElements;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errSvc.show({ title: 'TẢI DỮ LIỆU THẤT BẠI', message: err?.error?.error || 'Không thể tải danh sách vụ việc.', code: err?.status });
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  applyFilter(): void { this.loadVuViecs(); }
  resetFilter(): void {
    this.filterSearch = ''; this.filterLoai = '';
    this.filterMucDo = ''; this.filterTrangThai = '';
    this.loadVuViecs();
  }

  navigateToDetail(id: string): void { this.router.navigate(['/vu-viec', id]); }

  getMucDoBadge(m: MucDo): string {
    const map: Record<MucDo, string> = { CAO: 'sl-badge sl-badge-cao', TRUNG_BINH: 'sl-badge sl-badge-tb', THAP: 'sl-badge sl-badge-thap' };
    return map[m] ?? 'sl-badge';
  }

  getMucDoLabel(m: MucDo): string {
    const map: Record<MucDo, string> = { CAO: 'CAO', TRUNG_BINH: 'TRUNG BÌNH', THAP: 'THẤP' };
    return map[m];
  }

  getTrangThaiBadge(t: TrangThai): string {
    const map: Record<TrangThai, string> = {
      MOI: 'sl-badge sl-badge-moi', DANG_XU_LY: 'sl-badge sl-badge-xuly',
      CHO_DUYET: 'sl-badge sl-badge-choduyet', DA_KET_THUC: 'sl-badge sl-badge-ketthuc',
    };
    return map[t] ?? 'sl-badge';
  }

  padNum(n: number, digits: number): string { return String(n).padStart(digits, '0'); }

  private showToast(msg: string): void {
    this.successMsg = msg;
    setTimeout(() => { this.successMsg = ''; this.cdr.markForCheck(); }, 4000);
  }
}
