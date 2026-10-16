using Microsoft.EntityFrameworkCore;
using OMPolymer.API.Common;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Services.Implementations
{
    public class BlogService : IBlogService
    {
        private readonly OMPolymerDbContext _context;
        private readonly IFileStorageService _fileStorage;

        public BlogService(OMPolymerDbContext context, IFileStorageService fileStorage)
        {
            _context = context;
            _fileStorage = fileStorage;
        }

        public async Task<ApiResponse<PaginatedResponse<BlogResponse>>> GetPublishedBlogsAsync(int page, int pageSize, string? search)
        {
            var query = _context.BlogPosts
                .Where(b => b.IsPublished)
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(search)) query = query.Where(b => b.Title.Contains(search.Trim()));

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(b => b.PublishedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => MapToResponse(b))
                .ToListAsync();

            return ApiResponse<PaginatedResponse<BlogResponse>>.SuccessResponse(
                new PaginatedResponse<BlogResponse>(items, totalCount, page, pageSize));
        }

        public async Task<ApiResponse<PaginatedResponse<BlogResponse>>> GetAllBlogsAsync(int page, int pageSize, string? search)
        {
            var query = _context.BlogPosts
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(search)) query = query.Where(b => b.Title.Contains(search.Trim()));

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(b => b.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => MapToResponse(b))
                .ToListAsync();

            return ApiResponse<PaginatedResponse<BlogResponse>>.SuccessResponse(
                new PaginatedResponse<BlogResponse>(items, totalCount, page, pageSize));
        }

        public async Task<ApiResponse<BlogResponse>> GetBlogBySlugAsync(string slug)
        {
            var b = await _context.BlogPosts
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Slug == slug && x.IsPublished);

            if (b == null) return ApiResponse<BlogResponse>.FailureResponse("Blog post not found or unpublished.");
            return ApiResponse<BlogResponse>.SuccessResponse(MapToResponse(b));
        }

        public async Task<ApiResponse<BlogResponse>> CreateBlogAsync(BlogCreateRequest request)
        {
            var targetSlug = string.IsNullOrWhiteSpace(request.Slug) 
                ? SlugHelper.GenerateSlug(request.Title) 
                : SlugHelper.GenerateSlug(request.Slug);

            // Ensure unique slug with collision suffix if needed
            var originalSlug = targetSlug;
            int counter = 1;
            while (await _context.BlogPosts.AnyAsync(b => b.Slug.ToLower() == targetSlug.ToLower()))
            {
                targetSlug = $"{originalSlug}-{counter++}";
            }

            var post = new BlogPost
            {
                Title = request.Title.Trim(),
                Slug = targetSlug,
                ShortDescription = request.ShortDescription?.Trim(),
                Content = request.Content,
                FeaturedImageUrl = request.FeaturedImageUrl,
                Author = request.Author?.Trim(),
                MetaTitle = request.MetaTitle?.Trim(),
                MetaDescription = request.MetaDescription?.Trim(),
                IsPublished = request.IsPublished,
                PublishedAt = request.IsPublished ? DateTime.UtcNow : null,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();
            return ApiResponse<BlogResponse>.SuccessResponse(MapToResponse(post));
        }

        public async Task<ApiResponse<bool>> UpdateBlogAsync(int id, BlogCreateRequest request)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return ApiResponse<bool>.FailureResponse("Blog not found.");

            var targetSlug = string.IsNullOrWhiteSpace(request.Slug) 
                ? post.Slug 
                : SlugHelper.GenerateSlug(request.Slug);

            if (await _context.BlogPosts.AnyAsync(b => b.Slug.ToLower() == targetSlug.ToLower() && b.BlogId != id))
                return ApiResponse<bool>.FailureResponse("Slug already in use by another article.");

            if (!string.IsNullOrWhiteSpace(post.FeaturedImageUrl) && post.FeaturedImageUrl != request.FeaturedImageUrl)
            {
                await _fileStorage.DeleteImageAsync(post.FeaturedImageUrl);
            }

            post.Title = request.Title.Trim();
            post.Slug = targetSlug;
            post.ShortDescription = request.ShortDescription?.Trim();
            post.Content = request.Content;
            post.FeaturedImageUrl = request.FeaturedImageUrl;
            post.Author = request.Author?.Trim();
            post.MetaTitle = request.MetaTitle?.Trim();
            post.MetaDescription = request.MetaDescription?.Trim();

            if (!post.IsPublished && request.IsPublished) post.PublishedAt = DateTime.UtcNow;
            post.IsPublished = request.IsPublished;
            post.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true);
        }

        public async Task<ApiResponse<bool>> TogglePublishStatusAsync(int id, bool publish)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return ApiResponse<bool>.FailureResponse("Blog not found.");

            post.IsPublished = publish;
            post.PublishedAt = publish ? DateTime.UtcNow : null;
            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true);
        }

        public async Task<ApiResponse<bool>> DeleteBlogAsync(int id)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return ApiResponse<bool>.FailureResponse("Blog not found.");

            if (!string.IsNullOrWhiteSpace(post.FeaturedImageUrl))
            {
                await _fileStorage.DeleteImageAsync(post.FeaturedImageUrl);
            }

            _context.BlogPosts.Remove(post);
            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true);
        }

        private static BlogResponse MapToResponse(BlogPost b) => new()
        {
            BlogId = b.BlogId,
            Title = b.Title,
            Slug = b.Slug,
            ShortDescription = b.ShortDescription,
            Content = b.Content,
            FeaturedImageUrl = b.FeaturedImageUrl,
            Author = b.Author,
            MetaTitle = b.MetaTitle,
            MetaDescription = b.MetaDescription,
            IsPublished = b.IsPublished,
            PublishedAt = b.PublishedAt,
            CreatedAt = b.CreatedAt ?? DateTime.UtcNow
        };
    }
}