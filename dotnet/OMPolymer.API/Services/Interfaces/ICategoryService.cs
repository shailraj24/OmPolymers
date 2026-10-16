using OMPolymer.API.DTOs;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<ApiResponse<IEnumerable<CategoryResponseDto>>> GetAllCategoriesAsync(bool onlyActive = false);
        Task<ApiResponse<CategoryResponseDto>> GetCategoryByIdAsync(int id);
        Task<ApiResponse<CategoryResponseDto>> CreateCategoryAsync(CreateCategoryDto request);
        Task<ApiResponse<CategoryResponseDto>> UpdateCategoryAsync(int id, UpdateCategoryDto request);
        Task<ApiResponse<bool>> ToggleStatusAsync(int id);
        Task<ApiResponse<bool>> DeleteCategoryAsync(int id);
    }
}
