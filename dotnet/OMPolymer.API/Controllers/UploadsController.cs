using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/uploads")]
    public class UploadsController : ControllerBase
    {
        private readonly IFileStorageService _fileStorage;
        private readonly ICompanyService _companyService;

        public UploadsController(IFileStorageService fileStorage, ICompanyService companyService)
        {
            _fileStorage = fileStorage;
            _companyService = companyService;
        }

        /// <summary>
        /// Accepts multipart/form-data image upload. Saves to wwwroot/uploads/{category}/ and records metadata in SQL Server.
        /// </summary>
        [HttpPost("image")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImage([FromForm] UploadImageRequest request, CancellationToken cancellationToken = default)
        {
            var result = await _fileStorage.UploadImageAsync(request.File, request.Category, cancellationToken);
            if (!result.Success) return BadRequest(result);
            return StatusCode(201, result);
        }

        /// <summary>
        /// Dedicated site logo upload: stores in wwwroot/uploads/logos/ and updates CompanySettings.LogoUrl automatically.
        /// </summary>
        [HttpPost("logo")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadSiteLogo([FromForm] UploadLogoRequest request, CancellationToken cancellationToken = default)
        {
            if (request?.File == null || request.File.Length == 0)
            {
                return BadRequest(ApiResponse<ImageUploadResponse>.FailureResult("No logo file was provided or file is empty."));
            }

            var result = await _fileStorage.UploadImageAsync(request.File, "logos", cancellationToken);
            if (!result.Success) return BadRequest(result);

            if (result.Data?.RelativeUrl != null)
            {
                await _companyService.UpdateLogoAsync(result.Data.RelativeUrl);
            }

            return StatusCode(201, result);
        }

        /// <summary>
        /// Retrieves list of all uploaded files metadata.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllFiles(CancellationToken cancellationToken = default)
        {
            var result = await _fileStorage.GetAllFilesAsync(cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Retrieves metadata for a specific uploaded file by ID.
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetFileById(int id, CancellationToken cancellationToken = default)
        {
            var result = await _fileStorage.GetFileByIdAsync(id, cancellationToken);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        /// <summary>
        /// Retrieves uploaded files by category (e.g. products, blogs, logos).
        /// </summary>
        [HttpGet("category/{category}")]
        public async Task<IActionResult> GetFilesByCategory(string category, CancellationToken cancellationToken = default)
        {
            var result = await _fileStorage.GetFilesByCategoryAsync(category, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Deletes an uploaded image safely by relative path.
        /// </summary>
        [HttpDelete("image")]
        public async Task<IActionResult> DeleteImage([FromBody] DeleteImageRequest request)
        {
            var success = await _fileStorage.DeleteImageAsync(request.RelativePath);
            return Ok(new { success, message = success ? "File and metadata deleted." : "File not found or unsafe path." });
        }

        /// <summary>
        /// Deletes an uploaded image safely by file ID.
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteImageById(int id)
        {
            var success = await _fileStorage.DeleteImageByIdAsync(id);
            return Ok(new { success, message = success ? "File deleted." : "File not found." });
        }
    }

    public class DeleteImageRequest
    {
        public string RelativePath { get; set; } = string.Empty;
    }
}
