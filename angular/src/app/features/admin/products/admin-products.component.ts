import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product, ProductCategory, CreateProductRequest } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Product Catalog Management</h1>
          <p class="text-xs text-slate-400 mt-1">Add, update, inspect, and toggle active status for industrial polymer lines</p>
        </div>
        <button 
          (click)="openCreateModal()" 
          class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <span>＋</span> Add New Product
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
        <div class="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="loadProducts()" 
            placeholder="Search by name, spec..." 
            class="w-full sm:w-64 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <select 
            [(ngModel)]="selectedCategory" 
            (ngModelChange)="loadProducts()"
            class="px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option [ngValue]="undefined">All Categories</option>
            <option *ngFor="let c of categories()" [ngValue]="c.categoryId">
              {{ c.categoryName }}
            </option>
          </select>
        </div>
        <div class="text-xs text-slate-400">
          Showing <span class="font-bold text-white">{{ products().length }}</span> products
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-sm">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th class="p-3.5">Product Name & Slug</th>
              <th class="p-3.5">Category</th>
              <th class="p-3.5">Specifications</th>
              <th class="p-3.5">Featured</th>
              <th class="p-3.5">Status</th>
              <th class="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/80 text-slate-300">
            <tr *ngFor="let p of products()" class="hover:bg-slate-800/30 transition-colors">
              <td class="p-3.5">
                <div class="font-semibold text-white">{{ p.productName }}</div>
                <div class="text-[11px] font-mono text-slate-500">/products/{{ p.slug }}</div>
              </td>
              <td class="p-3.5">
                <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {{ p.category?.categoryName || 'General' }}
                </span>
              </td>
              <td class="p-3.5 max-w-xs truncate text-slate-400">{{ p.specifications || 'Standard specifications' }}</td>
              <td class="p-3.5">
                <span *ngIf="p.isFeatured" class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800/40">
                  ★ Featured
                </span>
                <span *ngIf="!p.isFeatured" class="text-slate-600 text-[10px]">Standard</span>
              </td>
              <td class="p-3.5">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                  [ngClass]="p.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-slate-800 text-slate-400 border border-slate-700'">
                  {{ p.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                <button (click)="openViewModal(p)" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors">
                  View
                </button>
                <button (click)="toggleStatus(p.productId)" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors">
                  {{ p.isActive ? 'Deactivate' : 'Activate' }}
                </button>
                <button (click)="openEditModal(p)" class="px-2.5 py-1 bg-blue-950 hover:bg-blue-900 text-blue-300 rounded transition-colors">
                  Edit
                </button>
                <button (click)="confirmDelete(p)" class="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded transition-colors">
                  Delete
                </button>
              </td>
            </tr>
            <tr *ngIf="products().length === 0">
              <td colspan="6" class="p-8 text-center text-slate-500">
                No products found matching criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add/Edit Product Modal -->
      <div *ngIf="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="text-base font-bold text-white">
              {{ editingProductId ? 'Edit Product Specification' : 'Add New Industrial Product' }}
            </h3>
            <button (click)="showFormModal = false" class="text-slate-400 hover:text-white text-lg">✕</button>
          </div>

          <form (ngSubmit)="saveProduct()" class="space-y-4 text-xs">
            <div>
              <label class="block text-slate-300 font-semibold mb-1">Product Name *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.productName" 
                name="productName" 
                (ngModelChange)="onNameChange($event)"
                required 
                placeholder="e.g. PE100 HDPE High-Pressure Piping"
                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-300 font-semibold mb-1">URL Slug *</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.slug" 
                  name="slug" 
                  required 
                  placeholder="e.g. pe100-hdpe-high-pressure-piping"
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-slate-300 font-semibold mb-1">Product Category *</label>
                <select 
                  [(ngModel)]="formData.categoryId" 
                  name="categoryId" 
                  required
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option *ngFor="let c of categories()" [ngValue]="c.categoryId">
                    {{ c.categoryName }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-300 font-semibold mb-1">Main Image URL / Asset</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.mainImageUrl" 
                  name="mainImageUrl" 
                  placeholder="https://... or /assets/products/..."
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div class="flex items-center gap-3 pt-6">
                <label class="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="formData.isFeatured" 
                    name="isFeatured"
                    class="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-slate-300 font-semibold mb-1">Short Description</label>
              <textarea 
                [(ngModel)]="formData.shortDescription" 
                name="shortDescription" 
                rows="2"
                placeholder="Summary for catalog cards and quick overviews..."
                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-slate-300 font-semibold mb-1">Technical Specifications (Standards, SDR, Pressure PN)</label>
              <input 
                type="text" 
                [(ngModel)]="formData.specifications" 
                name="specifications" 
                placeholder="e.g. ISO 4427 / IS 4984 · PN 6 to PN 25 · SDR 7.4 - SDR 26 · 20mm to 630mm"
                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-slate-300 font-semibold mb-1">Comprehensive Description & Application Guide</label>
              <textarea 
                [(ngModel)]="formData.fullDescription" 
                name="fullDescription" 
                rows="5"
                placeholder="Detailed polymer resin compounding properties, hydrostatic ratings, chemical resistance..."
                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              ></textarea>
            </div>

            <div *ngIf="formError" class="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300">
              {{ formError }}
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button 
                type="button" 
                (click)="showFormModal = false" 
                class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="saving"
                class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
              >
                {{ saving ? 'Saving...' : (editingProductId ? 'Update Product' : 'Create Product') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- View Product Modal -->
      <div *ngIf="selectedProduct" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400">
                {{ selectedProduct.category?.categoryName }}
              </span>
              <h3 class="text-base font-bold text-white mt-1">{{ selectedProduct.productName }}</h3>
            </div>
            <button (click)="selectedProduct = null" class="text-slate-400 hover:text-white text-lg">✕</button>
          </div>

          <div class="text-xs text-slate-400 space-y-1">
            <div><strong>Slug:</strong> /products/{{ selectedProduct.slug }}</div>
            <div><strong>Status:</strong> {{ selectedProduct.isActive ? 'Active' : 'Inactive' }}</div>
            <div><strong>Featured:</strong> {{ selectedProduct.isFeatured ? 'Yes' : 'No' }}</div>
          </div>

          <div *ngIf="selectedProduct.specifications" class="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400">
            {{ selectedProduct.specifications }}
          </div>

          <div class="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
            {{ selectedProduct.fullDescription || selectedProduct.shortDescription || 'No description provided.' }}
          </div>

          <div class="flex justify-end pt-3">
            <button (click)="selectedProduct = null" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs">
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="productToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
          <h3 class="text-base font-bold text-rose-400 flex items-center gap-2">
            <span>⚠️</span> Delete Product
          </h3>
          <p class="text-xs text-slate-300">
            Are you sure you want to delete <strong class="text-white">"{{ productToDelete.productName }}"</strong>?
          </p>
          <div class="flex justify-end gap-3 pt-3">
            <button (click)="productToDelete = null" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs">
              Cancel
            </button>
            <button (click)="deleteConfirmed()" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-md">
              Confirm Delete
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class AdminProductsComponent implements OnInit {
  private prodService = inject(ProductService);
  private toast = inject(ToastService);

  products = signal<Product[]>([]);
  categories = signal<ProductCategory[]>([]);
  selectedCategory: number | undefined = undefined;
  searchQuery = '';

  showFormModal = false;
  editingProductId: number | null = null;
  selectedProduct: Product | null = null;
  productToDelete: Product | null = null;
  saving = false;
  formError: string | null = null;

  formData: CreateProductRequest = {
    productName: '',
    slug: '',
    categoryId: 1,
    shortDescription: '',
    fullDescription: '',
    specifications: '',
    mainImageUrl: '',
    isFeatured: false
  };

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.prodService.getCategories().subscribe(res => {
      if (res.success && res.data) {
        this.categories.set(res.data);
        if (res.data.length > 0 && !this.formData.categoryId) {
          this.formData.categoryId = res.data[0].categoryId;
        }
      }
    });
  }

  loadProducts(): void {
    this.prodService.getProducts(1, 100, this.selectedCategory, this.searchQuery).subscribe(res => {
      if (res.success && res.data) {
        this.products.set(res.data.items);
      }
    });
  }

  onNameChange(val: string): void {
    if (!this.editingProductId) {
      this.formData.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
  }

  openCreateModal(): void {
    this.editingProductId = null;
    this.formData = {
      productName: '',
      slug: '',
      categoryId: this.categories()[0]?.categoryId || 1,
      shortDescription: '',
      fullDescription: '',
      specifications: '',
      mainImageUrl: '',
      isFeatured: false
    };
    this.formError = null;
    this.showFormModal = true;
  }

  openEditModal(p: Product): void {
    this.editingProductId = p.productId;
    this.formData = {
      productName: p.productName,
      slug: p.slug,
      categoryId: p.category?.categoryId || 1,
      shortDescription: p.shortDescription || '',
      fullDescription: p.fullDescription || '',
      specifications: p.specifications || '',
      mainImageUrl: p.mainImageUrl || '',
      isFeatured: p.isFeatured
    };
    this.formError = null;
    this.showFormModal = true;
  }

  openViewModal(p: Product): void {
    this.selectedProduct = p;
  }

  confirmDelete(p: Product): void {
    this.productToDelete = p;
  }

  saveProduct(): void {
    if (!this.formData.productName.trim()) {
      this.formError = 'Product name is required.';
      return;
    }
    if (!this.formData.slug.trim()) {
      this.formError = 'Valid product slug is required.';
      return;
    }
    if (!this.formData.categoryId) {
      this.formError = 'Please select a product category.';
      return;
    }

    this.saving = true;
    this.formError = null;

    if (this.editingProductId) {
      this.prodService.updateProduct(this.editingProductId, this.formData).subscribe({
        next: res => {
          this.saving = false;
          if (res.success) {
            this.toast.success('Product updated successfully.');
            this.showFormModal = false;
            this.loadProducts();
          } else {
            this.formError = res.message || 'Failed to update product.';
          }
        },
        error: err => {
          this.saving = false;
          this.formError = err.error?.message || 'Server error updating product.';
        }
      });
    } else {
      this.prodService.createProduct(this.formData).subscribe({
        next: res => {
          this.saving = false;
          if (res.success) {
            this.toast.success('New product created successfully.');
            this.showFormModal = false;
            this.loadProducts();
          } else {
            this.formError = res.message || 'Failed to create product.';
          }
        },
        error: err => {
          this.saving = false;
          this.formError = err.error?.message || 'Server error creating product.';
        }
      });
    }
  }

  toggleStatus(id: number): void {
    this.prodService.toggleProductStatus(id).subscribe({
      next: res => {
        if (res.success) {
          this.toast.success('Product status updated.');
          this.loadProducts();
        }
      },
      error: () => this.toast.error('Failed to change product status.')
    });
  }

  deleteConfirmed(): void {
    if (!this.productToDelete) return;
    this.prodService.deleteProduct(this.productToDelete.productId).subscribe({
      next: res => {
        if (res.success) {
          this.toast.success('Product deleted.');
          this.productToDelete = null;
          this.loadProducts();
        } else {
          this.toast.error(res.message || 'Failed to delete product.');
        }
      },
      error: () => this.toast.error('Server error deleting product.')
    });
  }
}
