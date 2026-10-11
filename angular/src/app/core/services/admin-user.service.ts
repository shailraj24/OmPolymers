import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { ApiResponse, PagedResponse } from '../models/api-response.model';
import { AdminUser, CreateAdminRequest, UpdateAdminRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private http = inject(HttpClient);

  getUsers(page = 1, pageSize = 10, role = 'All', status = 'All', search = ''): Observable<ApiResponse<PagedResponse<AdminUser>>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.USERS.LIST}`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (role && role !== 'All') params = params.set('role', role);
    if (status && status !== 'All') params = params.set('status', status);
    if (search.trim()) params = params.set('search', search.trim());

    return this.http.get<ApiResponse<PagedResponse<AdminUser>>>(url, { params });
  }

  createUser(data: CreateAdminRequest): Observable<ApiResponse<AdminUser>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.USERS.CREATE}`;
    return this.http.post<ApiResponse<AdminUser>>(url, data);
  }

  updateUser(id: number, data: UpdateAdminRequest): Observable<ApiResponse<AdminUser>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.USERS.UPDATE(id)}`;
    return this.http.put<ApiResponse<AdminUser>>(url, data);
  }

  toggleUserStatus(id: number): Observable<ApiResponse<AdminUser>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.USERS.TOGGLE_STATUS(id)}`;
    return this.http.patch<ApiResponse<AdminUser>>(url, {});
  }

  deleteUser(id: number): Observable<ApiResponse<boolean>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.USERS.DELETE(id)}`;
    return this.http.delete<ApiResponse<boolean>>(url);
  }
}
