import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { CompanyService } from '../../core/services/company.service';
import { APP_CONSTANTS } from '../../core/constants/app.constant';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <div class="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-[#0b132b] dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      <!-- Top Utility Notification Bar -->
      <div class="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-6 border-b border-slate-800">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center gap-1.5 text-blue-400 font-semibold tracking-wide uppercase text-[10px]">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              ISO 9001:2015 Certified Extrusion Facility
            </span>
            <span class="hidden md:inline text-slate-600">|</span>
            <span class="hidden md:inline text-slate-400">Continuous PE100 Virgin Compounding · Vegdi GIDC, Dhoraji, Gujarat</span>
          </div>
          <div class="flex items-center gap-4 text-slate-300">
            <a [href]="phoneTel" class="hover:text-white transition-colors flex items-center gap-1.5">
              <svg class="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span class="font-mono">{{ phone }}</span>
            </a>
            <span class="text-slate-700">·</span>
            <a [href]="emailMailto" class="hover:text-white transition-colors hidden sm:flex items-center gap-1.5">
              <svg class="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{{ email }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Main Navigation Header -->
      <header class="sticky top-0 z-40 bg-white/95 dark:bg-[#0e1726]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-6 py-3.5 transition-colors shadow-xs">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-6">
          
          <!-- Logo & Brand Mark -->
          <a routerLink="/" class="flex items-center gap-3 shrink-0 group">
            <div class="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 border border-blue-600/30 flex items-center justify-center text-white font-extrabold text-lg shadow-sm overflow-hidden group-hover:border-blue-500 transition-colors">
              <img 
                *ngIf="company.currentLogo()" 
                [src]="company.currentLogo()" 
                alt="OM Polymer Corporate Logo" 
                class="w-full h-full object-cover"
                (error)="onLogoError($event)"
              />
              <span *ngIf="logoFailed || !company.currentLogo()">OM</span>
            </div>
            <div>
              <span class="font-extrabold text-base tracking-tight leading-none text-slate-900 dark:text-white block">
                {{ company.companyProfile()?.companyName || 'OM POLYMER' }}
              </span>
              <span class="text-[10px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                Piping Infrastructure & Extrusion
              </span>
            </div>
          </a>

          <!-- Desktop Navigation Links -->
          <nav class="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider">
            <a routerLink="/" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold" [routerLinkActiveOptions]="{exact: true}" class="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </a>
            <a routerLink="/products" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold" class="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Products Catalog
            </a>
            <a routerLink="/blogs" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold" class="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Technical Papers
            </a>
            <a routerLink="/quote" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold" class="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Request RFQ
            </a>
          </nav>

          <!-- Desktop Actions -->
          <div class="hidden md:flex items-center gap-3">
            <!-- Theme Toggle -->
            <button 
              (click)="theme.toggleTheme()" 
              class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 shadow-2xs flex items-center justify-center transition-all"
              [title]="theme.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
              aria-label="Toggle Theme"
            >
              <svg *ngIf="theme.isDark()" class="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg *ngIf="!theme.isDark()" class="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>

            <!-- WhatsApp Direct Action -->
            <button 
              (click)="openWhatsApp()"
              class="px-3.5 py-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-500/20 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.13.332.202.043.073.043.419-.101.824z"/>
              </svg>
              <span>WhatsApp Desk</span>
            </button>

            <!-- RFQ Primary CTA -->
            <a 
              routerLink="/quote" 
              class="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
            >
              <span>Request Quote</span>
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          <!-- Mobile Hamburger Toggle -->
          <div class="flex items-center gap-2 md:hidden">
            <button 
              (click)="theme.toggleTheme()" 
              class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center"
              aria-label="Toggle Theme"
            >
              <svg *ngIf="theme.isDark()" class="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg *ngIf="!theme.isDark()" class="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>

            <button 
              (click)="toggleMobileMenu()" 
              class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <svg *ngIf="!isMobileMenuOpen()" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg *ngIf="isMobileMenuOpen()" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Drawer Navigation -->
        <div 
          *ngIf="isMobileMenuOpen()" 
          class="md:hidden border-t border-slate-200 dark:border-slate-800 mt-3 pt-4 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <nav class="flex flex-col space-y-1 text-sm font-semibold">
            <a 
              routerLink="/" 
              (click)="closeMobileMenu()" 
              routerLinkActive="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold" 
              [routerLinkActiveOptions]="{exact: true}" 
              class="px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Home
            </a>
            <a 
              routerLink="/products" 
              (click)="closeMobileMenu()" 
              routerLinkActive="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold" 
              class="px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Products Catalog
            </a>
            <a 
              routerLink="/blogs" 
              (click)="closeMobileMenu()" 
              routerLinkActive="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold" 
              class="px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Technical Papers
            </a>
            <a 
              routerLink="/quote" 
              (click)="closeMobileMenu()" 
              routerLinkActive="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold" 
              class="px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Request Quotation (RFQ)
            </a>
          </nav>

          <div class="px-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
            <button 
              (click)="openWhatsApp(); closeMobileMenu()" 
              class="w-full py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <span>WhatsApp Materials Desk</span>
            </button>
            <a 
              routerLink="/quote" 
              (click)="closeMobileMenu()" 
              class="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs text-center shadow-md"
            >
              Submit Project Specifications (RFQ)
            </a>
          </div>
        </div>
      </header>

      <!-- Main Viewport Router Outlet -->
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>

      <!-- Industrial Authority Footer -->
      <footer class="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs">
        <div class="max-w-7xl mx-auto px-6 py-12 space-y-10">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <!-- Col 1: Corporate Identity & Accreditation -->
            <div class="space-y-4 md:col-span-1">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                  OM
                </div>
                <span class="font-bold text-sm tracking-tight text-white uppercase">OM Polymer</span>
              </div>
              <p class="text-[11px] text-slate-400 leading-relaxed">
                Manufacturer of high-density polyethylene (HDPE PE100/PE80) pressure conduits, PP-R conduits, and engineered masterbatch compounds.
              </p>
              <div class="space-y-1 text-[11px] text-slate-300">
                <div class="flex items-center gap-1.5 font-medium text-emerald-400">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>ISO 9001:2015 Accredited</span>
                </div>
                <div class="text-slate-400">Tested to IS 4984 / ISO 4427 / ASTM D3035</div>
              </div>
            </div>

            <!-- Col 2: Engineering Lines -->
            <div class="space-y-3">
              <div class="font-bold text-white uppercase tracking-wider text-[11px]">Manufactured Lines</div>
              <ul class="space-y-2 text-[11px]">
                <li><a routerLink="/products" class="hover:text-blue-400 transition-colors">HDPE PE100 Pressure Pipes</a></li>
                <li><a routerLink="/products" class="hover:text-blue-400 transition-colors">Micro-Irrigation Poly Tubes</a></li>
                <li><a routerLink="/products" class="hover:text-blue-400 transition-colors">MDPE Industrial Gas Lines</a></li>
                <li><a routerLink="/products" class="hover:text-blue-400 transition-colors">PP-R Hot & Cold Conduits</a></li>
                <li><a routerLink="/products" class="hover:text-blue-400 transition-colors">Custom Polymer Masterbatches</a></li>
              </ul>
            </div>

            <!-- Col 3: Technical Resources & Legal -->
            <div class="space-y-3">
              <div class="font-bold text-white uppercase tracking-wider text-[11px]">Engineering Resources</div>
              <ul class="space-y-2 text-[11px]">
                <li><a routerLink="/blogs" class="hover:text-blue-400 transition-colors">Technical Whitepapers & Research</a></li>
                <li><a routerLink="/quote" class="hover:text-blue-400 transition-colors">Project Tender Quotation (RFQ)</a></li>
                <li><a routerLink="/products" class="hover:text-blue-400 transition-colors">Hydrostatic Testing Standards</a></li>
                <li><a [href]="mapsUrl" target="_blank" rel="noopener noreferrer" class="hover:text-blue-400 transition-colors">Factory Directions & Dispatch</a></li>
              </ul>
            </div>

            <!-- Col 4: Works & Plant Logistics -->
            <div class="space-y-3">
              <div class="font-bold text-white uppercase tracking-wider text-[11px]">Factory & Dispatch Desk</div>
              <div class="text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
                <div><strong>Works:</strong> Plot No. 59, Vegdi GIDC Industrial Area</div>
                <div>Dhoraji, Rajkot District, Gujarat 360410, India</div>
                <div class="pt-1 font-mono text-slate-300">Direct: {{ phone }}</div>
                <div class="text-blue-400">{{ email }}</div>
              </div>
            </div>

          </div>

          <!-- Bottom Bar with Discrete Internal Sign-In -->
          <div class="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 OM Polymer Extrusion & Compounding. All rights reserved.
            </div>
            
            <div class="flex items-center gap-4 text-slate-400">
              <a routerLink="/quote" class="hover:text-slate-200 transition-colors">Tender Desk</a>
              <span>·</span>
              <a [href]="mapsUrl" target="_blank" rel="noopener noreferrer" class="hover:text-slate-200 transition-colors">Plant Map</a>
              <span>·</span>
              <!-- Discrete Internal Admin Sign-in Link -->
              <a routerLink="/auth/login" class="text-slate-500 hover:text-slate-300 transition-colors font-mono">
                Admin Console
              </a>
            </div>
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
  isMobileMenuOpen = signal(false);

  phone: string = APP_CONSTANTS.DEFAULT_CONTACT.PHONE;
  phoneTel: string = APP_CONSTANTS.DEFAULT_CONTACT.PHONE_TEL;
  email: string = APP_CONSTANTS.DEFAULT_CONTACT.EMAIL;
  emailMailto: string = APP_CONSTANTS.DEFAULT_CONTACT.EMAIL_MAILTO;
  mapsUrl: string = APP_CONSTANTS.DEFAULT_CONTACT.MAPS_URL;
  whatsappNumber: string = '918866246042';

  ngOnInit(): void {
    this.company.getCompanySettings().subscribe(res => {
      if (res.success && res.data) {
        if (res.data.phoneContact) {
          this.phone = res.data.phoneContact;
          this.phoneTel = `tel:${res.data.phoneContact.replace(/\s+/g, '')}`;
        }
        if (res.data.emailContact) {
          this.email = res.data.emailContact;
          this.emailMailto = `mailto:${res.data.emailContact}`;
        }
        if (res.data.whatsappContact) {
          this.whatsappNumber = res.data.whatsappContact.replace(/\D/g, '');
        }
      }
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  onLogoError(event: Event): void {
    this.logoFailed = true;
  }

  openWhatsApp(): void {
    const text = encodeURIComponent('Hello OM Polymer Team, I would like to inquire regarding pipe specifications and commercial supply terms.');
    window.location.href = `https://wa.me/${this.whatsappNumber}?text=${text}`;
  }
}
