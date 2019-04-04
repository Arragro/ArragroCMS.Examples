using arragro_com_functions;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

namespace arragro.com.functions.Helpers
{
    public class SendGridHelper
    {
        private readonly string _apiKey;
        private readonly SendGridClient _sendGridClient;

        public SendGridHelper(string apiKey)
        {
            _apiKey = apiKey;
            _sendGridClient = new SendGridClient(_apiKey);
        }

        public async Task SendContactFormMessage(string url, ContactForm contactForm)
        {
            var fullName = $"{contactForm.FirstName} {contactForm.LastName}";
            var message = new SendGridMessage();
            message.AddTo("enquiries@arragro.com");
            message.From = new EmailAddress(contactForm.Email, fullName);
            message.Subject = $"You have an enquiry from {fullName}";
            message.PlainTextContent = "See Attachment";
            message.HtmlContent = $@"
<h1>Enquiry</h1>
<a href='{url}'>Click to download</a>
<ul>
    <li>{fullName}</li>
    <li>{contactForm.Company}</li>
    <li>{contactForm.Email}</li>
    <li>{contactForm.Phone}</li>
    <li>{contactForm.Message}</li>
</ul>";
            
            var response = await _sendGridClient.SendEmailAsync(message);
            if (response.StatusCode != System.Net.HttpStatusCode.Accepted)
            {
                throw new Exception("Something went wrong sending the email");
            }

        }
    }
}
