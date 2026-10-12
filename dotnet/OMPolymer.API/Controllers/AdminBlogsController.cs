using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [Authorize(Roles = "SuperAdmin,Admin")]
    [ApiController]
    [Route("api/admin/blogs")]
    public class AdminBlogsController : ControllerBase
    {
        private readonly IBlogService _blogService;

        public AdminBlogsController(IBlogService blogService)
        {
            _blogService = blogService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] int? categoryId = null, [FromQuery] string? search = null)
            => Ok(await _blogService.GetAllBlogsAsync(page, pageSize, categoryId, search));

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BlogCreateRequest request)
        {
            var result = await _blogService.CreateBlogAsync(request);
            if (!result.Success) return Conflict(result);
            return StatusCode(201, result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] BlogCreateRequest request)
        {
            var result = await _blogService.UpdateBlogAsync(id, request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpPatch("{id:int}/publish")]
        public async Task<IActionResult> Publish(int id)
        {
            var result = await _blogService.TogglePublishStatusAsync(id, true);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpPatch("{id:int}/unpublish")]
        public async Task<IActionResult> Unpublish(int id)
        {
            var result = await _blogService.TogglePublishStatusAsync(id, false);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _blogService.DeleteBlogAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }
    }
}