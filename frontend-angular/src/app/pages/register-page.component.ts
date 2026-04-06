import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  template: `
    <div class="min-h-screen grid place-items-center p-4 md:p-8 page-enter">
      <div class="w-full max-w-6xl overflow-hidden rounded-3xl shadow-card border border-white/50 bg-white/80 dark:bg-slate-900/75 backdrop-blur-md">
        <div class="grid md:grid-cols-2">
          <aside class="hidden md:flex flex-col justify-center p-10 lg:p-14 bg-gradient-to-br from-secondary via-emerald-500 to-primary text-white">
            <p class="text-sm uppercase tracking-wider text-white/80">{{ 'register.join' | translate }}</p>
            <h2 class="mt-3 text-4xl font-heading font-bold leading-tight">{{ 'register.title' | translate }}</h2>
            <a routerLink="/login" class="mt-8 inline-flex items-center justify-center rounded-xl bg-white text-primary px-6 py-3 font-semibold hover:bg-slate-100 transition w-fit">{{ 'register.alreadyAccount' | translate }}</a>
          </aside>

          <section class="p-6 sm:p-10 md:p-12 lg:p-14">
            <h1 class="mt-2 text-4xl font-heading font-semibold text-slate-900 dark:text-slate-100">{{ 'register.createAccount' | translate }}</h1>
            <form class="mt-7 space-y-3" [formGroup]="form" (ngSubmit)="submit()">
              <input class="w-full rounded-lg border border-slate-200 px-4 py-2.5 bg-slate-100/90 dark:bg-slate-800/80" [placeholder]="'register.fullName' | translate" formControlName="name" />
              <p *ngIf="submitAttempted && form.controls.name.invalid" class="text-xs text-rose-600">Please enter your full name.</p>

              <input class="w-full rounded-lg border border-slate-200 px-4 py-2.5 bg-slate-100/90 dark:bg-slate-800/80" [placeholder]="'register.email' | translate" formControlName="email" type="email" />
              <p *ngIf="submitAttempted && form.controls.email.invalid" class="text-xs text-rose-600">Please enter a valid email.</p>

              <input class="w-full rounded-lg border border-slate-200 px-4 py-2.5 bg-slate-100/90 dark:bg-slate-800/80" [placeholder]="'register.phone' | translate" formControlName="phone" />
              <p *ngIf="submitAttempted && form.controls.phone.invalid" class="text-xs text-rose-600">Phone number must be 10 digits.</p>

              <input class="w-full rounded-lg border border-slate-200 px-4 py-2.5 bg-slate-100/90 dark:bg-slate-800/80" [placeholder]="'register.password' | translate" formControlName="password" type="password" />
              <p *ngIf="submitAttempted && form.controls.password.invalid" class="text-xs text-rose-600">Use 8-64 chars with uppercase, lowercase, number and special character.</p>

              <div class="grid grid-cols-2 gap-3">
                <button type="button" (click)="form.patchValue({ role: 'CITIZEN' })" class="rounded-lg border px-4 py-3 text-sm font-medium transition" [ngClass]="form.value.role === 'CITIZEN' ? 'bg-primary text-white border-primary shadow-soft' : 'bg-slate-100/90 border-slate-200 text-slate-700'">{{ 'register.citizen' | translate }}</button>
                <button type="button" (click)="form.patchValue({ role: 'OFFICER' })" class="rounded-lg border px-4 py-3 text-sm font-medium transition" [ngClass]="form.value.role === 'OFFICER' ? 'bg-primary text-white border-primary shadow-soft' : 'bg-slate-100/90 border-slate-200 text-slate-700'">{{ 'register.officer' | translate }}</button>
              </div>

              <p *ngIf="error" class="text-sm text-rose-600">{{ error }}</p>
              <p *ngIf="success" class="text-sm text-emerald-700">{{ success }}</p>

              <button class="w-full rounded-lg bg-primary text-white py-3 font-medium hover:opacity-95 transition" [disabled]="loading">
                {{ loading ? ('register.creating' | translate) : ('register.create' | translate) }}
              </button>

              <p class="text-sm text-slate-600 dark:text-slate-300 md:hidden">
                Already have an account?
                <a routerLink="/login" class="text-primary font-medium">Sign in</a>
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  `
})
export class RegisterPageComponent {
  loading = false;
  error = '';
  success = '';
  submitAttempted = false;
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/)
      ]
    ],
    role: ['CITIZEN', [Validators.required]]
  });

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
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
    this.success = '';
    try {
      await this.auth.register(this.form.getRawValue());
      this.success = this.translate.instant('register.registrationSuccess');
      setTimeout(() => {
        this.router.navigateByUrl('/login');
      }, 900);
    } catch (err: any) {
      this.error = err?.error?.message || this.translate.instant('register.registrationFailed');
    } finally {
      this.loading = false;
    }
  }
}
