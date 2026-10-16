export interface Category {
  categoryId: number;
  id?: number;
  categoryName: string;
  name?: string;
  slug: string;
  description?: string;
  isActive: boolean;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  categoryName: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateCategoryRequest {
  categoryName: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}
