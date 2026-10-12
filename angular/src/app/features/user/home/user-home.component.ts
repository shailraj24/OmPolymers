import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CompanyService } from '../../../core/services/company.service';
import { BlogService } from '../../../core/services/blog.service';
import { Product } from '../../../core/models/product.model';
import { CompanySettings } from '../../../core/models/company.model';
import { BlogPost } from '../../../core/models/blog.model';
import { APP_CONSTANTS } from '../../../core/constants/app.constant';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-16 py-10 px-6 max-w-7xl mx-auto">
      
      <!-- 1. Hero Section -->
      <section class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 p-8 sm:p-14 text-white shadow-2xl">
        <div class="max-w-2xl space-y-6 relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            ISO 9001:2015 CERTIFIED INDUSTRIAL POLYMER MANUFACTURING
          </div>
          <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            High-Performance Polymer Extrusion & Piping Infrastructure
          </h1>
          <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
            Delivering high-density polyethylene (HDPE PE100/PE80) pipes, custom compounding masterbatches, and specialized engineering resins built for extreme hydrostatic pressure and chemical durability.
          </p>
          <div class="flex flex-wrap gap-3 pt-2">
            <a routerLink="/products" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95">
              Browse Products Catalog →
            </a>
            <a routerLink="/quote" class="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs transition-colors">
              Request Technical Quote (RFQ)
            </a>
            <button (click)="openWhatsApp()" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2">
              <span>💬</span> Chat on WhatsApp
            </button>
          </div>
        </div>
      </section>

      <!-- 2. Key Engineering Statistics -->
      <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400">13+</div>
          <div class="text-xs text-slate-500 mt-1 font-medium">Years of Manufacturing</div>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400">50,000+</div>
          <div class="text-xs text-slate-500 mt-1 font-medium">MT Annual Output</div>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400">ISO 9001</div>
          <div class="text-xs text-slate-500 mt-1 font-medium">Quality Accredited</div>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400">100%</div>
          <div class="text-xs text-slate-500 mt-1 font-medium">Virgin Polymer Raw Resins</div>
        </div>
      </section>

      <!-- 3. Featured Products Grid -->
      <section class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">Precision Manufacturing Lines</div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">Featured Industrial Products</h2>
            <p class="text-xs text-slate-500 mt-1">Tested to ISO 4427, ASTM D3035, and IS 4984 standards for high-pressure installations</p>
          </div>
          <a routerLink="/products" class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            <span>Explore Full Catalog ({{ featuredProducts().length }}+ lines)</span>
            <span>→</span>
          </a>
        </div>

        <div *ngIf="loadingProducts()" class="p-16 text-center text-slate-400 text-xs">
          <div class="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          <div>Loading featured product specifications...</div>
        </div>

        <div *ngIf="!loadingProducts()" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let p of featuredProducts()" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div class="p-5 space-y-4">
              <!-- Product Image Showcase -->
              <div class="h-48 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 relative">
                <img 
                  [src]="p.mainImageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'" 
                  [alt]="p.productName" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div *ngIf="p.isFeatured" class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-md">
                  ★ Highlighted
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between text-xs text-slate-500">
                  <span class="font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[11px]">
                    {{ p.category?.categoryName || 'Standard' }}
                  </span>
                  <span class="font-mono text-[11px]">PN6 — PN16</span>
                </div>

                <h3 class="font-extrabold text-base leading-snug group-hover:text-blue-600 transition-colors">
                  <a [routerLink]="['/products', p.slug]">{{ p.productName }}</a>
                </h3>

                <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {{ p.shortDescription }}
                </p>

                <div *ngIf="p.specifications" class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate">
                  {{ p.specifications }}
                </div>
              </div>
            </div>

            <!-- Card Actions -->
            <div class="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-2 flex items-center justify-between gap-2">
              <a [routerLink]="['/products', p.slug]" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                View Specifications →
              </a>
              <div class="flex items-center gap-2">
                <button 
                  (click)="openProductWhatsApp(p)"
                  class="p-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-500/20 transition-all text-xs font-semibold"
                  title="Inquire about this product on WhatsApp"
                >
                  <span>💬</span>
                </button>
                <a 
                  [routerLink]="['/quote']" 
                  [queryParams]="{ product: p.productName }"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-colors"
                >
                  RFQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. About Us Section -->
      <section class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div class="space-y-4">
            <div class="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">Infrastructure & Legacy</div>
            <h2 class="text-3xl font-extrabold tracking-tight leading-tight">Precision Polymer Engineering for Heavy Infrastructure</h2>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ company()?.aboutContent || 'Founded with a vision to deliver uncompromising quality in polymer engineering, OM Polymer operates state-of-the-art continuous extrusion and compounding lines at Vegdi GIDC, Dhoraji, Gujarat. We engineer high-performance HDPE pipes, MDPE gas lines, PP-R hot-water conduits, and customized polymer compounds serving municipal water grids, mining slurries, agricultural micro-irrigation, and industrial effluent transport.' }}
            </p>

            <div class="grid grid-cols-2 gap-4 pt-2">
              <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div class="text-2xl font-extrabold text-blue-600 dark:text-blue-400">18,000 MT</div>
                <div class="text-[11px] text-slate-500 font-medium">Annual Extrusion Capacity</div>
              </div>
              <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">50+ Years</div>
                <div class="text-[11px] text-slate-500 font-medium">Design Pipeline Life</div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="rounded-2xl overflow-hidden bg-slate-800 h-56 relative shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80" 
                alt="OM Polymer Extrusion Facility" 
                class="w-full h-full object-cover" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-5 flex flex-col justify-end">
                <div class="text-white font-bold text-sm">Industrial Compounding Line 02</div>
                <div class="text-slate-300 text-xs">Continuous gravimetric dosing and automated ultrasonic wall-thickness scanning</div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center">
                <div class="text-lg">⚙️</div>
                <div class="text-[11px] font-bold text-slate-800 dark:text-white mt-1">German Lines</div>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center">
                <div class="text-lg">🔬</div>
                <div class="text-[11px] font-bold text-slate-800 dark:text-white mt-1">In-House Lab</div>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center">
                <div class="text-lg">🌱</div>
                <div class="text-[11px] font-bold text-slate-800 dark:text-white mt-1">Zero Defect</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Latest Engineering Blogs Section -->
      <section class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">R&D & Engineering Articles</div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">Engineering Insights & Research</h2>
            <p class="text-xs text-slate-500 mt-1">Material science analysis, hydrostatic pressure benchmarks, and installation whitepapers</p>
          </div>
          <a routerLink="/blogs" class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            <span>Browse All Technical Papers</span>
            <span>→</span>
          </a>
        </div>

        <div *ngIf="loadingBlogs()" class="p-16 text-center text-slate-400 text-xs">
          <div class="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          <div>Loading engineering articles...</div>
        </div>

        <div *ngIf="!loadingBlogs()" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let blog of latestBlogs()" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div class="p-5 space-y-3">
              <!-- Blog Image -->
              <div class="h-44 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950">
                <img 
                  [src]="blog.featuredImageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'" 
                  [alt]="blog.title" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span class="font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px]">
                  {{ blog.category?.categoryName || 'Technical' }}
                </span>
                <span>{{ blog.createdAt | date:'mediumDate' }}</span>
              </div>

              <h3 class="font-extrabold text-base leading-snug group-hover:text-blue-600 transition-colors">
                <a [routerLink]="['/blogs', blog.slug]">{{ blog.title }}</a>
              </h3>

              <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {{ blog.shortDescription }}
              </p>
            </div>

            <div class="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-3 flex items-center justify-between">
              <span class="text-[11px] text-slate-400 font-medium">By {{ blog.author || 'OM Polymer Lab' }}</span>
              <a [routerLink]="['/blogs', blog.slug]" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
                <span>Read Article</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. Direct Engineering Contacts -->
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

      <!-- 7. Floating WhatsApp Consultation Action -->
      <aside aria-label="WhatsApp Support" class="fixed bottom-6 right-6 z-50">
        <button 
          (click)="openWhatsApp()"
          class="flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
          title="Chat directly on WhatsApp"
        >
          <span class="text-xl">💬</span>
          <span class="text-xs font-bold hidden sm:inline">WhatsApp Help</span>
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
        </button>
      </aside>

    </div>
  `
})
export class UserHomeComponent implements OnInit {
  private prodService = inject(ProductService);
  private compService = inject(CompanyService);
  private blogService = inject(BlogService);

  featuredProducts = signal<Product[]>([]);
  latestBlogs = signal<BlogPost[]>([]);
  company = signal<CompanySettings | null>(null);

  loadingProducts = signal(true);
  loadingBlogs = signal(true);

  phone: string = APP_CONSTANTS.DEFAULT_CONTACT.PHONE;
  phoneTel: string = APP_CONSTANTS.DEFAULT_CONTACT.PHONE_TEL;
  email: string = APP_CONSTANTS.DEFAULT_CONTACT.EMAIL;
  emailMailto: string = APP_CONSTANTS.DEFAULT_CONTACT.EMAIL_MAILTO;
  mapsUrl: string = APP_CONSTANTS.DEFAULT_CONTACT.MAPS_URL;
  whatsappNumber: string = '919876543210';

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadLatestBlogs();
    this.loadCompanySettings();
  }

  loadFeaturedProducts(): void {
    this.prodService.getFeaturedProducts().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.featuredProducts.set(res.data);
        }
        this.loadingProducts.set(false);
      },
      error: () => this.loadingProducts.set(false)
    });
  }

  loadLatestBlogs(): void {
    this.blogService.getPublishedBlogs(1, 3).subscribe({
      next: res => {
        if (res.success && res.data?.items) {
          this.latestBlogs.set(res.data.items);
        }
        this.loadingBlogs.set(false);
      },
      error: () => this.loadingBlogs.set(false)
    });
  }

  loadCompanySettings(): void {
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
          if (res.data.whatsappContact) {
            this.whatsappNumber = res.data.whatsappContact.replace(/\D/g, '');
          }
        }
      }
    });
  }

  openWhatsApp(): void {
    const text = encodeURIComponent('Hello OM Polymer Team, I would like to inquire about your HDPE pipe extrusion and polymer compounds.');
    window.location.href = `https://wa.me/${this.whatsappNumber}?text=${text}`;
  }

  openProductWhatsApp(p: Product): void {
    const text = encodeURIComponent(`Hello OM Polymer Team, I would like to inquire about specifications and pricing for: ${p.productName}`);
    window.location.href = `https://wa.me/${this.whatsappNumber}?text=${text}`;
  }
}
