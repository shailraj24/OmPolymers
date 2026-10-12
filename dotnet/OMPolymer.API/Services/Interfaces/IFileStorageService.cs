using Microsoft.AspNetCore.Http;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Services.Interfaces
{
    public interface IFileStorageService
    {
        Task<ApiResponse<ImageUploadResponse>> UploadImageAsync(IFormFile file, string category, CancellationToken cancellationToken = default);
        Task<bool> DeleteImageAsync(string? relativePath);
        Task<bool> DeleteImageByIdAsync(int fileId);
        Task<ApiResponse<ImageUploadResponse>> ReplaceImageAsync(string? oldRelativePath, IFormFile newFile, string category, CancellationToken cancellationToken = default);
        Task<ApiResponse<IEnumerable<ImageUploadResponse>>> GetAllFilesAsync(CancellationToken cancellationToken = default);
        Task<ApiResponse<IEnumerable<ImageUploadResponse>>> GetFilesByCategoryAsync(string category, CancellationToken cancellationToken = default);
        Task<ApiResponse<ImageUploadResponse>> GetFileByIdAsync(int fileId, CancellationToken cancellationToken = default);
    }
}