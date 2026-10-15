import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUrlService {
  /**
   * Resolves the configured base URL for files/uploads.
   * Priority:
   * 1. Explicit `environment.fileBaseUrl` (e.g. 'http://localhost:44370')
   * 2. Host origin extracted from absolute `environment.apiUrl` (e.g. 'http://localhost:44370/api' -> 'http://localhost:44370')
   * 3. Empty string if relative apiUrl (e.g. '/api' for production reverse proxy)
   */
  getBaseUrl(): string {
    const envFileBase = (environment as any).fileBaseUrl;
    if (typeof envFileBase === 'string') {
      return envFileBase.replace(/\/+$/, '');
    }

    const apiUrl = environment.apiUrl || '';
    if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
      try {
        const parsed = new URL(apiUrl);
        return parsed.origin;
      } catch {
        return apiUrl.replace(/\/api\/?$/i, '').replace(/\/+$/, '');
      }
    }

    return '';
  }

  /**
   * Transforms an asset path or URL into a fully-qualified URL for display.
   * Safe with:
   * - Absolute URLs (http://, https://, data:, blob:) -> untouched
   * - Relative paths (/uploads/logos/..., uploads/...) -> prepends backend base URL
   * - Missing/null/undefined paths -> returns fallback URL or empty string
   * - Avoids duplicate slashes: strips trailing slashes on base and leading slash duplicates
   *
   * @param path Stored relative path or absolute URL
   * @param fallback Optional fallback image URL if path is missing
   */
  resolve(path: string | null | undefined, fallback: string = ''): string {
    if (!path || typeof path !== 'string' || !path.trim()) {
      return fallback;
    }

    const trimmed = path.trim();

    // Already absolute (http://, https://, protocol-relative //, data:image, blob:)
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('//') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('blob:')
    ) {
      return trimmed;
    }

    const base = this.getBaseUrl();
    if (!base) {
      // In production same-origin setup, ensure single leading slash
      return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    }

    // Combine base and path with exactly one slash
    const cleanPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
    return `${base}/${cleanPath}`;
  }
}
