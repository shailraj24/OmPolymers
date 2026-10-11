using Microsoft.EntityFrameworkCore;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;
using BC = BCrypt.Net.BCrypt;

namespace OMPolymer.API.Services.Implementations
{
    public class AdminUserService : IAdminUserService
    {
        private readonly OMPolymerDbContext _context;
        private readonly ILogger<AdminUserService> _logger;

        public AdminUserService(OMPolymerDbContext context, ILogger<AdminUserService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ApiResponse<PaginatedResponse<AdminResponse>>> GetAdminsAsync(int page, int pageSize, string? role, string? status, string? search)
        {
            var query = _context.AdminUsers
                .Where(u => !u.IsDeleted)
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(role) && role != "All")
            {
                query = query.Where(u => u.Role.ToLower() == role.Trim().ToLower());
            }

            if (!string.IsNullOrWhiteSpace(status) && status != "All")
            {
                var isActive = status.Trim().ToLower() == "active";
                query = query.Where(u => u.IsActive == isActive);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                query = query.Where(u => u.FullName.ToLower().Contains(s) || u.Email.ToLower().Contains(s));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => MapToResponse(u))
                .ToListAsync();

            return ApiResponse<PaginatedResponse<AdminResponse>>.SuccessResponse(
                new PaginatedResponse<AdminResponse>(items, totalCount, page, pageSize));
        }

        public async Task<ApiResponse<AdminResponse>> GetAdminByIdAsync(int id)
        {
            var user = await _context.AdminUsers.AsNoTracking().FirstOrDefaultAsync(u => u.AdminId == id && !u.IsDeleted);
            if (user == null) return ApiResponse<AdminResponse>.FailureResponse("Administrator not found.");
            return ApiResponse<AdminResponse>.SuccessResponse(MapToResponse(user));
        }

        public async Task<ApiResponse<AdminResponse>> CreateAdminAsync(AdminCreateRequest request)
        {
            var cleanEmail = request.Email.Trim().ToLower();
            if (await _context.AdminUsers.IgnoreQueryFilters().AnyAsync(u => u.Email.ToLower() == cleanEmail && !u.IsDeleted))
            {
                return ApiResponse<AdminResponse>.FailureResponse("An administrator account with this email address already exists.");
            }

            var admin = new AdminUser
            {
                FullName = request.FullName.Trim(),
                Email = cleanEmail,
                PasswordHash = BC.HashPassword(request.Password),
                Role = request.Role == "SuperAdmin" ? "SuperAdmin" : "Admin",
                ProfileImageUrl = request.ProfileImageUrl,
                IsActive = request.IsActive,
                IsDeleted = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.AdminUsers.Add(admin);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Administrator created: {Email} with role {Role}", admin.Email, admin.Role);

            return ApiResponse<AdminResponse>.SuccessResponse(MapToResponse(admin), "Administrator account created successfully.");
        }

        public async Task<ApiResponse<AdminResponse>> UpdateAdminAsync(int id, AdminUpdateRequest request)
        {
            var admin = await _context.AdminUsers.FirstOrDefaultAsync(u => u.AdminId == id && !u.IsDeleted);
            if (admin == null) return ApiResponse<AdminResponse>.FailureResponse("Administrator not found.");

            var cleanEmail = request.Email.Trim().ToLower();
            if (await _context.AdminUsers.IgnoreQueryFilters().AnyAsync(u => u.Email.ToLower() == cleanEmail && u.AdminId != id && !u.IsDeleted))
            {
                return ApiResponse<AdminResponse>.FailureResponse("Email address is already in use by another administrator.");
            }

            // Prevent demoting the last active SuperAdmin
            if (admin.Role == "SuperAdmin" && request.Role != "SuperAdmin")
            {
                var otherSuperAdmins = await _context.AdminUsers.CountAsync(u => u.Role == "SuperAdmin" && u.IsActive && !u.IsDeleted && u.AdminId != id);
                if (otherSuperAdmins == 0)
                {
                    return ApiResponse<AdminResponse>.FailureResponse("Cannot demote the only remaining active Super Administrator.");
                }
            }

            // Prevent deactivating the last active SuperAdmin
            if (admin.Role == "SuperAdmin" && !request.IsActive)
            {
                var otherSuperAdmins = await _context.AdminUsers.CountAsync(u => u.Role == "SuperAdmin" && u.IsActive && !u.IsDeleted && u.AdminId != id);
                if (otherSuperAdmins == 0)
                {
                    return ApiResponse<AdminResponse>.FailureResponse("Cannot deactivate the only remaining active Super Administrator.");
                }
            }

            admin.FullName = request.FullName.Trim();
            admin.Email = cleanEmail;
            admin.Role = request.Role == "SuperAdmin" ? "SuperAdmin" : "Admin";
            admin.ProfileImageUrl = request.ProfileImageUrl;
            admin.IsActive = request.IsActive;
            admin.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return ApiResponse<AdminResponse>.SuccessResponse(MapToResponse(admin), "Administrator updated successfully.");
        }

        public async Task<ApiResponse<bool>> ToggleStatusAsync(int id, bool isActive)
        {
            var admin = await _context.AdminUsers.FirstOrDefaultAsync(u => u.AdminId == id && !u.IsDeleted);
            if (admin == null) return ApiResponse<bool>.FailureResponse("Administrator not found.");

            // Safety Guard: Cannot deactivate the last active Super Administrator
            if (admin.Role == "SuperAdmin" && !isActive)
            {
                var otherSuperAdmins = await _context.AdminUsers.CountAsync(u => u.Role == "SuperAdmin" && u.IsActive && !u.IsDeleted && u.AdminId != id);
                if (otherSuperAdmins == 0)
                {
                    return ApiResponse<bool>.FailureResponse("Cannot deactivate the only remaining active Super Administrator.");
                }
            }

            admin.IsActive = isActive;
            admin.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true, $"Administrator account has been {(isActive ? "activated" : "deactivated")}.");
        }

        public async Task<ApiResponse<bool>> DeleteAdminAsync(int id)
        {
            var admin = await _context.AdminUsers.FirstOrDefaultAsync(u => u.AdminId == id && !u.IsDeleted);
            if (admin == null) return ApiResponse<bool>.FailureResponse("Administrator not found.");

            // Safety Guard: Cannot delete the last active Super Administrator
            if (admin.Role == "SuperAdmin")
            {
                var otherSuperAdmins = await _context.AdminUsers.CountAsync(u => u.Role == "SuperAdmin" && u.IsActive && !u.IsDeleted && u.AdminId != id);
                if (otherSuperAdmins == 0)
                {
                    return ApiResponse<bool>.FailureResponse("Cannot delete the only remaining active Super Administrator.");
                }
            }

            // Soft deletion
            admin.IsDeleted = true;
            admin.IsActive = false;
            admin.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Administrator account has been soft-deleted.");
        }

        private static AdminResponse MapToResponse(AdminUser u) => new()
        {
            AdminId = u.AdminId,
            FullName = u.FullName,
            Email = u.Email,
            Role = u.Role,
            ProfileImageUrl = u.ProfileImageUrl,
            IsActive = u.IsActive,
            LastLoginAt = u.LastLoginAt,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        };
    }
}