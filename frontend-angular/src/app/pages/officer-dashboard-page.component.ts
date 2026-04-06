import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Complaint } from '../shared/models';
import { AuthService } from '../core/auth.service';
import { ThemeService } from '../core/theme.service';
import { LoaderComponent } from '../components/loader.component';
import { ToastComponent } from '../components/toast.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LoaderComponent, ToastComponent],
  template: `
    <app-loader *ngIf="loading"></app-loader>
    <div *ngIf="!loading && error" class="glass rounded-2xl p-6 shadow-card text-rose-600">{{ error }}</div>

    <div *ngIf="!loading && !error" class="space-y-5">
      <app-toast [message]="toast.message" [type]="toast.type" (close)="toast.message = ''"></app-toast>

      <section
        class="relative overflow-hidden rounded-3xl p-6 shadow-soft md:p-7"
        [ngClass]="
          theme.theme() === 'dark'
            ? 'border border-slate-700/70 bg-gradient-to-br from-slate-900/90 via-slate-900/85 to-slate-800/85'
            : 'border border-white/60 bg-gradient-to-br from-sky-50 via-white to-emerald-50'
        "
      >
        <div class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-2xl"></div>
        <div class="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary/15 blur-2xl"></div>

        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="relative">
            <p class="text-xs font-semibold uppercase tracking-wider text-primary">Field Operations</p>
            <h2 class="text-2xl md:text-3xl font-heading font-semibold mt-2">{{ 'officerDashboard.title' | translate }}</h2>
            <p class="text-sm text-slate-500 mt-1">{{ 'officerDashboard.description' | translate }}</p>
            <div class="mt-4 flex flex-wrap gap-2 text-xs">
              <span class="rounded-full border border-white/70 bg-white/80 px-3 py-1 font-semibold text-slate-700">{{ complaints.length }} Assigned</span>
              <span class="rounded-full border border-white/70 bg-white/80 px-3 py-1 font-semibold text-amber-700">{{ pendingCount }} Pending</span>
              <span class="rounded-full border border-white/70 bg-white/80 px-3 py-1 font-semibold text-blue-700">{{ inProgressCount }} In Progress</span>
              <span class="rounded-full border border-white/70 bg-white/80 px-3 py-1 font-semibold text-emerald-700">{{ resolvedCount }} Resolved</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              (click)="theme.toggleTheme()"
              class="rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white"
            >
              {{ theme.theme() === 'dark' ? ('navbar.light' | translate) : ('navbar.dark' | translate) }}
            </button>
            <button
              type="button"
              (click)="logout()"
              class="rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white"
            >
              {{ 'common.logout' | translate }}
            </button>
            <button (click)="loadComplaints()" class="rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white">Reload Queue</button>
            <button (click)="loadComplaints()" class="rounded-xl bg-primary px-4 py-2.5 text-white text-sm font-semibold hover:opacity-95">{{ 'common.refresh' | translate }}</button>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <article class="glass rounded-2xl p-4 shadow-card hover-lift">
          <p class="text-xs uppercase tracking-wide text-slate-500">Assigned</p>
          <p class="mt-2 text-3xl font-semibold">{{ complaints.length }}</p>
        </article>
        <article class="glass rounded-2xl p-4 shadow-card hover-lift">
          <p class="text-xs uppercase tracking-wide text-slate-500">Pending</p>
          <p class="mt-2 text-3xl font-semibold text-amber-600">{{ pendingCount }}</p>
        </article>
        <article class="glass rounded-2xl p-4 shadow-card hover-lift">
          <p class="text-xs uppercase tracking-wide text-slate-500">In Progress</p>
          <p class="mt-2 text-3xl font-semibold text-blue-600">{{ inProgressCount }}</p>
        </article>
        <article class="glass rounded-2xl p-4 shadow-card hover-lift">
          <p class="text-xs uppercase tracking-wide text-slate-500">Resolved</p>
          <p class="mt-2 text-3xl font-semibold text-emerald-600">{{ resolvedCount }}</p>
        </article>
      </section>

      <div *ngIf="complaints.length === 0" class="glass rounded-2xl p-8 shadow-card text-center">
        <h3 class="text-xl font-semibold text-slate-800">{{ 'officerDashboard.emptyTitle' | translate }}</h3>
        <p class="mt-2 text-sm text-slate-500">{{ 'officerDashboard.emptyDescription' | translate }}</p>
      </div>

      <section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div *ngFor="let complaint of sortedComplaints" class="glass rounded-2xl p-5 shadow-card hover-lift fade-up fade-up-delay-1 border border-white/50">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-semibold text-slate-800 text-lg">{{ complaint.title }}</h3>
              <p class="text-xs text-slate-500 mt-1">#{{ complaint.id }} - {{ ('categories.' + complaint.category) | translate }}</p>
            </div>
            <span class="rounded-full px-2 py-1 text-xs font-medium" [ngClass]="statusClass(complaint.status)">{{ ('status.' + complaint.status) | translate }}</span>
          </div>

          <p class="text-sm text-slate-600 mt-3 line-clamp-2">{{ complaint.description }}</p>

          <div class="mt-4 grid grid-cols-1 gap-2 text-xs text-slate-500">
            <div class="rounded-lg border border-slate-200 bg-white/70 px-3 py-2">📍 {{ complaint.location }}</div>
            <div class="rounded-lg border border-slate-200 bg-white/70 px-3 py-2">🗓️ {{ complaint.submissionDate | date : 'medium' }}</div>
          </div>

          <div class="space-y-3 mt-4">
            <textarea class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" [placeholder]="'officerDashboard.addResolutionNote' | translate" [(ngModel)]="notes[complaint.id]"></textarea>
            <input type="file" accept="image/*" class="text-sm rounded-lg border border-slate-200 bg-white/80 px-2 py-1.5 w-full" (change)="onProofFileChange(complaint.id, $event)" />
            <div class="flex flex-wrap gap-2">
              <button
                [disabled]="complaint.status === 'RESOLVED'"
                (click)="updateStatus(complaint.id, 'IN_PROGRESS')"
                class="px-3 py-2 rounded-lg text-sm bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {{ 'officerDashboard.inProgress' | translate }}
              </button>
              <button
                [disabled]="complaint.status === 'RESOLVED'"
                (click)="updateStatus(complaint.id, 'RESOLVED')"
                class="px-3 py-2 rounded-lg text-sm bg-emerald-100 text-emerald-700 font-medium hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {{ 'officerDashboard.resolve' | translate }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class OfficerDashboardPageComponent implements OnInit {
  complaints: Complaint[] = [];
  loading = true;
  error = '';
  notes: Record<number, string> = {};
  proofFiles: Record<number, File | null> = {};
  toast: { message: string; type: 'success' | 'error' } = { message: '', type: 'success' };

  get pendingCount(): number {
    return this.complaints.filter((complaint) => complaint.status === 'PENDING').length;
  }

  get inProgressCount(): number {
    return this.complaints.filter((complaint) => complaint.status === 'IN_PROGRESS').length;
  }

  get resolvedCount(): number {
    return this.complaints.filter((complaint) => complaint.status === 'RESOLVED').length;
  }

  get sortedComplaints(): Complaint[] {
    return [...this.complaints].sort((a, b) => +new Date(b.submissionDate) - +new Date(a.submissionDate));
  }

  constructor(
    private readonly http: HttpClient,
    public readonly auth: AuthService,
    public readonly theme: ThemeService,
    private readonly router: Router,
    private readonly translate: TranslateService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadComplaints();
  }

  async loadComplaints(): Promise<void> {
    const user = this.auth.user();
    if (!user) {
      return;
    }

    this.loading = true;
    this.error = '';
    try {
      const data = await this.http
        .get<Complaint[]>('/api/complaints', { params: { assignedOfficerId: String(user.id) } })
        .toPromise();
      this.complaints = (data || []).filter((complaint) => complaint.assignedOfficerId === user.id);
    } catch {
      this.error = this.translate.instant('officerDashboard.failedLoad');
    } finally {
      this.loading = false;
    }
  }

  statusClass(status: Complaint['status']): string {
    if (status === 'RESOLVED') {
      return 'bg-emerald-100 text-emerald-700';
    }
    if (status === 'IN_PROGRESS') {
      return 'bg-blue-100 text-blue-700';
    }
    if (status === 'REOPENED') {
      return 'bg-rose-100 text-rose-700';
    }
    return 'bg-amber-100 text-amber-700';
  }

  onProofFileChange(complaintId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.proofFiles[complaintId] = input.files?.[0] || null;
  }

  async updateStatus(complaintId: number, status: 'IN_PROGRESS' | 'RESOLVED'): Promise<void> {
    try {
      const payload = {
        complaintId,
        status,
        resolutionNote: this.notes[complaintId] || this.translate.instant('officerDashboard.defaultResolutionNote')
      };

      const selectedFile = this.proofFiles[complaintId];
      if (selectedFile) {
        const formData = new FormData();
        formData.append('payload', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
        formData.append('proofImage', selectedFile);
        await this.http.put('/api/complaints/status', formData).toPromise();
      } else {
        await this.http.put('/api/complaints/status', payload).toPromise();
      }

      this.toast = { message: this.translate.instant('officerDashboard.statusUpdated'), type: 'success' };
      await this.loadComplaints();
    } catch {
      this.toast = { message: this.translate.instant('officerDashboard.updateFailed'), type: 'error' };
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
