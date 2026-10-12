import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductCategory } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="py-10 px-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight">Industrial Products Catalog</h1>
        <p class="text-xs text-slate-500 mt-1">Explore our ISO-certified polyethylene piping systems and compounds</p>
      </div>

      <!-- Search & Category Filters -->
      <div class="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="flex flex-wrap gap-2">
          <button 
            (click)="selectCategory(undefined)"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            [ngClass]="selectedCategoryId() === undefined ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
          >
            All Products
          </button>
          <button 
            *ngFor="let cat of categories()"
            (click)="selectCategory(cat.categoryId)"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            [ngClass]="selectedCategoryId() === cat.categoryId ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
          >
            {{ cat.categoryName }}
          </button>
        </div>

        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          (ngModelChange)="loadProducts()"
          placeholder="Search by name, spec, or standard..." 
          class="w-full md:w-72 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
        />
      </div>

      <!-- Products Grid -->
      <div *ngIf="loading()" class="p-16 text-center text-slate-400 text-xs">
        <div class="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
        <div>Loading industrial product lines...</div>
      </div>

      <div *ngIf="!loading() && products().length === 0" class="p-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
        <div class="text-3xl">📦</div>
        <div class="font-bold text-sm text-slate-800 dark:text-white">No products match your criteria</div>
        <p class="text-xs text-slate-500">Try adjusting your keyword or reset category filters.</p>
        <button (click)="resetFilters()" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold">
          Reset All Filters
        </button>
      </div>

      <div *ngIf="!loading() && products().length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let p of products()" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
          <div class="p-5 space-y-4">
            <!-- Product Image -->
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
              <span class="inline-block text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {{ p.category?.categoryName || 'Industrial' }}
              </span>
              <h3 class="font-extrabold text-base leading-snug group-hover:text-blue-600 transition-colors">
                <a [routerLink]="['/products', p.slug]">{{ p.productName }}</a>
              </h3>
              <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">{{ p.shortDescription }}</p>
              <div *ngIf="p.specifications" class="text-[11px] font-mono bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 truncate">
                {{ p.specifications }}
              </div>
            </div>
          </div>

          <div class="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 mt-3 gap-2">
            <a [routerLink]="['/products', p.slug]" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Technical Details →
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
    </div>
  `
})
export class ProductCatalogComponent implements OnInit {
  private prodService = inject(ProductService);

  products = signal<Product[]>([]);
  categories = signal<ProductCategory[]>([]);
  selectedCategoryId = signal<number | undefined>(undefined);
  searchQuery = '';
  loading = signal(true);
  whatsappNumber = '919876543210';

  ngOnInit(): void {
    this.prodService.getCategories().subscribe(res => {
      if (res.success && res.data) this.categories.set(res.data);
    });
    this.loadProducts();
  }

  selectCategory(id?: number): void {
    this.selectedCategoryId.set(id);
    this.loadProducts();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategoryId.set(undefined);
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.prodService.getProducts(1, 50, this.selectedCategoryId(), this.searchQuery).subscribe({
      next: res => {
        if (res.success && res.data) {
          this.products.set(res.data.items);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openProductWhatsApp(p: Product): void {
    const text = encodeURIComponent(`Hello OM Polymer Team, I would like to inquire about specifications and pricing for: ${p.productName}`);
    window.location.href = `https://wa.me/${this.whatsappNumber}?text=${text}`;
  }
}
