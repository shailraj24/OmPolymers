import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../../core/services/blog.service';
import { BlogPost, BlogCategory } from '../../../core/models/blog.model';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="py-10 px-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight">Engineering Articles & Insights</h1>
        <p class="text-xs text-slate-500 mt-1">Research papers, hydrostatic testing data, and polymer manufacturing best practices</p>
      </div>

      <!-- Filters & Search Bar -->
      <div class="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="flex flex-wrap gap-2">
          <button 
            (click)="selectCategory(undefined)"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            [ngClass]="selectedCategoryId() === undefined ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
          >
            All Categories
          </button>
          <button 
            *ngFor="let cat of categories()"
            (click)="selectCategory(cat.blogCategoryId)"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            [ngClass]="selectedCategoryId() === cat.blogCategoryId ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
          >
            {{ cat.categoryName }}
          </button>
        </div>

        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          (ngModelChange)="loadBlogs()"
          placeholder="Search articles by title or keyword..." 
          class="w-full md:w-80 px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="p-16 text-center text-slate-400 text-xs">
        Loading engineering articles...
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading() && blogs().length === 0" class="p-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <p class="text-slate-500 text-sm">No articles found matching your criteria.</p>
      </div>

      <!-- Blogs Grid -->
      <div *ngIf="!loading() && blogs().length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article *ngFor="let blog of blogs()" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-xl transition-all">
          <div class="p-6 space-y-3">
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {{ blog.category?.categoryName || 'Technical' }}
              </span>
              <span>{{ blog.createdAt | date:'mediumDate' }}</span>
            </div>
            
            <h2 class="font-bold text-lg leading-snug hover:text-blue-600 transition-colors">
              <a [routerLink]="['/blogs', blog.slug]">{{ blog.title }}</a>
            </h2>
            
            <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">
              {{ blog.shortDescription }}
            </p>
          </div>

          <div class="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-4 flex items-center justify-between">
            <span class="text-xs text-slate-400">Author: {{ blog.author || 'OM Polymer Lab' }}</span>
            <a [routerLink]="['/blogs', blog.slug]" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Read Complete Article →
            </a>
          </div>
        </article>
      </div>
    </div>
  `
})
export class BlogListComponent implements OnInit {
  private blogService = inject(BlogService);

  blogs = signal<BlogPost[]>([]);
  categories = signal<BlogCategory[]>([]);
  selectedCategoryId = signal<number | undefined>(undefined);
  searchQuery = '';
  loading = signal(true);

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

  selectCategory(id?: number): void {
    this.selectedCategoryId.set(id);
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading.set(true);
    this.blogService.getPublishedBlogs(1, 50, this.selectedCategoryId(), this.searchQuery).subscribe({
      next: res => {
        if (res.success && res.data?.items) {
          this.blogs.set(res.data.items);
        } else {
          this.blogs.set([]);
        }
        this.loading.set(false);
      },
      error: () => {
        this.blogs.set([]);
        this.loading.set(false);
      }
    });
  }
}
