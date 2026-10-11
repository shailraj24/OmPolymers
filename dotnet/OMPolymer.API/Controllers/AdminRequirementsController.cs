using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [Authorize(Roles = "SuperAdmin,Admin")]
    [ApiController]
    [Route("api/admin/requirements")]
    public class AdminRequirementsController : ControllerBase
    {
        private readonly IRequirementService _service;

        public AdminRequirementsController(IRequirementService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? status = null, [FromQuery] string? search = null)
            => Ok(await _service.GetAllRequirementsAsync(page, pageSize, status, search));

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetRequirementByIdAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpPatch("{id:int}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] RequirementStatusUpdateRequest request)
        {
            var result = await _service.UpdateRequirementStatusAsync(id, request);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }
    }
}