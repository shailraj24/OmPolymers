namespace OMPolymer.API.Services.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendPasswordResetEmailAsync(string toEmail, string recipientName, string resetToken, CancellationToken cancellationToken = default);
    }
}