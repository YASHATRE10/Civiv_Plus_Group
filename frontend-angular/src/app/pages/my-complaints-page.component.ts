import { Component } from '@angular/core';
import { CitizenDashboardPageComponent } from './citizen-dashboard-page.component';

@Component({
  standalone: true,
  imports: [CitizenDashboardPageComponent],
  template: `<app-citizen-dashboard-page></app-citizen-dashboard-page>`
})
export class MyComplaintsPageComponent {}
