using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [Authorize(Roles = "SuperAdmin,Admin")]
    [ApiController]
    [Route("api/admin/products")]
    public class AdminProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public AdminProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductCreateRequest request)
        {
            var result = await _productService.CreateProductAsync(request);
            if (!result.Success) return Conflict(result);
            return StatusCode(201, result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductCreateRequest request)
        {
            var result = await _productService.UpdateProductAsync(id, request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpPatch("{id:int}/status")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var result = await _productService.ToggleStatusAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _productService.DeleteProductAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }
    }
}