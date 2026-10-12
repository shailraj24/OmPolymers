using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        private readonly IFileStorageService _fileStorage;

        public AdminCompanyController(ICompanyService service, IFileStorageService fileStorage)
        {
            _service = service;
            _fileStorage = fileStorage;
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] CompanySettingsUpdateRequest request)
        {
            var result = await _service.UpdateSettingsAsync(request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        /// <summary>
        /// Uploads, replaces, and updates the site logo dynamically.
        /// </summary>
        [HttpPost("logo")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadLogo([FromForm] IFormFile file, CancellationToken cancellationToken = default)
        {
            var uploadResult = await _fileStorage.UploadImageAsync(file, "logos", cancellationToken);
            if (!uploadResult.Success) return BadRequest(uploadResult);

            if (uploadResult.Data?.RelativeUrl != null)
            {
                await _service.UpdateLogoAsync(uploadResult.Data.RelativeUrl);
            }

            return Ok(uploadResult);
        }
    }
}
