using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [Authorize(Roles = "SuperAdmin,Admin")]
    [ApiController]
    [Route("api/uploads")]
    public class UploadsController : ControllerBase
    {
        private readonly IFileStorageService _fileStorage;

        public UploadsController(IFileStorageService fileStorage)
        {
            _fileStorage = fileStorage;
        }

        /// <summary>
        /// Accepts multipart/form-data image upload. Saves to wwwroot/uploads/{category}/ and returns relative path.
        /// </summary>
        [HttpPost("image")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImage([FromForm] UploadImageRequest request, CancellationToken cancellationToken = default)
        {
            var result = await _fileStorage.UploadImageAsync(request.File, request.Category, cancellationToken);
            if (!result.Success) return BadRequest(result);
            return StatusCode(201, result);
        }

        [HttpDelete("image")]
        public async Task<IActionResult> DeleteImage([FromBody] DeleteImageRequest request)
        {
            var success = await _fileStorage.DeleteImageAsync(request.RelativePath);
            return Ok(new { success, message = success ? "File deleted." : "File not found or unsafe path." });
        }
    }

    public class DeleteImageRequest
    {
        public string RelativePath { get; set; } = string.Empty;
    }
}