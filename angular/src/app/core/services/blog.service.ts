import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { ApiResponse, PagedResponse } from '../models/api-response.model';
import { BlogPost, CreateBlogRequest } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient);

  getPublishedBlogs(page = 1, pageSize = 10, search?: string): Observable<ApiResponse<PagedResponse<BlogPost>>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.BLOGS.PUBLIC_LIST}`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search?.trim()) params = params.set('search', search.trim());

    return this.http.get<ApiResponse<PagedResponse<BlogPost>>>(url, { params });
  }

  getAdminBlogs(page = 1, pageSize = 20, search?: string): Observable<ApiResponse<PagedResponse<BlogPost>>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.BLOGS.ADMIN_LIST}`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search?.trim()) params = params.set('search', search.trim());

    return this.http.get<ApiResponse<PagedResponse<BlogPost>>>(url, { params });
  }

  getBlogBySlug(slug: string): Observable<ApiResponse<BlogPost>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.BLOGS.BY_SLUG(slug)}`;
    return this.http.get<ApiResponse<BlogPost>>(url);
  }

  createBlog(data: CreateBlogRequest): Observable<ApiResponse<BlogPost>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.BLOGS.CREATE}`;
    return this.http.post<ApiResponse<BlogPost>>(url, data);
  }

  updateBlog(id: number, data: CreateBlogRequest): Observable<ApiResponse<boolean>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.BLOGS.UPDATE(id)}`;
    return this.http.put<ApiResponse<boolean>>(url, data);
  }

  publishBlog(id: number): Observable<ApiResponse<boolean>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.BLOGS.PUBLISH(id)}`;
    return this.http.patch<ApiResponse<boolean>>(url, {});
  }

  unpublishBlog(id: number): Observable<ApiResponse<boolean>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.BLOGS.UNPUBLISH(id)}`;
    return this.http.patch<ApiResponse<boolean>>(url, {});
  }

  deleteBlog(id: number): Observable<ApiResponse<boolean>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.BLOGS.DELETE(id)}`;
    return this.http.delete<ApiResponse<boolean>>(url);
  }
}
