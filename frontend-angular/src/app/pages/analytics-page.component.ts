import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import { Complaint, User } from '../shared/models';
import { LoaderComponent } from '../components/loader.component';
import { AuthService } from '../core/auth.service';
import { ThemeService } from '../core/theme.service';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement);

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, LoaderComponent],
  template: `
    <app-loader *ngIf="loading"></app-loader>
    <div *ngIf="!loading && error" class="glass rounded-2xl p-6 shadow-card">
      <h2 class="text-2xl font-heading font-semibold">{{ 'adminDashboard.charts.complaints' | translate }}</h2>
      <p class="mt-3 text-sm text-rose-600">{{ error }}</p>
      <button (click)="loadData()" class="mt-4 rounded-xl bg-primary px-4 py-2 text-white">{{ 'common.retry' | translate }}</button>
    </div>

    <div *ngIf="!loading && !error" class="space-y-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 class="text-2xl font-heading font-semibold md:text-3xl">{{ 'adminDashboard.charts.complaints' | translate }}</h2>
          <p class="mt-1 text-sm text-slate-500">A dedicated analytics view for complaint patterns and service performance.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button type="button" (click)="toggleTheme()" class="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-700/90">
            {{ theme.theme() === 'dark' ? ('navbar.light' | translate) : ('navbar.dark' | translate) }}
          </button>
          <button type="button" (click)="logout()" class="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-700/90">
            {{ 'common.logout' | translate }}
          </button>
        </div>
      </div>

      <section class="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <article class="glass rounded-2xl p-4 shadow-card hover-lift"><p class="text-xs uppercase tracking-wide text-slate-500">{{ 'adminDashboard.cards.total' | translate }}</p><p class="mt-2 text-3xl font-semibold">{{ complaints.length }}</p></article>
        <article class="glass rounded-2xl p-4 shadow-card hover-lift"><p class="text-xs uppercase tracking-wide text-slate-500">{{ 'adminDashboard.cards.pending' | translate }}</p><p class="mt-2 text-3xl font-semibold text-amber-600">{{ pendingCount }}</p></article>
        <article class="glass rounded-2xl p-4 shadow-card hover-lift"><p class="text-xs uppercase tracking-wide text-slate-500">{{ 'adminDashboard.cards.resolved' | translate }}</p><p class="mt-2 text-3xl font-semibold text-emerald-600">{{ resolvedCount }}</p></article>
        <article class="glass rounded-2xl p-4 shadow-card hover-lift"><p class="text-xs uppercase tracking-wide text-slate-500">{{ 'adminDashboard.cards.avgResolution' | translate }}</p><p class="mt-2 text-3xl font-semibold text-primary">{{ avgResolution }}</p></article>
        <article class="glass rounded-2xl p-4 shadow-card hover-lift"><p class="text-xs uppercase tracking-wide text-slate-500">{{ 'adminDashboard.cards.activeOfficers' | translate }}</p><p class="mt-2 text-3xl font-semibold text-blue-600">{{ officers.length }}</p></article>
      </section>

      <section class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article class="glass rounded-2xl p-5 shadow-card">
          <div class="mb-4 flex items-center justify-between gap-3">
            <h3 class="font-semibold">{{ 'adminDashboard.charts.byCategory' | translate }}</h3>
            <span class="text-xs text-slate-500">Distribution</span>
          </div>
          <div class="h-80 w-full"><canvas #categoryChart class="h-full w-full"></canvas></div>
        </article>
        <article class="glass rounded-2xl p-5 shadow-card">
          <div class="mb-4 flex items-center justify-between gap-3">
            <h3 class="font-semibold">{{ 'adminDashboard.charts.monthly' | translate }}</h3>
            <span class="text-xs text-slate-500">Volume trend</span>
          </div>
          <div class="h-80 w-full"><canvas #monthlyChart class="h-full w-full"></canvas></div>
        </article>
        <article class="glass rounded-2xl p-5 shadow-card lg:col-span-2">
          <div class="mb-4 flex items-center justify-between gap-3">
            <h3 class="font-semibold">{{ 'adminDashboard.charts.resolutionTrend' | translate }}</h3>
            <span class="text-xs text-slate-500">SLA snapshot</span>
          </div>
          <div class="h-80 w-full"><canvas #slaChart class="h-full w-full"></canvas></div>
        </article>
      </section>
    </div>
  `
})
export class AnalyticsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('categoryChart') categoryChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('monthlyChart') monthlyChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('slaChart') slaChartRef?: ElementRef<HTMLCanvasElement>;

  complaints: Complaint[] = [];
  officers: User[] = [];
  reports: { categories: Array<{ category: string; count: number }>; monthly: Array<{ month: string; count: number }>; sla: Array<{ id: number; days: number }> } = {
    categories: [],
    monthly: [],
    sla: []
  };

  loading = true;
  error = '';
  private categoryChart?: Chart;
  private monthlyChart?: Chart;
  private slaChart?: Chart;
  private viewReady = false;

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);

  get pendingCount(): number {
    return this.complaints.filter((c) => c.status === 'PENDING').length;
  }

  get resolvedCount(): number {
    return this.complaints.filter((c) => c.status === 'RESOLVED').length;
  }

  get avgResolution(): number {
    if (this.reports.sla.length === 0) {
      return 0;
    }
    return Math.round(this.reports.sla.reduce((acc, item) => acc + item.days, 0) / this.reports.sla.length);
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.scheduleChartRender();
  }

  ngOnDestroy(): void {
    this.categoryChart?.destroy();
    this.monthlyChart?.destroy();
    this.slaChart?.destroy();
  }

  async loadData(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      const [complaints, users, categories, monthly, sla] = await Promise.all([
        this.http.get<Complaint[]>('/api/complaints').toPromise(),
        this.http.get<User[]>('/api/auth/users').toPromise(),
        this.http.get<Array<{ category: string; count: number }>>('/api/reports/categories').toPromise(),
        this.http.get<Array<{ month: string; count: number }>>('/api/reports/monthly').toPromise(),
        this.http.get<Array<{ id: number; days: number }>>('/api/reports/sla').toPromise()
      ]);

      this.complaints = complaints || [];
      this.officers = (users || []).filter((u) => u.role === 'OFFICER');
      this.reports = { categories: categories || [], monthly: monthly || [], sla: sla || [] };

      this.scheduleChartRender();
    } catch {
      this.error = this.translate.instant('adminDashboard.failedLoad');
    } finally {
      this.loading = false;
    }
  }

  toggleTheme(): void {
    this.theme.toggleTheme();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private scheduleChartRender(): void {
    if (!this.viewReady) {
      return;
    }

    requestAnimationFrame(() => this.renderCharts());
  }

  private renderCharts(): void {
    if (!this.categoryChartRef || !this.monthlyChartRef || !this.slaChartRef) {
      return;
    }

    this.categoryChart?.destroy();
    this.monthlyChart?.destroy();
    this.slaChart?.destroy();

    this.categoryChart = new Chart(this.categoryChartRef.nativeElement, {
      type: 'pie',
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
      data: {
        labels: this.reports.categories.map((i) => this.translate.instant(`categories.${i.category}`)),
        datasets: [{ data: this.reports.categories.map((i) => i.count), backgroundColor: ['#2563EB', '#10B981', '#F59E0B', '#0EA5E9', '#F43F5E'] }]
      }
    });

    this.monthlyChart = new Chart(this.monthlyChartRef.nativeElement, {
      type: 'bar',
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } },
      data: {
        labels: this.reports.monthly.map((i) => i.month),
        datasets: [{ label: this.translate.instant('adminDashboard.charts.complaints'), data: this.reports.monthly.map((i) => i.count), backgroundColor: '#2563EB' }]
      }
    });

    this.slaChart = new Chart(this.slaChartRef.nativeElement, {
      type: 'line',
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } },
      data: {
        labels: this.reports.sla.map((i) => `#${i.id}`),
        datasets: [{ label: this.translate.instant('adminDashboard.charts.days'), data: this.reports.sla.map((i) => i.days), borderColor: '#10B981', tension: 0.35 }]
      }
    });
  }
}