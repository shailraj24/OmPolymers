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
import { FileUrlPipe } from '../../../shared/pipes/file-url.pipe';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FileUrlPipe],
  template: `
    <div class="space-y-20 py-10 px-6 max-w-7xl mx-auto">
      
      <!-- 1. Technical Hero Section -->
      <section class="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 sm:p-14 text-white shadow-xl">
        <!-- Subtle Industrial Grid Accent -->
        <div class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
        <div class="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-3xl space-y-6 relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/80">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span class="tracking-wide uppercase text-[11px] font-mono">ISO 9001:2015 · IS 4984 · ISO 4427 Certified</span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            High-Density Polyethylene Piping Systems & Engineered Compounds
          </h1>

          <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
            Delivering bimodal PE100 and PE80 industrial pressure conduits, micro-irrigation sub-mains, and custom polymer compounding masterbatches engineered for extreme hydrostatic longevity and zero notch propagation.
          </p>

          <div class="flex flex-wrap items-center gap-3 pt-2">
            <a 
              routerLink="/products" 
              class="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <span>Explore Technical Catalog</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <a 
              routerLink="/quote" 
              class="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-100 font-bold text-xs transition-colors"
            >
              Request Project Tender RFQ
            </a>
            <button 
              (click)="openWhatsApp()" 
              class="px-5 py-3 rounded-xl bg-emerald-700/30 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-600/40 font-bold text-xs transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.13.332.202.043.073.043.419-.101.824z"/>
              </svg>
              <span>Direct WhatsApp Desk</span>
            </button>
          </div>
        </div>
      </section>

      <!-- 2. Industrial Manufacturing Metrics -->
      <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
          <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">13+</div>
          <div class="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1">Years of Manufacturing</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Established operations at Vegdi GIDC</div>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
          <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">18,000 MT</div>
          <div class="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1">Annual Extrusion Output</div>
          <div class="text-[11px] text-slate-500 mt-0.5">High-speed twin lines</div>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
          <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">20 - 630 mm</div>
          <div class="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1">Diameter Range (OD)</div>
          <div class="text-[11px] text-slate-500 mt-0.5">SDR 7.4 to SDR 26 rating</div>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
          <div class="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">100%</div>
          <div class="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1">Virgin Polymer Resins</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Lot-traceable hydrostatic tests</div>
        </div>
      </section>

      <!-- 3. Featured Manufacturing Lines -->
      <section class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
              Precision Extrusion Lines
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5 text-slate-900 dark:text-white">
              Industrial Product Specifications
            </h2>
            <p class="text-xs text-slate-500 mt-1">
              Tested to IS 4984:2016, ISO 4427-2, and ASTM D3035 specifications for high-pressure installations
            </p>
          </div>
          <a routerLink="/products" class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            <span>Explore Full Catalog</span>
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        <div *ngIf="loadingProducts()" class="p-16 text-center text-slate-400 text-xs">
          <div class="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          <div>Loading featured technical specifications...</div>
        </div>

        <div *ngIf="!loadingProducts()" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            *ngFor="let p of featuredProducts()" 
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div class="p-5 space-y-4">
              <!-- Product Image Showcase -->
              <div class="h-48 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 relative border border-slate-100 dark:border-slate-800/80">
                <img 
                  [src]="p.mainImageUrl | fileUrl:'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'" 
                  [alt]="p.productName" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div *ngIf="p.isFeatured" class="absolute top-3 right-3 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 shadow-sm uppercase tracking-wide">
                  Standard Line
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between text-xs text-slate-500">
                  <span class="font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[11px]">
                    {{ p.category?.categoryName || 'Polymer Piping' }}
                  </span>
                  <span class="font-mono text-[11px] text-slate-500 dark:text-slate-400">IS 4984 / ISO 4427</span>
                </div>

                <h3 class="font-extrabold text-base leading-snug group-hover:text-blue-600 transition-colors">
                  <a [routerLink]="['/products', p.slug]">{{ p.productName }}</a>
                </h3>

                <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {{ p.shortDescription }}
                </p>

                <div *ngIf="p.specifications" class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate">
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
                  <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.13.332.202.043.073.043.419-.101.824z"/>
                  </svg>
                </button>
                <a 
                  [routerLink]="['/quote']" 
                  [queryParams]="{ product: p.productName }"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors"
                >
                  Request RFQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Quality Assurance & Lab Verification Section -->
      <section class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xs space-y-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div class="space-y-4">
            <div class="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
              In-House Testing Protocol
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
              Zero-Defect Extrusion With Hydrostatic Pressure Testing
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every production lot undergoes rigorous laboratory verification. Pipes are subjected to 100-hour and 1000-hour hydrostatic burst testing at 20°C and 80°C, automated ultrasonic thickness gauging, and melt flow index (MFI) validation to guarantee 50+ years of maintenance-free service.
            </p>

            <div class="grid grid-cols-2 gap-4 pt-2">
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                <div class="text-xs font-bold text-slate-900 dark:text-white">100h / 1000h Tests</div>
                <div class="text-[11px] text-slate-500 mt-1">Hydrostatic internal pressure tests per IS 4984</div>
              </div>
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                <div class="text-xs font-bold text-slate-900 dark:text-white">Ultrasonic Wall Gauge</div>
                <div class="text-[11px] text-slate-500 mt-1">Continuous 360° wall thickness scanning</div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="rounded-2xl overflow-hidden bg-slate-800 h-64 relative shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80" 
                alt="Continuous Twin Extruder Facility" 
                class="w-full h-full object-cover" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-5 flex flex-col justify-end">
                <div class="text-white font-bold text-sm">Industrial Continuous Extrusion Unit</div>
                <div class="text-slate-300 text-xs">Vegdi GIDC, Dhoraji Manufacturing Complex</div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                <div class="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">ISO 9001</div>
                <div class="text-[10px] text-slate-500 mt-0.5">Quality Accredited</div>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">PE100 / PE80</div>
                <div class="text-[10px] text-slate-500 mt-0.5">High Density Poly</div>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                <div class="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">50+ Years</div>
                <div class="text-[10px] text-slate-500 mt-0.5">Design Lifespan</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Technical Research Papers & Whitepapers -->
      <section class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
              Engineering Publications
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5 text-slate-900 dark:text-white">
              Technical Insights & Material Research
            </h2>
            <p class="text-xs text-slate-500 mt-1">
              Polymer science benchmarks, trenchless directional drilling installation guidelines, and hydrostatic standards
            </p>
          </div>
          <a routerLink="/blogs" class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            <span>Browse All Whitepapers</span>
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        <div *ngIf="loadingBlogs()" class="p-16 text-center text-slate-400 text-xs">
          <div class="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          <div>Loading technical research articles...</div>
        </div>

        <div *ngIf="!loadingBlogs()" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            *ngFor="let blog of latestBlogs()" 
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div class="p-5 space-y-3">
              <div class="h-44 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80">
                <img 
                  [src]="blog.featuredImageUrl | fileUrl:'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'" 
                  [alt]="blog.title" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span class="font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px]">
                  {{ blog.category?.categoryName || 'Technical Paper' }}
                </span>
                <span>{{ blog.createdAt | date:'mediumDate' }}</span>
              </div>

              <h3 class="font-extrabold text-base leading-snug group-hover:text-blue-600 transition-colors">
                <a [routerLink]="['/blogs', blog.slug]">{{ blog.title }}</a>
              </h3>

              <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {{ blog.shortDescription }}
              </p>
            </div>

            <div class="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-3 flex items-center justify-between">
              <span class="text-[11px] text-slate-500">By {{ blog.author || 'OM Polymer Lab' }}</span>
              <a [routerLink]="['/blogs', blog.slug]" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
                <span>Read Paper</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. Direct Engineering Contacts Matrix -->
      <section class="space-y-6 pt-4">
        <div class="text-center max-w-xl mx-auto space-y-1">
          <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Direct Technical Inquiry Desk
          </h2>
          <p class="text-xs text-slate-500">
            Connect directly with our plant materials engineers for dimension calculations, tender submittals, and lot deliveries
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a 
            [href]="phoneTel" 
            class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md text-center space-y-2 transition-all hover:-translate-y-0.5"
          >
            <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 mx-auto flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div class="font-bold text-sm text-slate-900 dark:text-white">Direct Phone Support</div>
            <div class="text-xs font-mono text-slate-500">{{ phone }}</div>
          </a>

          <a 
            [href]="emailMailto" 
            class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md text-center space-y-2 transition-all hover:-translate-y-0.5"
          >
            <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 mx-auto flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="font-bold text-sm text-slate-900 dark:text-white">Commercial Quotations</div>
            <div class="text-xs text-slate-500">{{ email }}</div>
          </a>

          <a 
            [href]="mapsUrl" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md text-center space-y-2 transition-all hover:-translate-y-0.5"
          >
            <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 mx-auto flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="font-bold text-sm text-slate-900 dark:text-white">Manufacturing Plant</div>
            <div class="text-xs text-slate-500">Vegdi GIDC, Dhoraji, Gujarat</div>
          </a>
        </div>
      </section>

      <!-- 7. Floating WhatsApp Consultation Widget -->
      <aside aria-label="WhatsApp Engineering Support" class="fixed bottom-6 right-6 z-50">
        <button 
          (click)="openWhatsApp()"
          class="flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group border border-emerald-400/30"
          title="Direct WhatsApp Support Desk"
        >
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.13.332.202.043.073.043.419-.101.824z"/>
          </svg>
          <span class="text-xs font-bold hidden sm:inline">WhatsApp Desk</span>
          <span class="w-2 h-2 rounded-full bg-emerald-300"></span>
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
  whatsappNumber: string = '918866246042';

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
    const text = encodeURIComponent('Hello OM Polymer Team, I would like to inquire regarding pipe specifications and commercial supply terms.');
    window.location.href = `https://wa.me/${this.whatsappNumber}?text=${text}`;
  }

  openProductWhatsApp(p: Product): void {
    const text = encodeURIComponent(`Hello OM Polymer Team, I would like to inquire about specifications and pricing for: ${p.productName}`);
    window.location.href = `https://wa.me/${this.whatsappNumber}?text=${text}`;
  }
}
