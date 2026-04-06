import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { inject } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  template: `
    <div class="min-h-screen grid place-items-center p-4">
      <div class="glass w-full max-w-md rounded-3xl shadow-soft p-8">
        <h1 class="text-3xl font-heading font-semibold gradient-text">{{ 'forgotPassword.title' | translate }}</h1>
        <p class="mt-2 text-sm text-slate-500">{{ 'forgotPassword.description' | translate }}</p>

        <form class="mt-6 space-y-4" [formGroup]="form" (ngSubmit)="submit()">
          <input type="email" class="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70" placeholder="Email" formControlName="email" />
          <p *ngIf="error" class="text-sm text-rose-600">{{ error }}</p>
          <p *ngIf="success" class="text-sm text-emerald-700">{{ success }}</p>
          <button [disabled]="loading" class="w-full rounded-xl bg-primary text-white py-3 font-medium hover:opacity-95">
            {{ loading ? ('forgotPassword.generating' | translate) : ('forgotPassword.generate' | translate) }}
          </button>
        </form>

        <div *ngIf="resetToken" class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          <p class="font-medium">{{ 'forgotPassword.useToken' | translate }}</p>
          <p class="mt-1 break-all">{{ resetToken }}</p>
          <a [routerLink]="'/reset-password'" [queryParams]="{ token: resetToken }" class="mt-2 inline-block text-primary font-medium">{{ 'forgotPassword.continueReset' | translate }}</a>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordPageComponent {
  loading = false;
  error = '';
  success = '';
  resetToken = '';
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(
    private readonly http: HttpClient,
    private readonly translate: TranslateService
  ) {}

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';
    this.resetToken = '';

    try {
      const data = await this.http
        .post<{ message?: string; resetToken?: string }>('/api/auth/forgot-password', this.form.getRawValue())
        .toPromise();
      this.success = data?.message || this.translate.instant('forgotPassword.generated');
      this.resetToken = data?.resetToken || '';
    } catch {
      this.error = this.translate.instant('forgotPassword.failed');
    } finally {
      this.loading = false;
    }
  }
}
