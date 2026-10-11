using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Services.Interfaces
{
    public interface IRequirementService
    {
        Task<ApiResponse<bool>> SubmitRequirementAsync(RequirementCreateRequest request);
        Task<ApiResponse<PaginatedResponse<RequirementResponse>>> GetAllRequirementsAsync(int page, int pageSize, string? status, string? search);
        Task<ApiResponse<RequirementResponse>> GetRequirementByIdAsync(int id);
        Task<ApiResponse<bool>> UpdateRequirementStatusAsync(int id, RequirementStatusUpdateRequest request);
    }
}