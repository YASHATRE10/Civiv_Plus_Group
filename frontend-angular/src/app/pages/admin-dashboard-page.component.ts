import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js/auto';
import { catchError, firstValueFrom, of, timeout, debounceTime, Subject } from 'rxjs';
import { Complaint, User } from '../shared/models';
import { LoaderComponent } from '../components/loader.component';
import { AuthService } from '../core/auth.service';
import { ThemeService } from '../core/theme.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LoaderComponent],
  template: `
    <app-loader *ngIf="loading"></app-loader>
    <div *ngIf="!loading && error" class="glass rounded-2xl p-6 shadow-card">
      <h2 class="text-2xl font-heading font-semibold">{{ 'adminDashboard.title' | translate }}</h2>
      <p class="mt-3 text-sm text-rose-600">{{ error }}</p>
      <button (click)="loadData()" class="mt-4 rounded-xl bg-primary px-4 py-2 text-white">{{ 'common.retry' | translate }}</button>
    </div>

    <div *ngIf="!loading && !error" class="space-y-5">
      <div *ngIf="warning" class="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">
        {{ warning }}
      </div>

      <section class="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6 shadow-soft md:p-7 dark:border-slate-700/70 dark:from-slate-900/90 dark:via-slate-900/85 dark:to-slate-800/85">
        <div class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-2xl"></div>
        <div class="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary/15 blur-2xl"></div>
        <div class="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-primary">Operations Hub</p>
            <h2 class="mt-2 text-2xl font-heading font-semibold md:text-3xl">{{ 'adminDashboard.title' | translate }}</h2>
            <p class="mt-1 text-sm text-slate-500">Monitor complaints, officers, and response trends from one command view.</p>
            <div class="mt-4 flex flex-wrap gap-2 text-xs">
              <span class="rounded-full border border-white/70 bg-white/80 px-3 py-1 font-semibold text-slate-700">{{ complaints.length }} Total</span>
              <span class="rounded-full border border-white/70 bg-white/80 px-3 py-1 font-semibold text-amber-700">{{ pendingCount }} Pending</span>
              <span class="rounded-full border border-white/70 bg-white/80 px-3 py-1 font-semibold text-emerald-700">{{ resolvedCount }} Resolved</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              (click)="openAnalytics()"
              class="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95"
            >
              Open Analytics
            </button>
            <button
              type="button"
              (click)="loadData()"
              class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-700/90"
            >
              {{ 'common.refresh' | translate }}
            </button>
          <button
            type="button"
            (click)="toggleTheme()"
            class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-700/90"
          >
            {{ theme.theme() === 'dark' ? ('navbar.light' | translate) : ('navbar.dark' | translate) }}
          </button>
          <button
            type="button"
            (click)="logout()"
            class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-700/90"
          >
            {{ 'common.logout' | translate }}
          </button>
        </div>
        </div>
      </section>

      <section class="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <article class="glass rounded-2xl p-4 shadow-card hover-lift"><p class="text-xs uppercase tracking-wide text-slate-500">{{ 'adminDashboard.cards.total' | translate }}</p><p class="text-3xl font-semibold mt-2">{{ complaints.length }}</p></article>
        <article class="glass rounded-2xl p-4 shadow-card hover-lift"><p class="text-xs uppercase tracking-wide text-slate-500">{{ 'adminDashboard.cards.pending' | translate }}</p><p class="text-3xl font-semibold mt-2 text-amber-600">{{ pendingCount }}</p></article>
        <article class="glass rounded-2xl p-4 shadow-card hover-lift"><p class="text-xs uppercase tracking-wide text-slate-500">{{ 'adminDashboard.cards.resolved' | translate }}</p><p class="text-3xl font-semibold mt-2 text-emerald-600">{{ resolvedCount }}</p></article>
        <article class="glass rounded-2xl p-4 shadow-card hover-lift"><p class="text-xs uppercase tracking-wide text-slate-500">{{ 'adminDashboard.cards.avgResolution' | translate }}</p><p class="text-3xl font-semibold mt-2 text-primary">{{ avgResolution }}</p></article>
        <article class="glass rounded-2xl p-4 shadow-card hover-lift"><p class="text-xs uppercase tracking-wide text-slate-500">{{ 'adminDashboard.cards.activeOfficers' | translate }}</p><p class="text-3xl font-semibold mt-2 text-blue-600">{{ officers.length }}</p></article>
      </section>

      <section class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article class="glass rounded-2xl p-5 shadow-card">
          <div class="mb-4 flex items-center justify-between gap-3">
            <h3 class="font-semibold">{{ 'adminDashboard.charts.byCategory' | translate }}</h3>
            <span class="text-xs text-slate-500">Distribution</span>
          </div>
          <div class="relative h-80 min-h-[18rem] w-full">
            <canvas #categoryChart class="block h-full w-full" style="display:block;width:100%;height:100%;"></canvas>
          </div>
        </article>
        <article class="glass rounded-2xl p-5 shadow-card">
          <div class="mb-4 flex items-center justify-between gap-3">
            <h3 class="font-semibold">{{ 'adminDashboard.charts.monthly' | translate }}</h3>
            <span class="text-xs text-slate-500">Volume trend</span>
          </div>
          <div class="relative h-80 min-h-[18rem] w-full">
            <canvas #monthlyChart class="block h-full w-full" style="display:block;width:100%;height:100%;"></canvas>
          </div>
        </article>

        <article class="glass rounded-2xl p-5 shadow-card">
          <div class="mb-4 flex items-center justify-between gap-3">
            <h3 class="font-semibold">{{ 'adminDashboard.charts.resolutionTrend' | translate }}</h3>
            <span class="text-xs text-slate-500">SLA snapshot</span>
          </div>
          <div class="relative h-80 min-h-[18rem] w-full">
            <canvas #slaChart class="block h-full w-full" style="display:block;width:100%;height:100%;"></canvas>
          </div>
        </article>

        <article class="glass rounded-2xl p-5 shadow-card">
          <div class="mb-4 flex items-center justify-between gap-3">
            <h3 class="font-semibold">{{ 'adminDashboard.charts.problemZones' | translate }}</h3>
            <span class="text-xs text-slate-500">{{ 'adminDashboard.charts.zone' | translate }}</span>
          </div>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div *ngFor="let zone of zoneCards" class="rounded-xl p-3 text-white" [ngClass]="zone.colorClass">
              <p class="text-[11px] uppercase tracking-wide text-white/80">{{ zone.label }}</p>
              <p class="mt-1 text-3xl font-semibold leading-none">{{ zone.count }}</p>
            </div>
          </div>
        </article>
      </section>

      <div *ngIf="!chartOnly" class="glass rounded-2xl p-4 shadow-card overflow-x-auto">
        <div class="flex flex-col md:flex-row md:items-center gap-3 md:justify-between mb-4">
          <h3 class="font-semibold">{{ 'adminDashboard.manage.title' | translate }}</h3>
          <div class="flex gap-2">
            <input [placeholder]="'adminDashboard.manage.search' | translate" class="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-slate-700 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-400" [(ngModel)]="filters.search" />
            <select class="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-slate-700 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100" [(ngModel)]="filters.status">
              <option value="ALL">{{ 'adminDashboard.manage.all' | translate }}</option>
              <option value="PENDING">{{ 'adminDashboard.manage.pending' | translate }}</option>
              <option value="IN_PROGRESS">{{ 'adminDashboard.manage.inProgress' | translate }}</option>
              <option value="RESOLVED">{{ 'adminDashboard.manage.resolved' | translate }}</option>
              <option value="REOPENED">{{ 'adminDashboard.manage.reopened' | translate }}</option>
            </select>
          </div>
        </div>
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-slate-500 border-b">
              <th class="py-2">ID</th><th>Title</th><th>Status</th><th>Date</th><th>Assign</th><th>Priority</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of filteredComplaints()" class="border-b last:border-b-0 hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
              <td class="py-3">#{{ c.id }}</td>
              <td>{{ c.title }}</td>
              <td>{{ ('status.' + c.status) | translate }}</td>
              <td>{{ c.submissionDate | date : 'shortDate' }}</td>
              <td>
                <select class="rounded-lg border border-slate-200 bg-white/80 px-2 py-1 text-slate-700 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100" [(ngModel)]="assignForm[c.id].officerId">
                  <option value="">{{ 'adminDashboard.manage.selectOfficer' | translate }}</option>
                  <option *ngFor="let officer of officers" [value]="officer.id">{{ officer.name }}</option>
                </select>
              </td>
              <td>
                <select class="rounded-lg border border-slate-200 bg-white/80 px-2 py-1 text-slate-700 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100" [(ngModel)]="assignForm[c.id].priority">
                  <option value="LOW">{{ 'adminDashboard.manage.low' | translate }}</option>
                  <option value="MEDIUM">{{ 'adminDashboard.manage.medium' | translate }}</option>
                  <option value="HIGH">{{ 'adminDashboard.manage.high' | translate }}</option>
                </select>
              </td>
              <td>
                <button [disabled]="!canAssign(c)" (click)="assignComplaint(c.id)" class="rounded-lg bg-primary px-3 py-1 text-white disabled:opacity-50 dark:shadow-none">
                  {{ 'adminDashboard.manage.assignButton' | translate }}
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredComplaints().length === 0">
              <td colspan="7" class="py-6 text-center text-slate-500">No complaints match the current filters.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminDashboardPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('categoryChart') categoryChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('monthlyChart') monthlyChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('slaChart') slaChartRef?: ElementRef<HTMLCanvasElement>;

  complaints: Complaint[] = [];
  officers: User[] = [];
  reports = { categories: [] as Array<{ category: string; count: number }>, monthly: [] as Array<{ month: string; count: number }>, sla: [] as Array<{ id: number; days: number }> };
  assignForm: Record<number, { officerId: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' }> = {};
  filters = { search: '', status: 'ALL' };
  loading = true;
  error = '';
  warning = '';
  chartOnly = false;

  private categoryChart?: Chart;
  private monthlyChart?: Chart;
  private slaChart?: Chart;
  private chartsRendered = false;
  private isDestroyed = false;
  private renderSubject = new Subject<void>();
  private isLoadingData = false;

  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  private viewReady = false;

  private static readonly CATEGORY_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#0EA5E9', '#F43F5E', '#8B5CF6'];

  get pendingCount(): number {
    return this.complaints.filter((c) => c.status === 'PENDING').length;
  }

  get resolvedCount(): number {
    return this.complaints.filter((c) => c.status === 'RESOLVED').length;
  }

  get avgResolution(): number {
    if (this.reports.sla.length === 0) return 0;
    return Math.round(this.reports.sla.reduce((acc, item) => acc + item.days, 0) / this.reports.sla.length);
  }

  get zoneCards(): Array<{ label: string; count: number; colorClass: string }> {
    const counts = { north: 0, south: 0, east: 0, west: 0 };
    this.complaints.forEach((complaint) => {
      const value = String(complaint.location || '').toLowerCase();
      if (value.includes('north')) counts.north += 1;
      else if (value.includes('south')) counts.south += 1;
      else if (value.includes('east')) counts.east += 1;
      else counts.west += 1;
    });
    return [
      { label: 'NORTH ZONE', count: counts.north, colorClass: 'bg-blue-500' },
      { label: 'SOUTH ZONE', count: counts.south, colorClass: 'bg-emerald-500' },
      { label: 'EAST ZONE', count: counts.east, colorClass: 'bg-amber-500' },
      { label: 'WEST ZONE', count: counts.west, colorClass: 'bg-rose-500' }
    ];
  }

  async ngOnInit(): Promise<void> {
    this.chartOnly = !!this.route.snapshot.data['chartOnly'];
    this.renderSubject.pipe(debounceTime(300)).subscribe(() => {
      if (!this.isDestroyed) this.renderChartsNow();
    });
    await this.loadData();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (!this.isLoadingData && !this.error) this.scheduleChartRender();
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.renderSubject.complete();
    this.destroyCharts();
  }

  filteredComplaints(): Complaint[] {
    return this.complaints
      .filter((c) => (this.filters.status === 'ALL' ? true : c.status === this.filters.status))
      .filter((c) => c.title.toLowerCase().includes(this.filters.search.toLowerCase()))
      .sort((a, b) => +new Date(b.submissionDate) - +new Date(a.submissionDate));
  }

  async loadData(): Promise<void> {
    if (this.isLoadingData) return;
    this.isLoadingData = true;
    this.loading = true;
    this.error = '';
    this.warning = '';
    this.chartsRendered = false;

    try {
      this.destroyCharts();
      const [complaintsResult, usersResult] = await Promise.all([
        this.safeGet<Complaint[]>('/api/complaints', []),
        this.safeGet<User[]>('/api/auth/users', [])
      ]);

      this.complaints = Array.isArray(complaintsResult.data) ? complaintsResult.data : [];
      this.officers = Array.isArray(usersResult.data) ? (usersResult.data.filter((u) => u.role === 'OFFICER') || []) : [];

      this.complaints.forEach((complaint) => {
        this.assignForm[complaint.id] = {
          officerId: complaint.assignedOfficerId ? String(complaint.assignedOfficerId) : '',
          priority: complaint.priority || 'MEDIUM'
        };
      });

      if (complaintsResult.failed || usersResult.failed) {
        this.error = 'Failed to load complaints or officers. Please refresh.';
        this.isLoadingData = false;
        this.loading = false;
        return;
      }

      await this.loadAnalyticsData();
    } catch (err) {
      this.error = this.translate.instant('adminDashboard.failedLoad');
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      this.isLoadingData = false;
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  private async loadAnalyticsData(): Promise<void> {
    try {
      const [categoriesResult, monthlyResult, slaResult] = await Promise.all([
        this.safeGet<unknown>('/api/reports/categories', []),
        this.safeGet<unknown>('/api/reports/monthly', []),
        this.safeGet<unknown>('/api/reports/sla', [])
      ]);

      console.log('[AdminDashboard] Raw analytics responses:', {
        categories: categoriesResult.data,
        monthly: monthlyResult.data,
        sla: slaResult.data
      });

      const normalizedCategories = this.normalizeCategoryReport(this.extractArray(categoriesResult.data));
      const normalizedMonthly = this.normalizeMonthlyReport(this.extractArray(monthlyResult.data));
      const normalizedSla = this.normalizeSlaReport(this.extractArray(slaResult.data));
      const derivedFallback = this.buildReportsFromComplaints();
      const mockFallback = this.buildMockReports();

      this.reports = {
        categories: normalizedCategories.length > 0 ? normalizedCategories : (derivedFallback.categories.length > 0 ? derivedFallback.categories : mockFallback.categories),
        monthly: normalizedMonthly.length > 0 ? normalizedMonthly : (derivedFallback.monthly.length > 0 ? derivedFallback.monthly : mockFallback.monthly),
        sla: normalizedSla.length > 0 ? normalizedSla : (derivedFallback.sla.length > 0 ? derivedFallback.sla : mockFallback.sla)
      };

      const failedRequests = [categoriesResult, monthlyResult, slaResult].filter((r) => r.failed).length;
      const usedFallback = normalizedCategories.length === 0 || normalizedMonthly.length === 0 || normalizedSla.length === 0;
      if (failedRequests > 0) {
        this.warning = `${failedRequests} analytics source(s) unavailable. Chart may be incomplete.`;
      } else if (usedFallback) {
        this.warning = 'Analytics response was empty or partial. Showing fallback chart data.';
      }

      console.log('[AdminDashboard] Chart datasets after normalization:', this.reports);

      this.cdr.detectChanges();

      if (!this.error && !this.isDestroyed) this.scheduleChartRender();
    } catch (err) {
      console.warn('Failed to load analytics data:', err);
      this.warning = 'Unable to load analytics data. Core functionality available.';
    }
  }

  private async safeGet<T>(url: string, fallback: T): Promise<{ data: T; failed: boolean }> {
    try {
      const data = await firstValueFrom(
        this.http.get<T>(url).pipe(
          timeout(10000),
          catchError((error) => {
            console.warn(`API call to ${url} failed:`, error);
            return of(fallback);
          })
        )
      );
      return { data, failed: data === fallback };
    } catch (err) {
      console.error(`Safe get failed for ${url}:`, err);
      return { data: fallback, failed: true };
    }
  }

  async assignComplaint(complaintId: number): Promise<void> {
    const form = this.assignForm[complaintId];
    const complaint = this.complaints.find((item) => item.id === complaintId);
    if (!form?.officerId || !complaint || !this.canAssign(complaint)) return;

    try {
      await this.http
        .put('/api/complaints/assign', {
          complaintId,
          officerId: Number(form.officerId),
          priority: form.priority,
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
        .toPromise();
      await this.loadData();
    } catch (err) {
      console.error('Failed to assign complaint:', err);
      alert('Failed to assign complaint. Please try again.');
    }
  }

  toggleTheme(): void {
    this.theme.toggleTheme();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  canAssign(complaint: Complaint): boolean {
    const form = this.assignForm[complaint.id];
    if (!form?.officerId || complaint.status === 'RESOLVED') {
      return false;
    }

    const selectedOfficerId = Number(form.officerId);
    const currentOfficerId = complaint.assignedOfficerId ?? null;
    const currentPriority = complaint.priority || 'MEDIUM';

    const assignmentChanged = currentOfficerId !== selectedOfficerId || currentPriority !== form.priority;
    return assignmentChanged;
  }

  openAnalytics(): void {
    this.router.navigate(['/analytics']);
  }

  private scheduleChartRender(): void {
    if (this.chartsRendered || !this.viewReady || this.loading || !!this.error || this.isDestroyed) return;
    this.renderSubject.next();
  }

  private renderChartsNow(): void {
    if (this.chartsRendered || !this.viewReady || this.loading || !!this.error || this.isDestroyed) return;
    requestAnimationFrame(() => {
      const categoryCanvas = this.categoryChartRef?.nativeElement;
      const monthlyCanvas = this.monthlyChartRef?.nativeElement;
      const slaCanvas = this.slaChartRef?.nativeElement;

      if (categoryCanvas && monthlyCanvas && slaCanvas) {
        const hasLayout = categoryCanvas.clientWidth > 0 && monthlyCanvas.clientWidth > 0 && slaCanvas.clientWidth > 0;
        if (!hasLayout) {
          setTimeout(() => {
            if (!this.isDestroyed) this.scheduleChartRender();
          }, 120);
          return;
        }

        try {
          this.renderCharts();
          this.chartsRendered = true;
          this.cdr.detectChanges();
        } catch (err) {
          console.error('Chart render failed:', err);
        }
      }
    });
  }

  private renderCharts(): void {
    if (!this.categoryChartRef || !this.monthlyChartRef || !this.slaChartRef) return;
    this.destroyCharts();

    const mockReports = this.buildMockReports();
    const categories = this.reports.categories.length > 0 ? this.reports.categories : mockReports.categories;
    const monthly = this.reports.monthly.length > 0 ? this.reports.monthly : mockReports.monthly;
    const sla = this.reports.sla.length > 0 ? this.reports.sla : mockReports.sla;

    try {
      this.categoryChart = new Chart(this.categoryChartRef.nativeElement, {
        type: 'pie',
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 450 },
          plugins: { legend: { position: 'bottom' } }
        },
        data: {
          labels: categories.map((i) => this.translate.instant(`categories.${i.category}`)),
          datasets: [{ data: categories.map((i) => i.count), backgroundColor: AdminDashboardPageComponent.CATEGORY_COLORS }]
        }
      });

      this.monthlyChart = new Chart(this.monthlyChartRef.nativeElement, {
        type: 'bar',
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 450 },
          scales: {
            y: { beginAtZero: true, ticks: { precision: 0 } },
            x: { ticks: { autoSkip: false, maxRotation: 0, minRotation: 0 } }
          }
        },
        data: {
          labels: monthly.map((i) => i.month),
          datasets: [{ label: this.translate.instant('adminDashboard.charts.complaints'), data: monthly.map((i) => i.count), backgroundColor: '#2563EB' }]
        }
      });

      this.slaChart = new Chart(this.slaChartRef.nativeElement, {
        type: 'line',
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 450 },
          scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
          elements: { line: { tension: 0.35 } }
        },
        data: {
          labels: sla.map((i) => `#${i.id}`),
          datasets: [{ label: this.translate.instant('adminDashboard.charts.days'), data: sla.map((i) => i.days), borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.15)', fill: true }]
        }
      });

      this.categoryChart.resize();
      this.monthlyChart.resize();
      this.slaChart.resize();
    } catch (err) {
      console.error('Error rendering charts:', err);
    }
  }

  private destroyCharts(): void {
    try {
      this.categoryChart?.destroy();
      this.monthlyChart?.destroy();
      this.slaChart?.destroy();
      this.categoryChart = undefined;
      this.monthlyChart = undefined;
      this.slaChart = undefined;
    } catch (err) {
      console.warn('Error destroying charts:', err);
    }
  }

  private extractArray(value: unknown): unknown[] {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
      const asRecord = value as Record<string, unknown>;
      if (Array.isArray(asRecord['data'])) return asRecord['data'] as unknown[];
      if (Array.isArray(asRecord['items'])) return asRecord['items'] as unknown[];
      if (Array.isArray(asRecord['content'])) return asRecord['content'] as unknown[];
    }
    return [];
  }

  private normalizeCategoryReport(items: unknown[]): Array<{ category: string; count: number }> {
    return items
      .map((item) => {
        const row = item as Record<string, unknown>;
        const category = this.getStringField(row, ['category', 'name', 'label', 'type']) || 'OTHER';
        const count = this.getNumberField(row, ['count', 'total', 'value']);
        return { category: category.toUpperCase(), count };
      })
      .filter((item) => item.count > 0);
  }

  private normalizeMonthlyReport(items: unknown[]): Array<{ month: string; count: number }> {
    return items
      .map((item) => {
        const row = item as Record<string, unknown>;
        const monthRaw = this.getStringField(row, ['month', 'label', 'name']);
        const count = this.getNumberField(row, ['count', 'total', 'value']);
        return { month: this.toMonthLabel(monthRaw), count };
      })
      .filter((item) => item.count >= 0 && item.month.length > 0);
  }

  private normalizeSlaReport(items: unknown[]): Array<{ id: number; days: number }> {
    return items
      .map((item, index) => {
        const row = item as Record<string, unknown>;
        const id = this.getNumberField(row, ['id', 'complaintId', 'ticketId']) || index + 1;
        const days = this.getNumberField(row, ['days', 'resolutionDays', 'value']);
        return { id, days };
      })
      .filter((item) => item.days >= 0);
  }

  private buildReportsFromComplaints(): {
    categories: Array<{ category: string; count: number }>;
    monthly: Array<{ month: string; count: number }>;
    sla: Array<{ id: number; days: number }>;
  } {
    const categoryMap = new Map<string, number>();
    const monthlyMap = new Map<string, number>();
    const sla: Array<{ id: number; days: number }> = [];

    for (const complaint of this.complaints) {
      const category = String(complaint.category || 'OTHER').toUpperCase();
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);

      const monthValue = new Date(complaint.submissionDate).toLocaleString('en-US', { month: 'short' });
      const monthLabel = this.toMonthLabel(monthValue);
      if (monthLabel) {
        monthlyMap.set(monthLabel, (monthlyMap.get(monthLabel) || 0) + 1);
      }

      if (complaint.resolvedDate) {
        const submittedAt = new Date(complaint.submissionDate).getTime();
        const resolvedAt = new Date(complaint.resolvedDate).getTime();
        if (Number.isFinite(submittedAt) && Number.isFinite(resolvedAt)) {
          const diffMs = Math.max(resolvedAt - submittedAt, 0);
          const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
          sla.push({ id: complaint.id, days });
        }
      }
    }

    return {
      categories: Array.from(categoryMap.entries()).map(([category, count]) => ({ category, count })),
      monthly: Array.from(monthlyMap.entries()).map(([month, count]) => ({ month, count })),
      sla
    };
  }

  private buildMockReports(): {
    categories: Array<{ category: string; count: number }>;
    monthly: Array<{ month: string; count: number }>;
    sla: Array<{ id: number; days: number }>;
  } {
    return {
      categories: [
        { category: 'ROAD', count: 4 },
        { category: 'WATER', count: 3 },
        { category: 'SANITATION', count: 2 },
        { category: 'ELECTRICITY', count: 1 }
      ],
      monthly: [
        { month: 'JAN', count: 2 },
        { month: 'FEB', count: 3 },
        { month: 'MAR', count: 4 },
        { month: 'APR', count: 2 }
      ],
      sla: [
        { id: 1, days: 2 },
        { id: 2, days: 3 },
        { id: 3, days: 1 },
        { id: 4, days: 4 }
      ]
    };
  }

  private getStringField(record: Record<string, unknown>, keys: string[]): string {
    for (const key of keys) {
      const raw = record[key];
      if (typeof raw === 'string' && raw.trim().length > 0) return raw.trim();
    }
    return '';
  }

  private getNumberField(record: Record<string, unknown>, keys: string[]): number {
    for (const key of keys) {
      const raw = record[key];
      if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
      if (typeof raw === 'string' && raw.trim().length > 0) {
        const parsed = Number(raw);
        if (Number.isFinite(parsed)) return parsed;
      }
    }
    return 0;
  }

  private toMonthLabel(raw: string): string {
    if (!raw) return '';
    const trimmed = raw.trim();
    if (trimmed.length <= 3) return trimmed.toUpperCase();
    return trimmed.substring(0, 3).toUpperCase();
  }
}
