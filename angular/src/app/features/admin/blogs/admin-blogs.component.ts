import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../../core/services/blog.service';
import { ToastService } from '../../../core/services/toast.service';
import { UploadService } from '../../../core/services/upload.service';
import { BlogPost, BlogCategory, CreateBlogRequest } from '../../../core/models/blog.model';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';

@Component({
  selector: 'app-admin-blogs',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Engineering Articles & Blogs</h1>
          <p class="text-xs text-slate-400 mt-1">Create, edit, publish, and manage technical whitepapers and industry insights</p>
        </div>
        <button 
          (click)="openCreateModal()" 
          class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <span>＋</span> Write New Article
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="loadBlogs()" 
            placeholder="Search by title..." 
            class="w-full sm:w-64 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div class="text-xs text-slate-400">
          Total: <span class="font-bold text-white">{{ blogs().length }}</span> articles
        </div>
      </div>

      <!-- Blogs Table -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-sm">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th class="p-3.5">Title & Slug</th>
              <th class="p-3.5">Category</th>
              <th class="p-3.5">Author</th>
              <th class="p-3.5">Status</th>
              <th class="p-3.5">Published Date</th>
              <th class="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/80 text-slate-300">
            <tr *ngFor="let b of blogs()" class="hover:bg-slate-800/30 transition-colors">
              <td class="p-3.5">
                <div class="font-semibold text-white max-w-sm truncate">{{ b.title }}</div>
                <div class="text-[11px] font-mono text-slate-500 truncate max-w-xs">/blogs/{{ b.slug }}</div>
              </td>
              <td class="p-3.5">
                <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {{ b.category?.categoryName || 'Technical' }}
                </span>
              </td>
              <td class="p-3.5 text-slate-400">{{ b.author || 'OM Polymer Lab' }}</td>
              <td class="p-3.5">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                  [ngClass]="b.isPublished ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-amber-950 text-amber-400 border border-amber-800/50'">
                  {{ b.isPublished ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="p-3.5 text-slate-400">
                {{ b.publishedAt ? (b.publishedAt | date:'mediumDate') : '—' }}
              </td>
              <td class="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                <button (click)="openViewModal(b)" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors">
                  View
                </button>
                <button (click)="togglePublish(b)" class="px-2.5 py-1 rounded transition-colors"
                  [ngClass]="b.isPublished ? 'bg-amber-950 hover:bg-amber-900 text-amber-300' : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300'">
                  {{ b.isPublished ? 'Unpublish' : 'Publish' }}
                </button>
                <button (click)="openEditModal(b)" class="px-2.5 py-1 bg-blue-950 hover:bg-blue-900 text-blue-300 rounded transition-colors">
                  Edit
                </button>
                <button (click)="confirmDelete(b)" class="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded transition-colors">
                  Delete
                </button>
              </td>
            </tr>
            <tr *ngIf="blogs().length === 0">
              <td colspan="6" class="p-8 text-center text-slate-500">
                No blog articles found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add/Edit Modal -->
      <div *ngIf="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="text-base font-bold text-white">
              {{ editingBlogId ? 'Edit Engineering Article' : 'Compose New Article' }}
            </h3>
            <button (click)="showFormModal = false" class="text-slate-400 hover:text-white text-lg">✕</button>
          </div>

          <form (ngSubmit)="saveBlog()" class="space-y-4 text-xs">
            <div>
              <label class="block text-slate-300 font-semibold mb-1">Article Title *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.title" 
                name="title" 
                (ngModelChange)="onTitleChange($event)"
                required 
                placeholder="e.g. Advances in PE100-RC Resins for Trenchless Installations"
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
                  placeholder="e.g. advances-in-pe100-rc-resins"
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-slate-300 font-semibold mb-1">Category</label>
                <select 
                  [(ngModel)]="formData.blogCategoryId" 
                  name="categoryId" 
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option [ngValue]="null">Select Category</option>
                  <option *ngFor="let c of categories()" [ngValue]="c.blogCategoryId">
                    {{ c.categoryName }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-300 font-semibold mb-1">Author Name</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.author" 
                  name="author" 
                  placeholder="e.g. Dr. Ramesh Patel, Chief Polymer Technologist"
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div class="flex items-center gap-3 pt-6">
                <label class="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="formData.isPublished" 
                    name="isPublished"
                    class="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700"
                  />
                  <span>Publish Immediately (Publicly Visible)</span>
                </label>
              </div>
            </div>

            <app-file-upload 
              category="blogs" 
              label="Featured Article Thumbnail" 
              helperText="PNG, JPG, WEBP (Max 5MB) · Uploads to API on Save"
              [currentImageUrl]="formData.featuredImageUrl" 
              (fileSelected)="stagedBlogFile = $event"
              (imageUrlChange)="formData.featuredImageUrl = $event"
              (imageRemoved)="stagedBlogFile = null; formData.featuredImageUrl = ''"
            ></app-file-upload>

            <div>
              <label class="block text-slate-300 font-semibold mb-1">Short Description / Excerpt</label>
              <textarea 
                [(ngModel)]="formData.shortDescription" 
                name="shortDescription" 
                rows="2"
                placeholder="Brief summary for listings and preview cards..."
                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-slate-300 font-semibold mb-1">Full Article Content (Markdown / Plain Text) *</label>
              <textarea 
                [(ngModel)]="formData.content" 
                name="content" 
                rows="8"
                required
                placeholder="Comprehensive technical writeup, specifications, standards, and references..."
                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                {{ saving ? 'Saving...' : (editingBlogId ? 'Update Article' : 'Publish Article') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- View Modal -->
      <div *ngIf="selectedBlog" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400">
                {{ selectedBlog.category?.categoryName || 'Technical' }}
              </span>
              <h3 class="text-base font-bold text-white mt-1">{{ selectedBlog.title }}</h3>
            </div>
            <button (click)="selectedBlog = null" class="text-slate-400 hover:text-white text-lg">✕</button>
          </div>

          <div class="text-xs text-slate-400 space-y-1">
            <div><strong>Slug:</strong> /blogs/{{ selectedBlog.slug }}</div>
            <div><strong>Author:</strong> {{ selectedBlog.author || 'OM Polymer Lab' }}</div>
            <div><strong>Status:</strong> {{ selectedBlog.isPublished ? 'Published' : 'Draft' }}</div>
            <div *ngIf="selectedBlog.publishedAt"><strong>Published At:</strong> {{ selectedBlog.publishedAt | date:'medium' }}</div>
          </div>

          <div *ngIf="selectedBlog.shortDescription" class="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-medium">
            {{ selectedBlog.shortDescription }}
          </div>

          <div class="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
            {{ selectedBlog.content }}
          </div>

          <div class="flex justify-end pt-3">
            <button (click)="selectedBlog = null" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs">
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="blogToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
          <h3 class="text-base font-bold text-rose-400 flex items-center gap-2">
            <span>⚠️</span> Delete Article
          </h3>
          <p class="text-xs text-slate-300">
            Are you sure you want to permanently delete <strong class="text-white">"{{ blogToDelete.title }}"</strong>? This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3 pt-3">
            <button (click)="blogToDelete = null" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs">
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
export class AdminBlogsComponent implements OnInit {
  private blogService = inject(BlogService);
  private toast = inject(ToastService);
  private uploadService = inject(UploadService);

  blogs = signal<BlogPost[]>([]);
  categories = signal<BlogCategory[]>([]);
  searchQuery = '';

  showFormModal = false;
  editingBlogId: number | null = null;
  selectedBlog: BlogPost | null = null;
  blogToDelete: BlogPost | null = null;
  saving = false;
  formError: string | null = null;
  stagedBlogFile: File | null = null;

  formData: CreateBlogRequest = {
    title: '',
    slug: '',
    blogCategoryId: null,
    shortDescription: '',
    content: '',
    author: 'OM Polymer Technical Team',
    isPublished: true
  };

  ngOnInit(): void {
    this.loadCategories();
    this.loadBlogs();
  }

  loadCategories(): void {
    this.blogService.getCategories().subscribe({
      next: res => {
        if (res.success && res.data) this.categories.set(res.data);
      }
    });
  }

  loadBlogs(): void {
    this.blogService.getAdminBlogs(1, 100, undefined, this.searchQuery).subscribe({
      next: res => {
        if (res.success && res.data?.items) {
          this.blogs.set(res.data.items);
        } else {
          this.blogs.set([]);
        }
      },
      error: () => this.blogs.set([])
    });
  }

  onTitleChange(val: string): void {
    if (!this.editingBlogId) {
      this.formData.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
  }

  openCreateModal(): void {
    this.editingBlogId = null;
    this.stagedBlogFile = null;
    this.formData = {
      title: '',
      slug: '',
      blogCategoryId: this.categories()[0]?.blogCategoryId || null,
      shortDescription: '',
      content: '',
      featuredImageUrl: '',
      author: 'OM Polymer Technical Team',
      isPublished: true
    };
    this.formError = null;
    this.showFormModal = true;
  }

  openEditModal(b: BlogPost): void {
    this.editingBlogId = b.blogId;
    this.stagedBlogFile = null;
    this.formData = {
      title: b.title,
      slug: b.slug,
      blogCategoryId: b.category?.blogCategoryId || null,
      shortDescription: b.shortDescription || '',
      content: b.content,
      featuredImageUrl: b.featuredImageUrl || '',
      author: b.author || '',
      isPublished: b.isPublished
    };
    this.formError = null;
    this.showFormModal = true;
  }

  openViewModal(b: BlogPost): void {
    this.selectedBlog = b;
  }

  confirmDelete(b: BlogPost): void {
    this.blogToDelete = b;
  }

  saveBlog(): void {
    if (!this.formData.title.trim()) {
      this.formError = 'Please provide an article title.';
      return;
    }
    if (!this.formData.slug.trim()) {
      this.formError = 'Please provide a valid slug.';
      return;
    }
    if (!this.formData.content.trim()) {
      this.formError = 'Please enter article content.';
      return;
    }

    this.saving = true;
    this.formError = null;

    // Only upload image to API if a new file was staged
    if (this.stagedBlogFile) {
      this.uploadService.uploadImage(this.stagedBlogFile, 'blogs').subscribe({
        next: (uploadRes) => {
          if (uploadRes.success && uploadRes.data?.relativeUrl) {
            this.formData.featuredImageUrl = uploadRes.data.relativeUrl;
            this.stagedBlogFile = null;
            this.executeSaveBlog();
          } else {
            this.saving = false;
            this.formError = uploadRes.message || 'Image upload failed.';
          }
        },
        error: (err) => {
          this.saving = false;
          this.formError = err?.error?.message || 'Image upload failed. Please verify admin session.';
        }
      });
    } else {
      this.executeSaveBlog();
    }
  }

  private executeSaveBlog(): void {
    if (this.editingBlogId) {
      this.blogService.updateBlog(this.editingBlogId, this.formData).subscribe({
        next: res => {
          this.saving = false;
          if (res.success) {
            this.toast.success('Article updated successfully.');
            this.showFormModal = false;
            this.loadBlogs();
          } else {
            this.formError = res.message || 'Failed to update article.';
          }
        },
        error: err => {
          this.saving = false;
          this.formError = err.error?.message || 'Error communicating with server.';
        }
      });
    } else {
      this.blogService.createBlog(this.formData).subscribe({
        next: res => {
          this.saving = false;
          if (res.success) {
            this.toast.success('Article created and published successfully.');
            this.showFormModal = false;
            this.loadBlogs();
          } else {
            this.formError = res.message || 'Failed to create article.';
          }
        },
        error: err => {
          this.saving = false;
          this.formError = err.error?.message || 'Error communicating with server.';
        }
      });
    }
  }

  togglePublish(b: BlogPost): void {
    const action$ = b.isPublished 
      ? this.blogService.unpublishBlog(b.blogId) 
      : this.blogService.publishBlog(b.blogId);

    action$.subscribe({
      next: res => {
        if (res.success) {
          this.toast.success(`Article ${b.isPublished ? 'moved to drafts' : 'published successfully'}.`);
          this.loadBlogs();
        } else {
          this.toast.error(res.message || 'Action failed.');
        }
      },
      error: () => this.toast.error('Network error updating status.')
    });
  }

  deleteConfirmed(): void {
    if (!this.blogToDelete) return;
    this.blogService.deleteBlog(this.blogToDelete.blogId).subscribe({
      next: res => {
        if (res.success) {
          this.toast.success('Article removed permanently.');
          this.blogToDelete = null;
          this.loadBlogs();
        } else {
          this.toast.error(res.message || 'Failed to delete article.');
        }
      },
      error: () => this.toast.error('Server error deleting article.')
    });
  }
}
