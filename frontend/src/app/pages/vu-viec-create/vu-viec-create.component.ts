import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VuViecService } from '../../core/services/vu-viec.service';
import { ErrorDialogService } from '../../core/services/error-dialog.service';
import { MucDo, DanhMucLoaiVuViec } from '../../core/models/vu-viec.model';

import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-vu-viec-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, IconComponent],
  templateUrl: './vu-viec-create.component.html',
  styleUrls: ['./vu-viec-create.component.css']
})
export class VuViecCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private vuViecService = inject(VuViecService);
  private errSvc = inject(ErrorDialogService);

  createForm: FormGroup;
  loaiOptions: DanhMucLoaiVuViec[] = [];
  selectedMucDo: MucDo | '' = '';
  files: File[] = [];

  constructor() {
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
  }

  loadLookups(): void {
    this.vuViecService.getLoaiVuViec().subscribe({
      next: (d) => this.loaiOptions = d
    });
  }

  selectMucDo(m: MucDo): void {
    this.selectedMucDo = m;
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.files = Array.from(event.target.files);
    }
  }

  save(): void {
    if (this.createForm.invalid || !this.selectedMucDo) {
      this.createForm.markAllAsTouched();
      return;
    }

    const val = this.createForm.value;
    this.vuViecService.create({ ...val, muc_do: this.selectedMucDo }).subscribe({
      next: (created) => {
        this.router.navigate(['/vu-viec', created.id]);
      },
      error: (err) => {
        this.errSvc.show({ title: 'TẠO VỤ VIỆC THẤT BẠI', message: err?.error?.error || 'Đã xảy ra lỗi.', code: err?.status });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/vu-viec']);
  }

  get f() { return this.createForm.controls; }
}
