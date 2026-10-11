import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Product Catalog Management</h1>
          <p class="text-xs text-slate-400 mt-1">Manage industrial polymer lines and active statuses</p>
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th class="p-3">Product Name</th>
              <th class="p-3">Category</th>
              <th class="p-3">Specifications</th>
              <th class="p-3">Status</th>
              <th class="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr *ngFor="let p of products()">
              <td class="p-3 font-semibold text-white">{{ p.productName }}</td>
              <td class="p-3 text-slate-400">{{ p.category?.categoryName }}</td>
              <td class="p-3 max-w-xs truncate text-slate-400">{{ p.specifications }}</td>
              <td class="p-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                  [ngClass]="p.isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'">
                  {{ p.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="p-3 text-right space-x-2">
                <button (click)="toggleStatus(p.productId)" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
                  Toggle
                </button>
                <button (click)="deleteProduct(p.productId)" class="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminProductsComponent implements OnInit {
  private prodService = inject(ProductService);
  private toast = inject(ToastService);

  products = signal<Product[]>([]);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.prodService.getProducts(1, 50).subscribe(res => {
      if (res.success && res.data) this.products.set(res.data.items);
    });
  }

  toggleStatus(id: number): void {
    this.prodService.toggleProductStatus(id).subscribe(res => {
      this.toast.success('Product status toggled.');
      this.loadProducts();
    });
  }

  deleteProduct(id: number): void {
    if (!confirm('Are you sure you want to delete this product?')) return;
    this.prodService.deleteProduct(id).subscribe(res => {
      this.toast.success('Product removed.');
      this.loadProducts();
    });
  }
}
