using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [ApiController]
    [Route("api/requirements")]
    public class RequirementsController : ControllerBase
    {
        private readonly IRequirementService _requirementService;

        public RequirementsController(IRequirementService requirementService)
        {
            _requirementService = requirementService;
        }

        [HttpPost]
        [EnableRateLimiting("RequirementPolicy")]
        public async Task<IActionResult> Submit([FromBody] RequirementCreateRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _requirementService.SubmitRequirementAsync(request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }
    }
}