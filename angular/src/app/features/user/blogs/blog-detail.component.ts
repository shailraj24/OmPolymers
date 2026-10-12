import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogService } from '../../../core/services/blog.service';
import { CompanyService } from '../../../core/services/company.service';
import { BlogPost } from '../../../core/models/blog.model';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="py-10 px-6 max-w-4xl mx-auto space-y-8">
      
      <!-- Breadcrumb Navigation -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/" class="hover:text-blue-600">Home</a>
        <span>/</span>
        <a routerLink="/blogs" class="hover:text-blue-600">Articles</a>
        <span>/</span>
        <span class="text-slate-800 dark:text-slate-200 truncate font-medium">{{ blog()?.title || 'Article' }}</span>
      </nav>

      <!-- Loading State -->
      <div *ngIf="loading()" class="p-16 text-center text-slate-400 text-xs">
        Loading engineering article details...
      </div>

      <!-- Article View -->
      <article *ngIf="!loading() && blog() as b" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        
        <header class="space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              {{ b.category?.categoryName || 'Technical Whitepaper' }}
            </span>
            <span class="text-xs text-slate-500">Published: {{ b.publishedAt || b.createdAt | date:'longDate' }}</span>
            <span class="text-xs text-slate-500">· Author: {{ b.author || 'OM Polymer Engineering Lab' }}</span>
          </div>

          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
            {{ b.title }}
          </h1>

          <p *ngIf="b.shortDescription" class="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed border-l-4 border-blue-600 pl-4 py-1">
            {{ b.shortDescription }}
          </p>
        </header>

        <!-- Article Body -->
        <div class="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line text-sm sm:text-base border-t border-slate-200 dark:border-slate-800 pt-6">
          {{ b.content }}
        </div>

        <!-- Technical Consultation CTA -->
        <div class="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="space-y-1">
            <h3 class="font-bold text-base">Have technical questions regarding this specification?</h3>
            <p class="text-xs text-slate-300">Our materials engineering team can assist with pressure rating calculations and resin selection.</p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <a routerLink="/quote" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors">
              Request RFQ
            </a>
            <button (click)="chatOnWhatsApp(b.title)" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5">
              <span>💬</span> WhatsApp Desk
            </button>
          </div>
        </div>
      </article>

      <!-- Not Found -->
      <div *ngIf="!loading() && !blog()" class="p-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
        <h2 class="text-lg font-bold">Article Not Found</h2>
        <p class="text-xs text-slate-500">The requested article is unpublished or does not exist.</p>
        <a routerLink="/blogs" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
          Return to All Articles
        </a>
      </div>

    </div>
  `
})
export class BlogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private compService = inject(CompanyService);

  blog = signal<BlogPost | null>(null);
  loading = signal(true);
  whatsappNumber = '919876543210';

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.blogService.getBlogBySlug(slug).subscribe({
        next: res => {
          if (res.success && res.data) {
            this.blog.set(res.data);
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.loading.set(false);
    }

    this.compService.getCompanySettings().subscribe({
      next: res => {
        if (res.success && res.data?.whatsappContact) {
          this.whatsappNumber = res.data.whatsappContact.replace(/\D/g, '');
        }
      }
    });
  }

  chatOnWhatsApp(title: string): void {
    const msg = encodeURIComponent(`Hello OM Polymer Engineering, I am inquiring regarding your article: "${title}". Can you provide technical guidance?`);
    window.location.href = `https://wa.me/${this.whatsappNumber}?text=${msg}`;
  }
}
