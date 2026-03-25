import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { AuthService } from '../../core/services/auth.service';
import { CommonService } from '../../core/services/common.service';
import { ErrorDialogService } from '../../core/services/error-dialog.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IconComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private commonService = inject(CommonService);
  private errorService = inject(ErrorDialogService);

  isLoginMode: boolean = true;
  showPassword: boolean = false;
  errorMessage: string | null = null;

  roles: any[] = [];
  units: any[] = [];
  loading: boolean = false;

  constructor() {
    this.loadLookups();
  }

  loadLookups() {
    this.commonService.getRoles().subscribe({
      next: (roles) => this.roles = roles,
      error: (err) => console.error('Failed to load roles', err)
    });
    this.commonService.getDepartments().subscribe({
      next: (units) => this.units = units,
      error: (err) => console.error('Failed to load units', err)
    });
  }

  clearError() {
    this.errorMessage = null;
  }

  onPositionChange() {
    const unitControl = this.registerForm.get('don_vi');
    if (this.showUnitField) {
      unitControl?.setValidators([Validators.required]);
    } else {
      unitControl?.clearValidators();
      unitControl?.setValue('');
    }
    unitControl?.updateValueAndValidity();
    this.clearError();
  }

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    vi_tri: ['', [Validators.required]],
    don_vi: ['']
  });

  unitsMock = ['Sư đoàn 304', 'Bộ Tham mưu', 'Cục Tác chiến', 'Viện Kỹ thuật Quân sự', 'Bộ Tư lệnh Thông tin'];

  get showUnitField(): boolean {
    const vt = (this.registerForm.get('vi_tri')?.value || '').toUpperCase();
    // Roles that need a unit: CBTT, Manager, or containing "Trưởng phòng"
    return vt.includes('CBTT') || vt.includes('MANAGER') || vt.includes('TRƯỞNG PHÒNG');
  }

  setMode(mode: 'login' | 'register') {
    this.isLoginMode = mode === 'login';
    this.errorMessage = null;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.isLoginMode) {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }

  private handleLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.loading = false;
          localStorage.setItem('currentUser', JSON.stringify(res.data));
          localStorage.setItem('token', res.data.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          // The backend returns the message in the "error" field for 401 Unauthorized
          this.errorMessage = err.error?.error || err.error?.message || 'Email hoặc mật khẩu không chính xác';
          this.errorService.show({ title: 'Đăng nhập thất bại', message: this.errorMessage || '' });
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Vui lòng nhập đầy đủ email và mật khẩu đúng định dạng.';
    }
  }

  private handleRegister() {
    if (this.registerForm.valid) {
      this.loading = true;
      // Map frontend fields to RegisterRequest DTO
      const payload = {
        name: this.registerForm.value.fullName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        role: this.registerForm.value.vi_tri,
        department: this.registerForm.value.don_vi
      };

      this.authService.register(payload).subscribe({
        next: (res) => {
          this.loading = false;
          // Automatic login after successful registration
          localStorage.setItem('currentUser', JSON.stringify(res.data));
          localStorage.setItem('token', res.data.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.error || err.error?.message || 'Không thể tạo tài khoản. Vui lòng kiểm tra lại thông tin.';
          this.errorService.show({ title: 'Lỗi đăng ký', message: this.errorMessage || '' });
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Vui lòng hoàn thiện tất cả các trường thông tin bắt buộc.';
    }
  }
}
