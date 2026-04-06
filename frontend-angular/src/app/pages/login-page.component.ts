import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  template: `
    <div class="min-h-screen grid place-items-center p-4 md:p-8 page-enter">
      <div class="w-full max-w-6xl overflow-hidden rounded-3xl shadow-card border border-white/50 bg-white/80 dark:bg-slate-900/75 backdrop-blur-md">
        <div class="grid md:grid-cols-2">
          <section class="p-6 sm:p-10 md:p-12 lg:p-14">
            <p class="text-sm font-semibold uppercase tracking-wider text-primary">{{ 'login.access' | translate }}</p>
            <h1 class="mt-2 text-4xl font-heading font-semibold text-slate-900 dark:text-slate-100">{{ 'login.welcomeBack' | translate }}</h1>
            <p class="mt-2 text-slate-600 dark:text-slate-300">{{ 'login.description' | translate }}</p>

            <form class="mt-7 space-y-4" [formGroup]="form" (ngSubmit)="submit()">
              <input class="w-full rounded-lg border border-slate-200 px-4 py-3 bg-slate-100/90 dark:bg-slate-800/80" type="email" [placeholder]="'login.emailPlaceholder' | translate" formControlName="email" />
              <p *ngIf="submitAttempted && form.controls.email.invalid" class="text-xs text-rose-600">Please enter a valid email.</p>

              <input class="w-full rounded-lg border border-slate-200 px-4 py-3 bg-slate-100/90 dark:bg-slate-800/80" type="password" [placeholder]="'login.passwordPlaceholder' | translate" formControlName="password" />
              <p *ngIf="submitAttempted && form.controls.password.invalid" class="text-xs text-rose-600">Password must be at least 6 characters.</p>

              <div class="flex items-center justify-between text-sm">
                <label class="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <input type="checkbox" class="rounded" /> {{ 'login.rememberMe' | translate }}
                </label>
                <a routerLink="/forgot-password" class="text-primary font-medium">{{ 'login.forgotPassword' | translate }}</a>
              </div>

              <p *ngIf="error" class="text-sm text-rose-600">{{ error }}</p>

              <button [disabled]="loading" class="w-full rounded-lg bg-primary text-white py-3 font-medium hover:opacity-95 transition">
                {{ loading ? ('login.signingIn' | translate) : ('login.signIn' | translate) }}
              </button>

              <p class="text-sm text-slate-600 dark:text-slate-300">
                New here?
                <a routerLink="/register" class="text-primary font-medium">Create a new account</a>
              </p>
            </form>
          </section>

          <aside class="hidden md:flex flex-col justify-center p-10 lg:p-14 bg-gradient-to-br from-primary via-blue-500 to-secondary text-white">
            <p class="text-sm uppercase tracking-wider text-white/80">{{ 'login.portal' | translate }}</p>
            <h2 class="mt-3 text-4xl font-heading font-bold leading-tight">{{ 'login.buildCity' | translate }}</h2>
            <p class="mt-5 text-white/90 leading-relaxed max-w-md">{{ 'login.asideDescription' | translate }}</p>
            <a routerLink="/register" class="mt-8 inline-flex items-center justify-center rounded-xl bg-white text-primary px-6 py-3 font-semibold hover:bg-slate-100 transition w-fit">{{ 'login.createAccount' | translate }}</a>
          </aside>
        </div>
      </div>
    </div>
  `
})
export class LoginPageComponent {
  loading = false;
  error = '';
  submitAttempted = false;
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private readonly auth: AuthService,
    private readonly translate: TranslateService
  ) {}

  async submit(): Promise<void> {
    this.submitAttempted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    try {
      const user = await this.auth.login(this.form.getRawValue() as { email: string; password: string });
      const role = String(user.role || '').replace('ROLE_', '');
      const target = role === 'ADMIN' ? '/admin' : role === 'OFFICER' ? '/officer' : '/citizen';
      window.location.href = target;
      return;
    } catch (err: any) {
      this.error = err?.error?.message || this.translate.instant('auth.invalidCredentials');
    } finally {
      this.loading = false;
    }
  }
}
