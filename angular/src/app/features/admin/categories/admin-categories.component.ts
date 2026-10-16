import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { ToastService } from '../../../core/services/toast.service';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../../core/models/category.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>🏷️</span> Dynamic Product Categories
          </h1>
          <p class="text-xs text-slate-400 mt-1">Manage industrial product taxonomy, automated SEO slugs, and active catalog assignments</p>
        </div>
        <button 
          (click)="openCreateModal()" 
          class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>＋</span> Add Product Category
        </button>
      </div>

      <!-- Stats & Filter Bar -->
      <div class="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Search categories by name or description..." 
            class="w-full sm:w-80 px-3.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div class="flex items-center gap-4 text-xs text-slate-400">
          <div>Total: <span class="font-bold text-white">{{ categories().length }}</span></div>
          <span class="text-slate-700">·</span>
          <div>Active: <span class="font-bold text-emerald-400">{{ activeCount() }}</span></div>
          <span class="text-slate-700">·</span>
          <div>Total Linked Products: <span class="font-bold text-blue-400">{{ totalLinkedProducts() }}</span></div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="p-16 text-center text-slate-400 text-xs bg-slate-900 border border-slate-800 rounded-2xl">
        Loading product categories...
      </div>

      <!-- Categories Table -->
      <div *ngIf="!loading()" class="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-sm">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th class="p-3.5">Category Name</th>
              <th class="p-3.5">Description</th>
              <th class="p-3.5 text-center">Associated Products</th>
              <th class="p-3.5">Status</th>
              <th class="p-3.5">Created Date</th>
              <th class="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/80 text-slate-300">
            <tr *ngFor="let c of filteredCategories()" class="hover:bg-slate-800/30 transition-colors">
              <td class="p-3.5">
                <div class="font-semibold text-white flex items-center gap-2">
                  <span>{{ c.categoryName }}</span>
                </div>
                <div class="text-[11px] font-mono text-slate-500 truncate max-w-xs">/products?category={{ c.slug }}</div>
              </td>
              <td class="p-3.5 max-w-xs truncate text-slate-400">
                {{ c.description || 'No description provided' }}
              </td>
              <td class="p-3.5 text-center">
                <span 
                  class="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold"
                  [ngClass]="(c.productCount || 0) > 0 ? 'bg-blue-950 text-blue-400 border border-blue-800/50' : 'bg-slate-800 text-slate-500 border border-slate-700'"
                >
                  {{ c.productCount || 0 }} products
                </span>
              </td>
              <td class="p-3.5">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                  [ngClass]="c.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-slate-800 text-slate-400 border border-slate-700'">
                  {{ c.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="p-3.5 text-slate-400">
                {{ c.createdAt ? (c.createdAt | date:'mediumDate') : 'System Default' }}
              </td>
              <td class="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                <button (click)="openViewModal(c)" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors" title="View Details">
                  View
                </button>
                <button (click)="toggleStatus(c)" class="px-2.5 py-1 rounded transition-colors"
                  [ngClass]="c.isActive ? 'bg-amber-950 hover:bg-amber-900 text-amber-300' : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300'">
                  {{ c.isActive ? 'Deactivate' : 'Activate' }}
                </button>
                <button (click)="openEditModal(c)" class="px-2.5 py-1 bg-blue-950 hover:bg-blue-900 text-blue-300 rounded transition-colors">
                  Edit
                </button>
                <button (click)="handleDeleteClick(c)" class="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded transition-colors">
                  Delete
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredCategories().length === 0">
              <td colspan="6" class="p-12 text-center text-slate-500">
                <p class="text-sm">No product categories found matching your query.</p>
                <button (click)="openCreateModal()" class="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold">
                  Create First Category
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add / Edit Category Modal -->
      <div *ngIf="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <span>🏷️</span>
              {{ editingCategoryId ? 'Edit Product Category' : 'Create New Product Category' }}
            </h3>
            <button (click)="showFormModal = false" class="text-slate-400 hover:text-white text-lg">✕</button>
          </div>

          <form (ngSubmit)="saveCategory()" class="space-y-4 text-xs">
            <div>
              <label class="block text-slate-300 font-semibold mb-1">Category Name *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.categoryName" 
                name="categoryName" 
                required 
                placeholder="e.g. Agricultural Drip & Micro-Irrigation"
                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p class="text-[10px] text-slate-500 mt-1">SEO URL slug will be generated automatically in the backend from this category name.</p>
            </div>

            <div>
              <label class="block text-slate-300 font-semibold mb-1">Description (Optional)</label>
              <textarea 
                [(ngModel)]="formData.description" 
                name="description" 
                rows="3"
                placeholder="Industrial extrusion standards, resin classifications, or commercial applications..."
                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              ></textarea>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <label class="flex items-center gap-2 cursor-pointer text-slate-300">
                <input 
                  type="checkbox" 
                  [(ngModel)]="formData.isActive" 
                  name="isActive"
                  class="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700"
                />
                <span class="font-medium">Active (Available for Product Catalog assignments)</span>
              </label>
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
                {{ saving ? 'Saving...' : (editingCategoryId ? 'Update Category' : 'Create Category') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- View Category Details Modal -->
      <div *ngIf="selectedCategory" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                [ngClass]="selectedCategory.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-slate-800 text-slate-400 border border-slate-700'">
                {{ selectedCategory.isActive ? 'Active' : 'Inactive' }}
              </span>
              <h3 class="text-base font-bold text-white mt-1">{{ selectedCategory.categoryName }}</h3>
            </div>
            <button (click)="selectedCategory = null" class="text-slate-400 hover:text-white text-lg">✕</button>
          </div>

          <div class="text-xs text-slate-400 space-y-2">
            <div><strong>Category ID:</strong> {{ selectedCategory.categoryId }}</div>
            <div><strong>Auto-generated Slug:</strong> <code class="text-blue-400 font-mono">{{ selectedCategory.slug }}</code></div>
            <div><strong>Linked Products Count:</strong> {{ selectedCategory.productCount || 0 }}</div>
            <div *ngIf="selectedCategory.createdAt"><strong>Created At:</strong> {{ selectedCategory.createdAt | date:'medium' }}</div>
            <div *ngIf="selectedCategory.updatedAt"><strong>Updated At:</strong> {{ selectedCategory.updatedAt | date:'medium' }}</div>
          </div>

          <div *ngIf="selectedCategory.description" class="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-medium">
            {{ selectedCategory.description }}
          </div>

          <div class="flex justify-end pt-3">
            <button (click)="selectedCategory = null" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs">
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Guard Blocker Modal (when productCount > 0) -->
      <div *ngIf="categoryBlockedFromDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="bg-slate-900 border border-amber-800/60 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl mx-auto">
            🛡️
          </div>
          <div class="text-center space-y-2">
            <h3 class="text-base font-bold text-amber-400">Deletion Blocked: Products Assigned</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              Cannot delete category <strong class="text-white">"{{ categoryBlockedFromDelete.categoryName }}"</strong> because it currently has <span class="font-bold text-amber-300">{{ categoryBlockedFromDelete.productCount }} associated product(s)</span>.
            </p>
            <p class="text-[11px] text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800 text-left">
              To preserve catalog integrity and prevent orphaned products, please reassign or delete these products in the <strong>Product Catalog</strong> before deleting this category.
            </p>
          </div>
          <div class="flex justify-center pt-2">
            <button (click)="categoryBlockedFromDelete = null" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs">
              Understood
            </button>
          </div>
        </div>
      </div>

      <!-- Safe Delete Confirmation Modal (when productCount === 0) -->
      <div *ngIf="categoryToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="bg-slate-900 border border-rose-800/60 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
          <h3 class="text-base font-bold text-rose-400 flex items-center gap-2">
            <span>⚠️</span> Delete Product Category
          </h3>
          <p class="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to permanently delete category <strong class="text-white">"{{ categoryToDelete.categoryName }}"</strong>? No products are currently assigned to this category.
          </p>
          <div class="flex justify-end gap-3 pt-3">
            <button (click)="categoryToDelete = null" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs">
              Cancel
            </button>
            <button (click)="confirmDelete()" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-md">
              Confirm Delete
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class AdminCategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private toast = inject(ToastService);

  categories = signal<Category[]>([]);
  loading = signal<boolean>(true);
  searchQuery = '';

  showFormModal = false;
  editingCategoryId: number | null = null;
  selectedCategory: Category | null = null;
  categoryToDelete: Category | null = null;
  categoryBlockedFromDelete: Category | null = null;
  saving = false;
  formError: string | null = null;

  formData = {
    categoryName: '',
    description: '',
    isActive: true
  };

  activeCount = computed(() => this.categories().filter(c => c.isActive).length);
  totalLinkedProducts = computed(() => this.categories().reduce((acc, c) => acc + (c.productCount || 0), 0));

  filteredCategories(): Category[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.categories();
    return this.categories().filter(c => 
      c.categoryName.toLowerCase().includes(q) || 
      (c.description && c.description.toLowerCase().includes(q)) ||
      c.slug.toLowerCase().includes(q)
    );
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.categoryService.getAdminCategories().subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.categories.set(res.data);
        } else {
          this.categories.set([]);
        }
      },
      error: () => {
        this.loading.set(false);
        this.categories.set([]);
      }
    });
  }

  openCreateModal(): void {
    this.editingCategoryId = null;
    this.formData = {
      categoryName: '',
      description: '',
      isActive: true
    };
    this.formError = null;
    this.showFormModal = true;
  }

  openEditModal(c: Category): void {
    this.editingCategoryId = c.categoryId;
    this.formData = {
      categoryName: c.categoryName,
      description: c.description || '',
      isActive: c.isActive
    };
    this.formError = null;
    this.showFormModal = true;
  }

  openViewModal(c: Category): void {
    this.selectedCategory = c;
  }

  handleDeleteClick(c: Category): void {
    // Decision 2: Strictly block deletion if products are currently assigned!
    if ((c.productCount || 0) > 0) {
      this.categoryBlockedFromDelete = c;
      return;
    }
    this.categoryToDelete = c;
  }

  saveCategory(): void {
    const cleanName = this.formData.categoryName.trim();
    if (!cleanName) {
      this.formError = 'Category name is required.';
      return;
    }

    // Client-side duplicate check
    const isDuplicate = this.categories().some(c => 
      c.categoryName.toLowerCase() === cleanName.toLowerCase() && 
      c.categoryId !== this.editingCategoryId
    );
    if (isDuplicate) {
      this.formError = `A category named "${cleanName}" already exists. Please choose a unique name.`;
      return;
    }

    this.saving = true;
    this.formError = null;

    if (this.editingCategoryId) {
      const updateReq: UpdateCategoryRequest = {
        categoryName: cleanName,
        name: cleanName,
        description: this.formData.description.trim() || undefined,
        isActive: this.formData.isActive
      };

      this.categoryService.updateCategory(this.editingCategoryId, updateReq).subscribe({
        next: res => {
          this.saving = false;
          if (res.success) {
            this.toast.success(`Category "${cleanName}" updated successfully.`);
            this.showFormModal = false;
            this.loadCategories();
          } else {
            this.formError = res.message || 'Failed to update category.';
          }
        },
        error: err => {
          this.saving = false;
          this.formError = err.error?.message || 'Server error updating category.';
        }
      });
    } else {
      const createReq: CreateCategoryRequest = {
        categoryName: cleanName,
        name: cleanName,
        description: this.formData.description.trim() || undefined,
        isActive: this.formData.isActive
      };

      this.categoryService.createCategory(createReq).subscribe({
        next: res => {
          this.saving = false;
          if (res.success) {
            this.toast.success(`Category "${cleanName}" created successfully.`);
            this.showFormModal = false;
            this.loadCategories();
          } else {
            this.formError = res.message || 'Failed to create category.';
          }
        },
        error: err => {
          this.saving = false;
          this.formError = err.error?.message || 'Server error creating category.';
        }
      });
    }
  }

  toggleStatus(c: Category): void {
    this.categoryService.toggleCategoryStatus(c.categoryId).subscribe({
      next: res => {
        if (res.success) {
          const newStatus = !c.isActive;
          this.toast.success(`Category "${c.categoryName}" is now ${newStatus ? 'active' : 'inactive'}.`);
          this.loadCategories();
        } else {
          this.toast.error(res.message || 'Failed to toggle status.');
        }
      },
      error: () => this.toast.error('Network error changing category status.')
    });
  }

  confirmDelete(): void {
    if (!this.categoryToDelete) return;
    const cat = this.categoryToDelete;

    this.categoryService.deleteCategory(cat.categoryId).subscribe({
      next: res => {
        if (res.success) {
          this.toast.success(`Category "${cat.categoryName}" deleted successfully.`);
          this.categoryToDelete = null;
          this.loadCategories();
        } else {
          this.toast.error(res.message || 'Could not delete category.');
        }
      },
      error: err => {
        this.toast.error(err.error?.message || 'Server error deleting category.');
      }
    });
  }
}
