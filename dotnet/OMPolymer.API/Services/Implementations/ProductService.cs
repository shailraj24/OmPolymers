using Microsoft.EntityFrameworkCore;
using OMPolymer.API.Common;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly OMPolymerDbContext _context;
        private readonly IFileStorageService _fileStorage;
        private readonly ILogger<ProductService> _logger;

        public ProductService(OMPolymerDbContext context, IFileStorageService fileStorage, ILogger<ProductService> logger)
        {
            _context = context;
            _fileStorage = fileStorage;
            _logger = logger;
        }

        public async Task<ApiResponse<PaginatedResponse<ProductResponse>>> GetAllActiveProductsAsync(int page, int pageSize, int? categoryId, string? search)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .Where(p => p.IsActive)
                .AsNoTracking();

            if (categoryId.HasValue) query = query.Where(p => p.CategoryId == categoryId.Value);
            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim();
                query = query.Where(p => p.ProductName.Contains(s) || (p.ShortDescription != null && p.ShortDescription.Contains(s)));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => MapToResponse(p))
                .ToListAsync();

            return ApiResponse<PaginatedResponse<ProductResponse>>.SuccessResponse(
                new PaginatedResponse<ProductResponse>(items, totalCount, page, pageSize));
        }

        public async Task<ApiResponse<ProductResponse>> GetProductBySlugAsync(string slug)
        {
            var p = await _context.Products
                .Include(x => x.Category)
                .Include(x => x.ProductImages)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Slug == slug && x.IsActive);

            if (p == null) return ApiResponse<ProductResponse>.FailureResponse("Product not found.");
            return ApiResponse<ProductResponse>.SuccessResponse(MapToResponse(p));
        }

        public async Task<ApiResponse<ProductResponse>> GetProductByIdAsync(int id)
        {
            var p = await _context.Products
                .Include(x => x.Category)
                .Include(x => x.ProductImages)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.ProductId == id && x.IsActive);

            if (p == null) return ApiResponse<ProductResponse>.FailureResponse("Product not found.");
            return ApiResponse<ProductResponse>.SuccessResponse(MapToResponse(p));
        }

        public async Task<ApiResponse<IEnumerable<ProductResponse>>> GetFeaturedProductsAsync()
        {
            var items = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.IsActive && p.IsFeatured)
                .AsNoTracking()
                .Select(p => MapToResponse(p))
                .ToListAsync();

            return ApiResponse<IEnumerable<ProductResponse>>.SuccessResponse(items);
        }

        public async Task<ApiResponse<IEnumerable<CategoryResponse>>> GetCategoriesAsync()
        {
            var items = await _context.ProductCategories
                .Where(c => c.IsActive)
                .AsNoTracking()
                .Select(c => new CategoryResponse { CategoryId = c.CategoryId, CategoryName = c.CategoryName, Slug = c.Slug })
                .ToListAsync();

            return ApiResponse<IEnumerable<CategoryResponse>>.SuccessResponse(items);
        }

        public async Task<ApiResponse<ProductResponse>> CreateProductAsync(ProductCreateRequest request)
        {
            var baseSlug = string.IsNullOrWhiteSpace(request.Slug) 
                ? SlugHelper.GenerateSlug(request.ProductName) 
                : SlugHelper.GenerateSlug(request.Slug);

            var targetSlug = baseSlug;
            int counter = 1;
            while (await _context.Products.AnyAsync(p => p.Slug.ToLower() == targetSlug.ToLower()))
            {
                targetSlug = $"{baseSlug}-{counter++}";
            }

            var product = new Product
            {
                ProductName = request.ProductName.Trim(),
                Slug = targetSlug,
                CategoryId = request.CategoryId,
                ShortDescription = request.ShortDescription?.Trim(),
                FullDescription = request.FullDescription,
                Specifications = request.Specifications?.Trim(),
                MainImageUrl = request.MainImageUrl,
                IsFeatured = request.IsFeatured,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            foreach (var imgUrl in request.AdditionalImages)
            {
                product.ProductImages.Add(new ProductImage { ImageUrl = imgUrl });
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Admin created product {ProductName} (ID: {ProductId})", product.ProductName, product.ProductId);

            return ApiResponse<ProductResponse>.SuccessResponse(MapToResponse(product), "Product created successfully.");
        }

        public async Task<ApiResponse<bool>> UpdateProductAsync(int id, ProductCreateRequest request)
        {
            var product = await _context.Products.Include(p => p.ProductImages).FirstOrDefaultAsync(p => p.ProductId == id);
            if (product == null) return ApiResponse<bool>.FailureResponse("Product not found.");

            var targetSlug = string.IsNullOrWhiteSpace(request.Slug)
                ? product.Slug
                : SlugHelper.GenerateSlug(request.Slug);

            if (await _context.Products.AnyAsync(p => p.Slug.ToLower() == targetSlug.ToLower() && p.ProductId != id))
                return ApiResponse<bool>.FailureResponse("Slug already in use by another product.");

            // If main image changed, delete old image from disk
            if (!string.IsNullOrWhiteSpace(product.MainImageUrl) && product.MainImageUrl != request.MainImageUrl)
            {
                await _fileStorage.DeleteImageAsync(product.MainImageUrl);
            }

            product.ProductName = request.ProductName.Trim();
            product.Slug = targetSlug;
            product.CategoryId = request.CategoryId;
            product.ShortDescription = request.ShortDescription?.Trim();
            product.FullDescription = request.FullDescription;
            product.Specifications = request.Specifications?.Trim();
            product.MainImageUrl = request.MainImageUrl;
            product.IsFeatured = request.IsFeatured;
            product.UpdatedAt = DateTime.UtcNow;

            _context.ProductImages.RemoveRange(product.ProductImages);
            foreach (var imgUrl in request.AdditionalImages)
            {
                product.ProductImages.Add(new ProductImage { ImageUrl = imgUrl });
            }

            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true, "Product updated.");
        }

        public async Task<ApiResponse<bool>> DeleteProductAsync(int id)
        {
            var product = await _context.Products.Include(p => p.ProductImages).FirstOrDefaultAsync(p => p.ProductId == id);
            if (product == null) return ApiResponse<bool>.FailureResponse("Product not found.");

            // Clean up main image
            if (!string.IsNullOrWhiteSpace(product.MainImageUrl))
            {
                await _fileStorage.DeleteImageAsync(product.MainImageUrl);
            }

            // Clean up gallery images
            foreach (var img in product.ProductImages)
            {
                await _fileStorage.DeleteImageAsync(img.ImageUrl);
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true, "Product deleted.");
        }

        public async Task<ApiResponse<bool>> ToggleStatusAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return ApiResponse<bool>.FailureResponse("Product not found.");

            product.IsActive = !product.IsActive;
            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true, $"Product status changed to {product.IsActive}.");
        }

        private static ProductResponse MapToResponse(Product p) => new()
        {
            ProductId = p.ProductId,
            ProductName = p.ProductName,
            Slug = p.Slug,
            ShortDescription = p.ShortDescription,
            FullDescription = p.FullDescription,
            Specifications = p.Specifications,
            MainImageUrl = p.MainImageUrl,
            IsFeatured = p.IsFeatured,
            IsActive = p.IsActive,
            CreatedAt = p.CreatedAt ?? DateTime.UtcNow,
            Category = p.Category != null ? new CategoryResponse { CategoryId = p.Category.CategoryId, CategoryName = p.Category.CategoryName, Slug = p.Category.Slug } : null,
            AdditionalImages = p.ProductImages.Select(img => new ProductImageResponse { ImageId = img.ImageId, ImageUrl = img.ImageUrl }).ToList()
        };
    }
}