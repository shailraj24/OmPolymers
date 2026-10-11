import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CompanyService } from '../../../core/services/company.service';
import { Product } from '../../../core/models/product.model';
import { CompanySettings } from '../../../core/models/company.model';
import { APP_CONSTANTS } from '../../../core/constants/app.constant';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-16 py-10 px-6 max-w-7xl mx-auto">
      
      <!-- Hero Section -->
      <section class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 p-8 sm:p-14 text-white shadow-2xl">
        <div class="max-w-2xl space-y-6 relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            ISO 9001:2015 CERTIFIED MANUFACTURING
          </div>
          <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Advanced Polymer Extrusion & High-Tensile Piping Solutions
          </h1>
          <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
            Delivering high-density polyethylene (HDPE) pipes, custom compounding resins, and specialized industrial polymers designed for extreme hydrostatic pressures.
          </p>
          <div class="flex flex-wrap gap-3 pt-2">
            <a routerLink="/products" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95">
              Browse Products Catalog
            </a>
            <a routerLink="/quote" class="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs transition-colors">
              Request Technical Quote
            </a>
          </div>
        </div>
      </section>

      <!-- Key Engineering Statistics -->
      <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400">13+</div>
          <div class="text-xs text-slate-500 mt-1">Years of Manufacturing</div>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400">50K+</div>
          <div class="text-xs text-slate-500 mt-1">Metric Tons Annual Output</div>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400">ISO</div>
          <div class="text-xs text-slate-500 mt-1">9001:2015 Accredited</div>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400">100%</div>
          <div class="text-xs text-slate-500 mt-1">Virgin Polymer Raw Resins</div>
        </div>
      </section>

      <!-- Featured Products Grid -->
      <section class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">Featured Industrial Products</h2>
            <p class="text-xs text-slate-500 mt-1">Pre-tested specifications conforming to ISO 4427 and ASTM standards</p>
          </div>
          <a routerLink="/products" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            View All Products →
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let p of featuredProducts()" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-xl transition-all">
            <div class="p-5 space-y-3">
              <span class="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {{ p.category?.categoryName || 'Industrial' }}
              </span>
              <h3 class="font-bold text-base leading-tight">{{ p.productName }}</h3>
              <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">{{ p.shortDescription }}</p>
            </div>
            <div class="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 mt-4">
              <a [routerLink]="['/products', p.slug]" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                View Specs
              </a>
              <a routerLink="/quote" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-slate-800 text-white hover:bg-blue-600 transition-colors">
                Request RFQ
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Interactive Contact Cards from Design Reference -->
      <section class="space-y-6 pt-6">
        <div class="text-center max-w-xl mx-auto">
          <h2 class="text-2xl font-bold">Direct Engineering Contacts</h2>
          <p class="text-xs text-slate-500 mt-1">Connect directly with our materials engineering sales desk</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a [href]="phoneTel" class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl text-center space-y-2 transition-all hover:-translate-y-1">
            <div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 mx-auto flex items-center justify-center text-xl">📞</div>
            <div class="font-bold text-sm">Phone Support</div>
            <div class="text-xs font-mono text-slate-500">{{ phone }}</div>
          </a>

          <a [href]="emailMailto" class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl text-center space-y-2 transition-all hover:-translate-y-1">
            <div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 mx-auto flex items-center justify-center text-xl">✉️</div>
            <div class="font-bold text-sm">Email Inquiry</div>
            <div class="text-xs text-slate-500">{{ email }}</div>
          </a>

          <a [href]="mapsUrl" target="_blank" rel="noopener noreferrer" class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl text-center space-y-2 transition-all hover:-translate-y-1">
            <div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 mx-auto flex items-center justify-center text-xl">🏢</div>
            <div class="font-bold text-sm">Manufacturing Plant</div>
            <div class="text-xs text-slate-500">Vegdi GIDC, Dhoraji, Gujarat</div>
          </a>
        </div>
      </section>
    </div>
  `
})
export class UserHomeComponent implements OnInit {
  private prodService = inject(ProductService);
  private compService = inject(CompanyService);

  featuredProducts = signal<Product[]>([]);
  company = signal<CompanySettings | null>(null);

  phone = APP_CONSTANTS.DEFAULT_CONTACT.PHONE;
  phoneTel = APP_CONSTANTS.DEFAULT_CONTACT.PHONE_TEL;
  email = APP_CONSTANTS.DEFAULT_CONTACT.EMAIL;
  emailMailto = APP_CONSTANTS.DEFAULT_CONTACT.EMAIL_MAILTO;
  mapsUrl = APP_CONSTANTS.DEFAULT_CONTACT.MAPS_URL;

  ngOnInit(): void {
    this.prodService.getFeaturedProducts().subscribe({
      next: res => {
        if (res.success && res.data) this.featuredProducts.set(res.data);
      }
    });

    this.compService.getCompanySettings().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.company.set(res.data);
          if (res.data.phoneContact) {
            this.phone = res.data.phoneContact;
            this.phoneTel = `tel:${res.data.phoneContact.replace(/\s+/g, '')}`;
          }
          if (res.data.emailContact) {
            this.email = res.data.emailContact;
            this.emailMailto = `mailto:${res.data.emailContact}`;
          }
        }
      }
    });
  }
}
