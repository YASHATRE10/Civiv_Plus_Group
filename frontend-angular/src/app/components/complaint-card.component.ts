import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Complaint } from '../shared/models';
import { STATUS_COLORS } from '../shared/constants';

@Component({
  selector: 'app-complaint-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="glass rounded-2xl p-4 shadow-card hover-lift fade-up fade-up-delay-1">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="font-semibold text-slate-800">{{ complaint.title }}</h3>
          <p class="text-xs text-slate-500 mt-1">#{{ complaint.id }} - {{ ('categories.' + complaint.category) | translate }}</p>
        </div>
        <span class="text-xs px-2 py-1 rounded-full font-medium" [ngClass]="statusColors[complaint.status]">
          {{ ('status.' + complaint.status) | translate }}
        </span>
      </div>
      <p class="text-sm text-slate-600 mt-3 line-clamp-2">{{ complaint.description }}</p>
      <div class="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
        <span>📍 {{ complaint.location }}</span>
        <span>🗓️ {{ complaint.submissionDate | date : 'shortDate' }}</span>
      </div>
      <div *ngIf="actionTemplate" class="mt-4">
        <ng-container *ngTemplateOutlet="actionTemplate"></ng-container>
      </div>
    </div>
  `
})
export class ComplaintCardComponent {
  @Input({ required: true }) complaint!: Complaint;
  @Input() actionTemplate?: TemplateRef<unknown>;
  readonly statusColors = STATUS_COLORS;
}
