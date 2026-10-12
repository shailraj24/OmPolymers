using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Services.Interfaces
{
    public interface ICompanyService
    {
        Task<ApiResponse<CompanySettingsResponse>> GetSettingsAsync();
        Task<ApiResponse<bool>> UpdateSettingsAsync(CompanySettingsUpdateRequest request);
        Task<ApiResponse<bool>> UpdateLogoAsync(string logoUrl);
        string GenerateWhatsAppUrl(string? phoneNumber, string message);
    }
}