import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar.component';
import { SidebarComponent } from '../components/sidebar.component';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div class="max-w-7xl mx-auto p-4 md:p-6 space-y-4 page-enter">
      <app-navbar></app-navbar>
      <div class="grid grid-cols-1 md:grid-cols-[230px_1fr] gap-4">
        <app-sidebar [role]="auth.user()?.role"></app-sidebar>
        <main class="fade-up fade-up-delay-1">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AppLayoutComponent {
  constructor(public readonly auth: AuthService) {}
}
