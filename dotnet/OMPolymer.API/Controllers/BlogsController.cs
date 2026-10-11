using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [ApiController]
    [Route("api/blogs")]
    public class BlogsController : ControllerBase
    {
        private readonly IBlogService _blogService;

        public BlogsController(IBlogService blogService)
        {
            _blogService = blogService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPublished([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] int? categoryId = null, [FromQuery] string? search = null)
            => Ok(await _blogService.GetPublishedBlogsAsync(page, pageSize, categoryId, search));

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var result = await _blogService.GetBlogBySlugAsync(slug);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories() => Ok(await _blogService.GetBlogCategoriesAsync());
    }
}