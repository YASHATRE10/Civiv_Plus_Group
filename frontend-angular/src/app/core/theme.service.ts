import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<'light' | 'dark'>('light');

  constructor() {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const initial = saved || (systemDark ? 'dark' : 'light');
    this.theme.set(initial);
    this.apply(initial);
  }

  toggleTheme(): void {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    this.apply(next);
  }

  private apply(theme: 'light' | 'dark'): void {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }
}
