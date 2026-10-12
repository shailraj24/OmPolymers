import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { CompanyService } from '../../core/services/company.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      <!-- Collapsible / Fixed Admin Sidebar -->
      <aside class="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
        <div>
          <!-- Sidebar Header Brand with Dynamic Site Logo -->
          <div class="flex items-center gap-3 mb-8">
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
              <span class="font-extrabold text-sm tracking-tight text-white block">
                {{ company.companyProfile()?.companyName || 'OM POLYMER' }}
              </span>
              <span class="text-[10px] font-bold tracking-wider uppercase text-blue-400">Admin Control</span>
            </div>
          </div>

          <!-- Role Pill -->
          <div class="mb-6 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div class="text-[11px] text-slate-400">Logged in as</div>
              <div class="text-xs font-semibold text-white truncate max-w-[130px]">{{ auth.adminName() }}</div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
              [ngClass]="auth.isSuperAdmin() ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'">
              {{ auth.role() }}
            </span>
          </div>

          <!-- Navigation Links -->
          <nav class="space-y-1 text-xs font-medium">
            <a routerLink="/admin/dashboard" routerLinkActive="bg-blue-600 text-white font-semibold" class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
              <span>📊</span> Dashboard Overview
            </a>
            <a routerLink="/admin/inquiries" routerLinkActive="bg-blue-600 text-white font-semibold" class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
              <span>📋</span> Inquiries CRM
            </a>
            <a routerLink="/admin/products" routerLinkActive="bg-blue-600 text-white font-semibold" class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
              <span>📦</span> Product Catalog
            </a>
            <a routerLink="/admin/blogs" routerLinkActive="bg-blue-600 text-white font-semibold" class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
              <span>📝</span> Articles & Blogs
            </a>
            <a routerLink="/admin/logs" routerLinkActive="bg-blue-600 text-white font-semibold" class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
              <span>📜</span> System Logs
            </a>
            <a routerLink="/admin/company" routerLinkActive="bg-blue-600 text-white font-semibold" class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
              <span>🏢</span> Company & WhatsApp
            </a>

            <!-- SuperAdmin Exclusive Navigation Link -->
            <a 
              *ngIf="auth.isSuperAdmin()"
              routerLink="/admin/users" 
              routerLinkActive="bg-blue-600 text-white font-semibold" 
              class="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <div class="flex items-center gap-3">
                <span>🛡️</span> Administrators
              </div>
              <span class="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">Root</span>
            </a>
          </nav>
        </div>

        <!-- Sidebar Bottom Actions -->
        <div class="pt-6 border-t border-slate-800 space-y-2 text-xs">
          <a routerLink="/" class="flex items-center gap-2 px-3.5 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <span>🌐</span> Client Portal
          </a>
          <button (click)="handleLogout()" class="w-full text-left flex items-center gap-2 px-3.5 py-2 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors font-medium">
            <span>🚪</span> Log Out
          </button>
        </div>
      </aside>

      <!-- Main Admin Workspace Viewport -->
      <main class="flex-1 flex flex-col overflow-x-hidden">
        <header class="bg-slate-900/60 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
          <div class="text-xs text-slate-400">
            Administrative Console · <span class="text-slate-200 font-medium">OM Polymer Platform</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="text-xs font-mono text-emerald-400">API Connected</span>
          </div>
        </header>

        <div class="flex-1 p-6 md:p-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AdminLayoutComponent implements OnInit {
  auth = inject(AuthService);
  company = inject(CompanyService);
  private toast = inject(ToastService);
  private router = inject(Router);

  logoFailed = false;

  ngOnInit(): void {
    this.company.getCompanySettings().subscribe();
  }

  onLogoError(event: Event): void {
    this.logoFailed = true;
  }

  handleLogout(): void {
    this.auth.logout();
    this.toast.info('You have logged out of the Admin Panel.');
    this.router.navigate(['/']);
  }
}
