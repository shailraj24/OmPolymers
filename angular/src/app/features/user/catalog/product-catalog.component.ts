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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let p of products()" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-lg transition-all">
          <div class="p-5 space-y-3">
            <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              {{ p.category?.categoryName }}
            </span>
            <h3 class="font-bold text-base leading-tight">{{ p.productName }}</h3>
            <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">{{ p.shortDescription }}</p>
            <div class="text-[11px] font-mono bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              {{ p.specifications }}
            </div>
          </div>
          <div class="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 mt-4">
            <a [routerLink]="['/products', p.slug]" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Technical Details →
            </a>
            <a routerLink="/quote" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors">
              RFQ
            </a>
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

  loadProducts(): void {
    this.prodService.getProducts(1, 50, this.selectedCategoryId(), this.searchQuery).subscribe(res => {
      if (res.success && res.data) this.products.set(res.data.items);
    });
  }
}
