import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonService } from '../../core/services/common.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { LayoutStateService } from '../../core/services/layout-state.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IconComponent, RouterLink],
  template: `
    <div class="sl-profile-container">
      <div class="sl-profile-card">
        <!-- Close Button - Improved Visibility -->
        <a routerLink="/dashboard" class="sl-close-btn" title="CLOSE_OPERATIONAL_FILE">
          <app-icon name="x" [size]="24"></app-icon>
        </a>

        <div class="sl-profile-header">
          <div class="sl-profile-avatar-large">
             <img *ngIf="userSignal()?.avatar; else defaultIcon" [src]="userSignal().avatar" class="sl-avatar-img" />
             <ng-template #defaultIcon>
                <div class="sl-default-avatar-icon">
                  <app-icon name="user" [size]="48"></app-icon>
                </div>
             </ng-template>
          </div>
          <div class="sl-profile-title" *ngIf="userSignal() as user">
            <h1 class="sl-profile-name">{{ user.name || 'UNKNOWN_OPERATOR' }}</h1>
            <p class="sl-profile-status">PERSONNEL_FILE :: {{ user.status || 'ACTIVE' }}</p>
          </div>
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="sl-profile-form">
          <div class="sl-form-grid">
            <div class="sl-form-group">
              <label>FULL NAME (EDITABLE)</label>
              <input type="text" formControlName="name" placeholder="Enter Full Name">
              <div class="sl-hint">OPERATIONAL ALIAS FOR THE SYSTEM</div>
            </div>

            <div class="sl-form-group">
              <label>EMAIL ADDRESS (READ-ONLY)</label>
              <input type="text" [value]="userSignal()?.email || 'N/A'" disabled>
            </div>

            <div class="sl-form-group">
              <label>DEPARTMENT / UNIT (READ-ONLY)</label>
              <input type="text" [value]="getDepartmentName()" disabled>
            </div>

            <div class="sl-form-group">
              <label>CLEARANCE / RANK (READ-ONLY)</label>
              <input type="text" [value]="getRankName()" disabled>
            </div>
          </div>

          <div class="sl-profile-footer">
            <button type="submit" class="sl-save-btn" [disabled]="loading || !profileForm.dirty">
              {{ loading ? 'ENCRYPTION_IN_PROGRESS...' : 'SAVE_DATA_CHANGES' }}
            </button>
            <p *ngIf="successMessage" class="sl-success-msg">{{ successMessage }}</p>
            <p *ngIf="errorMessage" class="sl-error-msg">{{ errorMessage }}</p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .sl-profile-container {
      max-width: 840px;
      margin: 60px auto;
      padding: 0 24px;
    }

    .sl-profile-card {
      background-color: #ffffff; /* Use white for card to match user screenshot */
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 50px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.1);
      position: relative;
    }

    .sl-close-btn {
      position: absolute;
      top: 24px;
      right: 24px;
      color: #64748b;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: #f1f5f9;
      border: 1px solid #e2e8f0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      z-index: 10;
    }

    .sl-close-btn:hover {
      background-color: #fee2e2;
      color: #ef4444;
      transform: rotate(90deg);
      border-color: #fecaca;
    }

    .sl-profile-header {
      display: flex;
      align-items: center;
      gap: 32px;
      margin-bottom: 48px;
    }

    .sl-profile-avatar-large {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background-color: #1a202c; /* Military Dark */
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }

    .sl-default-avatar-icon {
      color: #ffffff;
    }

    .sl-avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .sl-profile-name {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0;
      color: #1a202c;
    }

    .sl-profile-status {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: #64748b;
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sl-profile-status::before {
      content: "";
      width: 8px;
      height: 8px;
      background-color: #10b981;
      border-radius: 50%;
      display: inline-block;
    }

    .sl-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }

    .sl-form-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .sl-form-group label {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: #64748b;
    }

    .sl-form-group input {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 16px;
      border-radius: 8px;
      color: #1e293b;
      font-size: 15px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .sl-form-group input:focus:not(:disabled) {
      outline: none;
      border-color: #1a202c;
      background-color: #ffffff;
      box-shadow: 0 0 0 4px rgba(26, 32, 44, 0.05);
    }

    .sl-form-group input:disabled {
      background-color: #f1f5f9;
      color: #94a3b8;
      cursor: not-allowed;
    }

    .sl-hint {
      font-size: 10px;
      color: #94a3b8;
      font-weight: 600;
    }

    .sl-profile-footer {
      margin-top: 48px;
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .sl-save-btn {
      padding: 18px 40px;
      background-color: #1a202c;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.1em;
      cursor: pointer;
      transition: all 0.2s;
    }

    .sl-save-btn:hover:not(:disabled) {
      background-color: #2d3748;
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }

    .sl-save-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .sl-success-msg {
      color: #059669;
      font-size: 14px;
      font-weight: 700;
    }

    .sl-error-msg {
      color: #dc2626;
      font-size: 14px;
      font-weight: 700;
    }
  `]
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private commonService = inject(CommonService);
  private layoutState = inject(LayoutStateService);

  profileForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]]
  });

  // Expose the layoutState user signal directly for template reactivity
  userSignal = this.layoutState.user;

  departments: any[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    // Synchronize form when user signal updates
    effect(() => {
      const user = this.userSignal();
      if (user && !this.profileForm.dirty) {
        this.profileForm.patchValue({ name: user.name }, { emitEvent: false });
      }
    });
  }

  ngOnInit() {
    const cachedUser = this.authService.getUser();
    if (cachedUser) {
      this.loadFullUserInfo(cachedUser.id);
    }
    this.loadDepartments();
  }

  loadDepartments() {
    this.commonService.getDepartments().subscribe({
      next: (deps) => {
        console.log('[Profile] Departments loaded:', deps);
        this.departments = deps;
      },
      error: (err) => console.error('Failed to load departments', err)
    });
  }

  getDepartmentName(): string {
    const user = this.userSignal();
    const deptId = user?.departmentId;
    if (!deptId || !this.departments.length) return 'ASIGNING...';
    
    const dept = this.departments.find(d => d.id === deptId || d.name === deptId);
    return dept ? dept.name : `UNIT_ID: ${deptId.toString().substring(0, 8)}...`;
  }

  getRankName(): string {
    const user = this.userSignal();
    if (!user) return 'UNAUTHORIZED';
    return user.roleId === 1 ? 'ADMINISTRATOR' : 'FIELD_OPERATOR';
  }

  loadFullUserInfo(userId: string | number) {
    this.userService.getById(userId).subscribe({
      next: (user) => {
        console.log('[Profile] Full user data loaded:', user);
        this.layoutState.user.set(user);
      },
      error: (err) => console.error('Failed to load full user info', err)
    });
  }

  onSubmit() {
    const currentUser = this.userSignal();
    if (this.profileForm.valid && currentUser) {
      this.loading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const updatedUser = { ...currentUser, name: this.profileForm.value.name };
      
      this.userService.update(currentUser.id, updatedUser).subscribe({
        next: (res) => {
          this.loading = false;
          this.successMessage = 'DATA_SYNC_PROCESSED_SUCCESSFULLY';
          
          // Update persistent storage
          const sessionUser = this.authService.getUser();
          this.authService.saveSession(
            { ...sessionUser, name: updatedUser.name }, 
            localStorage.getItem('rememberMe') === 'true'
          );
          
          // Trigger signal update for global reactivity
          this.layoutState.user.set(updatedUser);
          this.profileForm.markAsPristine();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = 'TRANSMISSION_FAILED: ENCRYPTION_ERROR';
          console.error('[Profile] Save failed:', err);
        }
      });
    }
  }
}
