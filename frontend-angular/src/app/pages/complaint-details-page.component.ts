import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../core/auth.service';
import { ThemeService } from '../core/theme.service';
import { Complaint } from '../shared/models';
import { STATUS_COLORS } from '../shared/constants';
import { LoaderComponent } from '../components/loader.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LoaderComponent],
  template: `
    <app-loader *ngIf="loading"></app-loader>
    <div *ngIf="!loading && error" class="glass rounded-2xl p-6 shadow-card text-rose-600">{{ error }}</div>
    <div *ngIf="!loading && !error && !complaint" class="glass rounded-2xl p-6">{{ 'complaintDetails.notFound' | translate }}</div>

    <div *ngIf="!loading && complaint" class="space-y-5">
      <section
        class="relative overflow-hidden rounded-3xl p-6 shadow-soft md:p-8"
        [ngClass]="
          theme.theme() === 'dark'
            ? 'border border-slate-700/70 bg-gradient-to-br from-slate-900/90 via-slate-900/85 to-slate-800/85'
            : 'border border-white/60 bg-gradient-to-br from-sky-50 via-white to-emerald-50'
        "
      >
        <div class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-2xl"></div>
        <div class="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary/15 blur-2xl"></div>

        <div class="relative">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-2xl font-heading font-semibold md:text-3xl">{{ 'complaintDetails.title' | translate : { id: complaint.id } }}</h2>
            <div class="flex flex-wrap gap-2">
              <button type="button" (click)="theme.toggleTheme()" class="rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">
                {{ theme.theme() === 'dark' ? ('navbar.light' | translate) : ('navbar.dark' | translate) }}
              </button>
              <a routerLink="/citizen" class="rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">{{ 'common.dashboard' | translate }}</a>
              <a routerLink="/my-complaints" class="rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">{{ 'citizenDashboard.myComplaints' | translate }}</a>
            </div>
          </div>
          <p class="mt-2 text-sm text-slate-500">Track full complaint context, status, and resolution actions in one place.</p>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article class="glass rounded-2xl p-5 shadow-card lg:col-span-2">
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-full px-3 py-1 text-xs font-medium" [ngClass]="statusColors[complaint.status]">{{ ('status.' + complaint.status) | translate }}</span>
            <span class="rounded-full border px-3 py-1 text-xs font-semibold" [ngClass]="priorityBadgeClass(complaint.priority)">
              {{ 'complaintDetails.priority' | translate }}: {{ complaint.priority || '-' }}
            </span>
          </div>

          <div class="mt-4">
            <p class="text-xl font-semibold">{{ complaint.title }}</p>
            <p class="mt-3 leading-relaxed text-slate-600">{{ complaint.description }}</p>
          </div>

          <div class="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div class="rounded-xl border border-slate-200 bg-white/70 p-3">
              <p class="text-xs uppercase tracking-wide text-slate-500">{{ 'complaintDetails.category' | translate }}</p>
              <p class="mt-1 font-semibold">{{ ('categories.' + complaint.category) | translate }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white/70 p-3">
              <p class="text-xs uppercase tracking-wide text-slate-500">{{ 'complaintDetails.location' | translate }}</p>
              <p class="mt-1 font-semibold">{{ complaint.location }}</p>
            </div>
          </div>

          <div *ngIf="auth.user()?.role === 'CITIZEN' && complaint.status === 'RESOLVED'" class="mt-5 flex flex-wrap gap-3">
            <a [routerLink]="'/feedback/' + complaint.id" class="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95">{{ 'complaintDetails.rateService' | translate }}</a>
            <button (click)="reopenComplaint()" class="rounded-xl bg-rose-100 px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-200">{{ 'complaintDetails.reopen' | translate }}</button>
          </div>
        </article>

        <article class="glass rounded-2xl p-5 shadow-card">
          <h3 class="text-lg font-semibold">Complaint Snapshot</h3>
          <div class="mt-3 space-y-3 text-sm">
            <div class="rounded-xl border border-slate-200 bg-white/70 p-3">
              <p class="text-xs uppercase tracking-wide text-slate-500">ID</p>
              <p class="mt-1 font-semibold">#{{ complaint.id }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white/70 p-3">
              <p class="text-xs uppercase tracking-wide text-slate-500">Status</p>
              <p class="mt-1 font-semibold">{{ ('status.' + complaint.status) | translate }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white/70 p-3">
              <p class="text-xs uppercase tracking-wide text-slate-500">Image</p>
              <p class="mt-1 font-semibold">{{ complaint.imageUrl ? 'Attached' : 'Not attached' }}</p>
            </div>
          </div>
        </article>
      </section>

      <section *ngIf="complaint.imageUrl" class="glass rounded-2xl p-4 shadow-card">
        <h3 class="mb-3 text-lg font-semibold">Attached Evidence</h3>
        <img [src]="'http://localhost:8080' + complaint.imageUrl" alt="complaint" class="max-h-[420px] w-full rounded-xl object-cover" />
      </section>
    </div>
  `
})
export class ComplaintDetailsPageComponent implements OnInit {
  complaint: Complaint | null = null;
  loading = true;
  error = '';
  readonly statusColors = STATUS_COLORS;

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly auth: AuthService,
    public readonly theme: ThemeService,
    private readonly translate: TranslateService
  ) {}

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    try {
      const data = await this.http.get<Complaint[]>('/api/complaints').toPromise();
      this.complaint = (data || []).find((item) => Number(item.id) === id) || null;
    } catch {
      this.error = this.translate.instant('complaintDetails.failedLoad');
    } finally {
      this.loading = false;
    }
  }

  priorityBadgeClass(priority?: string): string {
    if (priority === 'HIGH') {
      return 'border-rose-300 bg-rose-50 text-rose-700';
    }
    if (priority === 'LOW') {
      return 'border-emerald-300 bg-emerald-50 text-emerald-700';
    }
    return 'border-amber-300 bg-amber-50 text-amber-700';
  }

  async reopenComplaint(): Promise<void> {
    if (!this.complaint) {
      return;
    }
    await this.http
      .put('/api/complaints/status', { complaintId: this.complaint.id, status: 'REOPENED' })
      .toPromise();
    this.complaint = { ...this.complaint, status: 'REOPENED' };
    this.router.navigate(['/my-complaints']);
  }
}
