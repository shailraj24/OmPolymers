export interface Testimonial {
  testimonialId: number;
  displayName: string;
  companyOrDesignation: string;
  reviewText: string;
  rating: number;
  isApproved: boolean;
  isPublished: boolean;
  createdAt: string;
}
