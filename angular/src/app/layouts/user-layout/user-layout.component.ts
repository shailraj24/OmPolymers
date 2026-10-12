import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { CompanyService } from '../../core/services/company.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <div class="min-h-screen bg-[#f5f8ff] text-[#172554] dark:bg-[#0f172a] dark:text-[#e2e8f0] flex flex-col transition-colors duration-300">
      
      <!-- Top Navigation Header -->
      <header class="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 transition-colors">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-6">
          
          <!-- Logo & Brand Mark (Dynamic Site Logo from Backend API) -->
          <a routerLink="/" class="flex items-center gap-3 shrink-0">
            <div class="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white font-extrabold text-lg shadow-md overflow-hidden">
              <img 
                *ngIf="company.currentLogo()" 
                [src]="company.currentLogo()" 
                alt="OM Polymer Site Logo" 
                class="w-full h-full object-cover"
                (error)="onLogoError($event)"
              />
              <span *ngIf="logoFailed || !company.currentLogo()">OM</span>
            </div>
            <div>
              <span class="font-extrabold text-base tracking-tight leading-none text-[#172554] dark:text-white block">
                {{ company.companyProfile()?.companyName || 'OM POLYMER' }}
              </span>
              <span class="text-[10px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                Extrusion & Compounding
              </span>
            </div>
          </a>

          <!-- Navigation Links -->
          <nav class="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider">
            <a routerLink="/" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold" [routerLinkActiveOptions]="{exact: true}" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </a>
            <a routerLink="/products" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Products
            </a>
            <a routerLink="/blogs" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Articles
            </a>
            <a routerLink="/quote" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Request Quote
            </a>
            <a routerLink="/maintenance" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Maintenance
            </a>
          </nav>

          <!-- Action Buttons & Auth Switcher -->
          <div class="flex items-center gap-3">
            <!-- Theme Toggle -->
            <button 
              (click)="theme.toggleTheme()" 
              class="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm flex items-center justify-center text-base hover:scale-110 active:scale-95 transition-all"
              [title]="theme.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            >
              {{ theme.isDark() ? '☀️' : '🌙' }}
            </button>

            <!-- Admin Entry -->
            <ng-container *ngIf="auth.isAuthenticated(); else loginLink">
              <a routerLink="/admin/dashboard" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all">
                <span>⚡ Admin Dashboard</span>
              </a>
            </ng-container>
            <ng-template #loginLink>
              <a routerLink="/auth/login" class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors">
                Admin Login
              </a>
            </ng-template>
          </div>
        </div>
      </header>

      <!-- Main User Page Content -->
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>

      <!-- User Experience Footer -->
      <footer class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 px-6 text-xs text-slate-500 transition-colors">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="font-extrabold text-sm text-slate-800 dark:text-white">OM POLYMER</div>
            <span>· ISO 9001 Certified · High-Density Polyethylene & Polymer Extrusion</span>
          </div>
          <div class="flex items-center gap-4 text-slate-400">
            <a routerLink="/blogs" class="hover:text-blue-500 transition-colors">Engineering Insights</a>
            <a routerLink="/products" class="hover:text-blue-500 transition-colors">Products</a>
            <a routerLink="/auth/login" class="hover:text-blue-500 transition-colors">Admin Console</a>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class UserLayoutComponent implements OnInit {
  theme = inject(ThemeService);
  auth = inject(AuthService);
  company = inject(CompanyService);

  logoFailed = false;

  ngOnInit(): void {
    this.company.getCompanySettings().subscribe();
  }

  onLogoError(event: Event): void {
    this.logoFailed = true;
  }
}
