using MailKit.Net.Smtp;
using MimeKit;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task<bool> SendPasswordResetEmailAsync(string toEmail, string recipientName, string resetToken, CancellationToken cancellationToken = default)
        {
            var emailSettings = _config.GetSection("EmailSettings");
            var smtpHost = emailSettings["SmtpHost"] ?? "localhost";
            var smtpPort = int.Parse(emailSettings["SmtpPort"] ?? "587");
            var senderEmail = emailSettings["SenderEmail"] ?? "no-reply@ompolymer.com";
            var senderName = emailSettings["SenderName"] ?? "OM Polymer Security";
            var appBaseUrl = emailSettings["AppBaseUrl"] ?? "https://ompolymer.com";

            var resetLink = $"{appBaseUrl}/admin/reset-password?token={resetToken}&email={Uri.EscapeDataString(toEmail)}";

            // In development or when credentials are not configured, log reset link to console
            if (string.IsNullOrWhiteSpace(emailSettings["SmtpUser"]))
            {
                _logger.LogInformation("=================================================");
                _logger.LogInformation("DEVELOPMENT PASSWORD RESET EMAIL SIMULATED:");
                _logger.LogInformation("To: {ToEmail} ({RecipientName})", toEmail, recipientName);
                _logger.LogInformation("Reset Link: {ResetLink}", resetLink);
                _logger.LogInformation("Reset Token: {Token}", resetToken);
                _logger.LogInformation("=================================================");
                return true;
            }

            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(senderName, senderEmail));
                message.To.Add(new MailboxAddress(recipientName, toEmail));
                message.Subject = "OM Polymer — Password Reset Request";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
                            <h2 style='color: #1e3a8a;'>Password Reset Request</h2>
                            <p>Hello {recipientName},</p>
                            <p>We received a request to reset your password for the OM Polymer Administration Portal.</p>
                            <p>Click the button below to set a new password. This link is single-use and will expire in 1 hour:</p>
                            <p style='margin: 30px 0;'>
                                <a href='{resetLink}' style='background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;'>Reset Password</a>
                            </p>
                            <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
                            <hr style='border: none; border-top: 1px solid #e2e8f0; margin-top: 40px;'/>
                            <p style='color: #64748b; font-size: 12px;'>OM Polymer Security Team</p>
                        </div>"
                };

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(smtpHost, smtpPort, MailKit.Security.SecureSocketOptions.StartTlsWhenAvailable, cancellationToken);
                if (!string.IsNullOrWhiteSpace(emailSettings["SmtpUser"]))
                {
                    await client.AuthenticateAsync(emailSettings["SmtpUser"], emailSettings["SmtpPass"], cancellationToken);
                }
                await client.SendAsync(message, cancellationToken);
                await client.DisconnectAsync(true, cancellationToken);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send password reset email to {Email}", toEmail);
                return false;
            }
        }
    }
}