import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { FileUrlPipe } from '../../../shared/pipes/file-url.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FileUrlPipe],
  template: `
    <div class="py-12 px-6 max-w-6xl mx-auto space-y-8" *ngIf="product(); else loadingTpl">
      <!-- Breadcrumb Navigation -->
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/" class="hover:text-blue-600 transition-colors">Home</a>
        <span>/</span>
        <a routerLink="/products" class="hover:text-blue-600 transition-colors">Products</a>
        <span>/</span>
        <span class="text-slate-800 dark:text-white font-medium">{{ product()?.productName }}</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <!-- Main Column: Product Gallery, Description & Specs -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Featured Image Container -->
          <div class="h-80 sm:h-96 w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative shadow-md">
            <img 
              [src]="product()?.mainImageUrl | fileUrl:'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80'" 
              [alt]="product()?.productName" 
              class="w-full h-full object-cover" 
            />
            <div *ngIf="product()?.isFeatured" class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-lg">
              ★ Highlighted Product
            </div>
          </div>

          <!-- Product Title & Overview -->
          <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div class="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <span>{{ product()?.category?.categoryName || 'Standard' }}</span>
              <span>·</span>
              <span class="font-mono">SDR 11 / SDR 17 / SDR 21</span>
            </div>

            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {{ product()?.productName }}
            </h1>

            <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {{ product()?.shortDescription }}
            </p>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 class="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Engineering Description
              </h2>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {{ product()?.fullDescription || 'Continuous extrusion with bimodal PE100 Virgin resin conforming strictly to ISO 4427 and ASTM D3035 specifications. Engineered for zero crack propagation under high hydrostatic transient pressure.' }}
              </p>
            </div>
          </div>

          <!-- Technical Specifications Matrix -->
          <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Technical Specifications & Performance Ratings
            </h2>

            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 font-mono text-xs text-blue-900 dark:text-blue-300 leading-relaxed whitespace-pre-line">
              {{ product()?.specifications || 'Standard specifications compliant with ISO 4427.' }}
            </div>
          </div>
        </div>

        <!-- Sidebar Column: Action Cards & Direct Inquiry -->
        <div class="space-y-6">
          <!-- Quotation & WhatsApp Action Box -->
          <div class="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white p-7 rounded-3xl shadow-xl space-y-5">
            <div class="space-y-2">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Direct Materials Desk
              </div>
              <h3 class="text-lg font-extrabold tracking-tight">Need Specifications & Commercial Quote?</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Connect with our materials engineering sales desk for specific outside diameters, wall thicknesses (SDR), metric tonnage delivery schedules, and project tenders.
              </p>
            </div>

            <div class="space-y-2.5 pt-2">
              <!-- WhatsApp Instant Inquiry -->
              <button 
                (click)="openWhatsApp()"
                class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span class="text-base">💬</span>
                <span>Inquire on WhatsApp Instantly</span>
              </button>

              <!-- RFQ Form Route -->
              <a 
                routerLink="/quote" 
                [queryParams]="{ product: product()?.productName }"
                class="w-full block text-center py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Request Detailed Quotation (RFQ) →
              </a>
            </div>
          </div>

          <!-- Quality Assurance & Standards Card -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white">Manufacturing Assurances</h4>
            <div class="space-y-2.5 text-slate-600 dark:text-slate-400">
              <div class="flex items-center gap-2">
                <span class="text-emerald-500 font-bold">✓</span>
                <span>100% Virgin Prime Polymer Pellets</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-emerald-500 font-bold">✓</span>
                <span>Ultrasonic Wall-Thickness Scanned</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-emerald-500 font-bold">✓</span>
                <span>Hydrostatic Lot-Traceable Certification</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-emerald-500 font-bold">✓</span>
                <span>Drinking Water Safe (Non-Toxic)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingTpl>
      <div class="py-24 text-center space-y-3">
        <div class="inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <div class="text-xs text-slate-500">Loading product technical specifications...</div>
      </div>
    </ng-template>
  `
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private prodService = inject(ProductService);

  product = signal<Product | null>(null);
  whatsappNumber = '919876543210';

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.prodService.getProductBySlug(slug).subscribe(res => {
        if (res.success && res.data) {
          this.product.set(res.data);
        }
      });
    }
  }

  openWhatsApp(): void {
    const p = this.product();
    const productName = p ? p.productName : 'OM Polymer Products';
    const text = encodeURIComponent(`Hello OM Polymer Team, I would like to inquire about specifications and pricing for: ${productName}`);
    window.location.href = `https://wa.me/${this.whatsappNumber}?text=${text}`;
  }
}
