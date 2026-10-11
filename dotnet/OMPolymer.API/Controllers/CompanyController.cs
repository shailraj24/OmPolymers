using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [ApiController]
    [Route("api/company")]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _service;

        public CompanyController(ICompanyService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetInfo() => Ok(await _service.GetSettingsAsync());

        [HttpGet("whatsapp-url")]
        public async Task<IActionResult> GetWhatsAppUrl([FromQuery] string? productSlug = null, [FromQuery] string? message = null)
        {
            var settings = await _service.GetSettingsAsync();
            string msg = message ?? (string.IsNullOrEmpty(productSlug)
                ? "Hello, I am interested in your products and services."
                : $"Hello, I would like to request technical specifications and a quotation for product: {productSlug}");

            return Ok(new
            {
                url = _service.GenerateWhatsAppUrl(settings.Data?.WhatsAppNumber, msg)
            });
        }
    }
}