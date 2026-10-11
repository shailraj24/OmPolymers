using Microsoft.EntityFrameworkCore;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Services.Implementations
{
    public class RequirementService : IRequirementService
    {
        private readonly OMPolymerDbContext _context;

        public RequirementService(OMPolymerDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<bool>> SubmitRequirementAsync(RequirementCreateRequest request)
        {
            var entity = new ClientRequirement
            {
                FullName = request.FullName,
                CompanyName = request.CompanyName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                ProductOfInterest = request.ProductOfInterest,
                Quantity = request.Quantity,
                RequirementDescription = request.RequirementDescription,
                City = request.City,
                State = request.State,
                Status = "New",
                CreatedAt = DateTime.UtcNow
            };

            _context.ClientRequirements.Add(entity);
            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true, "Your requirement has been submitted successfully.");
        }

        public async Task<ApiResponse<PaginatedResponse<RequirementResponse>>> GetAllRequirementsAsync(int page, int pageSize, string? status, string? search)
        {
            var query = _context.ClientRequirements.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(status) && status != "All")
                query = query.Where(r => r.Status == status);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim();
                query = query.Where(r => r.FullName.Contains(s) || (r.CompanyName != null && r.CompanyName.Contains(s)) || r.Email.Contains(s));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => MapToResponse(r))
                .ToListAsync();

            return ApiResponse<PaginatedResponse<RequirementResponse>>.SuccessResponse(
                new PaginatedResponse<RequirementResponse>(items, totalCount, page, pageSize));
        }

        public async Task<ApiResponse<RequirementResponse>> GetRequirementByIdAsync(int id)
        {
            var r = await _context.ClientRequirements.FindAsync(id);
            if (r == null) return ApiResponse<RequirementResponse>.FailureResponse("Requirement not found.");
            return ApiResponse<RequirementResponse>.SuccessResponse(MapToResponse(r));
        }

        public async Task<ApiResponse<bool>> UpdateRequirementStatusAsync(int id, RequirementStatusUpdateRequest request)
        {
            var r = await _context.ClientRequirements.FindAsync(id);
            if (r == null) return ApiResponse<bool>.FailureResponse("Requirement not found.");

            r.Status = request.Status;
            r.AdminRemarks = request.AdminRemarks;
            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true, "Requirement updated.");
        }

        private static RequirementResponse MapToResponse(ClientRequirement r) => new()
        {
            RequirementId = r.RequirementId,
            FullName = r.FullName,
            CompanyName = r.CompanyName,
            Email = r.Email,
            PhoneNumber = r.PhoneNumber,
            ProductOfInterest = r.ProductOfInterest,
            Quantity = r.Quantity,
            RequirementDescription = r.RequirementDescription,
            City = r.City,
            State = r.State,
            Status = r.Status,
            AdminRemarks = r.AdminRemarks,
            CreatedAt = r.CreatedAt ?? DateTime.UtcNow
        };
    }
}