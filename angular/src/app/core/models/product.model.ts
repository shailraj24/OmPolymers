export interface ProductCategory {
  categoryId: number;
  categoryName: string;
  slug: string;
}

export interface ProductImage {
  imageId: number;
  imageUrl: string;
}

export interface Product {
  productId: number;
  productName: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  specifications: string;
  mainImageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: ProductCategory | null;
  additionalImages: ProductImage[];
}

export interface CreateProductRequest {
  productName: string;
  slug: string;
  categoryId: number;
  shortDescription?: string;
  fullDescription?: string;
  specifications?: string;
  mainImageUrl?: string;
  isFeatured?: boolean;
  additionalImages?: string[];
}
