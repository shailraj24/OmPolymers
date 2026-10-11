using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Services.Interfaces
{
    public interface IAdminUserService
    {
        Task<ApiResponse<PaginatedResponse<AdminResponse>>> GetAdminsAsync(int page, int pageSize, string? role, string? status, string? search);
        Task<ApiResponse<AdminResponse>> GetAdminByIdAsync(int id);
        Task<ApiResponse<AdminResponse>> CreateAdminAsync(AdminCreateRequest request);
        Task<ApiResponse<AdminResponse>> UpdateAdminAsync(int id, AdminUpdateRequest request);
        Task<ApiResponse<bool>> ToggleStatusAsync(int id, bool isActive);
        Task<ApiResponse<bool>> DeleteAdminAsync(int id);
    }
}