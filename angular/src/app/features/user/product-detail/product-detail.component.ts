import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="py-10 px-6 max-w-5xl mx-auto space-y-8" *ngIf="product(); else loadingTpl">
      <div>
        <a routerLink="/products" class="text-xs text-blue-600 hover:underline">← Back to Catalog</a>
        <h1 class="text-3xl font-extrabold tracking-tight mt-2">{{ product()?.productName }}</h1>
        <div class="text-xs text-slate-500 mt-1">Category: {{ product()?.category?.categoryName }}</div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-6">
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 class="text-base font-bold">Engineering Overview</h2>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{{ product()?.fullDescription }}</p>
          </div>

          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 class="text-base font-bold">Technical Specifications</h2>
            <div class="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl font-mono text-xs text-slate-700 dark:text-slate-300">
              {{ product()?.specifications }}
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-blue-50 dark:bg-slate-900 p-6 rounded-2xl border border-blue-200 dark:border-slate-800 space-y-4">
            <h3 class="font-bold text-sm">Need Quotation for this Product?</h3>
            <p class="text-xs text-slate-500">Contact our engineering desk for custom diameters, SDR rating and pricing.</p>
            <a routerLink="/quote" class="block text-center py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors">
              Request Specific Quote
            </a>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingTpl>
      <div class="py-20 text-center text-xs text-slate-500">Loading product specifications...</div>
    </ng-template>
  `
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private prodService = inject(ProductService);

  product = signal<Product | null>(null);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.prodService.getProductBySlug(slug).subscribe(res => {
        if (res.success && res.data) this.product.set(res.data);
      });
    }
  }
}
