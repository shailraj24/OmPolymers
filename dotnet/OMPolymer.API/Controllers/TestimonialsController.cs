using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [ApiController]
    [Route("api/testimonials")]
    public class TestimonialsController : ControllerBase
    {
        private readonly ITestimonialService _service;

        public TestimonialsController(ITestimonialService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetPublished() => Ok(await _service.GetPublishedTestimonialsAsync());
    }
}