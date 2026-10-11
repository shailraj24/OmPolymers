using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] int? categoryId = null, [FromQuery] string? search = null)
            => Ok(await _productService.GetAllActiveProductsAsync(page, pageSize, categoryId, search));

        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var result = await _productService.GetProductBySlugAsync(slug);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _productService.GetProductByIdAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpGet("featured")]
        public async Task<IActionResult> GetFeatured() => Ok(await _productService.GetFeaturedProductsAsync());

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories() => Ok(await _productService.GetCategoriesAsync());
    }
}