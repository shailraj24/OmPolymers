using Microsoft.EntityFrameworkCore;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Services.Implementations
{
    public class TestimonialService : ITestimonialService
    {
        private readonly OMPolymerDbContext _context;

        public TestimonialService(OMPolymerDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<IEnumerable<TestimonialResponse>>> GetPublishedTestimonialsAsync()
        {
            var items = await _context.Testimonials
                .Where(t => t.IsPublished && t.IsApproved)
                .OrderByDescending(t => t.CreatedAt)
                .AsNoTracking()
                .Select(t => MapToResponse(t))
                .ToListAsync();

            return ApiResponse<IEnumerable<TestimonialResponse>>.SuccessResponse(items);
        }

        public async Task<ApiResponse<IEnumerable<TestimonialResponse>>> GetAllTestimonialsAsync()
        {
            var items = await _context.Testimonials
                .OrderByDescending(t => t.CreatedAt)
                .AsNoTracking()
                .Select(t => MapToResponse(t))
                .ToListAsync();

            return ApiResponse<IEnumerable<TestimonialResponse>>.SuccessResponse(items);
        }

        public async Task<ApiResponse<TestimonialResponse>> CreateTestimonialAsync(TestimonialCreateRequest request)
        {
            var t = new Testimonial
            {
                DisplayName = request.DisplayName,
                CompanyOrDesignation = request.CompanyOrDesignation,
                ReviewText = request.ReviewText,
                Rating = request.Rating,
                IsApproved = request.IsApproved,
                IsPublished = request.IsPublished,
                CreatedAt = DateTime.UtcNow
            };

            _context.Testimonials.Add(t);
            await _context.SaveChangesAsync();
            return ApiResponse<TestimonialResponse>.SuccessResponse(MapToResponse(t));
        }

        public async Task<ApiResponse<bool>> UpdateTestimonialAsync(int id, TestimonialCreateRequest request)
        {
            var t = await _context.Testimonials.FindAsync(id);
            if (t == null) return ApiResponse<bool>.FailureResponse("Testimonial not found.");

            t.DisplayName = request.DisplayName;
            t.CompanyOrDesignation = request.CompanyOrDesignation;
            t.ReviewText = request.ReviewText;
            t.Rating = request.Rating;
            t.IsApproved = request.IsApproved;
            t.IsPublished = request.IsPublished;

            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true);
        }

        public async Task<ApiResponse<bool>> TogglePublishStatusAsync(int id)
        {
            var t = await _context.Testimonials.FindAsync(id);
            if (t == null) return ApiResponse<bool>.FailureResponse("Testimonial not found.");

            t.IsPublished = !t.IsPublished;
            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true);
        }

        public async Task<ApiResponse<bool>> DeleteTestimonialAsync(int id)
        {
            var t = await _context.Testimonials.FindAsync(id);
            if (t == null) return ApiResponse<bool>.FailureResponse("Testimonial not found.");

            _context.Testimonials.Remove(t);
            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true);
        }

        private static TestimonialResponse MapToResponse(Testimonial t) => new()
        {
            TestimonialId = t.TestimonialId,
            DisplayName = t.DisplayName,
            CompanyOrDesignation = t.CompanyOrDesignation,
            ReviewText = t.ReviewText,
            Rating = t.Rating ?? 5,
            IsApproved = t.IsApproved,
            IsPublished = t.IsPublished,
            CreatedAt = t.CreatedAt ?? DateTime.UtcNow
        };
    }
}