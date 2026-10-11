using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Services.Interfaces
{
    public interface IProductService
    {
        Task<ApiResponse<PaginatedResponse<ProductResponse>>> GetAllActiveProductsAsync(int page, int pageSize, int? categoryId, string? search);
        Task<ApiResponse<ProductResponse>> GetProductBySlugAsync(string slug);
        Task<ApiResponse<ProductResponse>> GetProductByIdAsync(int id);
        Task<ApiResponse<IEnumerable<ProductResponse>>> GetFeaturedProductsAsync();
        Task<ApiResponse<IEnumerable<CategoryResponse>>> GetCategoriesAsync();

        Task<ApiResponse<ProductResponse>> CreateProductAsync(ProductCreateRequest request);
        Task<ApiResponse<bool>> UpdateProductAsync(int id, ProductCreateRequest request);
        Task<ApiResponse<bool>> DeleteProductAsync(int id);
        Task<ApiResponse<bool>> ToggleStatusAsync(int id);
    }
}