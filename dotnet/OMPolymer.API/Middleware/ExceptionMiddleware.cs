using System.Net;
using System.Text.Json;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled server error on {Path}: {Message}", context.Request.Path, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = ApiResponse<string>.FailureResponse(
                    _env.IsDevelopment() ? ex.Message : "An internal server error occurred. Please try again later.",
                    _env.IsDevelopment() ? new List<string> { ex.StackTrace ?? string.Empty } : null
                );

                var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                await context.Response.WriteAsync(json);
            }
        }
    }
}