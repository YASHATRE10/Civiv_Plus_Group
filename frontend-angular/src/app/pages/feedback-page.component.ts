import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RatingStarsComponent } from '../components/rating-stars.component';
import { ToastComponent } from '../components/toast.component';
import { ThemeService } from '../core/theme.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, RatingStarsComponent, ToastComponent],
  template: `
    <div class="space-y-5">
      <app-toast [message]="toast.message" [type]="toast.type" (close)="toast.message = ''"></app-toast>

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
            <h2 class="text-2xl font-heading font-semibold md:text-3xl">{{ 'feedbackPage.title' | translate }}</h2>
            <div class="flex flex-wrap gap-2">
              <button type="button" (click)="theme.toggleTheme()" class="rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">
                {{ theme.theme() === 'dark' ? ('navbar.light' | translate) : ('navbar.dark' | translate) }}
              </button>
              <a routerLink="/citizen" class="rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">{{ 'common.dashboard' | translate }}</a>
              <a routerLink="/my-complaints" class="rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">{{ 'citizenDashboard.myComplaints' | translate }}</a>
            </div>
          </div>
          <p class="mt-2 text-sm text-slate-600">{{ 'feedbackPage.description' | translate }}</p>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article class="glass rounded-2xl p-5 shadow-card lg:col-span-2 space-y-4">
          <div class="rounded-2xl border border-slate-200 bg-white/70 p-4">
            <p class="text-sm font-semibold text-slate-700">How was the resolution quality?</p>
            <p class="mt-1 text-xs text-slate-500">Give your honest rating to help improve civic services.</p>
            <div class="mt-3">
              <app-rating-stars [value]="rating" (change)="rating = $event"></app-rating-stars>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">{{ 'feedbackPage.commentPlaceholder' | translate }}</label>
            <textarea
              [(ngModel)]="comment"
              class="min-h-32 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              [placeholder]="'feedbackPage.commentPlaceholder' | translate"
            ></textarea>
          </div>

          <div class="flex justify-end">
            <button [disabled]="loading" (click)="submitFeedback()" class="rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60">
              {{ loading ? ('feedbackPage.submitting' | translate) : ('feedbackPage.submit' | translate) }}
            </button>
          </div>
        </article>

        <article class="glass rounded-2xl p-5 shadow-card">
          <h3 class="text-lg font-semibold">Feedback Guide</h3>
          <div class="mt-3 space-y-3 text-sm">
            <div class="rounded-xl border border-slate-200 bg-white/70 p-3">
              <p class="font-semibold text-slate-700">Be specific</p>
              <p class="mt-1 text-xs text-slate-500">Mention what worked well or what could be improved.</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white/70 p-3">
              <p class="font-semibold text-slate-700">Rate fairly</p>
              <p class="mt-1 text-xs text-slate-500">Your rating helps prioritize service quality improvements.</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white/70 p-3">
              <p class="font-semibold text-slate-700">Support transparency</p>
              <p class="mt-1 text-xs text-slate-500">Every feedback entry improves accountability in the workflow.</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  `
})
export class FeedbackPageComponent {
  rating = 4;
  comment = '';
  loading = false;
  toast: { message: string; type: 'success' | 'error' } = { message: '', type: 'success' };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly http: HttpClient,
    private readonly router: Router,
    public readonly theme: ThemeService,
    private readonly translate: TranslateService
  ) {}

  async submitFeedback(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    try {
      await this.http.post('/api/feedback', { complaintId: id, rating: this.rating, comment: this.comment }).toPromise();
      await this.router.navigateByUrl('/citizen');
    } catch {
      this.toast = { message: this.translate.instant('feedbackPage.failed'), type: 'error' };
    } finally {
      this.loading = false;
    }
  }
}
