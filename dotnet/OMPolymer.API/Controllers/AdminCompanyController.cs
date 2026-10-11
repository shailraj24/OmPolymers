using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [Authorize(Roles = "SuperAdmin,Admin")]
    [ApiController]
    [Route("api/admin/company")]
    public class AdminCompanyController : ControllerBase
    {
        private readonly ICompanyService _service;

        public AdminCompanyController(ICompanyService service)
        {
            _service = service;
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] CompanySettingsUpdateRequest request)
        {
            var result = await _service.UpdateSettingsAsync(request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }
    }
}