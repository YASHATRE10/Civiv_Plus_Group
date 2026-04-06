import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="flex items-center gap-2">
      <button *ngFor="let num of stars" type="button" (click)="change.emit(num)" [attr.aria-label]="('ratingStars.rate' | translate: { value: num })">
        <span class="text-2xl" [ngClass]="num <= value ? 'text-amber-400' : 'text-slate-300'">★</span>
      </button>
    </div>
  `
})
export class RatingStarsComponent {
  @Input() value = 0;
  @Output() change = new EventEmitter<number>();
  stars = [1, 2, 3, 4, 5];
}
