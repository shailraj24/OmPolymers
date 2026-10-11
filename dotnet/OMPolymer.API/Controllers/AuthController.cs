using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [ApiController]
    [Route("api/admin/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [EnableRateLimiting("LoginPolicy")]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request);
            if (!result.Success) return Unauthorized(result);
            return Ok(result);
        }

        [HttpPost("forgot-password")]
        [EnableRateLimiting("ForgotPasswordPolicy")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var result = await _authService.ForgotPasswordAsync(request);
            return Ok(result);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var result = await _authService.ResetPasswordAsync(request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [Authorize(Roles = "SuperAdmin,Admin")]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var adminIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(adminIdClaim, out var adminId)) return Unauthorized();

            var result = await _authService.ChangePasswordAsync(adminId, request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("hash-password")]
        public IActionResult GetHash([FromQuery] string password = "Admin@123")
        {
            return Ok(new { plainText = password, hash = _authService.HashPassword(password) });
        }
    }
}