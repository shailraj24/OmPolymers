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
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">Featured Industrial Products</h2>
            <p class="text-xs text-slate-500 mt-1">Certified to ISO 4427, ASTM D3035, and IS 4984 hydrostatic ratings</p>
          </div>
          <a routerLink="/products" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            View All Products →
          </a>
        </div>

        <div *ngIf="loadingProducts()" class="p-12 text-center text-slate-400 text-xs">
          Loading featured product catalog...
        </div>

        <div *ngIf="!loadingProducts()" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let p of featuredProducts()" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-xl transition-all">
            <div class="p-5 space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {{ p.category?.categoryName || 'Industrial' }}
                </span>
                <span *ngIf="p.isFeatured" class="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                  ★ Highlighted
                </span>
              </div>
              <h3 class="font-bold text-base leading-tight">{{ p.productName }}</h3>
              <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">{{ p.shortDescription }}</p>
              <div *ngIf="p.specifications" class="text-[11px] font-mono bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 truncate">
                {{ p.specifications }}
              </div>
            </div>
            <div class="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 mt-4">
              <a [routerLink]="['/products', p.slug]" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                View Specifications →
              </a>
              <a routerLink="/quote" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors">
                Request RFQ
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. About Us Section -->
      <section class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <div class="max-w-3xl">
          <span class="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">About OM Polymer</span>
          <h2 class="text-3xl font-extrabold mt-1 tracking-tight">Precision Polymer Engineering for Heavy Infrastructure</h2>
          <p class="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
            Founded with a vision to deliver uncompromising quality in polymer engineering, OM Polymer operates state-of-the-art continuous extrusion and compounding lines at Vegdi GIDC, Dhoraji, Gujarat. We engineer high-performance HDPE pipes, MDPE gas lines, PP-R hot-water conduits, and customized polymer compounds serving municipal water grids, mining slurries, agricultural micro-irrigation, and industrial effluent transport.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl font-bold">
              ⚙️
            </div>
            <h4 class="font-bold text-sm">German Extrusion Lines</h4>
            <p class="text-xs text-slate-500 leading-relaxed">Equipped with gravimetric dosing and ultrasonic wall thickness control ensuring uniform SDR thickness across high diameters.</p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl font-bold">
              🔬
            </div>
            <h4 class="font-bold text-sm">In-House Hydrostatic Lab</h4>
            <p class="text-xs text-slate-500 leading-relaxed">Full lot-traceable testing for Carbon Black dispersion, Melt Flow Index (MFI), Slow Crack Growth (SCG), and tensile elongation.</p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl font-bold">
              🌱
            </div>
            <h4 class="font-bold text-sm">Zero-Defect Sustainability</h4>
            <p class="text-xs text-slate-500 leading-relaxed">Closed-loop water cooling and 100% prime virgin raw material usage conforming strictly to drinking water safety norms.</p>
          </div>
        </div>
      </section>

      <!-- 5. Latest Engineering Blogs Section -->
      <section class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">Engineering Insights & Technical Articles</h2>
            <p class="text-xs text-slate-500 mt-1">Industry research on piping standards, trenchless installation, and resin technology</p>
          </div>
          <a routerLink="/blogs" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Browse All Articles →
          </a>
        </div>

        <div *ngIf="loadingBlogs()" class="p-10 text-center text-slate-400 text-xs">
          Loading engineering articles...
        </div>

        <div *ngIf="!loadingBlogs()" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let blog of latestBlogs()" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-xl transition-all">
            <div class="p-5 space-y-3">
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {{ blog.category?.categoryName || 'Technical' }}
                </span>
                <span>{{ blog.createdAt | date:'mediumDate' }}</span>
              </div>
              <h3 class="font-bold text-base leading-snug hover:text-blue-600 transition-colors">
                <a [routerLink]="['/blogs', blog.slug]">{{ blog.title }}</a>
              </h3>
              <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">{{ blog.shortDescription }}</p>
            </div>
            <div class="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-4 flex items-center justify-between">
              <span class="text-[11px] text-slate-400">By {{ blog.author || 'OM Polymer Lab' }}</span>
              <a [routerLink]="['/blogs', blog.slug]" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                Read Article →
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
}
