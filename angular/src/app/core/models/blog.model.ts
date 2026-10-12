export interface BlogCategory {
  blogCategoryId: number;
  categoryName: string;
  slug: string;
}

export interface BlogPost {
  blogId: number;
  title: string;
  slug: string;
  shortDescription?: string;
  content: string;
  featuredImageUrl?: string;
  author?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  category?: BlogCategory | null;
}

export interface CreateBlogRequest {
  title: string;
  slug: string;
  blogCategoryId?: number | null;
  shortDescription?: string;
  content: string;
  featuredImageUrl?: string;
  author?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
}
