import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <div class="min-h-screen px-4 py-8 md:py-12 page-enter">
      <div class="mx-auto max-w-6xl space-y-8">
        <header class="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6 shadow-soft md:p-10 fade-up">
          <div class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-2xl"></div>
          <div class="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary/15 blur-2xl"></div>

          <div class="relative">
            <p class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              {{ 'landing.badge' | translate }}
            </p>
            <h1 class="mt-3 text-3xl font-heading font-bold leading-tight text-slate-900 md:text-5xl">
              {{ 'landing.title' | translate }}
            </h1>
            <p class="mt-4 max-w-3xl text-base text-slate-600 md:text-lg">{{ 'landing.description' | translate }}</p>

            <div class="mt-7 flex flex-wrap gap-3">
              <a
                *ngIf="auth.user(); else loggedOut"
                routerLink="/dashboard"
                class="rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-soft hover-lift btn-shine"
              >
                {{ 'landing.openDashboard' | translate }}
              </a>
              <ng-template #loggedOut>
                <a routerLink="/login" class="rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-soft hover-lift btn-shine">{{ 'landing.login' | translate }}</a>
                <a routerLink="/register" class="rounded-xl bg-secondary px-5 py-3 font-semibold text-white shadow-soft hover-lift btn-shine">{{ 'landing.createAccount' | translate }}</a>
              </ng-template>
            </div>

            <div class="mt-8 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              <div class="rounded-2xl border border-white/70 bg-white/70 p-3 shadow-sm">
                <p class="text-slate-500">Citizens</p>
                <p class="mt-1 text-lg font-semibold text-slate-900">Report and track issues</p>
              </div>
              <div class="rounded-2xl border border-white/70 bg-white/70 p-3 shadow-sm">
                <p class="text-slate-500">Officers</p>
                <p class="mt-1 text-lg font-semibold text-slate-900">Manage and resolve faster</p>
              </div>
              <div class="rounded-2xl border border-white/70 bg-white/70 p-3 shadow-sm">
                <p class="text-slate-500">Admins</p>
                <p class="mt-1 text-lg font-semibold text-slate-900">Monitor city-wide insights</p>
              </div>
            </div>
          </div>
        </header>

        <section class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article class="glass rounded-2xl border border-white/60 p-5 shadow-card hover-lift fade-up fade-up-delay-1">
            <p class="text-2xl">📍</p>
            <h3 class="mt-3 text-lg font-semibold text-slate-900">{{ 'landing.highlights.tracking.title' | translate }}</h3>
            <p class="mt-2 text-sm text-slate-600">{{ 'landing.highlights.tracking.description' | translate }}</p>
          </article>
          <article class="glass rounded-2xl border border-white/60 p-5 shadow-card hover-lift fade-up fade-up-delay-1">
            <p class="text-2xl">🔎</p>
            <h3 class="mt-3 text-lg font-semibold text-slate-900">{{ 'landing.highlights.transparency.title' | translate }}</h3>
            <p class="mt-2 text-sm text-slate-600">{{ 'landing.highlights.transparency.description' | translate }}</p>
          </article>
          <article class="glass rounded-2xl border border-white/60 p-5 shadow-card hover-lift fade-up fade-up-delay-1">
            <p class="text-2xl">🛡️</p>
            <h3 class="mt-3 text-lg font-semibold text-slate-900">{{ 'landing.highlights.reporting.title' | translate }}</h3>
            <p class="mt-2 text-sm text-slate-600">{{ 'landing.highlights.reporting.description' | translate }}</p>
          </article>
        </section>

        <section class="glass rounded-3xl border border-white/60 p-6 shadow-card md:p-8">
          <h2 class="text-xl font-heading font-semibold text-slate-900 md:text-2xl">{{ 'landing.howItWorks' | translate }}</h2>
          <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <article class="rounded-2xl border border-slate-200 bg-white/70 p-4">
              <p class="text-sm font-semibold uppercase tracking-wide text-primary">{{ 'landing.steps.oneTitle' | translate }}</p>
              <p class="mt-2 text-sm text-slate-600">{{ 'landing.steps.oneDescription' | translate }}</p>
            </article>
            <article class="rounded-2xl border border-slate-200 bg-white/70 p-4">
              <p class="text-sm font-semibold uppercase tracking-wide text-primary">{{ 'landing.steps.twoTitle' | translate }}</p>
              <p class="mt-2 text-sm text-slate-600">{{ 'landing.steps.twoDescription' | translate }}</p>
            </article>
            <article class="rounded-2xl border border-slate-200 bg-white/70 p-4">
              <p class="text-sm font-semibold uppercase tracking-wide text-primary">{{ 'landing.steps.threeTitle' | translate }}</p>
              <p class="mt-2 text-sm text-slate-600">{{ 'landing.steps.threeDescription' | translate }}</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  `
})
export class LandingPageComponent {
  constructor(public readonly auth: AuthService) {}
}
