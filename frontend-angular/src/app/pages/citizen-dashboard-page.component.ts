import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../core/auth.service';
import { ThemeService } from '../core/theme.service';
import { Complaint } from '../shared/models';
import { STATUS_COLORS } from '../shared/constants';
import { LoaderComponent } from '../components/loader.component';

@Component({
  selector: 'app-citizen-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LoaderComponent],
  template: `
    <app-loader *ngIf="loading"></app-loader>
    <div *ngIf="!loading && error" class="glass rounded-2xl p-6 shadow-card text-rose-600">{{ error }}</div>

    <div *ngIf="!loading && !error" class="space-y-5">
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
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div class="relative">
            <p class="text-xs font-semibold uppercase tracking-wider text-primary inline-flex items-center gap-1">✨ {{ 'common.welcome' | translate }}</p>
            <h2 class="text-2xl md:text-3xl font-heading font-semibold mt-2">{{ auth.user()?.name }} - {{ 'citizenDashboard.title' | translate }}</h2>
            <p class="text-sm text-slate-500 mt-1">{{ 'citizenDashboard.description' | translate }}</p>
            <div class="mt-4 flex flex-wrap gap-2 text-xs">
              <span
                class="rounded-full px-3 py-1 font-semibold"
                [ngClass]="theme.theme() === 'dark' ? 'border border-slate-600 bg-slate-800/80 text-slate-100' : 'border border-white/70 bg-white/80 text-slate-700'"
              >
                {{ complaints.length }} {{ 'citizenDashboard.total' | translate }}
              </span>
              <span
                class="rounded-full px-3 py-1 font-semibold"
                [ngClass]="theme.theme() === 'dark' ? 'border border-amber-500/40 bg-amber-500/10 text-amber-300' : 'border border-white/70 bg-white/80 text-amber-700'"
              >
                {{ pendingCount }} {{ 'citizenDashboard.pending' | translate }}
              </span>
              <span
                class="rounded-full px-3 py-1 font-semibold"
                [ngClass]="theme.theme() === 'dark' ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border border-white/70 bg-white/80 text-emerald-700'"
              >
                {{ resolvedCount }} {{ 'citizenDashboard.resolved' | translate }}
              </span>
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
            <a routerLink="/submit" class="rounded-xl bg-secondary text-white px-4 py-2.5 text-sm font-semibold hover:opacity-95">{{ 'common.submitComplaint' | translate }}</a>
            <a routerLink="/my-complaints" class="rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white">{{ 'citizenDashboard.myComplaints' | translate }}</a>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-2 gap-3 md:grid-cols-5">
        <article class="glass rounded-2xl p-4 shadow-card hover-lift">
          <p class="text-xs uppercase tracking-wide text-slate-500">{{ 'citizenDashboard.total' | translate }}</p>
          <p class="mt-2 text-3xl font-semibold">{{ complaints.length }}</p>
        </article>
        <article class="glass rounded-2xl p-4 shadow-card hover-lift">
          <p class="text-xs uppercase tracking-wide text-slate-500">{{ 'citizenDashboard.pending' | translate }}</p>
          <p class="mt-2 text-3xl font-semibold text-amber-600">{{ pendingCount }}</p>
        </article>
        <article class="glass rounded-2xl p-4 shadow-card hover-lift">
          <p class="text-xs uppercase tracking-wide text-slate-500">{{ 'citizenDashboard.inProgress' | translate }}</p>
          <p class="mt-2 text-3xl font-semibold text-blue-600">{{ inProgressCount }}</p>
        </article>
        <article class="glass rounded-2xl p-4 shadow-card hover-lift">
          <p class="text-xs uppercase tracking-wide text-slate-500">{{ 'citizenDashboard.resolved' | translate }}</p>
          <p class="mt-2 text-3xl font-semibold text-emerald-600">{{ resolvedCount }}</p>
        </article>
        <article class="glass rounded-2xl p-4 shadow-card hover-lift">
          <p class="text-xs uppercase tracking-wide text-slate-500">{{ 'citizenDashboard.reopened' | translate }}</p>
          <p class="mt-2 text-3xl font-semibold text-rose-600">{{ reopenedCount }}</p>
        </article>
      </section>

      <section class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article class="glass rounded-2xl p-5 shadow-card lg:col-span-2">
          <div class="mb-4 flex items-center justify-between gap-2">
            <h3 class="font-semibold">{{ 'citizenDashboard.recentActivity' | translate }}</h3>
            <a routerLink="/my-complaints" class="text-sm font-medium text-primary">{{ 'citizenDashboard.viewAll' | translate }}</a>
          </div>

          <div *ngIf="recentComplaints.length === 0" class="rounded-xl border border-dashed border-slate-200 bg-white/60 p-5 text-center">
            <p class="font-semibold text-slate-700">{{ 'citizenDashboard.emptyTitle' | translate }}</p>
            <p class="mt-1 text-sm text-slate-500">{{ 'citizenDashboard.emptyDescription' | translate }}</p>
          </div>

          <div *ngIf="recentComplaints.length > 0" class="space-y-3">
            <div *ngFor="let c of recentComplaints" class="rounded-xl border border-slate-200 bg-white/70 p-3">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-medium text-slate-800">#{{ c.id }} - {{ c.title }}</p>
                  <p class="mt-1 text-xs text-slate-500">{{ ('categories.' + c.category) | translate }} - {{ c.submissionDate | date : 'mediumDate' }}</p>
                </div>
                <span class="whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium" [ngClass]="statusColors[c.status]">{{ ('status.' + c.status) | translate }}</span>
              </div>
            </div>
          </div>
        </article>

        <article class="glass rounded-2xl p-5 shadow-card">
          <h3 class="font-semibold">{{ 'citizenDashboard.quickActions' | translate }}</h3>
          <p class="mt-1 text-sm text-slate-500">{{ 'citizenDashboard.quickActionsDescription' | translate }}</p>
          <div class="mt-4 space-y-2">
            <a routerLink="/submit" class="block rounded-xl bg-secondary px-4 py-2.5 text-center text-sm font-semibold text-white hover:opacity-95">{{ 'citizenDashboard.fileNew' | translate }}</a>
            <a routerLink="/my-complaints" class="block rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-white">{{ 'citizenDashboard.myComplaints' | translate }}</a>
          </div>
        </article>
      </section>

      <section class="glass rounded-2xl p-4 shadow-card lg:col-span-2 overflow-x-auto">
        <h3 class="font-semibold mb-3">{{ 'citizenDashboard.myComplaints' | translate }}</h3>
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-slate-500 border-b">
              <th class="py-2">{{ 'citizenDashboard.columns.id' | translate }}</th>
              <th>{{ 'citizenDashboard.columns.title' | translate }}</th>
              <th>{{ 'citizenDashboard.columns.category' | translate }}</th>
              <th>{{ 'citizenDashboard.columns.status' | translate }}</th>
              <th>{{ 'citizenDashboard.columns.date' | translate }}</th>
              <th>{{ 'citizenDashboard.columns.details' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of complaints" class="border-b last:border-b-0 hover:bg-white/40 transition-colors">
              <td class="py-3">#{{ c.id }}</td>
              <td>{{ c.title }}</td>
              <td>{{ ('categories.' + c.category) | translate }}</td>
              <td><span class="px-2 py-1 rounded-full text-xs font-medium" [ngClass]="statusColors[c.status]">{{ ('status.' + c.status) | translate }}</span></td>
              <td>{{ c.submissionDate | date : 'shortDate' }}</td>
              <td><a class="text-primary font-medium" [routerLink]="'/complaints/' + c.id">{{ 'common.view' | translate }}</a></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  `
})
export class CitizenDashboardPageComponent implements OnInit {
  complaints: Complaint[] = [];
  loading = true;
  error = '';
  readonly statusColors = STATUS_COLORS;

  get pendingCount(): number {
    return this.complaints.filter((complaint) => complaint.status === 'PENDING').length;
  }

  get inProgressCount(): number {
    return this.complaints.filter((complaint) => complaint.status === 'IN_PROGRESS').length;
  }

  get resolvedCount(): number {
    return this.complaints.filter((complaint) => complaint.status === 'RESOLVED').length;
  }

  get reopenedCount(): number {
    return this.complaints.filter((complaint) => complaint.status === 'REOPENED').length;
  }

  get recentComplaints(): Complaint[] {
    return [...this.complaints]
      .sort((a, b) => +new Date(b.submissionDate) - +new Date(a.submissionDate))
      .slice(0, 4);
  }

  constructor(
    private readonly http: HttpClient,
    public readonly auth: AuthService,
    public readonly theme: ThemeService,
    private readonly router: Router,
    private readonly translate: TranslateService
  ) {}

  async ngOnInit(): Promise<void> {
    const user = this.auth.user();
    if (!user) {
      this.loading = false;
      return;
    }

    try {
      const data = await this.http.get<Complaint[]>(`/api/complaints/user/${user.id}`).toPromise();
      this.complaints = data || [];
    } catch {
      this.error = this.translate.instant('citizenDashboard.failedLoad');
    } finally {
      this.loading = false;
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
