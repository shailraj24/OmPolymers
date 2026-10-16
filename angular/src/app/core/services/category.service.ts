import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { ApiResponse } from '../models/api-response.model';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);

  getPublicCategories(): Observable<ApiResponse<Category[]>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.CATEGORIES.PUBLIC_LIST}`;
    return this.http.get<ApiResponse<Category[]>>(url);
  }

  getAdminCategories(): Observable<ApiResponse<Category[]>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.CATEGORIES.ADMIN_LIST}`;
    return this.http.get<ApiResponse<Category[]>>(url);
  }

  getCategoryById(id: number): Observable<ApiResponse<Category>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.CATEGORIES.BY_ID(id)}`;
    return this.http.get<ApiResponse<Category>>(url);
  }

  createCategory(data: CreateCategoryRequest): Observable<ApiResponse<Category>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.CATEGORIES.CREATE}`;
    return this.http.post<ApiResponse<Category>>(url, data);
  }

  updateCategory(id: number, data: UpdateCategoryRequest): Observable<ApiResponse<Category>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.CATEGORIES.UPDATE(id)}`;
    return this.http.put<ApiResponse<Category>>(url, data);
  }

  toggleCategoryStatus(id: number): Observable<ApiResponse<{ isActive: boolean }>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.CATEGORIES.TOGGLE_STATUS(id)}`;
    return this.http.patch<ApiResponse<{ isActive: boolean }>>(url, {});
  }

  deleteCategory(id: number): Observable<ApiResponse<boolean>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.CATEGORIES.DELETE(id)}`;
    return this.http.delete<ApiResponse<boolean>>(url);
  }
}
