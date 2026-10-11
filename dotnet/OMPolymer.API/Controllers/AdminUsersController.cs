using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [Authorize(Roles = "SuperAdmin,Admin")]
    [ApiController]
    [Route("api/admin/users")]
    public class AdminUsersController : ControllerBase
    {
        private readonly IAdminUserService _adminUserService;

        public AdminUsersController(IAdminUserService adminUserService)
        {
            _adminUserService = adminUserService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? role = null, [FromQuery] string? status = null, [FromQuery] string? search = null)
            => Ok(await _adminUserService.GetAdminsAsync(page, pageSize, role, status, search));

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _adminUserService.GetAdminByIdAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AdminCreateRequest request)
        {
            var result = await _adminUserService.CreateAdminAsync(request);
            if (!result.Success) return Conflict(result);
            return StatusCode(201, result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] AdminUpdateRequest request)
        {
            var result = await _adminUserService.UpdateAdminAsync(id, request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpPatch("{id:int}/status")]
        public async Task<IActionResult> ToggleStatus(int id, [FromBody] StatusToggleRequest request)
        {
            var result = await _adminUserService.ToggleStatusAsync(id, request.IsActive);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _adminUserService.DeleteAdminAsync(id);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }
    }

    public class StatusToggleRequest
    {
        public bool IsActive { get; set; }
    }
}