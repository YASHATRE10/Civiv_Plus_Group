import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserRole } from '../shared/models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  template: `
    <aside class="glass rounded-2xl p-4 shadow-card h-fit fade-up fade-up-delay-1">
      <p class="text-xs uppercase text-slate-500 mb-3">{{ 'sidebar.navigation' | translate }} 🧭</p>
      <nav class="space-y-2">
        <a
          *ngFor="let item of menuItems"
          [routerLink]="item.path"
          routerLinkActive="bg-primary text-white shadow-soft"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex items-center gap-3 rounded-xl px-3 py-2 transition hover-lift hover:bg-white/70 text-slate-600"
        >
          <span>{{ item.emoji }}</span>
          <span class="text-sm font-medium">{{ item.labelKey | translate }}</span>
        </a>
      </nav>
    </aside>
  `
})
export class SidebarComponent {
  @Input() role: UserRole | undefined;

  get menuItems() {
    const roleMenus: Record<string, Array<{ path: string; labelKey: string; emoji: string }>> = {
      CITIZEN: [
        { path: '/citizen', labelKey: 'sidebar.citizen.dashboard', emoji: '📊' },
        { path: '/submit', labelKey: 'sidebar.citizen.submit', emoji: '📨' },
        { path: '/my-complaints', labelKey: 'sidebar.citizen.myComplaints', emoji: '📋' }
      ],
      ADMIN: [
        { path: '/admin', labelKey: 'sidebar.admin.dashboard', emoji: '🛠️' },
        { path: '/analytics', labelKey: 'sidebar.admin.analytics', emoji: '📈' }
      ],
      OFFICER: [
        { path: '/officer', labelKey: 'sidebar.officer.panel', emoji: '🚓' },
        { path: '/officer-analytics', labelKey: 'sidebar.officer.analytics', emoji: '📊' }
      ]
    };
    return roleMenus[this.role || ''] || [];
  }
}
