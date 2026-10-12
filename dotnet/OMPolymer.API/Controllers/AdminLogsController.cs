using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Controllers
{
    [Authorize(Roles = "SuperAdmin,Admin")]
    [ApiController]
    [Route("api/admin/logs")]
    public class AdminLogsController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public AdminLogsController(IWebHostEnvironment env)
        {
            _env = env;
        }

        private string GetLogsDirectory()
        {
            // Check direct logs folder or upwards to project root
            var current = Directory.GetCurrentDirectory();
            var candidate = Path.Combine(current, "logs");
            if (Directory.Exists(candidate)) return candidate;

            var parent = Directory.GetParent(current)?.FullName;
            if (parent != null)
            {
                var parentCandidate = Path.Combine(parent, "logs");
                if (Directory.Exists(parentCandidate)) return parentCandidate;

                var rootCandidate = Path.Combine(Directory.GetParent(parent)?.FullName ?? "", "logs");
                if (Directory.Exists(rootCandidate)) return rootCandidate;
            }

            // Create if missing
            Directory.CreateDirectory(candidate);
            return candidate;
        }

        [HttpGet("files")]
        public IActionResult GetLogFiles()
        {
            try
            {
                var logsDir = GetLogsDirectory();
                var files = Directory.GetFiles(logsDir, "*.log")
                    .Select(Path.GetFileName)
                    .Where(f => !string.IsNullOrEmpty(f))
                    .ToList();

                if (!files.Contains("ompolymer-api.log"))
                {
                    files.Insert(0, "ompolymer-api.log");
                }

                return Ok(ApiResponse<List<string?>>.SuccessResponse(files!, "Log files retrieved successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<string>>.FailureResponse($"Failed reading logs: {ex.Message}"));
            }
        }

        [HttpGet]
        public IActionResult GetLogs([FromQuery] string? filename, [FromQuery] string? file, [FromQuery] string? severity, [FromQuery] string? level, [FromQuery] string? search, [FromQuery] int limit = 150)
        {
            try
            {
                var targetFile = !string.IsNullOrWhiteSpace(file) ? file : (!string.IsNullOrWhiteSpace(filename) ? filename : "ompolymer-api.log");
                var logsDir = GetLogsDirectory();
                var filePath = Path.Combine(logsDir, Path.GetFileName(targetFile));

                var logEntries = new List<object>();

                if (System.IO.File.Exists(filePath))
                {
                    var lines = System.IO.File.ReadAllLines(filePath);
                    var regex = new Regex(@"^\[([^\]]+)\]\s+\[([A-Z]+)\]\s+\[([^\]]+)\]\s+(.*)$");

                    var filterLevel = (severity ?? level ?? "ALL").ToUpperInvariant();
                    var searchTerm = (search ?? "").Trim().ToLowerInvariant();

                    for (int i = lines.Length - 1; i >= 0 && logEntries.Count < limit; i--)
                    {
                        var line = lines[i];
                        if (string.IsNullOrWhiteSpace(line)) continue;

                        var match = regex.Match(line);
                        string timestamp;
                        string logLevel;
                        string category;
                        string message;

                        if (match.Success)
                        {
                            timestamp = match.Groups[1].Value;
                            var rawLevel = match.Groups[2].Value;
                            logLevel = rawLevel switch
                            {
                                "INF" => "INFO",
                                "WRN" => "WARN",
                                "ERR" => "ERROR",
                                "SEC" => "SECURITY",
                                _ => rawLevel
                            };
                            category = match.Groups[3].Value;
                            message = match.Groups[4].Value;
                        }
                        else
                        {
                            timestamp = DateTime.UtcNow.ToString("o");
                            logLevel = "INFO";
                            category = "System";
                            message = line;
                        }

                        // Apply filters
                        if (filterLevel != "ALL" && !logLevel.Equals(filterLevel, StringComparison.OrdinalIgnoreCase) && !filterLevel.StartsWith(logLevel))
                        {
                            continue;
                        }

                        if (!string.IsNullOrEmpty(searchTerm) && 
                            !message.ToLowerInvariant().Contains(searchTerm) && 
                            !category.ToLowerInvariant().Contains(searchTerm))
                        {
                            continue;
                        }

                        logEntries.Add(new
                        {
                            timestamp,
                            level = logLevel,
                            category,
                            message,
                            sourceFile = targetFile
                        });
                    }
                }

                var filesList = Directory.GetFiles(logsDir, "*.log").Select(Path.GetFileName).ToList();
                var responseData = new
                {
                    total = logEntries.Count,
                    filtered = logEntries.Count,
                    files = filesList,
                    logs = logEntries
                };

                return Ok(ApiResponse<object>.SuccessResponse(responseData, "Dynamic logs loaded successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.FailureResponse($"Failed to fetch logs: {ex.Message}"));
            }
        }

        [HttpPost("clear")]
        public IActionResult ClearLogs([FromBody] ClearLogsRequest? request)
        {
            try
            {
                var targetFile = !string.IsNullOrWhiteSpace(request?.FileName) ? request.FileName : "ompolymer-api.log";
                var logsDir = GetLogsDirectory();
                var filePath = Path.Combine(logsDir, Path.GetFileName(targetFile));

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.WriteAllText(filePath, $"[{DateTime.UtcNow:o}] [INF] [OMPolymer.Logs] Log file rotated and cleared by administrator.\n");
                }

                return Ok(ApiResponse<object>.SuccessResponse(new { cleared = true }, $"Log file '{targetFile}' cleared successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.FailureResponse($"Failed clearing logs: {ex.Message}"));
            }
        }

        [HttpGet("download/{fileName}")]
        public IActionResult DownloadLog(string fileName)
        {
            var logsDir = GetLogsDirectory();
            var filePath = Path.Combine(logsDir, Path.GetFileName(fileName));
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(ApiResponse<string>.FailureResponse($"Log file '{fileName}' not found."));
            }

            var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            return File(stream, "text/plain", fileName);
        }
    }

    public class ClearLogsRequest
    {
        public string? FileName { get; set; }
    }
}
