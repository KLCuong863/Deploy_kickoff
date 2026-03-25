import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VuViecService } from '../../core/services/vu-viec.service';
import { ErrorDialogService } from '../../core/services/error-dialog.service';
import {
  VuViec, VuViecStatusLog, TrangThai,
  STATUS_TRANSITIONS, TRANG_THAI_LABELS, MUC_DO_LABELS, MucDo,
} from '../../core/models/vu-viec.model';

import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-vu-viec-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent],
  templateUrl: './vu-viec-detail.component.html',
})
export class VuViecDetailComponent implements OnInit {
  private errSvc = inject(ErrorDialogService);

  vuViec: VuViec | null = null;
  statusLogs: VuViecStatusLog[] = [];
  loading = true;
  successMsg = '';
  activeTab: 'info' | 'files' | 'log' = 'info';

  showStatusModal = false;
  allowedNextStatuses: TrangThai[] = [];
  statusForm: FormGroup;

  trangThaiLabels = TRANG_THAI_LABELS;
  mucDoLabels = MUC_DO_LABELS;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vuViecService: VuViecService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.statusForm = this.fb.group({
      sang_trang_thai: ['', Validators.required],
      ly_do: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadDetail(id);
  }

  loadDetail(id: string): void {
    this.loading = true;
    this.vuViecService.getById(id).subscribe({
      next: (v) => {
        this.vuViec = v;
        this.loading = false;
        this.cdr.markForCheck();
        this.loadLogs(id);
      },
      error: (err) => {
        this.errSvc.show({ title: 'KHÔNG TÌM THẤY', message: err?.error?.error || 'Không tìm thấy vụ việc.', code: 404 });
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  loadLogs(id: string): void {
    this.vuViecService.getStatusLogs(id).subscribe({
      next: (logs) => { this.statusLogs = logs; this.cdr.markForCheck(); },
    });
  }

  openStatusModal(): void {
    if (!this.vuViec) return;
    this.allowedNextStatuses = STATUS_TRANSITIONS[this.vuViec.trangThai] ?? [];
    this.statusForm.reset();
    this.showStatusModal = true;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.statusForm.reset();
  }

  confirmStatusChange(): void {
    if (this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      return;
    }
    const id = this.vuViec!.id!;
    this.vuViecService.changeStatus(id, this.statusForm.value).subscribe({
      next: () => {
        this.showToast('Chuyển trạng thái thành công!');
        this.closeStatusModal();
        this.loadDetail(id);
      },
      error: (err) => {
        this.errSvc.show({ title: 'CHUYỂN TRẠNG THÁI THẤT BẠI', message: err?.error?.error || 'Đã xảy ra lỗi khi chuyển trạng thái.', code: err?.status });
      },
    });
  }

  getMucDoBadge(m: MucDo): string {
    const map: Record<MucDo, string> = { CAO: 'sl-badge sl-badge-cao', TRUNG_BINH: 'sl-badge sl-badge-tb', THAP: 'sl-badge sl-badge-thap' };
    return map[m] ?? 'sl-badge';
  }

  getTrangThaiBadge(t: TrangThai): string {
    const map: Record<TrangThai, string> = {
      MOI: 'sl-badge sl-badge-moi', DANG_XU_LY: 'sl-badge sl-badge-xuly',
      CHO_DUYET: 'sl-badge sl-badge-choduyet', DA_KET_THUC: 'sl-badge sl-badge-ketthuc',
    };
    return map[t] ?? 'sl-badge';
  }

  canChangeStatus(): boolean {
    if (!this.vuViec) return false;
    return (STATUS_TRANSITIONS[this.vuViec.trangThai] ?? []).length > 0;
  }

  setTab(t: 'info' | 'files' | 'log'): void { this.activeTab = t; }

  goBack(): void { this.router.navigate(['/vu-viec']); }

  formatDate(val: string | undefined): string {
    return val ? val.split('T')[0] : '—';
  }

  private showToast(msg: string): void {
    this.successMsg = msg;
    setTimeout(() => { this.successMsg = ''; this.cdr.markForCheck(); }, 4000);
  }

  get sf() { return this.statusForm.controls; }
}
