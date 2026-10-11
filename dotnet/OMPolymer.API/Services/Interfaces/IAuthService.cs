using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request);
        Task<ApiResponse<bool>> ForgotPasswordAsync(ForgotPasswordRequest request);
        Task<ApiResponse<bool>> ResetPasswordAsync(ResetPasswordRequest request);
        Task<ApiResponse<bool>> ChangePasswordAsync(int adminId, ChangePasswordRequest request);
        string HashPassword(string password);
    }
}