import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { COMPLAINT_CATEGORIES } from '../shared/constants';
import { ToastComponent } from '../components/toast.component';
import { inject } from '@angular/core';
import { ThemeService } from '../core/theme.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule, ToastComponent],
  template: `
    <div class="space-y-5">
      <app-toast [message]="toast.message" [type]="toast.type" (close)="clearToast()"></app-toast>

      <section
        class="relative overflow-hidden rounded-3xl p-6 shadow-soft md:p-8"
        [ngClass]="
          theme.theme() === 'dark'
            ? 'border border-slate-700/70 bg-gradient-to-br from-slate-900/90 via-slate-900/85 to-slate-800/85'
            : 'border border-white/60 bg-gradient-to-br from-sky-50 via-white to-emerald-50'
        "
      >
        <div class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-2xl"></div>
        <div class="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-secondary/15 blur-2xl"></div>
        <div class="relative">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">Citizen Action Desk</p>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                (click)="theme.toggleTheme()"
                class="rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
              >
                {{ theme.theme() === 'dark' ? ('navbar.light' | translate) : ('navbar.dark' | translate) }}
              </button>
              <a routerLink="/citizen" class="rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">
                {{ 'common.dashboard' | translate }}
              </a>
              <a routerLink="/my-complaints" class="rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">
                {{ 'citizenDashboard.myComplaints' | translate }}
              </a>
            </div>
          </div>
          <h2 class="mt-3 text-2xl font-heading font-semibold md:text-3xl">{{ 'submitComplaint.title' | translate }}</h2>
          <p class="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">{{ 'submitComplaint.description' | translate }}</p>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <form class="glass rounded-2xl border border-white/60 p-5 shadow-card lg:col-span-2" [formGroup]="form" (ngSubmit)="submit()">
          <div class="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="md:col-span-2">
              <label class="mb-2 block text-sm font-semibold text-slate-700">{{ 'submitComplaint.complaintTitle' | translate }}</label>
              <input
                class="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                [placeholder]="'submitComplaint.complaintTitle' | translate"
                formControlName="title"
              />
              <p *ngIf="isFieldInvalid('title')" class="mt-1 text-xs text-rose-600">{{ 'submitComplaint.validation.titleRequired' | translate }}</p>
            </div>

            <div class="md:col-span-2">
              <label class="mb-2 block text-sm font-semibold text-slate-700">{{ 'submitComplaint.complaintDescription' | translate }}</label>
              <textarea
                class="min-h-32 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                [placeholder]="'submitComplaint.complaintDescription' | translate"
                formControlName="description"
              ></textarea>
              <p *ngIf="isFieldInvalid('description')" class="mt-1 text-xs text-rose-600">{{ 'submitComplaint.validation.descriptionRequired' | translate }}</p>
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">{{ 'citizenDashboard.columns.category' | translate }}</label>
              <select
                class="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                formControlName="category"
              >
                <option *ngFor="let cat of categories" [value]="cat">{{ ('categories.' + cat) | translate }}</option>
              </select>
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between gap-2">
                <label class="block text-sm font-semibold text-slate-700">{{ 'submitComplaint.addressPlaceholder' | translate }}</label>
                <span
                  *ngIf="locationStatus !== 'idle'"
                  class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  [ngClass]="
                    locationStatus === 'success'
                      ? 'bg-emerald-100 text-emerald-700'
                      : locationStatus === 'loading'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-rose-100 text-rose-700'
                  "
                >
                  {{ locationStatus === 'loading' ? 'Detecting...' : (locationStatus === 'success' ? 'Detected' : 'Retry') }}
                </span>
              </div>
              <input
                class="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                [placeholder]="locationStatus === 'loading' ? ('submitComplaint.detectingAddress' | translate) : ('submitComplaint.addressPlaceholder' | translate)"
                formControlName="location"
              />
              <p *ngIf="isFieldInvalid('location')" class="mt-1 text-xs text-rose-600">{{ 'submitComplaint.validation.locationRequired' | translate }}</p>
            </div>
          </div>

          <div class="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-4">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-sm font-semibold text-slate-700">Upload Photo (Optional)</p>
                <p class="text-xs text-slate-500">Attach a clear image to help officers resolve the issue quickly.</p>
              </div>
              <button
                type="button"
                (click)="detectLocation()"
                class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-primary hover:bg-slate-50"
                [disabled]="locationStatus === 'loading'"
              >
                {{ locationStatus === 'loading' ? ('submitComplaint.detectingAddress' | translate) : ('submitComplaint.useCurrentLocation' | translate) }}
              </button>
            </div>

            <input type="file" accept="image/*" class="mt-3 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3" (change)="onFileChange($event)" />
            <img *ngIf="preview" [src]="preview" alt="preview" class="mt-3 h-40 w-full rounded-xl object-cover md:w-72" />
          </div>

          <div class="mt-5 flex items-center justify-end gap-3">
            <button type="button" class="rounded-xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-white" (click)="form.reset({ category: categories[0] }); preview = ''; selectedFile = null; locationStatus = 'idle'">
              Clear
            </button>
            <button [disabled]="loading" class="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60">
              {{ loading ? ('submitComplaint.submitting' | translate) : ('submitComplaint.submit' | translate) }}
            </button>
          </div>
        </form>

        <aside class="glass rounded-2xl border border-white/60 p-5 shadow-card">
          <h3 class="text-lg font-semibold">Submission Guide</h3>
          <p class="mt-1 text-sm text-slate-500">A complete complaint gets solved faster.</p>

          <div class="mt-4 space-y-3">
            <div class="rounded-xl border border-slate-200 bg-white/70 p-3">
              <p class="text-sm font-semibold text-slate-700">1. Use a clear title</p>
              <p class="mt-1 text-xs text-slate-500">Mention the issue and area in one line.</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white/70 p-3">
              <p class="text-sm font-semibold text-slate-700">2. Add exact location</p>
              <p class="mt-1 text-xs text-slate-500">Use current location for better assignment accuracy.</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white/70 p-3">
              <p class="text-sm font-semibold text-slate-700">3. Attach a photo</p>
              <p class="mt-1 text-xs text-slate-500">Optional, but useful for field officers.</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  `
})
export class SubmitComplaintPageComponent implements OnInit {
  readonly categories = COMPLAINT_CATEGORIES;
  preview = '';
  loading = false;
  locationStatus: 'idle' | 'loading' | 'success' | 'error' | 'unsupported' = 'idle';
  selectedFile: File | null = null;
  toast: { message: string; type: 'success' | 'error' } = { message: '', type: 'success' };
  private readonly fb = inject(FormBuilder);
  readonly theme = inject(ThemeService);

  readonly form = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: [COMPLAINT_CATEGORIES[0], [Validators.required]],
    location: ['', [Validators.required]]
  });

  constructor(
    private readonly http: HttpClient,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.detectLocation();
  }

  clearToast(): void {
    this.toast = { message: '', type: 'success' };
  }

  isFieldInvalid(field: 'title' | 'description' | 'location'): boolean {
    const control = this.form.controls[field];
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.selectedFile = file;
    if (file) {
      this.preview = URL.createObjectURL(file);
    }
  }

  detectLocation(): void {
    if (!navigator.geolocation) {
      this.locationStatus = 'unsupported';
      this.toast = { message: this.translate.instant('submitComplaint.locationUnsupported'), type: 'error' };
      return;
    }

    this.locationStatus = 'loading';
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (!response.ok) {
            throw new Error('reverse geocode failed');
          }
          const geoData = await response.json();
          const parts = [geoData.locality, geoData.city, geoData.principalSubdivision, geoData.countryName].filter(Boolean);
          const readableAddress = parts.join(', ');
          if (!readableAddress) {
            throw new Error('address unavailable');
          }
          this.form.patchValue({ location: readableAddress });
          this.locationStatus = 'success';
        } catch {
          this.locationStatus = 'error';
          this.toast = { message: this.translate.instant('submitComplaint.locationReverseFailed'), type: 'error' };
        }
      },
      () => {
        this.locationStatus = 'error';
        this.toast = { message: this.translate.instant('submitComplaint.locationPermissionFailed'), type: 'error' };
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    try {
      const formData = new FormData();
      const values = this.form.getRawValue();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, String(value ?? ''));
      });
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
      await this.http.post('/api/complaints', formData).toPromise();
      this.form.reset({ category: COMPLAINT_CATEGORIES[0] });
      this.preview = '';
      this.selectedFile = null;
      this.locationStatus = 'idle';
      this.toast = { message: this.translate.instant('submitComplaint.submitted'), type: 'success' };
    } catch {
      this.toast = { message: this.translate.instant('submitComplaint.submitFailed'), type: 'error' };
    } finally {
      this.loading = false;
    }
  }
}
