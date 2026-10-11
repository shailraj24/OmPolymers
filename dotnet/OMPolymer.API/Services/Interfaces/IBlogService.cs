using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Services.Interfaces
{
    public interface IBlogService
    {
        Task<ApiResponse<PaginatedResponse<BlogResponse>>> GetPublishedBlogsAsync(int page, int pageSize, int? categoryId, string? search);
        Task<ApiResponse<BlogResponse>> GetBlogBySlugAsync(string slug);
        Task<ApiResponse<IEnumerable<BlogCategoryResponse>>> GetBlogCategoriesAsync();

        Task<ApiResponse<BlogResponse>> CreateBlogAsync(BlogCreateRequest request);
        Task<ApiResponse<bool>> UpdateBlogAsync(int id, BlogCreateRequest request);
        Task<ApiResponse<bool>> DeleteBlogAsync(int id);
        Task<ApiResponse<bool>> TogglePublishStatusAsync(int id, bool publish);
    }
}