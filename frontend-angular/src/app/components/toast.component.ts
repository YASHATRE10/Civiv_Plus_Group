import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" class="fixed right-4 top-4 z-50">
      <div class="rounded-xl px-4 py-3 text-sm shadow-card" [ngClass]="type === 'error' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'">
        <div class="flex items-center gap-3">
          <span>{{ message }}</span>
          <button type="button" (click)="close.emit()" class="font-bold" aria-label="Close notification">x</button>
        </div>
      </div>
    </div>
  `
})
export class ToastComponent {
  @Input() message = '';
  @Input() type: 'success' | 'error' = 'success';
  @Output() close = new EventEmitter<void>();
}
