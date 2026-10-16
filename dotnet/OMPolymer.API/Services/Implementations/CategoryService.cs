using Microsoft.EntityFrameworkCore;
using OMPolymer.API.Common;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly OMPolymerDbContext _context;
        private readonly ILogger<CategoryService> _logger;

        public CategoryService(OMPolymerDbContext context, ILogger<CategoryService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ApiResponse<IEnumerable<CategoryResponseDto>>> GetAllCategoriesAsync(bool onlyActive = false)
        {
            var query = _context.ProductCategories
                .AsNoTracking();

            if (onlyActive)
            {
                query = query.Where(c => c.IsActive);
            }

            var items = await query
                .OrderBy(c => c.CategoryName)
                .Select(c => new CategoryResponseDto
                {
                    CategoryId = c.CategoryId,
                    CategoryName = c.CategoryName,
                    Slug = c.Slug,
                    Description = c.Description,
                    IsActive = c.IsActive,
                    ProductCount = c.Products.Count,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync();

            return ApiResponse<IEnumerable<CategoryResponseDto>>.SuccessResponse(items);
        }

        public async Task<ApiResponse<CategoryResponseDto>> GetCategoryByIdAsync(int id)
        {
            var cat = await _context.ProductCategories
                .AsNoTracking()
                .Where(c => c.CategoryId == id)
                .Select(c => new CategoryResponseDto
                {
                    CategoryId = c.CategoryId,
                    CategoryName = c.CategoryName,
                    Slug = c.Slug,
                    Description = c.Description,
                    IsActive = c.IsActive,
                    ProductCount = c.Products.Count,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (cat == null)
            {
                return ApiResponse<CategoryResponseDto>.FailureResponse($"Category with ID {id} not found.");
            }

            return ApiResponse<CategoryResponseDto>.SuccessResponse(cat);
        }

        public async Task<ApiResponse<CategoryResponseDto>> CreateCategoryAsync(CreateCategoryDto request)
        {
            var cleanName = (request.CategoryName ?? request.Name ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(cleanName))
            {
                return ApiResponse<CategoryResponseDto>.FailureResponse("Category name is required.");
            }

            // Check duplicate name
            if (await _context.ProductCategories.AnyAsync(c => c.CategoryName.ToLower() == cleanName.ToLower()))
            {
                return ApiResponse<CategoryResponseDto>.FailureResponse($"A category with the name '{cleanName}' already exists.");
            }

            // Generate clean SEO slug
            var baseSlug = SlugHelper.GenerateSlug(cleanName);
            var slug = baseSlug;
            int counter = 1;
            while (await _context.ProductCategories.AnyAsync(c => c.Slug.ToLower() == slug.ToLower()))
            {
                slug = $"{baseSlug}-{counter++}";
            }

            var category = new ProductCategory
            {
                CategoryName = cleanName,
                Slug = slug,
                Description = request.Description?.Trim(),
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.ProductCategories.Add(category);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Admin created product category: {Name} (ID: {Id})", category.CategoryName, category.CategoryId);

            var response = new CategoryResponseDto
            {
                CategoryId = category.CategoryId,
                CategoryName = category.CategoryName,
                Slug = category.Slug,
                Description = category.Description,
                IsActive = category.IsActive,
                ProductCount = 0,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt
            };

            return ApiResponse<CategoryResponseDto>.SuccessResponse(response);
        }

        public async Task<ApiResponse<CategoryResponseDto>> UpdateCategoryAsync(int id, UpdateCategoryDto request)
        {
            var cat = await _context.ProductCategories
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.CategoryId == id);

            if (cat == null)
            {
                return ApiResponse<CategoryResponseDto>.FailureResponse($"Category with ID {id} not found.");
            }

            var cleanName = (request.CategoryName ?? request.Name ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(cleanName))
            {
                return ApiResponse<CategoryResponseDto>.FailureResponse("Category name is required.");
            }

            // Check duplicate name excluding self
            if (await _context.ProductCategories.AnyAsync(c => c.CategoryId != id && c.CategoryName.ToLower() == cleanName.ToLower()))
            {
                return ApiResponse<CategoryResponseDto>.FailureResponse($"Another category with the name '{cleanName}' already exists.");
            }

            // If name changed, update slug
            if (!string.Equals(cat.CategoryName, cleanName, StringComparison.OrdinalIgnoreCase))
            {
                var baseSlug = SlugHelper.GenerateSlug(cleanName);
                var slug = baseSlug;
                int counter = 1;
                while (await _context.ProductCategories.AnyAsync(c => c.CategoryId != id && c.Slug.ToLower() == slug.ToLower()))
                {
                    slug = $"{baseSlug}-{counter++}";
                }
                cat.Slug = slug;
            }

            cat.CategoryName = cleanName;
            cat.Description = request.Description?.Trim();
            cat.IsActive = request.IsActive;
            cat.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Admin updated product category: {Name} (ID: {Id})", cat.CategoryName, cat.CategoryId);

            var response = new CategoryResponseDto
            {
                CategoryId = cat.CategoryId,
                CategoryName = cat.CategoryName,
                Slug = cat.Slug,
                Description = cat.Description,
                IsActive = cat.IsActive,
                ProductCount = cat.Products.Count,
                CreatedAt = cat.CreatedAt,
                UpdatedAt = cat.UpdatedAt
            };

            return ApiResponse<CategoryResponseDto>.SuccessResponse(response);
        }

        public async Task<ApiResponse<bool>> ToggleStatusAsync(int id)
        {
            var cat = await _context.ProductCategories.FindAsync(id);
            if (cat == null)
            {
                return ApiResponse<bool>.FailureResponse($"Category with ID {id} not found.");
            }

            cat.IsActive = !cat.IsActive;
            cat.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Admin toggled product category {Id} status to {Status}", id, cat.IsActive);
            return ApiResponse<bool>.SuccessResponse(cat.IsActive);
        }

        public async Task<ApiResponse<bool>> DeleteCategoryAsync(int id)
        {
            var cat = await _context.ProductCategories
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.CategoryId == id);

            if (cat == null)
            {
                return ApiResponse<bool>.FailureResponse($"Category with ID {id} not found.");
            }

            // Confirmed Decision 2: Strictly block deletion if products are currently assigned!
            if (cat.Products.Any())
            {
                var count = cat.Products.Count;
                return ApiResponse<bool>.FailureResponse(
                    $"Cannot delete category '{cat.CategoryName}' because {count} associated product(s) are currently assigned to it. Please reassign or delete these products before deleting this category.");
            }

            _context.ProductCategories.Remove(cat);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Admin deleted product category: {Name} (ID: {Id})", cat.CategoryName, id);
            return ApiResponse<bool>.SuccessResponse(true);
        }
    }
}
