import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { interval, Subscription } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { ThemeService } from '../core/theme.service';
import { NotificationItem } from '../shared/models';
import { LANGUAGE_STORAGE_KEY } from '../shared/constants';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  template: `
    <header class="glass shadow-soft rounded-2xl px-4 py-3 md:px-6 flex items-center justify-between fade-up">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center relative">
          <span class="text-primary">🏢</span>
          <span class="absolute -right-1 -top-1 text-xs">✨</span>
        </div>
        <div>
          <h1 class="text-lg font-heading font-semibold">CivicPulse 🏙️</h1>
          <p class="text-xs text-slate-500">{{ 'navbar.tagline' | translate }} 🚦</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <select
          [ngModel]="currentLanguage"
          (ngModelChange)="changeLanguage($event)"
          class="appearance-none rounded-lg border border-slate-200 bg-white/80 px-2.5 py-2 pr-7 text-xs sm:text-sm font-medium text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="en">{{ 'navbar.english' | translate }}</option>
          <option value="hi">{{ 'navbar.hindi' | translate }}</option>
          <option value="mr">{{ 'navbar.marathi' | translate }}</option>
        </select>
        <button type="button" (click)="theme.toggleTheme()" class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 hover-lift">
          {{ theme.theme() === 'dark' ? ('navbar.light' | translate) : ('navbar.dark' | translate) }}
        </button>

        <div class="relative">
          <button type="button" (click)="toggleNotifications()" class="relative p-2 rounded-lg hover:bg-white/60 transition hover-lift">🔔
            <span *ngIf="unreadCount > 0" class="absolute -right-1 -top-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] leading-4 text-center">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
          </button>

          <div *ngIf="showNotifications" class="absolute right-0 mt-2 w-[320px] max-h-[420px] overflow-auto rounded-2xl border border-slate-200 bg-white shadow-card z-30">
            <div class="p-3 border-b border-slate-100 flex items-center justify-between">
              <p class="text-sm font-semibold text-slate-800">{{ 'navbar.notifications' | translate }}</p>
              <button type="button" (click)="markAllAsRead()" class="text-xs text-primary font-medium" [disabled]="!hasUnread()">{{ 'navbar.markAllRead' | translate }}</button>
            </div>

            <p *ngIf="loadingNotifications" class="p-4 text-sm text-slate-500">{{ 'navbar.loadingNotifications' | translate }}</p>
            <p *ngIf="!loadingNotifications && notifications.length === 0" class="p-4 text-sm text-slate-500">{{ 'navbar.noNotifications' | translate }}</p>

            <div *ngIf="!loadingNotifications && notifications.length > 0" class="divide-y divide-slate-100">
              <div *ngFor="let item of notifications" class="p-3" [ngClass]="item.read ? 'bg-white' : 'bg-emerald-50/40'">
                <p class="text-sm text-slate-700">{{ item.message }}</p>
                <div class="mt-2 flex items-center justify-between gap-2">
                  <span class="text-[11px] text-slate-500">{{ item.createdAt | date : 'short' }}</span>
                  <div class="flex items-center gap-2">
                    <a *ngIf="item.complaintId" [routerLink]="'/complaints/' + item.complaintId" class="text-xs text-primary font-medium" (click)="showNotifications = false">{{ 'navbar.viewComplaint' | translate }}</a>
                    <button *ngIf="!item.read" type="button" (click)="markOneAsRead(item.id)" class="text-xs text-slate-600 font-medium">{{ 'navbar.markRead' | translate }}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-right hidden sm:block">
          <p class="text-sm font-semibold">{{ auth.user()?.name }}</p>
          <p class="text-xs uppercase text-slate-500">{{ auth.user()?.role }}</p>
        </div>
        <button type="button" (click)="auth.logout()" class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 hover-lift">
          {{ 'common.logout' | translate }}
        </button>
      </div>
    </header>
  `
})
export class NavbarComponent implements OnInit, OnDestroy {
  showNotifications = false;
  notifications: NotificationItem[] = [];
  unreadCount = 0;
  loadingNotifications = false;
  currentLanguage = 'en';

  private pollingSub?: Subscription;

  constructor(
    public readonly auth: AuthService,
    public readonly theme: ThemeService,
    private readonly http: HttpClient,
    private readonly translate: TranslateService
  ) {
    this.currentLanguage = this.translate.currentLang || localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
  }

  ngOnInit(): void {
    this.fetchNotifications();
    this.pollingSub = interval(15000).subscribe(() => this.fetchNotifications());
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    if (!target.closest('.relative')) {
      this.showNotifications = false;
    }
  }

  changeLanguage(language: string): void {
    this.currentLanguage = language;
    this.translate.use(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }

  async fetchNotifications(): Promise<void> {
    if (!this.auth.user()) {
      return;
    }

    this.loadingNotifications = true;
    try {
      const data = await this.http.get<{ items: NotificationItem[]; unreadCount: number }>('/api/notifications/my').toPromise();
      this.notifications = data?.items || [];
      this.unreadCount = data?.unreadCount || 0;
    } catch {
      this.notifications = [];
      this.unreadCount = 0;
    } finally {
      this.loadingNotifications = false;
    }
  }

  async markOneAsRead(notificationId: number): Promise<void> {
    try {
      await this.http.put(`/api/notifications/${notificationId}/read`, {}).toPromise();
      this.notifications = this.notifications.map((item) =>
        item.id === notificationId ? { ...item, read: true } : item
      );
      this.unreadCount = Math.max(0, this.unreadCount - 1);
    } catch {
      // Ignore local UI update errors.
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await this.http.put('/api/notifications/read-all', {}).toPromise();
      this.notifications = this.notifications.map((item) => ({ ...item, read: true }));
      this.unreadCount = 0;
    } catch {
      // Ignore local UI update errors.
    }
  }

  hasUnread(): boolean {
    return this.notifications.some((item) => !item.read);
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.fetchNotifications();
    }
  }
}
