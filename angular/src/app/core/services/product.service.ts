import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { ApiResponse, PagedResponse } from '../models/api-response.model';
import { Product, ProductCategory, CreateProductRequest } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  getProducts(page = 1, pageSize = 10, categoryId?: number, search?: string): Observable<ApiResponse<PagedResponse<Product>>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.PRODUCTS.LIST}`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (categoryId) params = params.set('categoryId', categoryId.toString());
    if (search?.trim()) params = params.set('search', search.trim());

    return this.http.get<ApiResponse<PagedResponse<Product>>>(url, { params });
  }

  getFeaturedProducts(): Observable<ApiResponse<Product[]>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.PRODUCTS.FEATURED}`;
    return this.http.get<ApiResponse<Product[]>>(url);
  }

  getCategories(): Observable<ApiResponse<ProductCategory[]>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.PRODUCTS.CATEGORIES}`;
    return this.http.get<ApiResponse<ProductCategory[]>>(url);
  }

  getProductBySlug(slug: string): Observable<ApiResponse<Product>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.PRODUCTS.BY_SLUG(slug)}`;
    return this.http.get<ApiResponse<Product>>(url);
  }

  createProduct(data: CreateProductRequest): Observable<ApiResponse<Product>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.PRODUCTS.CREATE}`;
    return this.http.post<ApiResponse<Product>>(url, data);
  }

  updateProduct(id: number, data: Partial<CreateProductRequest>): Observable<ApiResponse<boolean>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.PRODUCTS.UPDATE(id)}`;
    return this.http.put<ApiResponse<boolean>>(url, data);
  }

  toggleProductStatus(id: number): Observable<ApiResponse<{ isActive: boolean }>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.PRODUCTS.TOGGLE_STATUS(id)}`;
    return this.http.patch<ApiResponse<{ isActive: boolean }>>(url, {});
  }

  deleteProduct(id: number): Observable<ApiResponse<boolean>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.PRODUCTS.DELETE(id)}`;
    return this.http.delete<ApiResponse<boolean>>(url);
  }
}
