using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Services.Interfaces
{
    public interface ITestimonialService
    {
        Task<ApiResponse<IEnumerable<TestimonialResponse>>> GetPublishedTestimonialsAsync();
        Task<ApiResponse<IEnumerable<TestimonialResponse>>> GetAllTestimonialsAsync();
        Task<ApiResponse<TestimonialResponse>> CreateTestimonialAsync(TestimonialCreateRequest request);
        Task<ApiResponse<bool>> UpdateTestimonialAsync(int id, TestimonialCreateRequest request);
        Task<ApiResponse<bool>> TogglePublishStatusAsync(int id);
        Task<ApiResponse<bool>> DeleteTestimonialAsync(int id);
    }
}