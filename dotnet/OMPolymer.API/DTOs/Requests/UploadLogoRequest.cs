using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests;

public class UploadLogoRequest
{
    [Required]
    public IFormFile File { get; set; } = null!;
}
