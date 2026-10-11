using Microsoft.EntityFrameworkCore;
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

        public async Task<ApiResponse<PaginatedResponse<BlogResponse>>> GetPublishedBlogsAsync(int page, int pageSize, int? categoryId, string? search)
        {
            var query = _context.BlogPosts
                .Include(b => b.BlogCategory)
                .Where(b => b.IsPublished)
                .AsNoTracking();

            if (categoryId.HasValue) query = query.Where(b => b.BlogCategoryId == categoryId.Value);
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

        public async Task<ApiResponse<BlogResponse>> GetBlogBySlugAsync(string slug)
        {
            var b = await _context.BlogPosts
                .Include(x => x.BlogCategory)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Slug == slug && x.IsPublished);

            if (b == null) return ApiResponse<BlogResponse>.FailureResponse("Blog post not found or unpublished.");
            return ApiResponse<BlogResponse>.SuccessResponse(MapToResponse(b));
        }

        public async Task<ApiResponse<IEnumerable<BlogCategoryResponse>>> GetBlogCategoriesAsync()
        {
            var items = await _context.BlogCategories
                .AsNoTracking()
                .Select(c => new BlogCategoryResponse { BlogCategoryId = c.BlogCategoryId, CategoryName = c.CategoryName, Slug = c.Slug })
                .ToListAsync();

            return ApiResponse<IEnumerable<BlogCategoryResponse>>.SuccessResponse(items);
        }

        public async Task<ApiResponse<BlogResponse>> CreateBlogAsync(BlogCreateRequest request)
        {
            if (await _context.BlogPosts.AnyAsync(b => b.Slug.ToLower() == request.Slug.ToLower()))
                return ApiResponse<BlogResponse>.FailureResponse("Slug already exists.");

            var post = new BlogPost
            {
                Title = request.Title,
                Slug = request.Slug,
                BlogCategoryId = request.BlogCategoryId,
                ShortDescription = request.ShortDescription,
                Content = request.Content,
                FeaturedImageUrl = request.FeaturedImageUrl,
                Author = request.Author,
                MetaTitle = request.MetaTitle,
                MetaDescription = request.MetaDescription,
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

            if (await _context.BlogPosts.AnyAsync(b => b.Slug.ToLower() == request.Slug.ToLower() && b.BlogId != id))
                return ApiResponse<bool>.FailureResponse("Slug already in use by another article.");

            if (!string.IsNullOrWhiteSpace(post.FeaturedImageUrl) && post.FeaturedImageUrl != request.FeaturedImageUrl)
            {
                await _fileStorage.DeleteImageAsync(post.FeaturedImageUrl);
            }

            post.Title = request.Title;
            post.Slug = request.Slug;
            post.BlogCategoryId = request.BlogCategoryId;
            post.ShortDescription = request.ShortDescription;
            post.Content = request.Content;
            post.FeaturedImageUrl = request.FeaturedImageUrl;
            post.Author = request.Author;
            post.MetaTitle = request.MetaTitle;
            post.MetaDescription = request.MetaDescription;

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
            CreatedAt = b.CreatedAt ?? DateTime.UtcNow,
            Category = b.BlogCategory != null ? new BlogCategoryResponse { BlogCategoryId = b.BlogCategory.BlogCategoryId, CategoryName = b.BlogCategory.CategoryName, Slug = b.BlogCategory.Slug } : null
        };
    }
}