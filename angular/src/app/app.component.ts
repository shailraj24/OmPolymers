import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <div class="min-h-screen">
      <router-outlet></router-outlet>
      <app-toast></app-toast>
    </div>
  `
})
export class AppComponent {
  private themeService = inject(ThemeService);
}
