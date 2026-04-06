import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="min-h-[240px] grid place-items-center" aria-label="Loading">
      <div class="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
    </div>
  `
})
export class LoaderComponent {}
