using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests;

public class UploadImageRequest
{
    [Required]
    public IFormFile File { get; set; } = null!;

    public string Category { get; set; } = "products";
}