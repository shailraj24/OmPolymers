import { Pipe, PipeTransform, inject } from '@angular/core';
import { FileUrlService } from '../../core/services/file-url.service';

/**
 * Reusable standalone Angular Pipe for transforming backend-stored relative paths
 * (e.g. '/uploads/logos/om-polymer-logo.png') into complete backend URLs
 * (e.g. 'http://localhost:3000/uploads/logos/om-polymer-logo.png') while preserving
 * absolute URLs and handling missing images gracefully.
 *
 * Usage:
 *   <img [src]="product.mainImageUrl | fileUrl" />
 *   <img [src]="blog.featuredImageUrl | fileUrl:'/assets/fallback.jpg'" />
 */
@Pipe({
  name: 'fileUrl',
  standalone: true
})
export class FileUrlPipe implements PipeTransform {
  private fileUrlService = inject(FileUrlService);

  transform(value: string | null | undefined, fallback: string = ''): string {
    return this.fileUrlService.resolve(value, fallback);
  }
}
