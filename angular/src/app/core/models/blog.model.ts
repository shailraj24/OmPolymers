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
}

export interface CreateBlogRequest {
  title: string;
  slug?: string;
  shortDescription?: string;
  content: string;
  featuredImageUrl?: string;
  author?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
}
