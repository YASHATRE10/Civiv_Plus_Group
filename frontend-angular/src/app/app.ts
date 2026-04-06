import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalLanguageSwitcherComponent } from './components/global-language-switcher.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalLanguageSwitcherComponent],
  templateUrl: './app.html'
})
export class App {}
