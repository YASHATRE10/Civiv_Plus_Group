import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { inject } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="min-h-screen grid place-items-center p-4">
      <div class="glass w-full max-w-md rounded-3xl shadow-soft p-8">
        <h1 class="text-3xl font-heading font-semibold gradient-text">{{ 'resetPassword.title' | translate }}</h1>
        <p class="mt-2 text-sm text-slate-500">{{ 'resetPassword.description' | translate }}</p>

        <form class="mt-6 space-y-4" [formGroup]="form" (ngSubmit)="submit()">
          <input class="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70" [placeholder]="'resetPassword.token' | translate" formControlName="token" />
          <input type="password" class="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70" [placeholder]="'resetPassword.newPassword' | translate" formControlName="newPassword" />
          <input type="password" class="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70" [placeholder]="'resetPassword.confirmPassword' | translate" formControlName="confirmPassword" />

          <p *ngIf="error" class="text-sm text-rose-600">{{ error }}</p>
          <p *ngIf="success" class="text-sm text-emerald-700">{{ success }}</p>

          <button [disabled]="loading" class="w-full rounded-xl bg-primary text-white py-3 font-medium hover:opacity-95">
            {{ loading ? ('resetPassword.resetting' | translate) : ('resetPassword.reset' | translate) }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class ResetPasswordPageComponent {
  loading = false;
  error = '';
  success = '';
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    token: ['', [Validators.required, Validators.minLength(20)]],
    newPassword: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/)
      ]
    ],
    confirmPassword: ['', [Validators.required]]
  });

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly translate: TranslateService
  ) {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.form.patchValue({ token });
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { token, newPassword, confirmPassword } = this.form.getRawValue();
    if (newPassword !== confirmPassword) {
      this.error = this.translate.instant('resetPassword.passwordMismatch');
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    try {
      await this.http.post('/api/auth/reset-password', { token, newPassword }).toPromise();
      this.success = this.translate.instant('resetPassword.success');
      setTimeout(() => {
        this.router.navigateByUrl('/login');
      }, 1000);
    } catch {
      this.error = this.translate.instant('resetPassword.failed');
    } finally {
      this.loading = false;
    }
  }
}
