import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4">
      <header class="max-w-7xl w-full mx-auto py-4 flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center font-bold text-white shadow-md">
            OM
          </div>
          <span class="font-bold text-base tracking-tight text-white">OM POLYMER</span>
        </a>
        <a routerLink="/" class="text-xs text-slate-400 hover:text-white transition-colors">
          ← Back to Client Portal
        </a>
      </header>

      <main class="flex-1 flex items-center justify-center py-8">
        <router-outlet></router-outlet>
      </main>

      <footer class="text-center py-4 text-xs text-slate-500">
        © 2026 OM POLYMER · Administrative Access Portal · ISO 9001
      </footer>
    </div>
  `
})
export class PublicLayoutComponent {}
