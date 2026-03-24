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

@Component({
  selector: 'app-vu-viec-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './vu-viec-list.component.html',
})
export class VuViecListComponent implements OnInit {
  private errSvc = inject(ErrorDialogService);

  vuViecs: VuViec[] = [];
  loaiOptions: DanhMucLoaiVuViec[] = [];
  loading = false;
  showModal = false;
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

  // Create form fields
  selectedMucDo: MucDo | '' = '';
  createForm: FormGroup;

  constructor(
    private vuViecService: VuViecService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.createForm = this.fb.group({
      tieu_de: ['', [Validators.required, Validators.maxLength(255)]],
      loai_vu_viec: ['', Validators.required],
      ngay_xay_ra: ['', Validators.required],
      dia_diem: ['', Validators.maxLength(255)],
      mo_ta: ['', [Validators.required, Validators.maxLength(10000)]],
      ghi_chu: ['', Validators.maxLength(500)],
    });
  }

  ngOnInit(): void {
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

  openCreate(): void {
    this.createForm.reset();
    this.selectedMucDo = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.createForm.reset();
    this.selectedMucDo = '';
  }

  selectMucDo(m: MucDo): void { this.selectedMucDo = m; }

  saveVuViec(): void {
    if (this.createForm.invalid || !this.selectedMucDo) {
      this.createForm.markAllAsTouched();
      if (!this.selectedMucDo) {
        this.errSvc.show({ title: 'THIẾU THÔNG TIN', message: 'Vui lòng chọn Mức độ nghiêm trọng.' });
      }
      return;
    }
    const val = this.createForm.value;
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const don_vi_id = user?.departmentId || '';

    this.vuViecService.create({ ...val, muc_do: this.selectedMucDo, don_vi_id }).subscribe({
      next: (created) => {
        this.showToast('Thêm mới vụ việc thành công!');
        this.closeModal();
        if (created?.id) this.router.navigate(['/vu-viec', created.id]);
        else this.loadVuViecs();
      },
      error: (err) => {
        this.errSvc.show({ title: 'TẠO VỤ VIỆC THẤT BẠI', message: err?.error?.error || 'Đã xảy ra lỗi. Vui lòng thử lại.', code: err?.status });
      },
    });
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

  today(): string { return new Date().toISOString().split('T')[0]; }

  padNum(n: number, digits: number): string { return String(n).padStart(digits, '0'); }

  private showToast(msg: string): void {
    this.successMsg = msg;
    setTimeout(() => { this.successMsg = ''; this.cdr.markForCheck(); }, 4000);
  }

  get f() { return this.createForm.controls; }
}
