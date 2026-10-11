using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;
using BC = BCrypt.Net.BCrypt;

namespace OMPolymer.API.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly OMPolymerDbContext _context;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(OMPolymerDbContext context, IConfiguration config, IEmailService emailService, ILogger<AuthService> logger)
        {
            _context = context;
            _config = config;
            _emailService = emailService;
            _logger = logger;
        }

        public async Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request)
        {
            var cleanEmail = request.Email.Trim().ToLower();
            var user = await _context.AdminUsers
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(u => u.Email.ToLower() == cleanEmail);

            if (user == null || user.IsDeleted)
            {
                return ApiResponse<AuthResponse>.FailureResponse("Invalid email or password.");
            }

            if (!user.IsActive)
            {
                return ApiResponse<AuthResponse>.FailureResponse("This administrator account has been deactivated. Please contact an administrator.");
            }

            if (!BC.Verify(request.Password, user.PasswordHash))
            {
                return ApiResponse<AuthResponse>.FailureResponse("Invalid email or password.");
            }

            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            var durationMinutes = double.Parse(_config["JwtSettings:DurationInMinutes"] ?? "1440");

            var response = new AuthResponse
            {
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                ProfileImageUrl = user.ProfileImageUrl,
                Expiry = DateTime.UtcNow.AddMinutes(durationMinutes)
            };

            return ApiResponse<AuthResponse>.SuccessResponse(response, "Login successful.");
        }

        public async Task<ApiResponse<bool>> ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            var cleanEmail = request.Email.Trim().ToLower();
            var user = await _context.AdminUsers.FirstOrDefaultAsync(u => u.Email.ToLower() == cleanEmail && u.IsActive && !u.IsDeleted);

            // Generic response to prevent account enumeration
            if (user == null)
            {
                return ApiResponse<bool>.SuccessResponse(true, "If your email is registered with an active administrator account, a password reset link has been dispatched.");
            }

            // Invalidate prior active reset tokens
            var activeTokens = await _context.PasswordResetTokens
                .Where(t => t.AdminId == user.AdminId && !t.IsUsed && t.ExpiresAt > DateTime.UtcNow)
                .ToListAsync();

            foreach (var t in activeTokens)
            {
                t.IsUsed = true;
            }

            // Generate cryptographically secure token
            var rawTokenBytes = RandomNumberGenerator.GetBytes(32);
            var rawToken = Convert.ToHexString(rawTokenBytes).ToLower();

            // Hash token for database storage (SHA-256)
            var tokenHash = ComputeSha256(rawToken);

            var resetTokenEntity = new PasswordResetToken
            {
                AdminId = user.AdminId,
                TokenHash = tokenHash,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                IsUsed = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.PasswordResetTokens.Add(resetTokenEntity);
            await _context.SaveChangesAsync();

            // Send email
            await _emailService.SendPasswordResetEmailAsync(user.Email, user.FullName, rawToken);

            return ApiResponse<bool>.SuccessResponse(true, "If your email is registered with an active administrator account, a password reset link has been dispatched.");
        }

        public async Task<ApiResponse<bool>> ResetPasswordAsync(ResetPasswordRequest request)
        {
            if (request.NewPassword != request.ConfirmPassword)
            {
                return ApiResponse<bool>.FailureResponse("New password and confirmation password do not match.");
            }

            var cleanEmail = request.Email.Trim().ToLower();
            var user = await _context.AdminUsers.FirstOrDefaultAsync(u => u.Email.ToLower() == cleanEmail && !u.IsDeleted);
            if (user == null)
            {
                return ApiResponse<bool>.FailureResponse("Password reset token is invalid, expired, or has already been used.");
            }

            var tokenHash = ComputeSha256(request.Token.Trim().ToLower());

            var resetToken = await _context.PasswordResetTokens
                .FirstOrDefaultAsync(t => t.AdminId == user.AdminId && t.TokenHash == tokenHash && !t.IsUsed && t.ExpiresAt > DateTime.UtcNow);

            if (resetToken == null)
            {
                return ApiResponse<bool>.FailureResponse("Password reset token is invalid, expired, or has already been used.");
            }

            // Invalidate token
            resetToken.IsUsed = true;

            // Invalidate any other tokens
            var otherTokens = await _context.PasswordResetTokens
                .Where(t => t.AdminId == user.AdminId && !t.IsUsed)
                .ToListAsync();
            foreach (var t in otherTokens) t.IsUsed = true;

            // Hash new password using BCrypt
            user.PasswordHash = HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            _logger.LogInformation("Password reset successful for administrator ID {AdminId}", user.AdminId);

            return ApiResponse<bool>.SuccessResponse(true, "Password has been successfully reset. You can now log in with your new credentials.");
        }

        public async Task<ApiResponse<bool>> ChangePasswordAsync(int adminId, ChangePasswordRequest request)
        {
            var user = await _context.AdminUsers.FindAsync(adminId);
            if (user == null || user.IsDeleted) return ApiResponse<bool>.FailureResponse("Administrator not found.");

            if (!BC.Verify(request.CurrentPassword, user.PasswordHash))
            {
                return ApiResponse<bool>.FailureResponse("Current password provided is incorrect.");
            }

            if (request.NewPassword != request.ConfirmPassword)
            {
                return ApiResponse<bool>.FailureResponse("New password and confirmation password do not match.");
            }

            user.PasswordHash = HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Password changed successfully.");
        }

        public string HashPassword(string password) => BC.HashPassword(password);

        private static string ComputeSha256(string raw)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(raw));
            return Convert.ToHexString(bytes).ToLower();
        }

        private string GenerateJwtToken(AdminUser user)
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.AdminId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var duration = double.Parse(jwtSettings["DurationInMinutes"] ?? "1440");

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(duration),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}