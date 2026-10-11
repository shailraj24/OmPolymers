using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [Authorize(Roles = "SuperAdmin,Admin")]
    [ApiController]
    [Route("api/admin/testimonials")]
    public class AdminTestimonialsController : ControllerBase
    {
        private readonly ITestimonialService _service;

        public AdminTestimonialsController(ITestimonialService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllTestimonialsAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TestimonialCreateRequest request)
        {
            var result = await _service.CreateTestimonialAsync(request);
            return StatusCode(201, result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] TestimonialCreateRequest request)
        {
            var result = await _service.UpdateTestimonialAsync(id, request);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpPatch("{id:int}/toggle-publish")]
        public async Task<IActionResult> TogglePublish(int id)
        {
            var result = await _service.TogglePublishStatusAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteTestimonialAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }
    }
}