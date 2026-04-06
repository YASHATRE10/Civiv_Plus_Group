import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LANGUAGE_STORAGE_KEY } from '../shared/constants';

@Component({
  selector: 'app-global-language-switcher',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
      <label for="global-language-switcher" class="sr-only">{{ 'navbar.language' | translate }}</label>
      <select
        id="global-language-switcher"
        [ngModel]="currentLanguage"
        (ngModelChange)="changeLanguage($event)"
        class="appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2 pr-8 text-xs sm:text-sm font-medium text-slate-700 shadow-card backdrop-blur-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="en">{{ 'navbar.english' | translate }}</option>
        <option value="hi">{{ 'navbar.hindi' | translate }}</option>
        <option value="mr">{{ 'navbar.marathi' | translate }}</option>
      </select>
    </div>
  `
})
export class GlobalLanguageSwitcherComponent {
  currentLanguage = 'en';

  constructor(private readonly translate: TranslateService) {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const initial = saved || 'en';
    this.currentLanguage = initial;
    this.translate.setDefaultLang('en');
    this.translate.use(initial);
  }

  changeLanguage(language: string): void {
    this.currentLanguage = language;
    this.translate.use(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
}
